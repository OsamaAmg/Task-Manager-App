import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import Task from '@/models/Task';
import User from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET!;

// Helper function to verify token and get user ID
async function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No token provided');
  }

  const token = authHeader.substring(7);
  const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
  return decoded.id;
}

// GET /api/tasks - Fetch all tasks for the authenticated user
export async function GET(request: NextRequest) {
  try {
    const userId = await verifyToken(request);
    await connectDB();

    // Get query parameters for filtering and pagination
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') === 'asc' ? 1 : -1;

    // Build filter object
    const filter: any = { userId };

    if (status && status !== 'all') {
      filter.status = status;
    }

    if (priority && priority !== 'all') {
      filter.priority = priority;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort object
    const sort: any = {};
    sort[sortBy] = sortOrder;

    // Get tasks with pagination
    const skip = (page - 1) * limit;
    const [tasks, totalCount] = await Promise.all([
      Task.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Task.countDocuments(filter)
    ]);

    return NextResponse.json({
      success: true,
      tasks,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasNextPage: page * limit < totalCount,
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    console.error('Get tasks error:', error);
    
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid or expired token' 
      }, { status: 401 });
    }
    
    if (error instanceof Error && error.message === 'No token provided') {
      return NextResponse.json({ 
        success: false, 
        error: 'Authentication token required' 
      }, { status: 401 });
    }
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch tasks'
    }, { status: 500 });
  }
}

// POST /api/tasks - Create a new task
export async function POST(request: NextRequest) {
  try {
    const userId = await verifyToken(request);
    const body = await request.json();
    const { title, description, status, priority, dueDate } = body;

    // Validation
    const errors: string[] = [];
    
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      errors.push('Title is required');
    }
    
    if (title && title.trim().length > 100) {
      errors.push('Title cannot exceed 100 characters');
    }

    if (description && typeof description === 'string' && description.trim().length > 500) {
      errors.push('Description cannot exceed 500 characters');
    }

    if (status && !['pending', 'in-progress', 'completed'].includes(status)) {
      errors.push('Invalid status value');
    }

    if (priority && !['low', 'medium', 'high'].includes(priority)) {
      errors.push('Invalid priority value');
    }

    if (dueDate && isNaN(new Date(dueDate).getTime())) {
      errors.push('Invalid due date format');
    }

    if (errors.length > 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'Validation failed', 
        details: errors 
      }, { status: 400 });
    }

    await connectDB();

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ 
        success: false, 
        error: 'User not found' 
      }, { status: 404 });
    }

    // Create new task
    const newTask = new Task({
      title: title.trim(),
      description: description?.trim() || undefined,
      status: status || 'pending',
      priority: priority || 'medium',
      dueDate: dueDate ? new Date(dueDate) : undefined,
      userId
    });

    const savedTask = await newTask.save();

    return NextResponse.json({
      success: true,
      message: 'Task created successfully',
      task: savedTask
    }, { status: 201 });

  } catch (error) {
    console.error('Create task error:', error);
    
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid or expired token' 
      }, { status: 401 });
    }

    // Handle mongoose validation errors
    if (error instanceof Error && error.name === 'ValidationError') {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        details: Object.values((error as any).errors).map((err: any) => err.message)
      }, { status: 400 });
    }
    
    return NextResponse.json({
      success: false,
      error: 'Failed to create task'
    }, { status: 500 });
  }
}
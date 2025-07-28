import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import Task from '@/models/Task';
import mongoose from 'mongoose';

const JWT_SECRET = process.env.JWT_SECRET!;

// Helper function to verify token and get user ID
async function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No token provided');
  }

  const token = authHeader.substring(7);
  const decoded = jwt.verify(token, JWT_SECRET) as { id?: string; userId?: string; email: string };
  
  // Handle both token formats: { id } for login and { userId } for OAuth
  const userId = decoded.id || decoded.userId;
  if (!userId) {
    throw new Error('Invalid token format');
  }
  
  return userId;
}

// GET /api/tasks/[id] - Get a specific task by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await verifyToken(request);
    await connectDB();

    const { id } = await params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid task ID format' },
        { status: 400 }
      );
    }

    // Find the task and ensure it belongs to the authenticated user
    const task = await Task.findOne({ _id: id, userId }).lean();

    if (!task) {
      return NextResponse.json(
        { success: false, error: 'Task not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      task
    });

  } catch (error) {
    console.error('Get task error:', error);
    
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
      error: 'Failed to fetch task'
    }, { status: 500 });
  }
}

// PUT /api/tasks/[id] - Update a specific task
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await verifyToken(request);
    await connectDB();

    const { id } = await params;
    const updates = await request.json();

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid task ID format' },
        { status: 400 }
      );
    }

    // Validate update fields
    const allowedUpdates = ['title', 'description', 'status', 'priority', 'dueDate'];
    const updateKeys = Object.keys(updates);
    const isValidOperation = updateKeys.every(key => allowedUpdates.includes(key));

    if (!isValidOperation) {
      return NextResponse.json(
        { success: false, error: 'Invalid update fields' },
        { status: 400 }
      );
    }

    // Find and update the task (ensure it belongs to the authenticated user)
    const updatedTask = await Task.findOneAndUpdate(
      { _id: id, userId },
      updates,
      { 
        new: true, // Return the updated document
        runValidators: true // Run schema validations
      }
    ).lean();

    if (!updatedTask) {
      return NextResponse.json(
        { success: false, error: 'Task not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Task updated successfully',
      task: updatedTask
    });

  } catch (error) {
    console.error('Update task error:', error);
    
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

    // Handle validation errors
    if (error instanceof Error && error.name === 'ValidationError') {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        details: error.message
      }, { status: 400 });
    }
    
    return NextResponse.json({
      success: false,
      error: 'Failed to update task'
    }, { status: 500 });
  }
}

// DELETE /api/tasks/[id] - Delete a specific task
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await verifyToken(request);
    await connectDB();

    const { id } = await params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid task ID format' },
        { status: 400 }
      );
    }

    // Find and delete the task (ensure it belongs to the authenticated user)
    const deletedTask = await Task.findOneAndDelete({ _id: id, userId }).lean();

    if (!deletedTask) {
      return NextResponse.json(
        { success: false, error: 'Task not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Task deleted successfully',
      task: deletedTask
    });

  } catch (error) {
    console.error('Delete task error:', error);
    
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
      error: 'Failed to delete task'
    }, { status: 500 });
  }
}

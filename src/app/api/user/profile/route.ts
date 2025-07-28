import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Task from '@/models/Task';
import bcrypt from 'bcryptjs';

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

export async function GET(request: NextRequest) {
  try {
    const userId = await verifyToken(request);
    await connectDB();
    
    // Get user data
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get comprehensive task analytics
    const [
      totalTasks,
      completedTasks,
      pendingTasks,
      inProgressTasks,
      overdueTasks,
      recentTasks,
      highPriorityTasks,
      mediumPriorityTasks,
      lowPriorityTasks
    ] = await Promise.all([
      // Basic task counts
      Task.countDocuments({ userId }),
      Task.countDocuments({ userId, status: 'completed' }),
      Task.countDocuments({ userId, status: 'pending' }),
      Task.countDocuments({ userId, status: 'in-progress' }),
      
      // Overdue tasks (pending or in-progress with due date in the past)
      Task.countDocuments({
        userId,
        status: { $in: ['pending', 'in-progress'] },
        dueDate: { $lt: new Date() }
      }),
      
      // Recent tasks (last 10 with more details)
      Task.find({ userId })
        .sort({ createdAt: -1 })
        .limit(10)
        .select('title description status priority createdAt updatedAt dueDate'),
      
      // Priority-based task counts
      Task.countDocuments({ userId, priority: 'high' }),
      Task.countDocuments({ userId, priority: 'medium' }),
      Task.countDocuments({ userId, priority: 'low' })
    ]);

    // Calculate success rate
    const successRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Time-based analytics
    const now = new Date();
    
    // This week's data
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const [tasksThisWeek, completedThisWeek] = await Promise.all([
      Task.countDocuments({
        userId,
        createdAt: { $gte: weekAgo }
      }),
      Task.countDocuments({
        userId,
        status: 'completed',
        updatedAt: { $gte: weekAgo }
      })
    ]);

    // This month's data
    const monthAgo = new Date(now.getFullYear(), now.getMonth(), 1);
    const [tasksThisMonth, completedThisMonth] = await Promise.all([
      Task.countDocuments({
        userId,
        createdAt: { $gte: monthAgo }
      }),
      Task.countDocuments({
        userId,
        status: 'completed',
        updatedAt: { $gte: monthAgo }
      })
    ]);

    // Tasks due soon (next 7 days)
    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const tasksDueSoon = await Task.countDocuments({
      userId,
      status: { $in: ['pending', 'in-progress'] },
      dueDate: { $gte: now, $lte: weekFromNow }
    });

    // Productivity trends (last 30 days)
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const productivityTrend = await Task.aggregate([
      {
        $match: {
          userId: user._id,
          status: 'completed',
          updatedAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      { $limit: 30 }
    ]);

    const analytics = {
      // Basic counts
      totalTasks,
      completedTasks,
      pendingTasks,
      inProgressTasks,
      overdueTasks,
      successRate,
      
      // Priority breakdown
      tasksByPriority: {
        high: highPriorityTasks,
        medium: mediumPriorityTasks,
        low: lowPriorityTasks
      },
      
      // Time-based analytics
      thisWeek: {
        created: tasksThisWeek,
        completed: completedThisWeek
      },
      thisMonth: {
        created: tasksThisMonth,
        completed: completedThisMonth
      },
      
      // Upcoming tasks
      tasksDueSoon,
      
      // Recent activity
      recentTasks,
      
      // Productivity trend for charts
      productivityTrend: productivityTrend.map(item => ({
        date: item._id,
        completed: item.count
      }))
    };

    return NextResponse.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        phone: user.phone,
        avatar: user.avatar,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
      analytics
    });

  } catch (error) {
    console.error('Profile API error:', error);
    
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
      error: 'Failed to fetch profile data'
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userId = await verifyToken(request);
    const body = await request.json();
    const { name, email, bio, phone, currentPassword, newPassword } = body;
    
    // Enhanced validation
    const errors: string[] = [];
    
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      errors.push('Name must be at least 2 characters long');
    }
    
    if (name && name.trim().length > 50) {
      errors.push('Name cannot exceed 50 characters');
    }

    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.push('Please provide a valid email address');
    }

    if (bio && typeof bio === 'string' && bio.trim().length > 500) {
      errors.push('Bio cannot exceed 500 characters');
    }

    if (phone && typeof phone === 'string' && phone.trim() && !/^[\+]?[1-9][\d]{0,15}$/.test(phone.trim())) {
      errors.push('Please provide a valid phone number');
    }

    if (newPassword) {
      if (!currentPassword) {
        errors.push('Current password is required to set a new password');
      }
      if (newPassword.length < 6) {
        errors.push('New password must be at least 6 characters long');
      }
    }

    if (errors.length > 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'Validation failed', 
        details: errors 
      }, { status: 400 });
    }

    await connectDB();
    
    // Get current user
    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return NextResponse.json({ 
        success: false, 
        error: 'User not found' 
      }, { status: 404 });
    }

    // Check if email is already taken by another user
    if (email.trim().toLowerCase() !== currentUser.email) {
      const existingUser = await User.findOne({ 
        email: email.trim().toLowerCase(), 
        _id: { $ne: userId } 
      });
      
      if (existingUser) {
        return NextResponse.json({ 
          success: false, 
          error: 'Email address is already in use' 
        }, { status: 400 });
      }
    }

    // Prepare update data
    const updateData: Record<string, unknown> = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
    };

    // Handle optional fields
    if (bio !== undefined) {
      updateData.bio = bio.trim() || undefined;
    }
    
    if (phone !== undefined) {
      updateData.phone = phone.trim() || undefined;
    }

    // Handle password change
    if (newPassword && currentPassword) {
      // Check if user has a password (OAuth users might not have one)
      if (!currentUser.password) {
        return NextResponse.json({ 
          success: false, 
          error: 'Cannot change password for OAuth accounts. Please set a password first through your OAuth provider.' 
        }, { status: 400 });
      }

      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, currentUser.password);
      if (!isCurrentPasswordValid) {
        return NextResponse.json({ 
          success: false, 
          error: 'Current password is incorrect' 
        }, { status: 400 });
      }

      // Hash new password
      const saltRounds = 12;
      updateData.password = await bcrypt.hash(newPassword, saltRounds);
    }
    
    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { 
        new: true,
        runValidators: true
      }
    ).select('-password');

    if (!updatedUser) {
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to update user profile' 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true,
      message: 'Profile updated successfully',
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        bio: updatedUser.bio,
        phone: updatedUser.phone,
        avatar: updatedUser.avatar,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt
      }
    });

  } catch (error) {
    console.error('Profile update error:', error);
    
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

    // Handle mongoose validation errors
    if (error instanceof Error && error.name === 'ValidationError') {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        details: Object.values((error as unknown as { errors: Record<string, { message: string }> }).errors).map((err) => err.message)
      }, { status: 400 });
    }
    
    return NextResponse.json({
      success: false,
      error: 'Failed to update profile'
    }, { status: 500 });
  }
}

// Optional: Add DELETE method to delete user account
export async function DELETE(request: NextRequest) {
  try {
    const userId = await verifyToken(request);
    const body = await request.json();
    const { password, confirmOAuth } = body;

    await connectDB();
    
    // Get user
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ 
        success: false, 
        error: 'User not found' 
      }, { status: 404 });
    }

    // Handle OAuth users (who don't have passwords)
    if (!user.password && user.provider !== 'local') {
      if (!confirmOAuth) {
        return NextResponse.json({ 
          success: false, 
          error: 'Confirmation required for OAuth account deletion' 
        }, { status: 400 });
      }
    } else {
      // Handle local users (who have passwords)
      if (!password) {
        return NextResponse.json({ 
          success: false, 
          error: 'Password confirmation required' 
        }, { status: 400 });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return NextResponse.json({ 
          success: false, 
          error: 'Invalid password' 
        }, { status: 400 });
      }
    }

    // Delete user's tasks first
    await Task.deleteMany({ userId });
    
    // Delete user
    await User.findByIdAndDelete(userId);

    return NextResponse.json({ 
      success: true,
      message: 'Account deleted successfully' 
    });

  } catch (error) {
    console.error('Account deletion error:', error);
    
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid or expired token' 
      }, { status: 401 });
    }
    
    return NextResponse.json({
      success: false,
      error: 'Failed to delete account'
    }, { status: 500 });
  }
}
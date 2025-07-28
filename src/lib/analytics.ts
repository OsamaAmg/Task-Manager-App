// import UserAnalytics from '@/models/UserAnalytics';
import Task from '@/models/Task';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

export interface AnalyticsUpdateData {
  userId: string;
  action: 'create' | 'update' | 'delete';
  taskData?: {
    priority: 'low' | 'medium' | 'high';
    status: 'pending' | 'in-progress' | 'completed';
    oldStatus?: 'pending' | 'in-progress' | 'completed';
  };
}

/**
 * Updates user analytics based on task operations
 */
export async function updateUserAnalytics(data: AnalyticsUpdateData): Promise<void> {
  try {
    await connectDB();
    
    const { userId, action, taskData } = data;
    
    // Ensure we have a valid ObjectId
    // const userObjectId = new mongoose.Types.ObjectId(userId); // Not needed in legacy mode
    
    // Old analytics logic: No UserAnalytics document. Implement your legacy analytics logic here.
    // Example: You may want to do nothing, or use a different analytics storage.
    const analytics = {
      totalTasks: 0,
      completedTasks: 0,
      pendingTasks: 0,
      inProgressTasks: 0,
      deletedTasks: 0,
      tasksByPriority: { high: 0, medium: 0, low: 0 },
      completedTasksByPriority: { high: 0, medium: 0, low: 0 },
      lastUpdated: new Date()
    };
    
    switch (action) {
      case 'create':
        if (taskData) {
          analytics.totalTasks += 1;
          analytics.tasksByPriority[taskData.priority] += 1;
          
          // Update status-specific counters
          if (taskData.status === 'completed') {
            analytics.completedTasks += 1;
            analytics.completedTasksByPriority[taskData.priority] += 1;
          } else if (taskData.status === 'pending') {
            analytics.pendingTasks += 1;
          } else if (taskData.status === 'in-progress') {
            analytics.inProgressTasks += 1;
          }
        }
        break;
        
      case 'update':
        if (taskData && taskData.oldStatus && taskData.oldStatus !== taskData.status) {
          // Handle status changes
          
          // Decrement old status
          if (taskData.oldStatus === 'completed') {
            analytics.completedTasks = Math.max(0, analytics.completedTasks - 1);
            analytics.completedTasksByPriority[taskData.priority] = Math.max(0, analytics.completedTasksByPriority[taskData.priority] - 1);
          } else if (taskData.oldStatus === 'pending') {
            analytics.pendingTasks = Math.max(0, analytics.pendingTasks - 1);
          } else if (taskData.oldStatus === 'in-progress') {
            analytics.inProgressTasks = Math.max(0, analytics.inProgressTasks - 1);
          }
          
          // Increment new status
          if (taskData.status === 'completed') {
            analytics.completedTasks += 1;
            analytics.completedTasksByPriority[taskData.priority] += 1;
          } else if (taskData.status === 'pending') {
            analytics.pendingTasks += 1;
          } else if (taskData.status === 'in-progress') {
            analytics.inProgressTasks += 1;
          }
        }
        break;
        
      case 'delete':
        if (taskData) {
          analytics.deletedTasks += 1;
          
          // Decrement totalTasks and priority counts when task is deleted
          analytics.totalTasks = Math.max(0, analytics.totalTasks - 1);
          analytics.tasksByPriority[taskData.priority] = Math.max(0, analytics.tasksByPriority[taskData.priority] - 1);
          
          // Decrement status counters
          if (taskData.status === 'completed') {
            analytics.completedTasks = Math.max(0, analytics.completedTasks - 1);
            analytics.completedTasksByPriority[taskData.priority] = Math.max(0, analytics.completedTasksByPriority[taskData.priority] - 1);
          } else if (taskData.status === 'pending') {
            analytics.pendingTasks = Math.max(0, analytics.pendingTasks - 1);
          } else if (taskData.status === 'in-progress') {
            analytics.inProgressTasks = Math.max(0, analytics.inProgressTasks - 1);
          }
        }
        break;
    }
    
    analytics.lastUpdated = new Date();
    // No save, just log (legacy mode)
    console.log(`Analytics updated for user ${userId}, action: ${action} (legacy mode)`);
    
  } catch (error) {
    console.error('Error updating user analytics:', error);
    // Don't throw the error - analytics updates shouldn't break main operations
  }
}

/**
 * Initializes analytics for a user based on their existing tasks
 */
export async function initializeUserAnalytics(userId: string): Promise<void> {
  try {
    await connectDB();
    
    // const userObjectId = new mongoose.Types.ObjectId(userId); // Not needed in legacy mode
    
    // Legacy: No analytics initialization needed
    console.log(`Analytics initialization skipped for user ${userId} (legacy mode)`);
    return;
    
    // Aggregate current task data
    // Skipped aggregation in legacy mode
    
    // Legacy: No analytics document created
    // No save, just log
    console.log(`Analytics initialized for user ${userId} (legacy mode)`);
    
  } catch (error) {
    console.error('Error initializing user analytics:', error);
    throw error;
  }
}

/**
 * Gets analytics for a user with real-time data for time-based metrics
 */
export async function getUserAnalytics(userId: string) {
  try {
    await connectDB();
    
    const userObjectId = new mongoose.Types.ObjectId(userId);
    
    // Legacy: No persistent analytics, just return dummy data
    const analytics = {
      totalTasks: 0,
      completedTasks: 0,
      pendingTasks: 0,
      inProgressTasks: 0,
      deletedTasks: 0,
      tasksByPriority: { high: 0, medium: 0, low: 0 },
      completedTasksByPriority: { high: 0, medium: 0, low: 0 },
      lastUpdated: new Date()
    };
    
    // Get time-based data (still calculated in real-time as these change frequently)
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const [
      tasksThisWeek,
      completedThisWeek,
      overdueTasks,
      recentTasks
    ] = await Promise.all([
      Task.countDocuments({
        userId: userObjectId,
        createdAt: { $gte: weekAgo }
      }),
      Task.countDocuments({
        userId: userObjectId,
        status: 'completed',
        updatedAt: { $gte: weekAgo }
      }),
      Task.countDocuments({
        userId: userObjectId,
        status: { $in: ['pending', 'in-progress'] },
        dueDate: { $lt: now }
      }),
      Task.find({ userId: userObjectId })
        .sort({ createdAt: -1 })
        .limit(10)
        .select('title status createdAt dueDate')
        .lean()
    ]);
    
    // Calculate success rate
    const successRate = analytics.totalTasks > 0 ? 
      Math.round((analytics.completedTasks / analytics.totalTasks) * 100) : 0;
    
    return {
      // Legacy analytics (dummy data)
      totalTasks: analytics.totalTasks,
      completedTasks: analytics.completedTasks,
      pendingTasks: analytics.pendingTasks,
      inProgressTasks: analytics.inProgressTasks,
      deletedTasks: analytics.deletedTasks,
      successRate,
      tasksByPriority: analytics.tasksByPriority,
      completedTasksByPriority: analytics.completedTasksByPriority,
      // Real-time time-based data
      tasksThisWeek,
      completedThisWeek,
      overdueTasks,
      recentTasks,
      // Metadata
      lastUpdated: analytics.lastUpdated
    };
    
  } catch (error) {
    console.error('Error getting user analytics:', error);
    throw error;
  }
}

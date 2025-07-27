"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type Task from "@/types/Task";

type TasksContextType = {
  tasks: Task[];
  addTask: (task: Omit<Task, "id">) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  deleteTasks: (ids: string[]) => Promise<void>; 
  updateTask: (id: string, updatedTask: Partial<Task>) => Promise<void>; 
  toggleTask: (id: string) => Promise<void>;
  loading: boolean;
  error: string | null;
  refreshTasks: () => Promise<void>;
};

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper function to get auth token
  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  // Fetch tasks from API
  const refreshTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = getAuthToken();
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('/api/tasks', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/auth/login';
          return;
        }
        throw new Error(`Failed to fetch tasks: ${response.statusText}`);
      }

      const data = await response.json();
      // Map API response to frontend Task format
      const mappedTasks = data.tasks.map((task: {
        _id: string;
        title: string;
        description?: string;
        status: 'pending' | 'in-progress' | 'completed';
        priority: 'low' | 'medium' | 'high';
        createdAt: string;
        dueDate?: string;
      }) => ({
        id: task._id,
        title: task.title,
        description: task.description,
        completed: task.status === 'completed',
        priority: task.priority,
        createdAt: task.createdAt,
        dueDate: task.dueDate
      }));
      setTasks(mappedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  // Load tasks on mount
  useEffect(() => {
    refreshTasks();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Add task via API
  const addTask = async (task: Omit<Task, "id">) => {
    try {
      setError(null);
      const token = getAuthToken();
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Convert frontend task format to API format
      const apiTask = {
        title: task.title,
        description: task.description,
        status: task.completed ? 'completed' : 'pending',
        priority: task.priority,
        dueDate: task.dueDate
      };

      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiTask),
      });

      const data = await response.json();

      if (!response.ok) {
        // Show API error details if available
        let errorMsg = 'Failed to create task';
        if (data?.error) errorMsg = data.error;
        if (data?.details && Array.isArray(data.details)) {
          errorMsg += ': ' + data.details.join(', ');
        }
        setError(errorMsg);
        throw new Error(errorMsg);
      }

      // Map API response back to frontend format
      const newTask = {
        id: data.task._id,
        title: data.task.title,
        description: data.task.description,
        completed: data.task.status === 'completed',
        priority: data.task.priority,
        createdAt: data.task.createdAt,
        dueDate: data.task.dueDate
      };
      setTasks(prev => [...prev, newTask]);
    } catch (error) {
      console.error('Error adding task:', error);
      setError(error instanceof Error ? error.message : 'Failed to add task');
      throw error;
    }
  };

  // Delete task via API
  const deleteTask = async (id: string) => {
    try {
      setError(null);
      const token = getAuthToken();
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete task');
      }

      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete task');
      throw error;
    }
  };

  // Delete multiple tasks via API
  const deleteTasks = async (ids: string[]) => {
    try {
      await Promise.all(ids.map(id => deleteTask(id)));
    } catch (error) {
      console.error('Error deleting tasks:', error);
      throw error;
    }
  };

  // Update task via API
  const updateTask = async (id: string, updatedTask: Partial<Task>) => {
    try {
      setError(null);
      const token = getAuthToken();
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Convert frontend format to API format
      const apiUpdate: Record<string, unknown> = {};
      if (updatedTask.title !== undefined) apiUpdate.title = updatedTask.title;
      if (updatedTask.description !== undefined) apiUpdate.description = updatedTask.description;
      if (updatedTask.completed !== undefined) apiUpdate.status = updatedTask.completed ? 'completed' : 'pending';
      if (updatedTask.priority !== undefined) apiUpdate.priority = updatedTask.priority;
      if (updatedTask.dueDate !== undefined) apiUpdate.dueDate = updatedTask.dueDate;

      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiUpdate),
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      const data = await response.json();
      // Map response back to frontend format
      const updatedTaskMapped = {
        id: data.task._id,
        title: data.task.title,
        description: data.task.description,
        completed: data.task.status === 'completed',
        priority: data.task.priority,
        createdAt: data.task.createdAt,
        dueDate: data.task.dueDate
      };
      setTasks(prev => prev.map(task => task.id === id ? updatedTaskMapped : task));
    } catch (error) {
      console.error('Error updating task:', error);
      setError(error instanceof Error ? error.message : 'Failed to update task');
      throw error;
    }
  };

  // Toggle task completion via API
  const toggleTask = async (id: string) => {
    try {
      const task = tasks.find(t => t.id === id);
      if (!task) return;
      
      // Toggle completed status
      await updateTask(id, { completed: !task.completed });
    } catch (error) {
      console.error('Error toggling task:', error);
      throw error;
    }
  };

  return (
    <TasksContext.Provider value={{ 
      tasks, 
      addTask, 
      toggleTask, 
      deleteTask, 
      deleteTasks, 
      updateTask, 
      loading, 
      error, 
      refreshTasks 
    }}>
      {children}
    </TasksContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TasksContext);
  if (!context) throw new Error('useTasks must be used within TasksProvider');

  return context;
}
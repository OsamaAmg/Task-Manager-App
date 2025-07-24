"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type Task from "@/types/Task";

type TasksContextType = {
  tasks: Task[];
  addTask: (task: Omit<Task, "id">) => void;
  deleteTask: (id: string) => void;
  deleteTasks: (ids: string[]) => void; // New batch delete function
  toggleTask: (id: string) => void;
};

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);

  // Load tasks from localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // Save tasks to localStorage
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }, [tasks]);

  const addTask = (task: Omit<Task, "id">) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
    };
    setTasks(prevTasks => [...prevTasks, newTask]);
  };

  const deleteTask = (id: string) => {
    setTasks(prevTasks => prevTasks.filter((task) => task.id !== id));
  };

  // New batch delete function - more efficient for multiple deletions
  const deleteTasks = (ids: string[]) => {
    console.log('Batch deleting tasks:', ids); // Debug log
    setTasks(prevTasks => {
      const filteredTasks = prevTasks.filter(task => !ids.includes(task.id));
      console.log('Tasks before:', prevTasks.length, 'Tasks after:', filteredTasks.length); // Debug log
      return filteredTasks;
    });
  };

  const toggleTask = (id: string) => {
    setTasks(prevTasks =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  return (
    <TasksContext.Provider value={{ tasks, addTask, toggleTask, deleteTask, deleteTasks }}>
      {children}
    </TasksContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TasksContext);
  if (!context) throw new Error('useTasks must be used within TasksProvider');

  return context;
}
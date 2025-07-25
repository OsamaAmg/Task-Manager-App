"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type Task from "@/types/Task";

type TasksContextType = {
  tasks: Task[];
  addTask: (task: Omit<Task, "id">) => void;
  deleteTask: (id: string) => void;
  deleteTasks: (ids: string[]) => void; 
  updateTask: (id: string, updatedTask: Partial<Task>) => void; 
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
      createdAt: new Date().toISOString(),
    };
    setTasks(prevTasks => [...prevTasks, newTask]);
  };

  const deleteTask = (id: string) => {
    setTasks(prevTasks => prevTasks.filter((task) => task.id !== id));
  };


  const deleteTasks = (ids: string[]) => {
    setTasks(prevTasks => {
      const filteredTasks = prevTasks.filter(task => !ids.includes(task.id));
      return filteredTasks;
    });
  };


  const updateTask = (id: string, updatedTask: Partial<Task>) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { ...task, ...updatedTask } : task
      )
    );
  };

  const toggleTask = (id: string) => {
    setTasks(prevTasks =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  return (
    <TasksContext.Provider value={{ tasks, addTask, toggleTask, deleteTask, deleteTasks, updateTask }}>
      {children}
    </TasksContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TasksContext);
  if (!context) throw new Error('useTasks must be used within TasksProvider');

  return context;
}
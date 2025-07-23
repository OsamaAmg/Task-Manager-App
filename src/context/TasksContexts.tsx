"use client";

import { createContext, useContext, useState, useEffect, ReactNode, Children } from "react";
import type Task from "@/types/Task";

type TasksContextType = {
  tasks: Task[];
  addTask: (task: Task) => void;
  deleteTask: (id: string) => void;
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
    setTasks([...tasks, newTask]);
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const toggleTask = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };


  return (
    <TasksContext.Provider value={{tasks, addTask, toggleTask, deleteTask}}>
        {children}
    </TasksContext.Provider>
  );
}

export function useTasks(){
    const context = useContext(TasksContext);
    if(!context) throw new Error('useTasks must be used within TasksProvider');

    return context;
}

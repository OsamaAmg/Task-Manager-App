"use client";

import { useState, useEffect } from 'react';
import TaskForm from '@/components/TaskForm';  
import TasksList from '@/components/TasksList';
import Task from '@/types/Task';  

export default function Home() {
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

  const addTask = (task: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
    };
    setTasks([...tasks, newTask]);
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  return (
    <div style={{ padding: '2rem' }}>
      <TaskForm onAddTask={addTask} />
      <TasksList 
        tasks={tasks} 
        onDeleteTask={deleteTask}
        onToggleComplete={toggleTask}
      />
    </div>
  );
}
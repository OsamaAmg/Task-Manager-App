"use client";

import { useTasks } from '@/context/TasksContexts';
import TaskForm from '@/components/TaskForm';  
import TasksList from '@/components/TasksList'; 

export default function Home() {
  const {tasks, addTask, toggleTask, deleteTask} = useTasks();


  return (
    <div style={{ padding: '2rem' }}>
      <TaskForm onAddTask={addTask} />
      {/*
      <TasksList 
        tasks={tasks} 
        onDeleteTask={deleteTask}
        onToggleComplete={toggleTask}
      /> 
      */}
      
    </div>
  );
}
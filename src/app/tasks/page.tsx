'use client'


import TasksList from "@/components/TasksList";
import { useTasks } from "@/context/TasksContexts";

export default function TasksPage(){
    const {tasks, addTask, toggleTask, deleteTask} = useTasks();


    return (
        <TasksList 
        tasks={tasks} 
        onDeleteTask={deleteTask}
        onToggleComplete={toggleTask}
      />
    );
}
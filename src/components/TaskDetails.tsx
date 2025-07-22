import { useParams } from "next/navigation";
import TaskItem from "./TaskItem";
import type Task from "@/types/Task";

interface TaskDetailsProps {
    tasks:Task[],
    onToggleComplete:(id:string, completed:boolean) => void,
    onDeleteTask: (id:string) => void;
}

export default function TaskDetails({tasks, onToggleComplete, onDeleteTask}:TaskDetailsProps){
    const { theId } = useParams();
    const thetask:Task | undefined = tasks.find((task) => 
        task.id === theId
    );
    if(!thetask){
        return
    }

    return (
        <>
            <TaskItem 
                key={thetask.id} 
                task={thetask} 
                onToggleComplete={onToggleComplete}
                onDeleteTask={onDeleteTask}
                />
        </>
    );
}
import type Task from "@/types/Task";
import TaskItem from "./TaskItem";

interface TasksListProps {
    tasks: Task[];
    onToggleComplete: (id: string, completed: boolean) => void;
    onDeleteTask: (id: string) => void;
}

function TasksList({ tasks, onToggleComplete, onDeleteTask }: TasksListProps) {
    if (tasks.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-muted-foreground">No tasks found. Create your first task!</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 col-span-full">
            {tasks.map((task) => (
                <TaskItem 
                    key={task.id} 
                    task={task} 
                    onToggleComplete={onToggleComplete}
                    onDeleteTask={onDeleteTask}
                />
            ))}
        </div>
    );
}

export default TasksList;


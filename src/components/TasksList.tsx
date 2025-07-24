import type Task from "@/types/Task";
import TaskItem from "./TaskItem";

interface TasksListProps {
    tasks: Task[];
    onToggleComplete: (id: string, completed: boolean) => void;
    onDeleteTask: (id: string) => void;
    selectedTasks?: string[];
    onSelectTask?: (id: string, selected: boolean) => void;
    gridLayout?: boolean;
}

function TasksList({ 
    tasks, 
    onToggleComplete, 
    onDeleteTask, 
    selectedTasks = [], 
    onSelectTask,
    gridLayout = true 
}: TasksListProps) {
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
                    isSelected={selectedTasks.includes(task.id)}
                    onSelectTask={onSelectTask}
                />
            ))}
        </div>
    );
}

export default TasksList;
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, Trash2, Eye, AlertTriangle } from "lucide-react";
import Link from "next/link";
import type Task from "@/types/Task";

interface TaskItemProps {
    task: Task;
    onToggleComplete: (id: string, completed: boolean) => void;
    onDeleteTask: (id: string) => void;
}

function TaskItem({ task, onToggleComplete, onDeleteTask }: TaskItemProps) {
    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;
    
    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'bg-red-500';
            case 'medium': return 'bg-yellow-500';
            case 'low': return 'bg-green-500';
            default: return 'bg-gray-500';
        }
    };

    const getPriorityVariant = (priority: string): "default" | "destructive" | "secondary" | "outline" => {
        switch (priority) {
            case 'high': return 'destructive';
            case 'medium': return 'default';
            case 'low': return 'secondary';
            default: return 'outline';
        }
    };

    return (
        <Card className="w-full max-w-lg mx-auto hover:shadow-md transition-shadow">
            <CardContent className="p-4">
                <div className="space-y-3">
                    {/* Header with title and priority */}
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 flex-1">
                            <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`} />
                            <h3 className={`font-medium text-sm ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                                {task.title}
                            </h3>
                        </div>
                        <Badge variant={getPriorityVariant(task.priority)} className="text-xs">
                            {task.priority.toUpperCase()}
                        </Badge>
                    </div>

                    {/* Dates */}
                    <div className="space-y-1 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
                        </div>
                        {task.dueDate && (
                            <div className="flex items-center gap-1">
                                <CalendarDays className="h-3 w-3" />
                                <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                            </div>
                        )}
                    </div>

                    {/* Overdue warning */}
                    {isOverdue && (
                        <div className="flex items-center gap-1 text-red-600 text-xs">
                            <AlertTriangle className="h-3 w-3" />
                            <span>This task is overdue!</span>
                        </div>
                    )}

                    {/* Status badge */}
                    <div className="flex items-center justify-between">
                        <Badge variant={task.completed ? 'secondary' : 'outline'} className="text-xs">
                            {task.completed ? 'Completed' : 'Pending'}
                        </Badge>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-2 border-t">
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={task.completed}
                                onChange={(e) => onToggleComplete(task.id, e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-xs text-muted-foreground">
                                {task.completed ? 'Completed' : 'Mark complete'}
                            </span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm" asChild>
                                <Link href={`/tasks/${task.id}`}>
                                    <Eye className="h-3 w-3" />
                                </Link>
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onDeleteTask(task.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                                <Trash2 className="h-3 w-3" />
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default TaskItem;

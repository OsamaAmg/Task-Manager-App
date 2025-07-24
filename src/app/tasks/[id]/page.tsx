'use client'

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save, Trash2, Calendar, AlertCircle } from "lucide-react";
import { useTasks } from "@/context/TasksContexts";
import type Task from "@/types/Task";

export default function TaskDetailPage() {
    const router = useRouter();
    const params = useParams();
    const taskId = params.id as string;
    
    const { tasks, toggleTask, deleteTask, updateTask } = useTasks();
    
    // Find the task
    const task = tasks.find(t => t.id === taskId);
    
    // Form state
    const [editedTask, setEditedTask] = useState<Task | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    
    useEffect(() => {
        if (task) {
            setEditedTask(task);
        }
    }, [task]);

    // If task not found
    if (!task) {
        return (
            <div className="container mx-auto p-6">
                <div className="flex items-center gap-4 mb-6">
                    <Button 
                        variant="outline" 
                        onClick={() => router.push('/tasks')}
                        className="flex items-center gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Tasks
                    </Button>
                </div>
                <Card>
                    <CardContent className="p-8 text-center">
                        <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h2 className="text-xl font-semibold mb-2">Task Not Found</h2>
                        <p className="text-muted-foreground">The task you're looking for doesn't exist or may have been deleted.</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Handle form changes
    const handleInputChange = (field: keyof Task, value: any) => {
        if (!editedTask) return;
        setEditedTask({
            ...editedTask,
            [field]: value
        });
    };

    // Save changes
    const handleSave = () => {
        if (!editedTask) return;
        
        // Use the updateTask function from context
        updateTask(taskId, editedTask);
        setIsEditing(false);
    };

    // Handle delete
    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this task?')) {
            deleteTask(taskId);
            router.push('/tasks');
        }
    };

    // Toggle completion
    const handleToggleComplete = () => {
        toggleTask(taskId);
    };

    // Format date for display
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Get priority color
    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'text-red-600 bg-red-50 border-red-200';
            case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            case 'low': return 'text-green-600 bg-green-50 border-green-200';
            default: return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    if (!editedTask) return null;

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Button 
                        variant="outline" 
                        onClick={() => router.push('/tasks')}
                        className="flex items-center gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Tasks
                    </Button>
                    <h1 className="text-2xl font-bold">Task Details</h1>
                </div>
                
                <div className="flex items-center gap-2">
                    {isEditing ? (
                        <>
                            <Button onClick={handleSave} className="flex items-center gap-2">
                                <Save className="h-4 w-4" />
                                Save Changes
                            </Button>
                            <Button 
                                variant="outline" 
                                onClick={() => {
                                    setEditedTask(task);
                                    setIsEditing(false);
                                }}
                            >
                                Cancel
                            </Button>
                        </>
                    ) : (
                        <Button onClick={() => setIsEditing(true)}>
                            Edit Task
                        </Button>
                    )}
                    
                    <Button 
                        variant="destructive" 
                        onClick={handleDelete}
                        className="flex items-center gap-2"
                    >
                        <Trash2 className="h-4 w-4" />
                        Delete
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Task Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Title */}
                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                {isEditing ? (
                                    <Input
                                        id="title"
                                        value={editedTask.title}
                                        onChange={(e) => handleInputChange('title', e.target.value)}
                                        placeholder="Task title"
                                    />
                                ) : (
                                    <p className="text-lg font-medium">{editedTask.title}</p>
                                )}
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                {isEditing ? (
                                    <Textarea
                                        id="description"
                                        value={editedTask.description || ''}
                                        onChange={(e) => handleInputChange('description', e.target.value)}
                                        placeholder="Task description"
                                        rows={4}
                                    />
                                ) : (
                                    <p className="text-muted-foreground whitespace-pre-wrap">
                                        {editedTask.description || 'No description provided'}
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Task Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Status</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Priority */}
                            <div className="space-y-2">
                                <Label htmlFor="priority" className='mr-2'>Priority</Label>
                                {isEditing ? (
                                    <Select 
                                        value={editedTask.priority} 
                                        onValueChange={(value) => handleInputChange('priority', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="low">Low</SelectItem>
                                            <SelectItem value="medium">Medium</SelectItem>
                                            <SelectItem value="high">High</SelectItem>
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(editedTask.priority)}`}>
                                        {editedTask.priority.charAt(0).toUpperCase() + editedTask.priority.slice(1)} Priority
                                    </div>
                                )}
                            </div>

                            {/* Due Date */}
                            <div className="space-y-2">
                                <Label htmlFor="dueDate" className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    Due Date
                                </Label>
                                {isEditing ? (
                                    <Input
                                        id="dueDate"
                                        type="datetime-local"
                                        value={editedTask.dueDate || ''}
                                        onChange={(e) => handleInputChange('dueDate', e.target.value)}
                                    />
                                ) : (
                                    <p className="text-muted-foreground">
                                        {editedTask.dueDate ? formatDate(editedTask.dueDate) : 'No due date set'}
                                    </p>
                                )}
                            </div>


                            {/* Completion Status */}
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="completed"
                                    checked={editedTask.completed}
                                    onCheckedChange={handleToggleComplete}
                                />
                                <Label htmlFor="completed" className="text-sm font-medium">
                                    Mark as completed
                                </Label>
                            </div>
                            <div>
                                <Label className="text-sm text-muted-foreground">Created</Label>
                                <p className="text-sm">{formatDate(editedTask.createdAt)}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Status Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Status</CardTitle>
                        </CardHeader>
                        <CardContent>

                            <div className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium ${
                                editedTask.completed 
                                    ? 'bg-green-50 text-green-700 border border-green-200'
                                    : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                            }`}>
                                {editedTask.completed ? 'Completed' : 'Pending'}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
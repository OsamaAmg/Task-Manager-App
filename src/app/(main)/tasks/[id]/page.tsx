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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ArrowLeft, Save, Trash2, Calendar, AlertCircle, Loader2, CheckCircle, XCircle } from "lucide-react";
import { useTasks } from "@/context/TasksContexts";
import type Task from "@/types/Task";

interface ValidationErrors {
    title?: string;
    description?: string;
    dueDate?: string;
    priority?: string;
}

interface LoadingStates {
    saving: boolean;
    deleting: boolean;
    toggling: boolean;
}

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
    
    // Validation and error handling
    const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');
    
    // Loading states
    const [loadingStates, setLoadingStates] = useState<LoadingStates>({
        saving: false,
        deleting: false,
        toggling: false
    });
    
    // Delete dialog state
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    
    useEffect(() => {
        if (task) {
            setEditedTask(task);
        }
    }, [task]);

    // Clear messages after 5 seconds
    useEffect(() => {
        if (errorMessage || successMessage) {
            const timer = setTimeout(() => {
                setErrorMessage('');
                setSuccessMessage('');
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [errorMessage, successMessage]);

    // Validation function
    const validateTask = (taskData: Task): ValidationErrors => {
        const errors: ValidationErrors = {};
        
        // Title validation
        if (!taskData.title.trim()) {
            errors.title = 'Title is required';
        } else if (taskData.title.trim().length < 3) {
            errors.title = 'Title must be at least 3 characters long';
        } else if (taskData.title.trim().length > 100) {
            errors.title = 'Title must be less than 100 characters';
        }
        
        // Description validation (optional but with limits)
        if (taskData.description && taskData.description.length > 1000) {
            errors.description = 'Description must be less than 1000 characters';
        }
        
        // Due date validation
        if (taskData.dueDate) {
            const dueDate = new Date(taskData.dueDate);
            const now = new Date();
            if (dueDate < now && !taskData.completed) {
                errors.dueDate = 'Due date cannot be in the past for incomplete tasks';
            }
        }
        
        // Priority validation
        if (!['low', 'medium', 'high'].includes(taskData.priority)) {
            errors.priority = 'Please select a valid priority level';
        }
        
        return errors;
    };

    // Set loading state helper
    const setLoading = (key: keyof LoadingStates, value: boolean) => {
        setLoadingStates(prev => ({ ...prev, [key]: value }));
    };

    // Clear all messages
    const clearMessages = () => {
        setErrorMessage('');
        setSuccessMessage('');
        setValidationErrors({});
    };

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
        
        clearMessages();
        
        const updatedTask = {
            ...editedTask,
            [field]: value
        };
        
        setEditedTask(updatedTask);
        
        // Clear validation error for this field
        if (validationErrors[field as keyof ValidationErrors]) {
            setValidationErrors(prev => ({
                ...prev,
                [field]: undefined
            }));
        }
    };

    // Save changes
    const handleSave = async () => {
        if (!editedTask) return;
        
        clearMessages();
        
        // Validate the task
        const errors = validateTask(editedTask);
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            setErrorMessage('Please fix the validation errors before saving.');
            return;
        }
        
        setLoading('saving', true);
        
        try {
            // Simulate API call delay for demonstration
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            updateTask(taskId, editedTask);
            setIsEditing(false);
            setSuccessMessage('Task updated successfully!');
        } catch (error) {
            setErrorMessage('Failed to save task. Please try again.');
            console.error('Save error:', error);
        } finally {
            setLoading('saving', false);
        }
    };

    // Handle delete
    const handleDelete = async () => {
        setDeleteDialogOpen(false);
        setLoading('deleting', true);
        clearMessages();
        
        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 800));
            
            deleteTask(taskId);
            router.push('/tasks');
        } catch (error) {
            setErrorMessage('Failed to delete task. Please try again.');
            console.error('Delete error:', error);
        } finally {
            setLoading('deleting', false);
        }
    };

    // Toggle completion
    const handleToggleComplete = async () => {
        setLoading('toggling', true);
        clearMessages();
        
        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 500));
            
            toggleTask(taskId);
            setSuccessMessage(`Task marked as ${!editedTask?.completed ? 'completed' : 'pending'}!`);
            
            // Update local state
            if (editedTask) {
                setEditedTask({
                    ...editedTask,
                    completed: !editedTask.completed
                });
            }
        } catch (error) {
            setErrorMessage('Failed to update task status. Please try again.');
            console.error('Toggle error:', error);
        } finally {
            setLoading('toggling', false);
        }
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
                        disabled={loadingStates.saving || loadingStates.deleting}
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Tasks
                    </Button>
                    <h1 className="text-2xl font-bold">Task Details</h1>
                </div>
                
                <div className="flex items-center gap-2">
                    {isEditing ? (
                        <>
                            <Button 
                                onClick={handleSave} 
                                className="flex items-center gap-2"
                                disabled={loadingStates.saving}
                            >
                                {loadingStates.saving ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Save className="h-4 w-4" />
                                )}
                                {loadingStates.saving ? 'Saving...' : 'Save Changes'}
                            </Button>
                            <Button 
                                variant="outline" 
                                onClick={() => {
                                    setEditedTask(task);
                                    setIsEditing(false);
                                    clearMessages();
                                }}
                                disabled={loadingStates.saving}
                            >
                                Cancel
                            </Button>
                        </>
                    ) : (
                        <Button 
                            onClick={() => setIsEditing(true)}
                            disabled={loadingStates.deleting || loadingStates.toggling}
                        >
                            Edit Task
                        </Button>
                    )}
                    
                    <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                        <AlertDialogTrigger asChild>
                            <Button 
                                variant="destructive" 
                                className="flex items-center gap-2"
                                disabled={loadingStates.deleting || loadingStates.saving}
                            >
                                {loadingStates.deleting ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Trash2 className="h-4 w-4" />
                                )}
                                {loadingStates.deleting ? 'Deleting...' : 'Delete'}
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle className="flex items-center gap-2">
                                    <AlertCircle className="h-5 w-5 text-red-600" />
                                    Delete Task
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    Are you sure you want to delete "{editedTask.title}"? This action cannot be undone and will permanently remove the task from your list.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel disabled={loadingStates.deleting}>
                                    Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction 
                                    onClick={handleDelete}
                                    className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                                    disabled={loadingStates.deleting}
                                >
                                    {loadingStates.deleting ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                            Deleting...
                                        </>
                                    ) : (
                                        <>
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Delete Task
                                        </>
                                    )}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>

            {/* Success/Error Messages */}
            {successMessage && (
                <Alert className="mb-6 border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-700">
                        {successMessage}
                    </AlertDescription>
                </Alert>
            )}

            {errorMessage && (
                <Alert className="mb-6 border-red-200 bg-red-50">
                    <XCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-700">
                        {errorMessage}
                    </AlertDescription>
                </Alert>
            )}

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
                                <Label htmlFor="title">Title *</Label>
                                {isEditing ? (
                                    <div>
                                        <Input
                                            id="title"
                                            value={editedTask.title}
                                            onChange={(e) => handleInputChange('title', e.target.value)}
                                            placeholder="Task title"
                                            className={validationErrors.title ? 'border-red-500' : ''}
                                        />
                                        {validationErrors.title && (
                                            <p className="text-sm text-red-600 mt-1">{validationErrors.title}</p>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-lg font-medium">{editedTask.title}</p>
                                )}
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                {isEditing ? (
                                    <div>
                                        <Textarea
                                            id="description"
                                            value={editedTask.description || ''}
                                            onChange={(e) => handleInputChange('description', e.target.value)}
                                            placeholder="Task description"
                                            rows={4}
                                            className={validationErrors.description ? 'border-red-500' : ''}
                                        />
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {editedTask.description?.length || 0}/1000 characters
                                        </p>
                                        {validationErrors.description && (
                                            <p className="text-sm text-red-600 mt-1">{validationErrors.description}</p>
                                        )}
                                    </div>
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
                            <CardTitle>Settings</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Priority */}
                            <div className="space-y-2">
                                <Label htmlFor="priority" className='mr-2'>Priority *</Label>
                                {isEditing ? (
                                    <div>
                                        <Select 
                                            value={editedTask.priority} 
                                            onValueChange={(value) => handleInputChange('priority', value)}
                                        >
                                            <SelectTrigger className={validationErrors.priority ? 'border-red-500' : ''}>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="low">Low</SelectItem>
                                                <SelectItem value="medium">Medium</SelectItem>
                                                <SelectItem value="high">High</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {validationErrors.priority && (
                                            <p className="text-sm text-red-600 mt-1">{validationErrors.priority}</p>
                                        )}
                                    </div>
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
                                    <div>
                                        <Input
                                            id="dueDate"
                                            type="datetime-local"
                                            value={editedTask.dueDate || ''}
                                            onChange={(e) => handleInputChange('dueDate', e.target.value)}
                                            className={validationErrors.dueDate ? 'border-red-500' : ''}
                                        />
                                        {validationErrors.dueDate && (
                                            <p className="text-sm text-red-600 mt-1">{validationErrors.dueDate}</p>
                                        )}
                                    </div>
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
                                    disabled={loadingStates.toggling}
                                />
                                <Label htmlFor="completed" className="text-sm font-medium flex items-center gap-2">
                                    Mark as completed
                                    {loadingStates.toggling && (
                                        <Loader2 className="h-3 w-3 animate-spin" />
                                    )}
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

                    {/* Validation Summary */}
                    {Object.keys(validationErrors).length > 0 && isEditing && (
                        <Card className="border-red-200">
                            <CardHeader>
                                <CardTitle className="text-red-700 flex items-center gap-2">
                                    <AlertCircle className="h-4 w-4" />
                                    Validation Errors
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-1 text-sm text-red-600">
                                    {Object.entries(validationErrors).map(([field, error]) => (
                                        <li key={field}>• {error}</li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
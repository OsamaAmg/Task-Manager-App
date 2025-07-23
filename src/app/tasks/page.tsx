'use client'

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Filter, ArrowUpDown, CheckCheck, Trash2, X } from "lucide-react";
import TasksList from "@/components/TasksList";
import { useTasks } from "@/context/TasksContexts";
import type Task from "@/types/Task";

export default function TasksPage() {
    const { tasks, addTask, toggleTask, deleteTask } = useTasks();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'pending'>('all');
    const [priorityFilter, setPriorityFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
    const [sortBy, setSortBy] = useState<'createdAt' | 'dueDate' | 'priority' | 'title'>('createdAt');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [selectedTasks, setSelectedTasks] = useState<string[]>([]);

    // Filtered and sorted tasks
    const filteredAndSortedTasks = useMemo(() => {
        let filtered = tasks.filter(task => {
            const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()); //true or false

            const matchesStatus = statusFilter === 'all' || 
                (statusFilter === 'completed' && task.completed) ||
                (statusFilter === 'pending' && !task.completed); // true or false

            const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
            
            return matchesSearch && matchesStatus && matchesPriority;
        });

        return filtered.sort((a, b) => {
            let comparison = 0;
            
            switch (sortBy) {
                case 'title':
                    comparison = a.title.localeCompare(b.title);
                    break;
                case 'createdAt':
                    comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                    break;
                case 'dueDate':
                    const aDate = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
                    const bDate = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
                    comparison = aDate - bDate;
                    break;
                case 'priority':
                    const priorityOrder = { high: 3, medium: 2, low: 1 };
                    comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
                    break;
            }
            
            return sortOrder === 'asc' ? comparison : -comparison;
        });
    }, [tasks, searchTerm, statusFilter, priorityFilter, sortBy, sortOrder]);

    // Selection handlers
    const handleSelectTask = (id: string, selected: boolean) => {
        setSelectedTasks(prev => 
            selected 
                ? [...prev, id]
                : prev.filter(taskId => taskId !== id)
        );
    };

    const handleSelectAll = (checked: boolean) => {
        setSelectedTasks(checked ? filteredAndSortedTasks.map(task => task.id) : []);
    };

    // Bulk operations
    const handleBulkComplete = () => {
        selectedTasks.forEach(id => toggleTask(id));
        setSelectedTasks([]);
    };

    const handleBulkDelete = () => {
        selectedTasks.forEach(id => deleteTask(id));
        setSelectedTasks([]);
    };

    const clearSelection = () => {
        setSelectedTasks([]);
    };

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Tasks</h1>
                <div className="text-sm text-muted-foreground">
                    {filteredAndSortedTasks.length} of {tasks.length} tasks
                </div>
            </div>

            {/* Search and Filters */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        Filters & Search
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search tasks..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    {/* Filters Row */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={priorityFilter} onValueChange={(value: any) => setPriorityFilter(value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Priority" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Priorities</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="low">Low</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="createdAt">Created Date</SelectItem>
                                <SelectItem value="dueDate">Due Date</SelectItem>
                                <SelectItem value="priority">Priority</SelectItem>
                                <SelectItem value="title">Title</SelectItem>
                            </SelectContent>
                        </Select>

                        <Button
                            variant="outline"
                            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                            className="flex items-center gap-2"
                        >
                            <ArrowUpDown className="h-4 w-4" />
                            {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Bulk Operations */}
            {selectedTasks.length > 0 && (
                <Card className="border-blue-200 bg-blue-50">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">
                                    {selectedTasks.length} task{selectedTasks.length > 1 ? 's' : ''} selected
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    size="sm"
                                    onClick={handleBulkComplete}
                                    className="flex items-center gap-1"
                                >
                                    <CheckCheck className="h-3 w-3" />
                                    Mark Complete
                                </Button>
                                <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={handleBulkDelete}
                                    className="flex items-center gap-1"
                                >
                                    <Trash2 className="h-3 w-3" />
                                    Delete
                                </Button>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={clearSelection}
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Select All */}
            {filteredAndSortedTasks.length > 0 && (
                <div className="flex items-center gap-2">
                    <Checkbox
                        checked={selectedTasks.length === filteredAndSortedTasks.length && filteredAndSortedTasks.length > 0}
                        onCheckedChange={handleSelectAll}
                    />
                    <span className="text-sm text-muted-foreground">
                        Select all visible tasks
                    </span>
                </div>
            )}

            {/* Tasks List */}
            <TasksList 
                tasks={filteredAndSortedTasks}
                onDeleteTask={deleteTask}
                onToggleComplete={(id, completed) => toggleTask(id)}
                selectedTasks={selectedTasks}
                onSelectTask={handleSelectTask}
            />
        </div>
    );
}
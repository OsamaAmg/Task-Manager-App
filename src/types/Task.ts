
export default interface Task {
    id: string,
    title: string,
    description?: string, // Added optional description field
    completed: boolean,
    priority: 'low' | 'medium' | 'high',
    createdAt: string, // Changed to string for better serialization
    dueDate?: string   // Changed to string for better serialization
}
import api from './api';
import { Task, Project, Client, TaskPriority, TaskRecurrence } from '../types';

export const dataService = {
    // Tasks
    fetchTasks: async (): Promise<Task[]> => {
        const response = await api.get('/tasks/');
        // Backend uses snake_case, frontend uses camelCase. We might need mapping or update backend serializers.
        // For now assuming we need to map basics or rely on JS flexibility. 
        // Ideally backend serializers should use camelCase or we map here.
        // Let's assume standard DRF snake_case for now and map them.
        return response.data.map((task: any) => ({
            id: task.id.toString(),
            description: task.description,
            projectId: task.project.toString(), // Foreign key
            startTime: task.start_time,
            duration: task.duration,
            date: task.date,
            isCompleted: task.is_completed,
            priority: task.priority as TaskPriority,
            recurrence: task.recurrence as TaskRecurrence,
            comment: task.comment,
            imageUrl: task.image_url,
            dueDate: task.due_date,
            isRunning: false // Derived state usually
        }));
    },

    createTask: async (task: Partial<Task>): Promise<Task> => {
        const payload = {
            description: task.description,
            project: task.projectId,
            duration: task.duration,
            is_completed: task.isCompleted,
            priority: task.priority,
            recurrence: task.recurrence,
            comment: task.comment,
            image_url: task.imageUrl,
            due_date: task.dueDate
        };
        const response = await api.post('/tasks/', payload);
        const data = response.data;
        return {
            id: data.id.toString(),
            description: data.description,
            projectId: data.project.toString(),
            startTime: data.start_time,
            duration: data.duration,
            date: data.date,
            isCompleted: data.is_completed,
            priority: data.priority as TaskPriority,
            recurrence: data.recurrence as TaskRecurrence,
            comment: data.comment,
            imageUrl: data.image_url,
            dueDate: data.due_date,
            isRunning: false
        };
    },

    updateTask: async (id: string, task: Partial<Task>): Promise<Task> => {
        const payload: any = {};
        if (task.description !== undefined) payload.description = task.description;
        if (task.isCompleted !== undefined) payload.is_completed = task.isCompleted;
        if (task.duration !== undefined) payload.duration = task.duration;
        if (task.priority !== undefined) payload.priority = task.priority;
        if (task.date !== undefined) payload.date = task.date;

        const response = await api.patch(`/tasks/${id}/`, payload);
        return response.data;
    },

    deleteTask: async (id: string): Promise<void> => {
        await api.delete(`/tasks/${id}/`);
    },

    // Projects
    fetchProjects: async (): Promise<Project[]> => {
        const response = await api.get('/projects/');
        return response.data.map((p: any) => ({
            id: p.id.toString(),
            name: p.name,
            color: p.color,
            clientId: p.client.toString(),
            deadline: p.deadline,
            estimatedDuration: p.estimated_duration
        }));
    },

    createProject: async (project: Partial<Project>): Promise<Project> => {
        const payload = {
            name: project.name,
            color: project.color,
            client: project.clientId,
            deadline: project.deadline,
            estimated_duration: project.estimatedDuration
        };
        const response = await api.post('/projects/', payload);
        const p = response.data;
        return {
            id: p.id.toString(),
            name: p.name,
            color: p.color,
            clientId: p.client,
            deadline: p.deadline,
            estimatedDuration: p.estimated_duration
        };
    },

    updateProject: async (id: string, project: Partial<Project>): Promise<Project> => {
        const payload: any = {};
        if (project.name) payload.name = project.name;
        if (project.color) payload.color = project.color;
        if (project.clientId) payload.client = project.clientId;
        if (project.deadline !== undefined) payload.deadline = project.deadline;
        if (project.estimatedDuration !== undefined) payload.estimated_duration = project.estimatedDuration;

        const response = await api.patch(`/projects/${id}/`, payload);
        const p = response.data;
        return {
            id: p.id.toString(),
            name: p.name,
            color: p.color,
            clientId: p.client,
            deadline: p.deadline,
            estimatedDuration: p.estimated_duration
        };
    },

    deleteProject: async (id: string): Promise<void> => {
        await api.delete(`/projects/${id}/`);
    },

    // Clients
    fetchClients: async (): Promise<Client[]> => {
        const response = await api.get('/clients/');
        return response.data.map((c: any) => ({
            id: c.id.toString(),
            name: c.name,
            hourlyRate: parseFloat(c.hourly_rate),
            currency: c.currency
        }));
    },

    createClient: async (client: Partial<Client> & { email?: string; password?: string }): Promise<Client> => {
        const payload = {
            name: client.name,
            hourly_rate: client.hourlyRate,
            currency: client.currency,
            email: client.email,
            password: client.password
        };
        const response = await api.post('/clients/', payload);
        const c = response.data;
        return {
            id: c.id.toString(),
            name: c.name,
            hourlyRate: parseFloat(c.hourly_rate),
            currency: c.currency
        };
    },

    updateClient: async (id: string, client: Partial<Client>): Promise<Client> => {
        const payload: any = {};
        if (client.name) payload.name = client.name;
        if (client.hourlyRate) payload.hourly_rate = client.hourlyRate;
        if (client.currency) payload.currency = client.currency;

        const response = await api.patch(`/clients/${id}/`, payload);
        const c = response.data;
        return {
            id: c.id.toString(),
            name: c.name,
            hourlyRate: parseFloat(c.hourly_rate),
            currency: c.currency
        };
    },

    deleteClient: async (id: string): Promise<void> => {
        await api.delete(`/clients/${id}/`);
    }
};

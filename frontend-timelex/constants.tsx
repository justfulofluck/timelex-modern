
import { Client, Project, Task } from './types';

export const INITIAL_CLIENTS: Client[] = [
  { id: 'c1', name: 'Default Client', hourlyRate: 50, currency: 'USD' },
  { id: 'c2', name: 'TechCorp', hourlyRate: 120, currency: 'USD' },
];

export const INITIAL_PROJECTS: Project[] = [
  { 
    id: 'p1', 
    name: 'Default', 
    color: '#3b82f6', 
    clientId: 'c1',
    deadline: '2026-12-31',
    estimatedDuration: 36000000 // 10 hours
  },
  { 
    id: 'p2', 
    name: 'RHMS', 
    color: '#10b981', 
    clientId: 'c1',
    deadline: '2025-01-01', // Overdue example
    estimatedDuration: 72000000 // 20 hours
  },
  { 
    id: 'p3', 
    name: 'Website Redesign', 
    color: '#f59e0b', 
    clientId: 'c2',
    deadline: '2026-06-30',
    estimatedDuration: 180000000 // 50 hours
  },
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 't1',
    description: 'Responcive changes',
    projectId: 'p1',
    startTime: null,
    duration: 2116000, // 35:16
    date: '2026-01-01',
    isRunning: false,
    isCompleted: false,
    priority: 'medium',
    recurrence: 'none',
  },
  {
    id: 't2',
    description: 'Fix UI and Test Functionality.',
    projectId: 'p2',
    startTime: null,
    duration: 14994000, // 04:09:54
    date: '2025-12-22',
    isRunning: false,
    isCompleted: true,
    priority: 'high',
    recurrence: 'none',
  },
];

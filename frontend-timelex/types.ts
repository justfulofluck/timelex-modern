
export interface Client {
  id: string;
  name: string;
  hourlyRate: number;
  currency: string;
}

export interface Project {
  id: string;
  name: string;
  color: string;
  clientId: string;
  deadline?: string;
  estimatedDuration?: number; // estimated time in ms
}

export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskRecurrence = 'none' | 'daily' | 'weekly' | 'monthly';

export interface Task {
  id: string;
  description: string;
  projectId: string;
  startTime: number | null; // null if not running
  duration: number; // accumulated time in ms
  date: string; // ISO date string
  isRunning: boolean;
  isCompleted: boolean;
  priority: TaskPriority;
  recurrence: TaskRecurrence;
  comment?: string;
  imageUrl?: string;
  dueDate?: string;
}

export type View = 'tasks' | 'projects' | 'clients' | 'reports' | 'overview' | 'invoices' | 'settings';

export type UserRole = 'admin' | 'client';

export interface UserSession {
  role: UserRole;
  clientId?: string; // Only set if role is 'client'
  name: string;
}

export interface TimeSummary {
  day: string;
  totalTime: number;
  earnings: number;
}

export interface AIConfig {
  useCustom: boolean;
  endpoint: string;
  apiKey: string;
  model?: string;
}

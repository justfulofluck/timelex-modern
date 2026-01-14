import api from './api';
import { UserRole } from '../types';

export const authService = {
    login: async (email: string, password: string): Promise<{ token: string; role: UserRole; clientId?: string }> => {
        try {
            const response = await api.post('/login/', { email, password });
            const token = response.data.token;
            localStorage.setItem('timelex_token', token);

            const { role, user_id, username, client_id } = response.data;

            // Allow backend to dictate role, fallback to logic if needed (but backend is now source of truth)
            // We map backend 'admin'/'client' string to UserRole type if needed, but it matches.

            return { token, role: role as UserRole, clientId: role === 'client' && client_id ? client_id.toString() : undefined };
        } catch (error) {
            throw new Error('Login failed');
        }
    },

    resetPassword: async (email: string): Promise<void> => {
        try {
            await api.post('/reset-password/', { email });
        } catch (error: any) {
            if (error.response?.data?.error) {
                throw new Error(error.response.data.error);
            }
            throw new Error('Reset failed');
        }
    },

    changePassword: async (oldPassword: string, newPassword: string): Promise<void> => {
        try {
            await api.post('/change-password/', { old_password: oldPassword, new_password: newPassword });
        } catch (error: any) {
            if (error.response?.data?.error) {
                throw new Error(error.response.data.error);
            }
            throw new Error('Failed to update password');
        }
    },

    logout: () => {
        localStorage.removeItem('timelex_token');
    },

    getToken: () => {
        return localStorage.getItem('timelex_token');
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('timelex_token');
    }
};

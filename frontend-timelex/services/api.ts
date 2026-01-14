import axios from 'axios';

// Dynamically determine the backend URL based on the current window location.
// This allows accessing the backend when viewing the frontend from a different device on the LAN.
const API_URL = `http://${window.location.hostname}:8000/api`;

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('timelex_token');
    if (token) {
        config.headers.Authorization = `Token ${token}`;
    }
    return config;
});

export default api;

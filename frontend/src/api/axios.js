import axios from 'axios';

const API = axios.create({
    baseURL: 'https://a-ai-counselling-website-for-abroad-study.onrender.com'
});

// Add token to requests
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth
export const signup = (data) => API.post('/auth/signup', data);
export const login = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');

// Profile
export const createProfile = (data) => API.post('/profile', data);
export const getProfile = () => API.get('/profile');
export const updateProfile = (data) => API.put('/profile', data);
export const getProfileStrength = () => API.get('/profile/strength');

// Universities
export const getUniversities = (params) => API.get('/universities', { params });
export const getUniversity = (id) => API.get(`/universities/${id}`);
export const getRecommendations = () => API.get('/universities/recommend');

// Shortlist
export const addToShortlist = (data) => API.post('/shortlist', data);
export const getShortlist = () => API.get('/shortlist');
export const getLockedUniversities = () => API.get('/shortlist/locked');
export const removeFromShortlist = (id) => API.delete(`/shortlist/${id}`);
export const lockUniversity = (id) => API.put(`/shortlist/${id}/lock`);
export const unlockUniversity = (id) => API.put(`/shortlist/${id}/unlock`);

// Todos
export const getTodos = (params) => API.get('/todos', { params });
export const createTodo = (data) => API.post('/todos', data);
export const updateTodo = (id, data) => API.put(`/todos/${id}`, data);
export const deleteTodo = (id) => API.delete(`/todos/${id}`);

// AI
export const sendMessage = (message) => API.post('/ai/chat', { message });
export const getAnalysis = () => API.get('/ai/analyze');
export const getChatHistory = () => API.get('/ai/history');
export const clearChatHistory = () => API.delete('/ai/history');

export default API;

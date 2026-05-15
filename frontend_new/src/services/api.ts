import axios, { InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor to add JWT token to requests
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const academicService = {
    getSubjects: () => apiClient.get('/academics/subjects'),
    getSubjectDetails: (id: string) => apiClient.get(`/academics/subjects/${id}`),
    getModules: (subjectId: string) => apiClient.get(`/academics/subjects/${subjectId}/modules`),
    getAnalysis: (subjectId: string) => apiClient.get(`/academics/subjects/${subjectId}/analysis`),
};

export const aiService = {
    chat: (subjectId: string, message: string) =>
        apiClient.post('/ai/chat', { subject_id: subjectId, message }),
    evaluate: (question: string, answer: string, scheme: string) =>
        apiClient.post('/academics/evaluate', { question, answer, scheme }),
};

export const authService = {
    login: (credentials: Record<string, string>) => apiClient.post('/auth/login', credentials),
    signup: (userData: Record<string, string>) => apiClient.post('/auth/signup', userData),
};

export default apiClient;

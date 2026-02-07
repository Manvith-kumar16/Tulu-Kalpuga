import { toast } from "sonner";

const API_URL = 'https://tulu-kalpuga.onrender.com/';

interface RequestOptions extends RequestInit {
    headers?: Record<string, string>;
}

async function fetchWithAuth(url: string, options: RequestOptions = {}) {
    const token = localStorage.getItem('token');

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['x-auth-token'] = token;
    }

    const response = await fetch(`${API_URL}${url}`, {
        ...options,
        headers,
    });

    let data;
    try {
        data = await response.json();
    } catch (error) {
        // If response is not JSON (e.g. 500 HTML or text), treat as generic error
        throw new Error(response.statusText || 'Network response was not ok');
    }

    if (!response.ok) {
        throw new Error(data?.msg || data?.message || 'Something went wrong');
    }


    return data;
}

export const api = {
    get: (url: string) => fetchWithAuth(url, { method: 'GET' }),
    post: (url: string, body: any) => fetchWithAuth(url, { method: 'POST', body: JSON.stringify(body) }),
    put: (url: string, body: any) => fetchWithAuth(url, { method: 'PUT', body: JSON.stringify(body) }),
    delete: (url: string) => fetchWithAuth(url, { method: 'DELETE' }),
    // Progress API
    getProgress: () => fetchWithAuth('/progress', { method: 'GET' }),
    getStats: () => api.get('/progress/stats'),
    logLearn: (letter: string) => api.post('/progress/learn', { letter }),
    logPractice: (letter?: string) => api.post('/progress/practice', { letter }),
    logQuiz: (score: number, total: number) => api.post('/progress/quiz', { score, total }),
    logActivity: (type: 'learn' | 'quiz' | 'practice', data: any, action?: string) =>
        fetchWithAuth('/progress/activity', {
            method: 'POST',
            body: JSON.stringify({ type, data, action })
        }),
};

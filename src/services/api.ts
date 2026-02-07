import { toast } from "sonner";

const API_URL = 'https://tulu-kalpuga.onrender.com/api';

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

    const fullUrl = `${API_URL}${url}`;
    console.log(`📡 Request: ${fullUrl}`);

    try {
        const response = await fetch(fullUrl, {
            ...options,
            headers,
        });

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            const data = await response.json();

            if (!response.ok) {
                console.error("❌ API Error:", data);
                throw new Error(data?.msg || data?.message || `Error ${response.status}: ${response.statusText}`);
            }
            return data;
        } else {
            // Received non-JSON response (likely HTML error from server/proxy)
            const text = await response.text();
            console.error("❌ Non-JSON Response:", response.status, text);

            if (!response.ok) {
                throw new Error(`Server Error (${response.status}): ${response.statusText || "Check console for details"}`);
            }
            return text; // Should likely not happen for valid API calls expecting JSON
        }
    } catch (error: any) {
        console.error("❌ Network/Request Error:", error);
        throw error;
    }
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

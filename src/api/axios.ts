import axios from "axios"

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,  // This is crucial for cookies
    headers: {
        "Content-Type": "application/json",
    },
})

// Add automatic token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            try {
                // Attempt to refresh the token
                await api.post('/api/auth/refresh/');
                // Retry the original request with new token
                return api(originalRequest);
            } catch (refreshError) {
                // Refresh failed - redirect to login
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        
        return Promise.reject(error);
    }
)

export default api
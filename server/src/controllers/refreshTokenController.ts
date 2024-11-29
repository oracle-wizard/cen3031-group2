import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/api', 
    withCredentials: true,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    }, 
});

// Attach the token to every request if available
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            console.log("Attaching access token to request.");
            config.headers.Authorization = `Bearer ${token}`;
        } else {
            console.log("No access token found for this request.");
        }
        return config;
    },
    (error) => {
        console.log(`Error in request interceptor: ${error}`);
        return Promise.reject(error);
    }
);

// Handle 401 errors and refresh the token
api.interceptors.response.use(
    (response) => {
        console.log("Response received successfully.");
        return response;
    }, 
    async (error) => {
        console.log(`Error response status: ${error.response?.status}`);
        const originalRequest = error.config;

        // If 401 and retry hasn't been attempted
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const { data } = await api.post('/refresh-token', {}, { withCredentials: true });
                const newAccessToken = data.token;

                console.log("New access token received and stored.");
                localStorage.setItem('accessToken', newAccessToken);

                // Attach the new token to the original request
                api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                
                return api(originalRequest); // Retry the original request
            } catch (refreshError) {
                console.log("Failed to refresh token. Redirecting to login.");
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export const refreshToken = api; // Named export for the Axios instance
export default refreshToken;

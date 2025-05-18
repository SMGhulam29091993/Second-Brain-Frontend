import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';

const apiUrl: string = import.meta.env.VITE_BASE_URL;
console.log('API URL:', apiUrl);

const getToken = () => localStorage.getItem('token');

const api: AxiosInstance = axios.create({
    baseURL: apiUrl,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
    withCredentials: true,
});

// Add token to every request
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle unauthorized responses
api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config;

        if (!originalRequest) {
            return Promise.reject(error);
        }

        // Prevent infinite retry loops
        if ((originalRequest as any)._retry) {
            return Promise.reject(error);
        }

        // Check for token expiration errors
        const is401or403 = error.response && [401, 403].includes(error.response.status);

        // Check for 500 error with TokenExpiredError
        const is500TokenExpired =
            error.response &&
            error.response.status === 500 &&
            JSON.stringify(error.response.data).includes('TokenExpiredError');

        if (is401or403 || is500TokenExpired) {
            // Mark this request as retried
            (originalRequest as any)._retry = true;

            try {
                // Call the refresh token endpoint with GET method
                const refreshResponse = await axios.get(`${apiUrl}/user/refresh-token`, {
                    withCredentials: true,
                });

                // Check if we received a valid token
                if (refreshResponse.data?.data?.token) {
                    const newToken = refreshResponse.data.data.token;

                    // Store the new token
                    localStorage.setItem('token', newToken);

                    // Update default headers for future requests
                    api.defaults.headers.common.Authorization = `Bearer ${newToken}`;

                    // Update the original request with the new token
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;

                    // Retry the original request with the new token
                    return axios(originalRequest);
                }

                return Promise.reject(error);
            } catch (refreshError) {
                // If refresh token fails, clear token and possibly redirect
                localStorage.removeItem('token');

                // Optionally redirect to login page
                // window.location.href = '/login';

                return Promise.reject(refreshError);
            }
        }

        // For all other errors, just reject the promise
        return Promise.reject(error);
    }
);

export default api;

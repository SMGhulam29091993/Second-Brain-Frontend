import axios, { AxiosInstance } from 'axios';

const apiUrl: string = import.meta.env.VITE_BASE_URL;
console.log('API URL:', apiUrl);

const token = localStorage.getItem('token');

const api: AxiosInstance = axios.create({
    baseURL: apiUrl,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
    },
    withCredentials: true,
});

export default api;

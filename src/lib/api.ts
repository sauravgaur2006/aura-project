import axios from 'axios';

// #3: withCredentials ensures httpOnly cookies are sent with every request
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
});

export default api;

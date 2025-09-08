import axios from 'axios';
import history from '../utils/history';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

export const setupAxiosInterceptors = (store) => {
  API.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  API.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Dispatch logout action
        store.dispatch({ type: 'auth/logout/fulfilled' }); // Manually dispatch the fulfilled action
        history.push('/login');
      }
      return Promise.reject(error);
    }
  );
};

export default API;
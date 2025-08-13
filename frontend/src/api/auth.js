import API from './api';

const authService = {
  login: (credentials) => API.post('/auth/login', credentials),
  register: (userData) => API.post('/auth/register', userData),
  logout: () => {
    localStorage.removeItem('token');
    API.post('/auth/logout');
  }
};

export default authService;
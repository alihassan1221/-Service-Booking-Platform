import API from './api';

const register = async (userData) => {
  const response = await API.post('/auth/register', userData);

  // if (response.data) {
  //   localStorage.setItem('user', JSON.stringify(response.data.user));
  //   localStorage.setItem('token', response.data.token);
  // }

  return response.data;
};

const login = async (userData) => {
  const response = await API.post('/auth/login', userData);

  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data.user));
    localStorage.setItem('token', response.data.token);
  }

  return response.data;
};

const logout = async () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
};

const authService = {
  register,
  login,
  logout,
};

export default authService;
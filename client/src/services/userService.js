import API from './api';

const getUsers = async (token) => {
  const response = await API.get('/users');
  return response.data.data;
};

const createManager = async (userData, token) => {
  const response = await API.post('/users/managers', userData);
  return response.data.data;
};

const deleteUser = async (userId, token) => {
  await API.delete(`/users/${userId}`);
  return { id: userId };
};

const userService = {
  getUsers,
  createManager,
  deleteUser,
};

export default userService;
import API from './api';

const getUsers = async () => {
  try {
    const response = await API.get('/users');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

const createManager = async (userData) => {
  try {
    const response = await API.post('/users/managers', userData);
    return response.data.data;
  } catch (error) {
    console.error('Error creating manager:', error);
    throw error;
  }
};

const deleteUser = async (userId) => {
  try {
    await API.delete(`/users/${userId}`);
    return { id: userId };
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};
// Update user
const updateUser = async (userId, userData) => {
  try {
    const response = await API.put(`/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    console.error("Error updating Manager", error);
    throw error;
  }
};

const userService = {
  getUsers,
  createManager,
  deleteUser,
  updateUser,
};

export default userService;
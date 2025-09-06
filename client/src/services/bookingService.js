import API from './api';

const createBooking = async (bookingData, token) => {
  const response = await API.post('/bookings', bookingData);
  return response.data.data;
};

const getUserBookings = async (token) => {
  const response = await API.get('/bookings');
  return response.data.data;
};

const getAllBookings = async (token) => {
  const response = await API.get('/bookings');
  return response.data.data;
};

const updateBooking = async (bookingId, bookingData, token) => {
  const response = await API.put(`/bookings/${bookingId}`, bookingData);
  return response.data.data;
};

const deleteBooking = async (bookingId, token) => {
  await API.delete(`/bookings/${bookingId}`);
  return { id: bookingId };
};

const bookingService = {
  createBooking,
  getUserBookings,
  getAllBookings,
  updateBooking,
  deleteBooking,
};

export default bookingService;
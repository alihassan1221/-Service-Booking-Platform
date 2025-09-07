import API from './api';

const createBooking = async (bookingData) => {
  try {
    const response = await API.post('/bookings', bookingData);
    return response.data.data;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};

const getUserBookings = async () => {
  try {
    const response = await API.get('/bookings');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    throw error;
  }
};

const getAllBookings = async () => {
  try {
    const response = await API.get('/bookings');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching all bookings:', error);
    throw error;
  }
};

const updateBooking = async (bookingId, bookingData) => {
  try {
    const response = await API.put(`/bookings/${bookingId}`, bookingData);
    return response.data.data;
  } catch (error) {
    console.error('Error updating booking:', error);
    throw error;
  }
};

const deleteBooking = async (bookingId) => {
  try {
    await API.delete(`/bookings/${bookingId}`);
    return { id: bookingId };
  } catch (error) {
    console.error('Error deleting booking:', error);
    throw error;
  }
};

const bookingService = {
  createBooking,
  getUserBookings,
  getAllBookings,
  updateBooking,
  deleteBooking,
};

export default bookingService;
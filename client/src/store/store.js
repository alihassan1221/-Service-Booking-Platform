import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import bookingReducer from './slices/bookingSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    bookings: bookingReducer,
    users: userReducer,
  },
});
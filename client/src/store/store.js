import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import bookingReducer from './slices/bookingSlice';
import userReducer from './slices/userSlice';

const appReducer = combineReducers({
  auth: authReducer,
  bookings: bookingReducer,
  users: userReducer,
});

const rootReducer = (state, action) => {
  if (action.type === 'auth/logout/fulfilled') {
    state = undefined; 
  }
  return appReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
});

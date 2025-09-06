import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import bookingService from '../../services/bookingService';

const initialState = {
  bookings: [],
  booking: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

export const createBooking = createAsyncThunk(
  'bookings/create',
  async (bookingData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await bookingService.createBooking(bookingData, token);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getUserBookings = createAsyncThunk(
  'bookings/getAll',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await bookingService.getUserBookings(token);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getAllBookings = createAsyncThunk(
  'bookings/getAllBookings',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await bookingService.getAllBookings(token);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateBooking = createAsyncThunk(
  'bookings/update',
  async ({ bookingId, bookingData }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await bookingService.updateBooking(bookingId, bookingData, token);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteBooking = createAsyncThunk(
  'bookings/delete',
  async (bookingId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await bookingService.deleteBooking(bookingId, token);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBooking.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.bookings.push(action.payload);
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getUserBookings.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserBookings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.bookings = action.payload;
      })
      .addCase(getUserBookings.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getAllBookings.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllBookings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.bookings = action.payload;
      })
      .addCase(getAllBookings.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateBooking.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateBooking.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.bookings = state.bookings.map((booking) =>
          booking._id === action.payload._id ? action.payload : booking
        );
      })
      .addCase(updateBooking.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteBooking.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteBooking.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.bookings = state.bookings.filter(
          (booking) => booking._id !== action.payload.id
        );
      })
      .addCase(deleteBooking.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = bookingSlice.actions;
export default bookingSlice.reducer;
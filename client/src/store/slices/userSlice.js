import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userService from '../../services/userService';

const initialState = {
  users: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

export const getUsers = createAsyncThunk(
  'users/getAll',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await userService.getUsers(token);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const createManager = createAsyncThunk(
  'users/createManager',
  async (userData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await userService.createManager(userData, token);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteUser = createAsyncThunk(
  'users/delete',
  async (userId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await userService.deleteUser(userId, token);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const userSlice = createSlice({
  name: 'user',
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
      .addCase(getUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.users = action.payload;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createManager.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createManager.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.users.push(action.payload);
      })
      .addCase(createManager.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.users = state.users.filter(
          (user) => user._id !== action.payload.id
        );
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = userSlice.actions;
export default userSlice.reducer;
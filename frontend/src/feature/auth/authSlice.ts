import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_URL}/auth`;

// Define the argument types
interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

interface AuthState {
  user: any | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

// Login user
export const loginUser = createAsyncThunk<
  // Return type of the payload creator
  { user: any; token: string },
  // Argument type
  LoginPayload,
  { rejectValue: { message: string } }
>(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });
      localStorage.setItem("token", response.data.token);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Register user
export const registerUser = createAsyncThunk<
  { user: any },
  RegisterPayload,
  { rejectValue: { message: string } }
>("auth/registerUser", async ({ name, email, password }, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_URL}/signup`, { name, email, password });
    localStorage.setItem("token", response.data.token);

    return response.data;
  } catch (err: any) {
    return rejectWithValue(err.response.data);
  }
});

// Slice
const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("token") || null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Something went wrong";
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Something went wrong";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;

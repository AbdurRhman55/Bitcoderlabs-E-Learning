import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '../src/api/index.js';

const initialState = {
    isAuthenticated: false,
    user: null,
    token: localStorage.getItem('token') || '',
    loading: !!localStorage.getItem('token'),
    error: null,
}

export const login = createAsyncThunk(
    "auth/login",
    async (credentials, { rejectWithValue }) => {
        try {
            const data = await apiClient.login(credentials);
            return data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

export const logoutAsync = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            await apiClient.logout();
            return null;
        } catch (err) {
            // Even if API call fails, we should still clear local state
            console.warn('Logout API call failed, clearing local state anyway:', err);
            return null;
        }
    }
);

export const register = createAsyncThunk(
    'auth/register',
    async (userData, { rejectWithValue }) => {
        try {
            const data = await apiClient.register(userData);
            return data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

export const checkAuth = createAsyncThunk(
    'auth/checkAuth',
    async (_, { rejectWithValue }) => {
        try {
            const data = await apiClient.getCurrentUser();
            return data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        // Login cases
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload.token;
                state.user = action.payload.user;
                state.isAuthenticated = true;
                localStorage.setItem('token', action.payload.token);
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Register cases
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.token) {
                    state.token = action.payload.token;
                    state.user = action.payload.user;
                    state.isAuthenticated = true;
                    localStorage.setItem('token', action.payload.token);
                }
                // For inactive users, just show success message, no auto-login
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Check auth cases
            .addCase(checkAuth.pending, (state) => {
                state.loading = true;
            })
            .addCase(checkAuth.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.isAuthenticated = true;
            })
            .addCase(checkAuth.rejected, (state, action) => {
                state.loading = false;
                state.token = '';
                state.isAuthenticated = false;
                state.user = null;
                localStorage.removeItem('token');
            })

            // Logout cases
            .addCase(logoutAsync.pending, (state) => {
                state.isAuthenticated = false;
                state.user = null;
                state.error = null;
            })
            .addCase(logoutAsync.fulfilled, (state) => {
                state.token = '';
                state.isAuthenticated = false;
                state.user = null;
                state.error = null;
                localStorage.removeItem('token');
            });
    },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;

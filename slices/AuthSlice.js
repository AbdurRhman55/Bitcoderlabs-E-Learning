import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '../src/api/index.js';

const getInitialUser = () => {
    try {
        const userData = localStorage.getItem('userData');
        const token = localStorage.getItem('token');
        if (token && userData) {
            return JSON.parse(userData);
        }
    } catch (e) {
        console.warn('Error parsing user data from localStorage:', e);
    }
    return null;
};

const initialState = {
    isAuthenticated: false,
    user: getInitialUser(),
    token: localStorage.getItem('token') || null,
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
    async () => {
        try {
            await apiClient.logout();
            return null;
        } catch (err) {
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

export const updateProfile = createAsyncThunk(
    'auth/updateProfile',
    async ({ userData }, { rejectWithValue, getState }) => { // Changed: removed id parameter
        try {
            const state = getState();
            const currentUser = state.auth.user;

            if (!currentUser || !currentUser.id) {
                throw new Error('User not authenticated');
            }

            // Always use the current user's ID
            const data = await apiClient.updateMyProfile(currentUser.id, userData);
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
        },
        updateUserAvatar: (state, action) => {
            if (state.user) {
                state.user.avatar = action.payload;
                const savedUser = JSON.parse(localStorage.getItem('userData') || '{}');
                savedUser.avatar = action.payload;
                localStorage.setItem('userData', JSON.stringify({ ...savedUser, ...state.user }));
            }
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
                const { user, token } = action.payload;
                state.token = token;
                state.user = user;
                state.isAuthenticated = true;
                state.error = null;
                localStorage.setItem('token', token);
                localStorage.setItem('userData', JSON.stringify(user));
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
                // Registration never returns a token - user must verify email first
                // Store user data temporarily if needed, but don't set isAuthenticated
                state.user = action.payload.user;
                state.error = null;
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
                const savedAvatar = localStorage.getItem(`avatar_${action.payload.user.id}`);
                if (savedAvatar) {
                    state.user.avatar = savedAvatar;
                }
                state.isAuthenticated = true;
                localStorage.setItem('userData', JSON.stringify(state.user));
            })
            .addCase(checkAuth.rejected, (state) => {
                state.loading = false;
                state.token = null;
                state.isAuthenticated = false;
                state.user = null;
                state.error = null;
                localStorage.removeItem('token');
                localStorage.removeItem('userData');
            })

            // Logout cases
            .addCase(logoutAsync.pending, (state) => {
                state.isAuthenticated = false;
                state.user = null;
                state.error = null;
            })
            .addCase(logoutAsync.fulfilled, (state) => {
                state.token = null;
                state.isAuthenticated = false;
                state.user = null;
                state.error = null;
                localStorage.removeItem('token');
                localStorage.removeItem('userData');
            })

            // Update profile cases
            .addCase(updateProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.loading = false;
                const updatedUser = action.payload.user || action.payload;
                state.user = { ...state.user, ...updatedUser };
                localStorage.setItem('userData', JSON.stringify(state.user));
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearError, updateUserAvatar } = authSlice.actions;
export default authSlice.reducer;
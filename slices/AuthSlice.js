import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
    name: '',
    email: '',
    password: '',
    token: '',
    role: '',
    confirmation_password: '',
    isAuthenticated: false,
    user: null,
    error: null,
}


export const login = createAsyncThunk(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const res = await fetch("http://127.0.0.1:8000/api/v1/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(credentials),
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.message || 'Login failed');
            console.log(data);

            return data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.token = '';
            state.isAuthenticated = false;
            state.user = null;
            localStorage.clear()
            if (localStorage.getItem("token")) {
                return
            } else {
                alert("successfully Logouted")
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.token = action.payload.token;
                state.user = action.payload.user;
                state.isAuthenticated = true;
                localStorage.setItem('token', action.payload.token);
            })

            .addCase(login.rejected, (state, action) => {
                state.error = action.payload;
            });
    }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;

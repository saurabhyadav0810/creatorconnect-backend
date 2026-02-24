import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as authApi from '../../api/authApi';


export const initiateSignup = createAsyncThunk(
    'auth/initiateSignup',
    async (email, { rejectWithValue }) => {
        try {
            const response = await authApi.initiateSignup(email);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Signup initiation failed');
        }
    }
);

export const verifySignupOtp = createAsyncThunk(
    'auth/verifySignupOtp',
    async (data, { rejectWithValue }) => {
        try {
            const response = await authApi.verifySignupOtp(data);
            localStorage.setItem('token', response.token);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'OTP verification failed');
        }
    }
);

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await authApi.loginUser(credentials);
            localStorage.setItem('token', response.token);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Login failed');
        }
    }
);

export const getCurrentUser = createAsyncThunk(
    'auth/getCurrentUser',
    async (_, { rejectWithValue }) => {
        try {
            const response = await authApi.getCurrentUser();
            return response.user;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch user');
        }
    }
);

export const logoutUser = createAsyncThunk(
    'auth/logoutUser',
    async (_, { rejectWithValue }) => {
        try {
            await authApi.logoutUser();
            localStorage.removeItem('token');
            return null;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Logout failed');
        }
    }
);

const initialState = {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    signupEmail: null,
    signupInitiated: false
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        resetAuth: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.signupEmail = null;
            state.signupInitiated = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        // Initiate Signup
        builder
            .addCase(initiateSignup.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(initiateSignup.fulfilled, (state, action) => {
                state.loading = false;
                state.signupInitiated = true;
                state.signupEmail = action.payload.email;
                state.error = null;
            })
            .addCase(initiateSignup.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

    
        builder
            .addCase(verifySignupOtp.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(verifySignupOtp.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.isAuthenticated = true;
                state.signupInitiated = false;
                state.signupEmail = null;
                state.error = null;
            })
            .addCase(verifySignupOtp.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

       
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        builder
            .addCase(getCurrentUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getCurrentUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(getCurrentUser.rejected, (state, action) => {
                state.loading = false;
                state.user = null;
                state.isAuthenticated = false;
            });

      
        builder
            .addCase(logoutUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.loading = false;
                state.user = null;
                state.isAuthenticated = false;
                state.error = null;
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearError, resetAuth } = authSlice.actions;
export default authSlice.reducer;
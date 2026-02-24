import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as assetApi from '../../api/assetApi';


export const createAsset = createAsyncThunk(
    'asset/createAsset',
    async (payload, { rejectWithValue }) => {
        try {
            const response = await assetApi.createAsset(payload);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create asset');
        }
    }
);

export const getMyAssets = createAsyncThunk(
    'asset/getMyAssets',
    async (_, { rejectWithValue }) => {
        try {
            const response = await assetApi.getMyAssets();
            return response.assets || response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch your assets');
        }
    }
);

export const getPublicAssets = createAsyncThunk(
    'asset/getPublicAssets',
    async (_, { rejectWithValue }) => {
        try {
            const response = await assetApi.getPublicAssets();
            return response.assets || response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch public assets');
        }
    }
);

const initialState = {
    myAssets: [],
    publicAssets: [],
    loading: false,
    error: null,
    createLoading: false,
    createError: null
};

const assetSlice = createSlice({
    name: 'asset',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
            state.createError = null;
        },
        resetAssets: (state) => {
            state.myAssets = [];
            state.publicAssets = [];
            state.error = null;
            state.createError = null;
        }
    },
    extraReducers: (builder) => {
     
        builder
            .addCase(createAsset.pending, (state) => {
                state.createLoading = true;
                state.createError = null;
            })
            .addCase(createAsset.fulfilled, (state, action) => {
                state.createLoading = false;
                state.myAssets.unshift(action.payload.asset || action.payload);
                state.createError = null;
            })
            .addCase(createAsset.rejected, (state, action) => {
                state.createLoading = false;
                state.createError = action.payload;
            });

     
        builder
            .addCase(getMyAssets.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getMyAssets.fulfilled, (state, action) => {
                state.loading = false;
                state.myAssets = Array.isArray(action.payload) ? action.payload : [];
                state.error = null;
            })
            .addCase(getMyAssets.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.myAssets = [];
            });

       
        builder
            .addCase(getPublicAssets.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getPublicAssets.fulfilled, (state, action) => {
                state.loading = false;
                state.publicAssets = Array.isArray(action.payload) ? action.payload : [];
                state.error = null;
            })
            .addCase(getPublicAssets.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.publicAssets = [];
            });
    }
});

export const { clearError, resetAssets } = assetSlice.actions;
export default assetSlice.reducer;
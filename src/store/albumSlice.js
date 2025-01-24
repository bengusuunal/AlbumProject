import { createSlice } from '@reduxjs/toolkit';

const albumSlice = createSlice({
    name: 'albums',
    initialState: {
        list: [],
        loading: false,
        error: null,
    },
    reducers: {
        setAlbums: (state, action) => {
            state.list = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
    },
});

export const { setAlbums, setLoading, setError } = albumSlice.actions;
export default albumSlice.reducer;

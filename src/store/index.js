import { configureStore } from '@reduxjs/toolkit';
import albumReducer from './albumSlice';

const store = configureStore({
    reducer: {
        albums: albumReducer, // Albüm slice'ını store'a bağla
    },
});

export default store;

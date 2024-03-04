import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'


import { api } from './api/api';
import auth from './authSlice'

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    auth
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware().concat(api.middleware)
});

setupListeners(store.dispatch);

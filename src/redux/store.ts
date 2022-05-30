import { combineReducers, configureStore } from '@reduxjs/toolkit'
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import authSlice from './reducers/authSlice'
import { serverApi } from '../services/serverApi'
import loginModalSlice from './reducers/loginModalSlice'
import currentGameSlice from './reducers/currentGameSlice'

const persistConfig = {
  key: 'root',
  storage,
  blacklist: [serverApi.reducerPath],
}

const rootReducer = combineReducers({
  [serverApi.reducerPath]: serverApi.reducer,
  authSlice,
  loginModalSlice,
  currentGameSlice,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

const setupStore = () =>
  configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(serverApi.middleware),
  })

export const store = setupStore()

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']

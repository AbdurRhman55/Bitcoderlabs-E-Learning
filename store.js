import { configureStore } from '@reduxjs/toolkit'
import authReducer from "./slices/AuthSlice"
import coursesReducer from './slices/courseSlice';


export default configureStore({
    reducer: {
        auth: authReducer,
        courses: coursesReducer
    }

}) 
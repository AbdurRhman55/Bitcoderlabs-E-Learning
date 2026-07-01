import { configureStore } from '@reduxjs/toolkit'
import authReducer from "./slices/AuthSlice"
import coursesReducer from './slices/courseSlice';
import blogReducer from './slices/blogSlice';


export default configureStore({
    reducer: {
        auth: authReducer,
        courses: coursesReducer,
        blogs: blogReducer,
    }

}) 
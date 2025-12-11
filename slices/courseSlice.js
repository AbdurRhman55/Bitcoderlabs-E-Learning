import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


export const fetchCourses = createAsyncThunk(
  'courses/fetchCourses',
  async () => {
    const response = await axios.get('http://127.0.0.1:8000/api/v1/courses');
    console.log(response.data.data);
    
    return response.data.data; 
  }
);


const coursesSlice = createSlice({
  name: 'courses',
  initialState: {
    courses: [], 
    loading: false,
    error: null,
  },
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload; 
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default coursesSlice.reducer;

export const selectCourses = (state) => state.courses.courses;

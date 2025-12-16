import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '../src/api/index.js';


export const fetchCourses = createAsyncThunk(
  'courses/fetchCourses',
  async () => {
    const response = await apiClient.getCourses();
    console.log(response.data);

    return response.data;
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

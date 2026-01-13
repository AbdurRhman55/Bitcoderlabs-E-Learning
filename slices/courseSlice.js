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

export const fetchMyCourses = createAsyncThunk(
  'courses/fetchMyCourses',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const userId = auth.user?.id;

      if (!userId) {
        return rejectWithValue("User not authenticated");
      }

      // 1. Fetch all enrollments
      const enrollmentsRes = await apiClient.getEnrollments();
      const enrollmentsData = enrollmentsRes.data || [];

      // 2. Filter for current student's enrollments
      // Note: We handle both single object and array responses for robustness
      const allEnrollments = Array.isArray(enrollmentsData) ? enrollmentsData : [enrollmentsData];
      const userEnrollments = allEnrollments.filter(e => e.user_id === userId);

      if (userEnrollments.length === 0) {
        return [];
      }

      // 3. For each enrollment, fetch the actual course details
      const coursePromises = userEnrollments.map(async (enrollment) => {
        try {
          const courseRes = await apiClient.getCourseById(enrollment.course_id);
          // Unwrap nested course data if it follows the { data: { ... } } pattern
          const courseData = courseRes.data?.data || courseRes.data || courseRes;

          return {
            ...courseData,
            progress: enrollment.progress_percentage || 0,
            status: enrollment.is_active ? 'active' : 'pending',
            enrollmentId: enrollment.id
          };
        } catch (err) {
          console.error(`Failed to fetch details for course ID ${enrollment.course_id}:`, err);
          return null;
        }
      });

      const resolvedCourses = await Promise.all(coursePromises);
      // Return only successfully fetched courses
      return resolvedCourses.filter(Boolean);
    } catch (err) {
      console.error("fetchMyCourses error:", err);
      return rejectWithValue(err.message || "Failed to fetch enrolled courses");
    }
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
      })
      .addCase(fetchMyCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload;
      })
      .addCase(fetchMyCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default coursesSlice.reducer;

export const selectCourses = (state) => state.courses.courses;

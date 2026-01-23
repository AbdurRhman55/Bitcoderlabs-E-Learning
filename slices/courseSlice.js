import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '../src/api/index.js';

export const fetchCourses = createAsyncThunk(
  'courses/fetchCourses',
  async () => {
    const response = await apiClient.getCourses();
    console.log(response.data);
    return response.data || [];
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

      const enrollmentsRes = await apiClient.getEnrollments();
      const enrollmentsData = enrollmentsRes.data || [];

      const allEnrollments = Array.isArray(enrollmentsData)
        ? enrollmentsData
        : [enrollmentsData];

      const userEnrollments = allEnrollments.filter(
        e => String(e.user_id) === String(userId)
      );

      if (userEnrollments.length === 0) {
        return [];
      }

      const coursePromises = userEnrollments.map(async (enrollment) => {
        try {
          const courseRes = await apiClient.getCourseById(enrollment.course_id);
          const courseData =
            courseRes.data?.data || courseRes.data || courseRes;

          const getDisplayStatus = (enrollment) => {
            if (enrollment.status) {
              switch (enrollment.status) {
                case 'approved':
                  return enrollment.is_active ? 'active' : 'pending';
                case 'rejected':
                  return 'rejected';
                case 'pending':
                default:
                  return 'pending';
              }
            }
            return enrollment.is_active ? 'active' : 'pending';
          };

          return {
            ...courseData,
            progress: enrollment.progress_percentage || 0,
            status: getDisplayStatus(enrollment),
            enrollmentStatus: enrollment.status,
            enrollmentId: enrollment.id
          };
        } catch (err) {
          console.error(`Failed to fetch details for course ID ${enrollment.course_id}:`, err);
          return null;
        }
      });

      const resolvedCourses = await Promise.all(coursePromises);
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
    myCourses: [],
    loading: false,
    myCoursesLoading: false,
    error: null,
  },
  reducers: {},
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
        state.myCoursesLoading = true;
        state.error = null;
      })
      .addCase(fetchMyCourses.fulfilled, (state, action) => {
        state.myCoursesLoading = false;
        state.myCourses = action.payload;
      })
      .addCase(fetchMyCourses.rejected, (state, action) => {
        state.myCoursesLoading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default coursesSlice.reducer;

export const selectCourses = (state) => state.courses.courses;
export const selectMyCourses = (state) => state.courses.myCourses;

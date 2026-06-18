import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '../src/api/index.js';

export const fetchBlogs = createAsyncThunk(
  'blogs/fetchBlogs',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.getBlogs();
      const data = response?.data?.data || response?.data || response || [];
      return Array.isArray(data) ? data : [];
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch blogs");
    }
  }
);

export const fetchBlogById = createAsyncThunk(
  'blogs/fetchBlogById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiClient.getBlogById(id);
      const blog = response?.data?.data || response?.data || response;
      return blog;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch blog");
    }
  }
);

export const createBlog = createAsyncThunk(
  'blogs/createBlog',
  async (blogData, { rejectWithValue }) => {
    try {
      const response = await apiClient.createBlog(blogData);
      const blog = response?.data?.data || response?.data || response;
      return blog;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to create blog");
    }
  }
);

export const updateBlog = createAsyncThunk(
  'blogs/updateBlog',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await apiClient.updateBlog(id, data);
      const blog = response?.data?.data || response?.data || response;
      return blog;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to update blog");
    }
  }
);

export const deleteBlog = createAsyncThunk(
  'blogs/deleteBlog',
  async (id, { rejectWithValue }) => {
    try {
      await apiClient.deleteBlog(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to delete blog");
    }
  }
);

const blogSlice = createSlice({
  name: 'blogs',
  initialState: {
    blogs: [],
    currentBlog: null,
    loading: false,
    currentLoading: false,
    error: null,
  },
  reducers: {
    clearCurrentBlog: (state) => {
      state.currentBlog = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = action.payload;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchBlogById.pending, (state) => {
        state.currentLoading = true;
        state.error = null;
      })
      .addCase(fetchBlogById.fulfilled, (state, action) => {
        state.currentLoading = false;
        state.currentBlog = action.payload;
      })
      .addCase(fetchBlogById.rejected, (state, action) => {
        state.currentLoading = false;
        state.error = action.payload;
      })
      .addCase(createBlog.fulfilled, (state, action) => {
        state.blogs.unshift(action.payload);
      })
      .addCase(updateBlog.fulfilled, (state, action) => {
        const index = state.blogs.findIndex((b) => b.id === action.payload.id);
        if (index !== -1) {
          state.blogs[index] = action.payload;
        }
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.blogs = state.blogs.filter((b) => b.id !== action.payload);
      });
  },
});

export const { clearCurrentBlog } = blogSlice.actions;
export const selectBlogs = (state) => state.blogs.blogs;
export const selectCurrentBlog = (state) => state.blogs.currentBlog;

export default blogSlice.reducer;

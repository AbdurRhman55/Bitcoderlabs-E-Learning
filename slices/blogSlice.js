import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '../src/api/index.js';
import {
  normalizeBlogListResponse,
  normalizeBlogResponse,
} from '../src/utils/blogAdapter.js';

const upsertBlog = (blogs, blog, { prepend = false } = {}) => {
  const existingIndex = blogs.findIndex((item) => item.id === blog.id);

  if (existingIndex === -1) {
    return prepend ? [blog, ...blogs] : [...blogs, blog];
  }

  const next = [...blogs];
  next[existingIndex] = {
    ...next[existingIndex],
    ...blog,
  };

  return next;
};

export const fetchBlogs = createAsyncThunk(
  'blogs/fetchBlogs',
  async (params = {}, { rejectWithValue }) => {
    try {
      const { append = false, ...query } = params || {};
      const response = await apiClient.getBlogs(query);
      const { items, pagination } = normalizeBlogListResponse(response);
      return { items, pagination, append };
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
      return normalizeBlogResponse(response);
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
      return normalizeBlogResponse(response);
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
      return normalizeBlogResponse(response);
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
    pagination: {
      current_page: 1,
      last_page: 1,
      per_page: 15,
      total: 0,
      from: 0,
      to: 0,
      links: null,
      hasMore: false,
    },
    loading: false,
    loadingMore: false,
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
      .addCase(fetchBlogs.pending, (state, action) => {
        const isAppend = Boolean(action.meta.arg?.append);
        state.loading = !isAppend;
        state.loadingMore = isAppend;
        state.error = null;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        const { items, pagination, append } = action.payload;
        state.loading = false;
        state.loadingMore = false;
        state.pagination = pagination;
        state.blogs = append ? items.reduce((acc, blog) => upsertBlog(acc, blog), state.blogs) : items;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.loading = false;
        state.loadingMore = false;
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
        state.blogs = upsertBlog(state.blogs, action.payload, { prepend: true });
        state.currentBlog = action.payload;
      })
      .addCase(updateBlog.fulfilled, (state, action) => {
        state.blogs = upsertBlog(state.blogs, action.payload);
        if (state.currentBlog?.id === action.payload.id) {
          state.currentBlog = action.payload;
        }
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.blogs = state.blogs.filter((b) => b.id !== action.payload);
        if (state.currentBlog?.id === action.payload) {
          state.currentBlog = null;
        }
      });
  },
});

export const { clearCurrentBlog } = blogSlice.actions;
export const selectBlogs = (state) => state.blogs.blogs;
export const selectCurrentBlog = (state) => state.blogs.currentBlog;
export const selectBlogPagination = (state) => state.blogs.pagination;
export const selectBlogLoading = (state) => state.blogs.loading;
export const selectBlogLoadingMore = (state) => state.blogs.loadingMore;

export default blogSlice.reducer;

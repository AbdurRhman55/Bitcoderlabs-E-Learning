import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBlogs,
  selectBlogs,
  selectBlogPagination,
  selectBlogLoading,
  selectBlogLoadingMore,
} from "../../slices/blogSlice";
import BlogHero from "../Component/Blog/BlogHero";
import BlogSection from "../Component/Blog/BlogSection";

export default function Blog() {
  const dispatch = useDispatch();
  const blogs = useSelector(selectBlogs);
  const loading = useSelector(selectBlogLoading);
  const loadingMore = useSelector(selectBlogLoadingMore);
  const pagination = useSelector(selectBlogPagination);
  const hasMore = Boolean(pagination?.hasMore);

  useEffect(() => {
    if (!blogs || blogs.length === 0) {
      dispatch(fetchBlogs());
    }
  }, [dispatch, blogs]);

  const handleLoadMore = () => {
    if (!hasMore || loadingMore) return;

    dispatch(
      fetchBlogs({
        page: (pagination?.current_page || 1) + 1,
        per_page: pagination?.per_page || 15,
        append: true,
      })
    );
  };

  return (
    <div>
      <BlogHero />
      <BlogSection
        blogs={blogs}
        loading={loading}
        loadingMore={loadingMore}
        hasMore={hasMore}
        onLoadMore={handleLoadMore}
      />
    </div>
  );
}

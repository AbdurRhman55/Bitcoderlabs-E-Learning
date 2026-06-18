import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogs, selectBlogs } from "../../slices/blogSlice";
import BlogHero from "../Component/Blog/BlogHero";
import BlogSection from "../Component/Blog/BlogSection";

export default function Blog() {
  const dispatch = useDispatch();
  const blogs = useSelector(selectBlogs);
  const { loading } = useSelector((state) => state.blogs);

  useEffect(() => {
    if (!blogs || blogs.length === 0) {
      dispatch(fetchBlogs());
    }
  }, [dispatch, blogs]);

  return (
    <div>
      <BlogHero />
      <BlogSection blogs={blogs} loading={loading} />
    </div>
  );
}

import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogById, selectCurrentBlog, clearCurrentBlog } from "../../slices/blogSlice";
import Hero from "../Component/Blog Detail Page/Hero";
import MainContent from "../Component/Blog Detail Page/MainContent";
import { Loader } from "lucide-react";

export default function BlogDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const blog = useSelector(selectCurrentBlog);
  const { currentLoading } = useSelector((state) => state.blogs);

  useEffect(() => {
    if (id) {
      dispatch(fetchBlogById(id));
    }
    return () => {
      dispatch(clearCurrentBlog());
    };
  }, [dispatch, id]);

  if (currentLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-gray-500 text-lg">Blog not found</p>
      </div>
    );
  }

  return (
    <div>
      <Hero blog={blog} />
      <MainContent blog={blog} />
    </div>
  );
}

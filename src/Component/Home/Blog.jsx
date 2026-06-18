import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FaArrowRight, FaCalendar, FaClock, FaUser } from "react-icons/fa";
import { Loader } from "lucide-react";
import SectionHeader from "../UI/SectionHeader";
import {
  fetchBlogs,
  selectBlogs,
  selectBlogLoading,
} from "../../../slices/blogSlice";
import {
  formatBlogDate,
  resolveBlogImageUrl,
} from "../../utils/blogAdapter";

export default function BlogSection() {
  const dispatch = useDispatch();
  const blogs = useSelector(selectBlogs);
  const loading = useSelector(selectBlogLoading);

  useEffect(() => {
    if (!blogs || blogs.length === 0) {
      dispatch(fetchBlogs());
    }
  }, [dispatch, blogs]);

  const featuredBlog = useMemo(() => {
    return blogs.find((blog) => blog.is_featured || blog.isFeatured) || blogs[0] || null;
  }, [blogs]);

  const recentBlogs = useMemo(() => {
    if (!featuredBlog) return [];
    return blogs
      .filter((blog) => blog.id !== featuredBlog.id)
      .slice(0, 3);
  }, [blogs, featuredBlog]);

  if (loading && blogs.length === 0) {
    return (
      <section className="py-20 bg-gradient-to-b from-white via-[#f9fcff] to-[#eaf7ff]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center py-16">
            <Loader className="w-10 h-10 animate-spin text-primary" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-b from-white via-[#f9fcff] to-[#eaf7ff]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title=" LATEST BLOGS "
          subtitle={
            <>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3baee9] to-[#2a9fd8]">
                Insights &
              </span>{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2a9fd8] to-[#3baee9]">
                Updates
              </span>
            </>
          }
          description="Stay updated with the latest trends, tutorials, and insights in web development and technology."
        />

        {featuredBlog ? (
          <div className="mb-16">
            <div className="rounded-3xl overflow-hidden shadow-xl bg-white/80 backdrop-blur-md border border-gray-100 hover:shadow-2xl transition-all duration-500 group">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                <div className="relative overflow-hidden">
                  <img
                    src={featuredBlog.image || featuredBlog.imageUrl || resolveBlogImageUrl(featuredBlog.image_path)}
                    alt={featuredBlog.title}
                    className="w-full h-80 lg:h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="absolute top-4 left-4 bg-[#3baee9] text-white text-sm font-semibold px-3 py-1 rounded-full">
                    Featured
                  </span>
                </div>

                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <div className="flex items-center flex-wrap gap-4 mb-4">
                    <span className="bg-[#e8f7ff] text-[#3baee9] px-3 py-1 rounded-full text-sm font-semibold">
                      {featuredBlog.category || "General"}
                    </span>
                    <div className="flex items-center gap-3 text-gray-500 text-sm">
                      <div className="flex items-center gap-1">
                        <FaCalendar className="text-xs" />
                        <span>
                          {formatBlogDate(featuredBlog.published_at || featuredBlog.created_at || featuredBlog.date) || "Recently"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FaClock className="text-xs" />
                        <span>{featuredBlog.read_time || featuredBlog.readTime || "5 min read"}</span>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3 group-hover:text-[#3baee9] transition-colors duration-300">
                    {featuredBlog.title}
                  </h3>

                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {featuredBlog.description}
                  </p>

                  <div className="flex items-center justify-between mt-auto gap-4 flex-wrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#e8f7ff] rounded-full flex items-center justify-center">
                        <FaUser className="text-[#3baee9] text-sm" />
                      </div>
                      <span className="text-gray-700 font-medium text-sm">
                        {featuredBlog.author_name || featuredBlog.author || "BitCoderLabs"}
                      </span>
                    </div>

                    <Link
                      to={`/blog/${featuredBlog.id}`}
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-primary text-white font-semibold shadow-lg hover:bg-primary-dark transition-colors"
                    >
                      Read More
                      <FaArrowRight className="text-sm" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-16 rounded-3xl border border-dashed border-gray-200 bg-white/70 p-12 text-center">
            <p className="text-gray-500">No blog posts available yet.</p>
          </div>
        )}

        {recentBlogs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentBlogs.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-3xl overflow-hidden shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300 group"
              >
                <Link to={`/blog/${post.id}`} className="block">
                  <div className="h-48 overflow-hidden">
                    <img
                      src={post.image || post.imageUrl || resolveBlogImageUrl(post.image_path)}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                </Link>

                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="px-2 py-1 rounded-full bg-[#e8f7ff] text-[#3baee9] font-semibold">
                      {post.category || "General"}
                    </span>
                    <span>•</span>
                    <span>{formatBlogDate(post.published_at || post.created_at || post.date) || "Recently"}</span>
                  </div>

                  <h4 className="text-lg font-bold text-gray-900 line-clamp-2">
                    {post.title}
                  </h4>

                  <p className="text-sm text-gray-600 line-clamp-3">
                    {post.description}
                  </p>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-sm font-medium text-gray-700">
                      {post.author_name || post.author || "BitCoderLabs"}
                    </span>
                    <Link
                      to={`/blog/${post.id}`}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-[#3baee9] hover:text-primary-dark transition-colors"
                    >
                      Read
                      <FaArrowRight className="text-xs" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="place-items-center mt-12">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white border border-[#3baee9] text-[#3baee9] font-semibold hover:bg-[#3baee9] hover:text-white transition-colors shadow-sm"
          >
            View All Blog Posts
            <FaArrowRight className="text-sm" />
          </Link>
        </div>
      </div>
    </section>
  );
}

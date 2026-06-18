import { useState, useMemo } from "react";
import { FaArrowRight } from "react-icons/fa";
import { Loader } from "lucide-react";
import CategoryButtons from "./CategoryButtons";
import BlogCard from "./BlogCard";

export default function BlogSection({ blogs = [], loading = false }) {
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = useMemo(() => {
    const cats = [{ id: "all", name: "All Topics" }];
    const seen = new Set();
    blogs.forEach((blog) => {
      if (blog.category && !seen.has(blog.category)) {
        seen.add(blog.category);
        cats.push({ id: blog.category, name: blog.category.charAt(0).toUpperCase() + blog.category.slice(1) });
      }
    });
    return cats;
  }, [blogs]);

  const filteredBlogs =
    activeCategory === "all"
      ? blogs
      : blogs.filter((blog) => blog.category === activeCategory);

  return (
    <section className="py-20 bg-gradient-to-b from-white to-blue-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#e8f7ff] border border-[#3baee9]/20 text-[#2a9fd8] px-4 py-2 rounded-full text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-[#3baee9] rounded-full animate-pulse"></span>
            Latest Insights & Stories
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Discover{" "}
            <span className="bg-gradient-to-r from-[#3baee9] to-[#2a9fd8] bg-clip-text text-transparent">
              Amazing
            </span>{" "}
            Content
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore our curated collection of articles, tutorials, and insights
            to level up your skills.
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-12 flex justify-between items-center flex-wrap gap-4">
          <div className="flex items-center justify-start ">
            <div className="flex lg:flex-col lg:items-start sm:flex-row sm:items-center gap-4">
              <h3 className="text-2xl font-bold text-gray-900">
                Browse Content
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-500 bg-white px-3 py-1 rounded-full border w-25">
                <span className="w-2 h-2 bg-[#3baee9] rounded-full"></span>
                {filteredBlogs.length} articles
              </div>
            </div>
          </div>

          <CategoryButtons
            categories={categories}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
          />
        </div>

        {/* Blog Cards Grid */}
        <BlogCard filteredBlogs={filteredBlogs} />

        {/* Empty State */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : filteredBlogs.length === 0 && blogs.length > 0 ? (
          <div className="text-center py-20">
            <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-[#e8f7ff] to-blue-100 rounded-3xl flex items-center justify-center">
              <span className="text-5xl">🔍</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              No articles found
            </h3>
            <p className="text-gray-600 mb-8 text-lg">
              Try selecting a different category or check back later for new
              content.
            </p>
            <button
              onClick={() => setActiveCategory("all")}
              className="bg-gradient-to-r from-[#3baee9] to-[#2a9fd8] text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Explore All Articles
            </button>
          </div>
        ) : blogs.length === 0 && !loading ? (
          <div className="text-center py-20">
            <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-[#e8f7ff] to-blue-100 rounded-3xl flex items-center justify-center">
              <span className="text-5xl">📝</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              No blogs yet
            </h3>
            <p className="text-gray-600 mb-8 text-lg">
              Blog posts will appear here once published.
            </p>
          </div>
        ) : null}

        {/* Load More */}
        {filteredBlogs.length > 0 && (
          <div className="text-center mt-16">
            <button className="group bg-white border-2 border-[#3baee9] text-[#3baee9] hover:bg-[#3baee9] hover:text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
              <span className="flex items-center gap-3">
                Load More Articles
                <FaArrowRight className="text-sm transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Animation */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}

import React from "react";
import {
  FaArrowRight,
  FaCalendar,
  FaClock,
  FaFire,
  FaLeaf,
  FaUser,
} from "react-icons/fa";
import { categories } from "../../../Data/BlogcardsArray";
import Button from "../UI/Button";
import { Link } from "react-router-dom";
// import BlogDetail from "../../Pages/BlogDetail";
// Blog detail import removed (unused) — navigation handled via router links
// import blogDetail from "../../Pages/BlogDetail";

export default function BlogCard({ filteredBlogs }) {
  return (
    <div>
      <Link to="/blog/:id">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredBlogs.map((blog, index) => (
            <article
              key={blog.id}
              className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-700 overflow-hidden border border-gray-100 hover:border-[#3baee9]/30 cursor-pointer h-full"
              style={{
                animationDelay: `${index * 100}ms`,
                animation: "fadeInUp 0.6s ease-out forwards",
              }}
            >
              {/* Background hover effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-blue-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"></div>

              {/* Blog Image */}
              <div className="relative overflow-hidden h-56">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  <span className="px-3 py-1.5 bg-[#3baee9]/90 text-white rounded-full text-xs font-semibold backdrop-blur-sm flex items-center gap-1.5">
                    {categories.find((cat) => cat.id === blog.category)?.name}
                  </span>

                  {blog.isNew && (
                    <span className="px-3 py-1.5 bg-green-500/90 text-white rounded-full text-xs font-semibold backdrop-blur-sm flex items-center gap-1.5">
                      <FaLeaf className="text-xs" /> New
                    </span>
                  )}

                  {blog.trending && (
                    <span className="px-3 py-1.5 bg-red-500/90 text-white rounded-full text-xs font-semibold backdrop-blur-sm flex items-center gap-1.5">
                      <FaFire className="text-xs" /> Trending
                    </span>
                  )}
                </div>
              </div>

              {/* Blog Content */}
              <div className="relative p-6 z-10 flex flex-col justify-between h-[330px]">
                <div>
                  <div className="flex items-center justify-between text-sm text-gray-500 ">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <FaUser className="text-[#3baee9] text-xs" />
                        <span className="font-medium">{blog.author}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <FaCalendar className="text-[#3baee9] text-xs" />
                        <span>{blog.date}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 bg-gray-100 px-2 mb-1 py-1 rounded-full">
                      <FaClock className="text-[#3baee9] text-[10px]" />
                      <span className="text-[10px]">{blog.readTime}</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-[#2a9fd8] transition-colors duration-300">
                    {blog.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {blog.description}
                  </p>
                </div>

                {/* Button at bottom */}
                <div className="mt-auto">
                  <Button
                    variant="squarefull"
                    text="Read More"
                    icon={<FaArrowRight className="text-sm" />}
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      </Link>
    </div>
  );
}

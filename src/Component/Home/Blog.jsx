// src/Component/Home/BlogSection.jsx
import React from "react";
import { FaCalendar, FaUser, FaArrowRight, FaClock } from "react-icons/fa";
import SectionHeader from "../UI/SectionHeader";
import { blogPosts } from "../../../Data/Array";
import Button from "../UI/Button";
import Swal from 'sweetalert2';

export default function BlogSection() {


  return (
    <section className="py-20 bg-gradient-to-b from-white via-[#f9fcff] to-[#eaf7ff]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
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
          description="Stay updated with the latest trends, tutorials, and insights in web
            development and technology."
        />

        {/* Featured Blog Post */}
        <div className="mb-16">
          {blogPosts
            .filter((post) => post.featured)
            .map((post) => (
              <div
                key={post.id}
                className="rounded-3xl overflow-hidden shadow-xl bg-white/80 backdrop-blur-md border border-gray-100 hover:shadow-2xl transition-all duration-500 group"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                  {/* Image */}
                  <div className="relative overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-80 lg:h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <span className="absolute top-4 left-4 bg-[#3baee9] text-white text-sm font-semibold px-3 py-1 rounded-full">
                      Featured
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-8 lg:p-12 flex flex-col justify-center">
                    <div className="flex items-center flex-wrap gap-4 mb-4">
                      <span className="bg-[#e8f7ff] text-[#3baee9] px-3 py-1 rounded-full text-sm font-semibold">
                        {post.category}
                      </span>
                      <div className="flex items-center gap-3 text-gray-500 text-sm">
                        <div className="flex items-center gap-1">
                          <FaCalendar className="text-xs" />
                          <span>{post.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FaClock className="text-xs" />
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                    </div>

                    <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3 group-hover:text-[#3baee9] transition-colors duration-300">
                      {post.title}
                    </h3>

                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {post.description}
                    </p>

                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#e8f7ff] rounded-full flex items-center justify-center">
                          <FaUser className="text-[#3baee9] text-sm" />
                        </div>
                        <span className="text-gray-700 font-medium text-sm">
                          {post.author}
                        </span>
                      </div>

                      <Button text="Read More" onClick={() => Swal.fire({
                        title: 'Coming Soon',
                        text: 'This blog post will be available soon!',
                        icon: 'info',
                        confirmButtonColor: '#3baee9'
                      })} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* CTA Button */}
        <div className="place-items-center mt-12">
          <Button text="View All Blog Posts" size="lg" />
        </div>
      </div>
    </section>
  );
}

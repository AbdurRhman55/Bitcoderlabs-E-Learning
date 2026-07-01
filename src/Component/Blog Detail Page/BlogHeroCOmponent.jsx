import React from "react";
import { FaUser, FaCalendarAlt, FaStar } from "react-icons/fa";

export default function BlogHero({ title, author, date, coverImage }) {
  return (
    <section className="relative w-full bg-slate-900 py-24 px-6 md:px-12 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-slate-900 to-indigo-900/40"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full bg-blue-500/10 blur-[100px] rounded-full"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
        {/* Left Content */}
        <div className="flex-1 text-center md:text-left">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-medium text-sm mb-8 backdrop-blur-sm">
            <FaStar className="text-amber-400" />
            <span>Featured Article</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-[1.1] mb-6 tracking-tight">
            {title || "Mastering React Hooks: A Complete Guide for 2025"}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-slate-300 text-sm font-medium">
            <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700/50 backdrop-blur-sm">
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-xs text-white">
                <FaUser className="scale-75" />
              </div>
              <span>{author || "Abdur Rahman"}</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700/50 backdrop-blur-sm">
              <FaCalendarAlt className="text-blue-400" />
              <span>{date || "November 4, 2025"}</span>
            </div>
          </div>
        </div>

        {/* Right Image */}
        <div className="flex-1 w-full max-w-2xl">
          <div className="relative group overflow-hidden rounded-3xl shadow-2xl shadow-blue-900/20 ring-1 ring-white/10">
            <img
              src={
                coverImage ||
                "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=80"
              }
              alt="Blog Cover"
              className="w-full h-[450px] object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-60"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

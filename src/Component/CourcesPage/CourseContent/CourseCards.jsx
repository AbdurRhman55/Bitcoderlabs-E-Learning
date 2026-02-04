// src/components/courses/CourseCard.jsx
import React from "react";
import {
  FaStar,
  FaClock,
  FaUser,
  FaBook,
  FaHeart,
  FaShare,
  FaEye,
} from "react-icons/fa";
import { FiUsers, FiBarChart2, FiBookOpen } from "react-icons/fi";
import Button from "../../UI/Button";
import { Link } from "react-router-dom";
import { API_ORIGIN } from "../../../api/index";

const PLACEHOLDER_IMAGE = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmVmZWZlIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZpbGw9IiM5OTkiIGZvbnQtc2l6ZT0iMTQiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZHk9Ii4zZW0iIHRleHQtYW5jaG9yPSJtaWRkbGUiPkJpdGNvZGVyIExhYnM8L3RleHQ+PC9zdmc+";

export default function CourseCard({
  course,
  layout = "grid",
  onWishlist,
  onShare,
}) {
  const resolveImageUrl = (url) => {
    if (!url) return PLACEHOLDER_IMAGE;
    const stringUrl = String(url).trim();
    if (stringUrl.startsWith('http') || stringUrl.startsWith('data')) return stringUrl;

    let cleanPath = stringUrl.startsWith('/') ? stringUrl.substring(1) : stringUrl;

    // Check if the path already includes 'storage/'
    if (cleanPath.startsWith('storage/')) {
      return `${API_ORIGIN}/${cleanPath}`;
    }

    // Default to the storage folder
    return `${API_ORIGIN}/storage/${cleanPath}`;
  };

  const isList = layout === "list";

  return (
    <Link to={`/course/${course.id}`} className="block h-full">
      <div
        className={`group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 hover:border-primary/20 overflow-hidden transition-all duration-300 ${isList ? "flex flex-col md:flex-row gap-0" : "flex flex-col h-full"
          }`}
      >
        {/* IMAGE SECTION */}
        <div
          className={`relative overflow-hidden shrink-0 ${isList ? "w-full md:w-72 lg:w-80 h-64 md:h-auto" : "w-full h-52"
            }`}
        >
          <img
            src={resolveImageUrl(course.image)}
            alt={course.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={(e) => {
              if (e.target.src !== PLACEHOLDER_IMAGE) {
                e.target.onerror = null;
                e.target.src = PLACEHOLDER_IMAGE;
              }
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Badge & Duration Overlays */}
          <div className="absolute top-3 left-3 flex gap-2">
            <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-white/90 text-gray-800 backdrop-blur-sm shadow-sm capitalize">
              {course.level || "Beginner"}
            </span>
          </div>

          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-md text-white text-xs font-medium">
            <FaClock size={10} className="text-primary-light" />
            <span>{course.duration || "0h 0m"}</span>
          </div>
        </div>

        {/* CONTENT SECTION */}
        <div className={`flex flex-col flex-1 p-5 ${isList ? "justify-center py-6" : ""}`}>
          <div className="flex-1">
            {/* Category & Rating Row */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold tracking-wide text-primary bg-primary/10 px-2.5 py-1 rounded-full uppercase">
                {course.category?.title || course.category?.name || "Uncategorized"}
              </span>
              <div className="flex items-center gap-1 text-yellow-400 text-xs font-bold">
                <FaStar />
                <span className="text-gray-700">{course.rating ? Number(course.rating).toFixed(1) : "0.0"}</span>
                <span className="text-gray-400 font-normal">({course.reviews_count || 0} reviews)</span>
              </div>
            </div>

            {/* Title */}
            <h3 className={`font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors ${isList ? "text-xl md:text-2xl" : "text-lg line-clamp-2"}`}>
              {course.title}
            </h3>

            {/* Description - Show more in list view */}
            <p className={`text-gray-500 text-sm mb-4 leading-relaxed ${isList ? "line-clamp-2 md:line-clamp-3" : "line-clamp-2"}`}>
              {course.description || course.short_description || "No description available."}
            </p>

            {/* Instructor & Meta Info */}
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-5 border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                  <FaUser size={12} />
                </div>
                <span className="font-medium text-gray-700">{course.instructor?.name || "Instructor"}</span>
              </div>
              <div className={`hidden sm:flex items-center gap-1.5 ${isList ? "flex" : ""}`}>
                <FiUsers size={14} />
                <span>{course.students_count || 0} students</span>
              </div>
            </div>
          </div>

          {/* Footer: Price & CTA */}
          <div className="flex items-center justify-between mt-auto">
            <div className="flex flex-col">
              <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Price</span>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-gray-900">
                  {course.price > 0 ? `Rs ${course.price.toLocaleString()}` : "Free"}
                </span>
                {course.old_price && (
                  <span className="text-sm text-gray-400 line-through">Rs {course.old_price}</span>
                )}
              </div>
            </div>

            <Button
              text={isList ? "View Details" : "View"}
              variant="outline"
              size="sm"
              rounded="md"
              className="!border-gray-200 !text-gray-600 hover:!border-primary hover:!bg-primary hover:!text-white transition-all shadow-sm hover:shadow-md"
              icon={isList ? <FaEye /> : null}
            />
          </div>
        </div>
      </div>
    </Link>
  );
}

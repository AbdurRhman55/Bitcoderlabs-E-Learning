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

export default function CourseCard({
  course,
  layout = "grid",
  onWishlist,
  onShare,
}) {
  return (
    <Link to={`/course/${course.id}`}>
      <div
        className={`group bg-white rounded-2xl shadow-sm hover:shadow-2xl border border-gray-100 hover:border-primary/20 overflow-hidden transition-all duration-500 ${layout === "list"
          ? "flex flex-col md:flex-row items-stretch max-h-[270px]"
          : "flex flex-col h-full"
          }`}
      >
        {/* IMAGE */}
        <div
          className={`relative overflow-hidden ${layout === "list"
            ? "w-full md:w-2/5 lg:w-1/3 h-48 md:h-auto"
            : "h-48 w-full"
            }`}
        >
          <img
            src={course.image || "/placeholder-course.jpg"}
            alt={course.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />

          {/* LEVEL */}
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 capitalize">
              {course.level}
            </span>
          </div>

          {/* ACTIONS */}
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            <Button
              icon={<FaHeart className="w-4 h-4" />}
              size="xxs"
              rounded="full"
              onClick={(e) => {
                e.preventDefault();
                onWishlist?.(course);
              }}
            />
            <Button
              icon={<FaShare className="w-4 h-4" />}
              size="xxs"
              rounded="full"
              onClick={(e) => {
                e.preventDefault();
                onShare?.(course);
              }}
            />
          </div>

          {/* DURATION */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2 py-1 bg-black/70 rounded-full text-white text-xs">
            <FaClock />
            {course.duration}
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex flex-col flex-1 p-5 justify-between">
          <div>
            {/* CATEGORY */}
            <div className="flex items-center gap-2 mb-3">
              <FiBookOpen className="text-primary" />
              <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded-full">
                {course.category?.name || "Uncategorized"}
              </span>
            </div>

            {/* TITLE */}
            <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">
              {course.title}
            </h3>

            {/* INSTRUCTOR */}
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <FaUser />
              <span>
                By {course.instructor?.name || "Admin"}
              </span>
            </div>

            {/* DESCRIPTION */}
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
              {course.description}
            </p>

            {/* STATS */}
            <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
              <div className="flex items-center gap-1">
                <FiUsers />
                {course.students_count} students
              </div>
              <div className="flex items-center gap-1">
                <FaBook />
                {course.reviews_count} reviews
              </div>
            </div>

            {/* RATING */}
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <FaStar
                    key={i}
                    className={
                      i <= Math.round(course.rating)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }
                  />
                ))}
              </div>
              <span className="text-sm font-semibold">
                {course.rating}
              </span>
            </div>
          </div>

          {/* PRICE */}
          <div className="flex items-center justify-between pt-3 border-t">
            <span className="text-xl font-bold text-primary">
              {course.price === 0 ? "Free" : `Rs ${course.price}`}
            </span>

            <Button
              text={course.price === 0 ? "Enroll Free" : "Explore Now"}
              size="sm"
              rounded="lg"
            />
          </div>
        </div>
      </div>
    </Link>
  );
}

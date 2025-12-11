// src/components/courses/CourseCard.jsx
import React, { useEffect } from "react";
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
  const [_isHovered, setIsHovered] = React.useState(false);
   
  return (
    <Link to={`/course/${course.id}`} >
      <div
        className={`group bg-white rounded-2xl  shadow-sm hover:shadow-2xl border border-gray-100 hover:border-primary/20 overflow-hidden transition-all duration-500 ${layout === "list"
          ? "flex flex-col md:flex-row items-stretch max-h-[270px] h-full" // 
          : "flex flex-col h-full"
          }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Thumbnail with Overlay */}
        <div
          className={`relative overflow-hidden ${layout === "list" ? "w-full md:w-2/5 lg:w-1/3 h-48 md:h-auto" : "h-48 w-full"
            }`}
        >
          <img
            src={course.image}
            alt={course.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />

          {/* Hover Overlay */}
          <div
            className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${layout === "list" ? "md:bg-gradient-to-r md:from-black/60" : ""
              }`}
          />

          {/* Course Level Badge */}
          <div className="absolute top-3 left-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${course.level === "beginner"
                ? "bg-green-100 text-green-800"
                : course.level === "intermediate"
                  ? "bg-yellow-100 text-yellow-800"
                  : course.level === "advanced"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-red-100 text-red-800"
                }`}
            >
              {course.level}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            <Button
              icon={
                <FaHeart
                  className={`w-4 h-7 ${course.isWishlisted
                    ? "text-red-500"
                    : "text-gray-600 hover:text-red-500"
                    }`}
                />
              }
              size="xxs"
              variant="wishlist"
              rounded="full"
              onClick={() => onWishlist?.(course)}
            />

            <Button
              icon={
                <FaShare className="w-4 h-6   text-gray-600 hover:text-primary" />
              }
              rounded="full"
              variant="share"
              size="xs"
              onClick={() => onShare?.(course)}
            />
          </div>

          {/* Duration Badge */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2 py-1 bg-black/70 rounded-full text-white text-xs">
            <FaClock className="w-3 h-3" />
            <span>{course.duration}</span>
          </div>
        </div>

        {/* Content */}
        <div
          className={`flex flex-col flex-1 ${layout === "list"
            ? "p-6 justify-between"
            : "p-5 justify-between h-full"
            }`}
        >
          <div>
            {/* Category */}
            <div className="flex items-center gap-2 mb-3">
              <FiBookOpen className="w-4 h-4 text-primary" />
              <span className="text-xs font-medium text-primary bg-primary-light px-2 py-1 rounded-full">
                {course.category}
              </span>
            </div>

            {/* Title */}
            <h3
              className={`font-bold text-gray-900 mb-2 line-clamp-2 hover:text-primary transition-colors duration-300 ${layout === "list" ? "text-lg" : "text-lg", layout === "list" ? "text-" : ""

                }`}
            >
              {course?.title}
            </h3>

            {/* Instructor */}
            <div className={`flex items-center gap-2 ${layout === "list" ? "mb-1" : "mb-3"} text-sm text-gray-600`}>
              <FaUser className="w-3 h-3" />
              <span>By {course.instructor.name}</span>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
              {course.description}
            </p>

            {/* Stats */}
            <div className={` gap-4 mb-4 text-xs text-gray-500
          ${layout === "list" ? "flex flex-col md:flex-row md:items-center md:justify-between" : ""}
          `}>
              <div className={`flex gap-4 ${layout === "list" ? "mb-0" : "mb-3"}`}>
                <div className="flex items-center gap-1">
                  <FiUsers className="w-4 h-4" />
                  <span>{course.students} students</span>
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <FaBook className="w-3 h-3" />
                    <span>{course.lessons} lessons</span>
                  </div>
                  {course.progress !== undefined && (
                    <div className="flex items-center gap-1">
                      <FiBarChart2 className="w-4 h-4" />
                      <span>{course.progress}% complete</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 ">
                    {Array.from({ length: 5 }, (_, i) => (
                      <FaStar
                        key={i}
                        className={`w-4 h-4 text-xs ${i < Math.floor(course.rating)
                          ? "text-yellow-400"
                          : "text-gray-300"
                          }`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] font-semibold text-gray-700">
                    {course.rating}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({course.reviews} reviews)
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {/* Price & Action */}
            <div
              className={`flex items-center justify-between ${layout === "list" ? "pt-2 border-t border-gray-100" : ""
                }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`font-bold ${course.price === 0
                    ? "text-green-600 text-lg"
                    : course.originalPrice
                      ? "text-gray-400 line-through text-sm"
                      : "text-primary text-xl"
                    }`}
                >
                  {course.price === 0 ? "Free" : `$${course.price}`}
                </span>
                {course.originalPrice && course.price !== 0 && (
                  <span className="text-primary font-bold text-xl">
                    ${course.price}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {layout === "list" && (
                  <Button
                    icon={<FaEye className="w-4 h-4" />}
                    size="sm"
                    text="Preview"
                    rounded="lg"
                    onClick={() => { }}
                  />
                )}
                <Link to="/course/:id">
                  <Button
                    text={course.price === 0 ? "Enroll Free" : "Explore Now"}
                    size="sm"
                    rounded="lg"
                    variant={layout === "list" ? "outline" : "primary"}
                    onClick={() => { }}
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

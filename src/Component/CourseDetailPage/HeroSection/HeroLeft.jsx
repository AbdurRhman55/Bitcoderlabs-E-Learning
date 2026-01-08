import React from "react";
import { courseData } from "../../../../Data/Courses.Array";
import Button from "../../UI/Button";


export default function HeroLeft({ course }) {
  // Helper to parse potentially double-encoded JSON arrays
  const parseList = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    try {
      // First parse
      const parsed = JSON.parse(data);
      // If it's still a string (double encoded), parse again
      if (typeof parsed === 'string') {
        const nested = JSON.parse(parsed);
        return Array.isArray(nested) ? nested : [];
      }
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error("Failed to parse list:", data, e);
      return [];
    }
  };

  // const badges = parseList(course.badges || course.tags);
  const features = parseList(course.features);
  const rating = course.rating || 0;
  const reviews = course.reviews_count || course.reviews || 0;
  const instructorName = course.instructor?.name || "Instructor";
  const instructorRole = course.instructor?.role || "Instructor";
  // Determine avatar source
  const instructorAvatar = course.instructor?.avatar;
  // If it looks like a relative path from DB (e.g. "instructors/..."), you might need to prepend base URL
  // For now we use it as is or fallback
  const avatarSrc = instructorAvatar
    ? (instructorAvatar.startsWith('http') || instructorAvatar.startsWith('data') ? instructorAvatar : `/${instructorAvatar}`)
    : "https://via.placeholder.com/40";


  return (
    <div>
      <div className="space-y-8">
        {/* Badges */}
        <div className="flex flex-wrap gap-3">
          {badges.map((tag, index) => (
            <span
              key={index}
              className="px-4 py-2 bg-gradient-to-r from-[#3baee9] to-[#2a9fd8] text-white text-sm font-semibold rounded-full shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Title & Tagline */}
        <div className="space-y-6">
          <h1 className="text-5xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight tracking-tight">
            {course.title}
          </h1>
          <p className="text-2xl text-gray-600 leading-relaxed font-light">
            {course.tagline || course.short_description}
          </p>
        </div>

        {/* Rating & Instructor */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-white px-4 py-[13px] rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center">
                <span className="text-2xl font-bold text-[#3baee9] mr-1">
                  {Number(rating).toFixed(1)}
                </span>
                <div className="flex text-yellow-400 ml-2">{"★".repeat(Math.round(rating))}</div>
              </div>
              <div className="w-px h-6 bg-gray-200 mx-4"></div>
              <span className="text-gray-600 font-medium">
                {reviews} reviews
              </span>
            </div>
          </div>

          {/* Instructor */}
          <div className="flex items-center gap-3 bg-white px-3 py-2 rounded-2xl shadow-sm border border-gray-100">
            <img
              src={avatarSrc}
              alt={instructorName}
              className="w-10 h-10 rounded-full object-cover"
              onError={(e) => { e.target.src = "https://via.placeholder.com/40"; }}
            />

            <div>
              <div className="font-semibold text-gray-900">
                {instructorName}
              </div>
              <div className="text-sm text-gray-500">
                {instructorRole}
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 gap-4">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="w-2 h-2 bg-[#3baee9] rounded-full"></div>
              <span className="text-gray-700 font-medium">{feature}</span>
            </div>
          ))}
        </div>

        {/* Primary CTA */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button
            text="Enroll Now"
          />
          <Button
            text="Preview Course"
            variant="outline"
          />
        </div>
      </div>
    </div>
  );
}

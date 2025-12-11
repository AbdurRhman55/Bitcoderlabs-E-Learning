import React from "react";
import { courseData } from "../../../../Data/Courses.Array";
import Button from "../../UI/Button";


export default function HeroLeft({course}) {
  console.log(course);
  console.log(course.badges
);
  return (
    <div>
      <div className="space-y-8">
        {/* Badges */}
        <div className="flex flex-wrap gap-3">
          {course.badges.map((tags, index) => (
            <span
              key={index}
              className="px-4 py-2 bg-gradient-to-r from-[#3baee9] to-[#2a9fd8] text-white text-sm font-semibold rounded-full shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              {tags}
            </span>
          ))}
        </div>

        {/* Title & Tagline */}
        <div className="space-y-6">
          <h1 className="text-5xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight tracking-tight">
            {course.title}
          </h1>
          <p className="text-2xl text-gray-600 leading-relaxed font-light">
            {course.tagline}
          </p>
        </div>

        {/* Rating & Instructor */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-white px-4 py-[13px] rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center">
                <span className="text-2xl font-bold text-[#3baee9] mr-1">
                  {course.rating}
                </span>
                <div className="flex text-yellow-400 ml-2">{"★".repeat(5)}</div>
              </div>
              <div className="w-px h-6 bg-gray-200 mx-4"></div>
              <span className="text-gray-600 font-medium">
                {course.reviews} reviews
              </span>
            </div>
          </div>

          {/* Instructor */}
          <div className="flex items-center gap-3 bg-white px-3 py-2 rounded-2xl shadow-sm border border-gray-100">
            <img
              // src={course.instructor.avatar}
              alt={course.instructor.avatar}
              className="w-10 h-10 rounded-full object-cover"
            />

            <div>
              <div className="font-semibold text-gray-900">
                {course.instructor.name}
              </div>
              <div className="text-sm text-gray-500">
                {course.instructor.role}
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 gap-4">
          {course.features.map((feature, index) => (
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

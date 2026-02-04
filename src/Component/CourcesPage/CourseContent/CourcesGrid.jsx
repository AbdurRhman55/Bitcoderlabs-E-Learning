import React, { useEffect, useState } from "react";
import CourseCard from "./CourseCards";
import { dummyCourses } from "../../../../Data/Courses.Array";
import Button from "../../UI/Button";
import { FaGraduationCap, FaThLarge, FaList } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourses, selectCourses } from '../../../../slices/courseSlice';

import { motion } from "framer-motion";

// ... (imports remain same)
export default function CourseGrid({ searchQuery }) {
  const [layout, setLayout] = useState("grid");
  const dispatch = useDispatch();
  const allCourses = useSelector(selectCourses); // Rename to allCourses for clarity
  const loading = useSelector((state) => state.courses.loading);
  const error = useSelector((state) => state.courses.error);

  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  // Filter courses based on search query
  const filteredCourses = allCourses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (course.description && course.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <section className="bg-gray-50 py-10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative">
        {/* ===== Header ===== */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 lg:mx-7 gap-4">
          <div className="flex flex-col">
            <h2 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
              <FaGraduationCap className="text-primary" />
              Available Courses
            </h2>
            <p className="text-sm text-gray-500 mt-1 ml-1">Explore our latest course offerings</p>
          </div>

          <div className="flex items-center gap-3 bg-white p-1 rounded-2xl shadow-sm border border-gray-100">
            {/* Professional Layout Switcher */}
            <div className="flex relative bg-gray-100/80 rounded-xl p-1 w-40 sm:w-48 overflow-hidden">
              {/* Animated Sliding Pill */}
              <motion.div
                className="absolute top-1 bottom-1 left-1 bg-primary rounded-lg shadow-sm"
                initial={false}
                animate={{
                  x: layout === "grid" ? "0%" : "100%",
                }}
                transition={{ type: "spring", stiffness: 500, damping: 40 }}
                style={{ width: "calc(50% - 4px)" }}
              />

              {/* Option: Grid */}
              <button
                onClick={() => setLayout("grid")}
                className={`flex-1 relative z-10 flex items-center justify-center gap-2 py-2 text-xs sm:text-sm font-bold transition-colors duration-300 cursor-pointer ${layout === "grid" ? "text-white" : "text-gray-500 hover:text-gray-800"
                  }`}
              >
                <FaThLarge className="text-sm" />
                <span>Grid</span>
              </button>

              {/* Option: List */}
              <button
                onClick={() => setLayout("list")}
                className={`flex-1 relative z-10 flex items-center justify-center gap-2 py-2 text-xs sm:text-sm font-bold transition-colors duration-300 cursor-pointer ${layout === "list" ? "text-white" : "text-gray-500 hover:text-gray-800"
                  }`}
              >
                <FaList className="text-sm" />
                <span>List</span>
              </button>
            </div>
          </div>
        </div>

        {/* ===== Main Section ===== */}
        <div className="flex gap-8 lg:ml-5 items-start transition-all duration-500 ease-in-out">
          {/* Courses */}
          <div className="flex-1 transition-all duration-500">
            {filteredCourses.length > 0 ? (
              <div
                className={
                  layout === "grid"
                    ? "grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
                    : "space-y-6"
                }
              >
                {filteredCourses.map((course) => (
                  <CourseCard key={course.id} course={course} layout={layout} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <h3 className="text-xl font-bold text-gray-700">No courses found matching "{searchQuery}"</h3>
                <p className="text-gray-500 mt-2">Try adjusting your search terms.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

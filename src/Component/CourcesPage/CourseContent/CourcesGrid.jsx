import React, { useState } from "react";
import CourseCard from "./CourseCards";
import { dummyCourses } from "../../../../Data/Courses.Array";
import Button from "../../UI/Button";
import { FaGraduationCap, FaFilter, FaThLarge, FaList } from "react-icons/fa";
import Filter from "../Filter/FIlter";
import { Link } from "react-router-dom";  

export default function CourseGrid() {
  const [layout, setLayout] = useState("grid");
  const [showFilter, setShowFilter] = useState(false); // for mobile slide filter

  return (
    <section className="bg-gray-50 py-10  relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative">
        {/* ===== Header ===== */}
        <div className="flex justify-between items-center mb-8 lg:mx-7 mx-1 ">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaGraduationCap className="text-primary text-4xl" />
            Available Courses
          </h2>
    
          <div className="flex items-center gap-3">
            {/* Filter Button */}
            <Button
              variant="outline"
              size="xs"
              icon={<FaFilter className="w-5 h-7 " />}
              onClick={() => setShowFilter(!showFilter)}
              className={`rounded-full cursor-pointer transition-all duration-300 ${
                showFilter ? "bg-gray-200" : "bg-white"
              }`}
            />

            {/* Layout Toggle */}
            <div className="hidden lg:block">
              <Button
                variant="outline"
                size="xs"
                icon={
                  layout === "grid" ? (
                    <FaList className="w-5 h-7 cursor-pointer" />
                  ) : (
                    <FaThLarge className="w-5 h-7 cursor-pointer" />
                  )
                }
                onClick={() =>
                  setLayout((prev) => (prev === "grid" ? "list" : "grid"))
                }
                className="p-2 rounded-full"
              />
            </div>
          </div>
        </div>

        {/* ===== Main Section ===== */}
        
          <div className="flex gap-8 lg:ml-5 items-start transition-all duration-500 ease-in-out">
            {/* Left: Courses */}
            <Link to="/course/:id">
            <div className="flex-1 transition-all duration-500">
              <div
                className={
                  layout === "grid"
                    ? `grid gap-6 ${
                        showFilter
                          ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                          : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
                      }`
                    : "space-y-6"
                }
              >
                {dummyCourses.map((course) => (
                  <CourseCard key={course.id} course={course} layout={layout} />
                ))}
              </div>
            </div>
            </Link>
            {/* Right: Filter (visible on large screen only) */}
            <div
              className={`hidden lg:block transition-all duration-500 ease-in-out transform ${
                showFilter
                  ? "opacity-100 translate-x-0 w-80"
                  : "opacity-0 -translate-x-10 w-0 overflow-hidden"
              }`}
            >
              <div className="sticky top-24">
                <Filter />
              </div>
            </div>
          </div>
        
      </div>

      {/*  Mobile Filter Drawer */}
      <div
        className={`fixed top-0 right-0 h-full bg-white shadow-2xl transform transition-transform duration-500 ease-in-out z-50 lg:hidden ${
          showFilter ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 h-full overflow-y-auto">
          <Filter />
        </div>
      </div>

      {/* Dark Overlay when Filter is Open */}
      {showFilter && (
        <div
          className="fixed inset-0 bg-black/70 z-40 lg:hidden"
          onClick={() => setShowFilter(false)}
        ></div>
      )}
    </section>
  );
}

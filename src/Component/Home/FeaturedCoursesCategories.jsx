import React, { useState, useEffect } from "react";
import { FaCode, FaPaintBrush, FaBriefcase, FaFire, FaChartLine, FaStar, FaRocket, FaUsers, FaGraduationCap, FaClock, FaDollarSign } from "react-icons/fa";
import { apiClient, API_ORIGIN } from "../../api/index.js";
import { Link } from "react-router-dom";

const PLACEHOLDER_IMAGE = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmVmZWZlIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZpbGw9IiM5OTkiIGZvbnQtc2l6ZT0iMTQiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZHk9Ii4zZW0iIHRleHQtYW5jaG9yPSJtaWRkbGUiPkJpdGNvZGVyIExhYnM8L3RleHQ+PC9zdmc+";

export default function FilteredCourses() {
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
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all"); // all, career, popular, trending
  const [activeCategory, setActiveCategory] = useState("all");

  // Sample categories for filtering
  const categories = [
    { id: "all", name: "All Courses", icon: FaCode },
    { id: "web", name: "Web Development", icon: FaCode },
    { id: "design", name: "Design", icon: FaPaintBrush },
    { id: "business", name: "Business", icon: FaBriefcase },
    { id: "data", name: "Data Science", icon: FaChartLine },
  ];

  // Filter buttons
  const filters = [
    { id: "all", name: "All Courses", icon: FaCode, color: "bg-primary text-white" },
    { id: "career", name: "Career", icon: FaBriefcase, color: "bg-green-100 text-green-700" },
    { id: "popular", name: "Most Popular", icon: FaFire, color: "bg-red-100 text-red-700" },
    { id: "trending", name: "Trending Now", icon: FaRocket, color: "bg-purple-100 text-purple-700" },
    { id: "featured", name: "Featured", icon: FaStar, color: "bg-yellow-100 text-yellow-700" },
  ];

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await apiClient.getCourses({
          per_page: 50,
          page: 1
        });

        const courseData = response?.data || [];
        setCourses(Array.isArray(courseData) ? courseData : []);
        setFilteredCourses(Array.isArray(courseData) ? courseData : []);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
        setCourses([]);
        setFilteredCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Filter courses based on active filter and category
  useEffect(() => {
    if (courses.length === 0) return;

    let result = [...courses];

    // Apply main filter
    switch (activeFilter) {
      case "career":
        // Filter courses that are career-focused (you might need to adjust this logic)
        result = result.filter(course =>
          course.title?.toLowerCase().includes("career") ||
          course.category?.name?.toLowerCase().includes("career") ||
          course.tags?.includes("career") ||
          course.level === "advanced"
        );
        break;

      case "popular":
        // Sort by students count, reviews, or rating
        result = result.sort((a, b) => {
          const aScore = (a.students_count || 0) + (a.reviews_count || 0) * 2;
          const bScore = (b.students_count || 0) + (b.reviews_count || 0) * 2;
          return bScore - aScore;
        });
        break;

      case "trending":
        // Sort by recent activity or high growth (you might need to adjust this)
        result = result.filter(course =>
          course.is_featured ||
          course.rating >= 4.5 ||
          (course.students_count || 0) > 100
        );
        break;

      case "featured":
        // Filter featured courses
        result = result.filter(course => course.is_featured);
        break;

      default:
        break;
    }

    // Apply category filter
    if (activeCategory !== "") {
      result = result.filter(course => {
        const categoryName = course.category?.name?.toLowerCase() || "";
        switch (activeCategory) {
          case "web":
            return categoryName.includes("web") ||
              categoryName.includes("programming") ||
              categoryName.includes("development");
          case "design":
            return categoryName.includes("design") ||
              categoryName.includes("ui") ||
              categoryName.includes("ux");
          case "business":
            return categoryName.includes("business") ||
              categoryName.includes("marketing") ||
              categoryName.includes("finance");
          case "data":
            return categoryName.includes("data") ||
              categoryName.includes("analytics") ||
              categoryName.includes("science");
          default:
            return true;
        }
      });
    }

    setFilteredCourses(result.slice(0, 4)); // Show top 8 results
  }, [courses, activeFilter, activeCategory]);

  const getCourseIcon = (course) => {
    const categoryName = course.category?.name?.toLowerCase() || "";
    if (categoryName.includes("web") || categoryName.includes("programming")) return FaCode;
    if (categoryName.includes("design")) return FaPaintBrush;
    if (categoryName.includes("business")) return FaBriefcase;
    if (categoryName.includes("data")) return FaChartLine;
    return FaGraduationCap;
  };

  const getCourseColor = (course) => {
    const categoryName = course.category?.name?.toLowerCase() || "";
    if (categoryName.includes("web") || categoryName.includes("programming")) return "bg-blue-100 text-blue-700";
    if (categoryName.includes("design")) return "bg-pink-100 text-pink-700";
    if (categoryName.includes("business")) return "bg-green-100 text-green-700";
    if (categoryName.includes("data")) return "bg-purple-100 text-purple-700";
    return "bg-gray-100 text-gray-700";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-10 min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <span className="ml-3 font-semibold text-gray-600">Loading courses...</span>
      </div>
    );
  }

  return (
    <div className="lg:mx-7 mx-4 mt-10">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Discover Amazing Courses
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Browse through our curated collection of courses filtered by career paths, popularity, and trending topics
        </p>
      </div>

      {/* Main Filter Buttons */}
      <div className="flex flex-wrap gap-3 justify-center mb-8">
        {filters.map((filter) => {
          const Icon = filter.icon;
          const isActive = activeFilter === filter.id;

          return (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`flex items-center gap-2 px-5 py-3 cursor-pointer rounded-full font-medium transition-all duration-300 ${isActive
                ? `${filter.color.replace('100', '500').replace('700', '50')} shadow-lg scale-105`
                : "bg-white text-gray-700 border border-gray-200 hover:border-gray-300"
                }`}
            >
              <Icon className={`${isActive ? 'text-white' : filter.color.split(' ')[1]}`} />
              <span className={isActive ? 'text-white' : ''}>{filter.name}</span>
              {isActive && (
                <span className="ml-2 w-2 h-2 bg-white rounded-full"></span>
              )}
            </button>
          );
        })}
      </div>

      {/* Category Filter */}
      {/* <div className="flex flex-wrap gap-2 justify-center mb-10">
        {categories.map((category) => {
          const Icon = category.icon;
          const isActive = activeCategory === category.id;

          return (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 cursor-pointer rounded-lg font-medium transition-all ${isActive
                ? 'bg-primary text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              <Icon size={16} />
              <span>{category.name}</span>
            </button>
          );
        })}
      </div> */}

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredCourses.length === 0 ? (
          <div className="col-span-full text-center py-16">
            <div className="text-gray-400 mb-4">
              <FaGraduationCap className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No courses found
            </h3>
            <p className="text-gray-500">
              Try a different filter or category
            </p>
            <button
              onClick={() => {
                setActiveFilter("all");
                setActiveCategory("all");
              }}
              className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredCourses.map((course) => {
            const Icon = getCourseIcon(course);
            const colorClass = getCourseColor(course);

            return (
              <Link
                key={course.id}
                to={`/course/${course.id}`}
                className="block bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
              >
                {/* Course Image */}
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  {course.image ? (
                    <img
                      src={resolveImageUrl(course.image)}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        if (e.target.src !== PLACEHOLDER_IMAGE) {
                          e.target.onerror = null;
                          e.target.src = PLACEHOLDER_IMAGE;
                        }
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                      <Icon className="text-4xl text-primary opacity-50" />
                      <h2 className="text-lg font-semibold text-primary mt-2">BITCODERLABS</h2>
                    </div>
                  )}

                  {/* Category Badge */}
                  <div className="absolute top-3 left-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${colorClass}`}>
                      {course.category?.name || "Course"}
                    </span>
                  </div>


                </div>

                {/* Course Content */}
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${colorClass}`}>
                        {course.level ? course.level.charAt(0).toUpperCase() + course.level.slice(1) : "All Levels"}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-yellow-500">
                      <FaStar size={14} />
                      <span className="text-sm font-medium">
                        {course.rating ? Number(course.rating).toFixed(1) : "4.5"}
                      </span>
                      <span className="text-gray-400 text-sm">
                        ({course.reviews_count || 0})
                      </span>
                    </div>
                  </div>

                  <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 h-12">
                    {course.title}
                  </h3>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2 h-10">
                    {course.short_description || course.description?.substring(0, 80) + "..." || "Explore this comprehensive course"}
                  </p>

                  <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                    <div className="flex items-center gap-3  text-gray-500">
                      <span className="flex items-center gap-1 text-[12px]">
                        <FaUsers size={12} />
                        {course.students_count || 0}
                      </span>
                      {course.duration && (
                        <span className="flex items-center gap-1 text-[12px]">
                          <FaClock size={12} />
                          {course.duration}
                        </span>
                      )}
                    </div>


                    {/* Instructor */}
                    {course.instructor && (
                      <div className=" flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-[10px] font-medium text-gray-700">
                            {(course.instructor?.user?.name?.[0] || course.instructor?.name?.[0] || "I").toUpperCase()}
                          </span>
                        </div>
                        <span className="text-[12px] text-gray-600 truncate">
                          {course.instructor?.user?.name || course.instructor?.name || "Instructor"}
                        </span>
                      </div>
                    )}
                  </div>


                </div>
              </Link>
            );
          })
        )}
      </div>

      {/* View More Button */}
      {filteredCourses.length > 0 && (
        <div className="text-center mt-12">
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-lg hover:shadow-lg transition-all duration-300 font-medium group"
          >
            View All Courses
            <svg
              className="w-5 h-5 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      )}

      {/* Stats Section */}
      <div className="mt-16 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">
              {courses.length}+
            </div>
            <div className="text-gray-600">Total Courses</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {courses.filter(c => c.students_count > 100).length}+
            </div>
            <div className="text-gray-600">Popular Courses</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {courses.filter(c => c.is_featured).length}+
            </div>
            <div className="text-gray-600">Featured</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {courses.filter(c => c.rating >= 4.5).length}+
            </div>
            <div className="text-gray-600">Top Rated</div>
          </div>
        </div>
      </div>
    </div>
  );
}
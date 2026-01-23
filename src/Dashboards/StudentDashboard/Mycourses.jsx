import React, { useState, useEffect } from 'react';
import { FaPaintBrush, FaBolt, FaBullseye, FaScroll, FaBook } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyCourses, selectMyCourses } from '../../../slices/courseSlice';
import { API_ORIGIN } from '../../api/index.js';

const MyCourses = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const dispatch = useDispatch();

  const fetchedCourses = useSelector(selectMyCourses) || [];
  const loading = useSelector((state) => state.courses.myCoursesLoading);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchMyCourses());
    }
  }, [dispatch, user?.id]);

  const resolveImageUrl = (image) => {
    if (!image) return null;
    if (typeof image !== "string") return null;
    if (image.startsWith("http://") || image.startsWith("https://")) return image;
    if (image.startsWith("/")) return `${API_ORIGIN}${image}`;
    return `${API_ORIGIN}/storage/${image}`;
  };

  const PLACEHOLDER_IMAGE = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmVmZWZlIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZpbGw9IiM5OTkiIGZvbnQtc2l6ZT0iMTQiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZHk9Ii4zZW0iIHRleHQtYW5jaG9yPSJtaWRkbGUiPkJpdGNvZGVyIExhYnM8L3RleHQ+PC9zdmc+";

  const getCategoryName = (category) => {
    if (!category) return 'General';
    if (typeof category === 'string') return category;
    return category.name || 'General';
  };

  const getInstructorName = (instructor) => {
    if (!instructor) return 'Unknown Instructor';
    if (typeof instructor === 'string') return instructor;
    return instructor.user?.name || instructor.name || 'Unknown Instructor';
  };

  const filters = [
    { id: 'all', label: 'All Courses' },
    { id: 'active', label: 'Active' },
    { id: 'pending', label: 'Pending' },
    { id: 'completed', label: 'Completed' }
  ];

  const filteredCourses = fetchedCourses.filter(
    (course) => activeFilter === 'all' || (course.status === activeFilter)
  );

  const getFilterCount = (filterId) => {
    if (filterId === 'all') return fetchedCourses.length;
    return fetchedCourses.filter(c => c.status === filterId).length;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-dark"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
          <p className="text-gray-600 mt-1">Manage and track your learning progress</p>
        </div>
        <Link to="/courses" className="mt-4 sm:mt-0 inline-block bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors duration-200">
          Browse All Courses
        </Link>
      </div>

      {/* Filters */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors duration-200
              ${activeFilter === filter.id
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
            `}
          >
            {filter.label}
            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${activeFilter === filter.id
              ? 'bg-white/20 text-white'
              : 'bg-gray-200 text-gray-600'
              }`}>
              {getFilterCount(filter.id)}
            </span>
          </button>
        ))}
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <div
            key={course.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
          >
            <div className="p-6">

              {/* Thumbnail + Status */}
              <div className="flex items-start justify-between mb-4">
                <div className="w-16 h-12 bg-primary-light rounded-lg flex items-center justify-center text-xl overflow-hidden">
                  <img
                    src={resolveImageUrl(course.image) || PLACEHOLDER_IMAGE}
                    alt={course.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      if (e.target.src !== PLACEHOLDER_IMAGE) {
                        e.target.onerror = null;
                        e.target.src = PLACEHOLDER_IMAGE;
                      }
                    }}
                  />
                </div>

                <span
                  className={`
                    px-2 py-1 text-xs font-medium rounded-full capitalize
                    ${course.status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : course.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : course.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-blue-100 text-blue-800'}
                  `}
                >
                  {course.status === 'rejected' ? 'Enrollment Rejected' : course.status}
                </span>
              </div>

              <h3 className="font-semibold text-gray-900 mb-2 truncate" title={course.title}>{course.title}</h3>
              <p className="text-sm text-gray-600 mb-4">by {getInstructorName(course.instructor)}</p>

              {/* Progress */}
              <div className="space-y-3">
                {course.status === 'pending' && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-xs text-yellow-700">
                      ⏳ Your enrollment is pending approval. You'll be able to access the course once an admin approves it.
                    </p>
                  </div>
                )}
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{course.progress || 0}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`
                        h-2 rounded-full transition-all duration-300
                        ${course.status === 'completed' ? 'bg-green-500' : 'bg-primary'}
                      `}
                      style={{ width: `${course.progress || 0}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex justify-between text-sm text-gray-600">
                  <span>Duration: {course.duration || 'N/A'}</span>
                  <span>{getCategoryName(course.category)}</span>
                </div>
              </div>
            </div>

            {/* Button */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <button
                className={`
                  w-full py-2 px-4 rounded-lg font-medium text-sm transition-colors duration-200
                  ${course.status === 'completed'
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    : course.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 cursor-not-allowed'
                      : course.status === 'rejected'
                        ? 'bg-red-100 text-red-800 hover:bg-red-200 cursor-not-allowed'
                        : 'bg-primary text-white hover:bg-primary-dark'}
                `}
                disabled={course.status === 'rejected' || course.status === 'pending'}
              >
                {course.status === 'completed'
                  ? 'View Certificate'
                  : course.status === 'pending'
                    ? '⌛ Waiting for Approval'
                    : course.status === 'rejected'
                      ? 'Enrollment Rejected'
                      : 'Continue Learning'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <FaBook className="text-6xl text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
          <p className="text-gray-600">Try selecting a different filter or browse new courses.</p>
        </div>
      )}
    </div>
  );
};

export default MyCourses;

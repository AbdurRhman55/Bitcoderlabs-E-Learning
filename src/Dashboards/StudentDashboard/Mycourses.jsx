// components/MyCourses.jsx
import React, { useState } from 'react';
import { FaPaintBrush, FaBolt, FaBullseye, FaScroll, FaBook } from "react-icons/fa";
import { Link } from 'react-router-dom';
const MyCourses = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  const courses = [
    {
      id: 1,
      title: 'Advanced React Patterns',
      instructor: 'Sarah Johnson',
      category: 'Frontend',
      progress: 85,
      duration: '12h 30m',
      enrolledDate: '2024-01-15',
      thumbnail: <FaPaintBrush className="text-2xl text-primary" />,
      status: 'in-progress'
    },
    {
      id: 2,
      title: 'Node.js Backend Development',
      instructor: 'Mike Chen',
      category: 'Backend',
      progress: 45,
      duration: '18h 15m',
      enrolledDate: '2024-01-20',
      thumbnail: <FaBolt className="text-2xl text-primary" />,
      status: 'in-progress'
    },
    {
      id: 3,
      title: 'UI/UX Design Fundamentals',
      instructor: 'Emily Davis',
      category: 'Design',
      progress: 30,
      duration: '8h 45m',
      enrolledDate: '2024-02-01',
      thumbnail: <FaBullseye className="text-2xl text-primary" />,
      status: 'in-progress'
    },
    {
      id: 4,
      title: 'JavaScript Fundamentals',
      instructor: 'David Kim',
      category: 'Frontend',
      progress: 100,
      duration: '10h 00m',
      enrolledDate: '2023-12-10',
      thumbnail: <FaScroll className="text-2xl text-primary" />,
      status: 'completed'
    }
  ];

  const filters = [
    { id: 'all', label: 'All Courses' },
    { id: 'in-progress', label: 'In Progress' },
    { id: 'completed', label: 'Completed' },
    { id: 'new', label: 'New' }
  ];

  const filteredCourses = courses.filter(
    (course) => activeFilter === 'all' || course.status === activeFilter
  );

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
                <div className="w-12 h-12 bg-primary-light rounded-lg flex items-center justify-center text-xl">
                  {course.thumbnail}
                </div>

                <span
                  className={`
                    px-2 py-1 text-xs font-medium rounded-full
                    ${course.status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-blue-100 text-blue-800'}
                  `}
                >
                  {course.status === 'completed' ? 'Completed' : 'In Progress'}
                </span>
              </div>

              <h3 className="font-semibold text-gray-900 mb-2">{course.title}</h3>
              <p className="text-sm text-gray-600 mb-4">by {course.instructor}</p>

              {/* Progress */}
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{course.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`
                        h-2 rounded-full transition-all duration-300
                        ${course.status === 'completed' ? 'bg-green-500' : 'bg-primary'}
                      `}
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex justify-between text-sm text-gray-600">
                  <span>Duration: {course.duration}</span>
                  <span>{course.category}</span>
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
                    : 'bg-primary text-white hover:bg-primary-dark'}
                `}
              >
                {course.status === 'completed' ? 'View Certificate' : 'Continue Learning'}
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

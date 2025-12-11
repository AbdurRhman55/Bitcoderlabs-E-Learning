// CourseProgress.jsx
import React from 'react';

const CourseProgress = () => {
  const courses = [
    {
      id: 1,
      title: 'Advanced React Patterns',
      instructor: 'Sarah Johnson',
      progress: 85,
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=100&h=60&fit=crop',
      duration: '12h 30m',
      lastAccessed: '2 days ago'
    },
    {
      id: 2,
      title: 'Node.js Backend Development',
      instructor: 'Mike Chen',
      progress: 45,
      thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=100&h=60&fit=crop',
      duration: '18h 15m',
      lastAccessed: '1 week ago'
    },
    {
      id: 3,
      title: 'UI/UX Design Fundamentals',
      instructor: 'Emily Davis',
      progress: 30,
      thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=100&h=60&fit=crop',
      duration: '8h 45m',
      lastAccessed: '3 days ago'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Current Courses</h2>
        <button className="text-primary hover:text-primary-dark font-medium text-sm">
          View All Courses
        </button>
      </div>

      <div className="space-y-4">
        {courses.map((course) => (
          <div key={course.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:border-primary-light transition-colors duration-200">
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-16 h-12 object-cover rounded"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900 truncate">{course.title}</h3>
              <p className="text-sm text-gray-600">by {course.instructor}</p>
              <div className="flex items-center space-x-4 mt-1">
                <span className="text-xs text-gray-500">{course.duration}</span>
                <span className="text-xs text-gray-500">Last accessed: {course.lastAccessed}</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-24 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${course.progress}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-gray-700 w-8">{course.progress}%</span>
              <button className="text-primary hover:text-primary-dark text-sm font-medium">
                Continue
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseProgress;
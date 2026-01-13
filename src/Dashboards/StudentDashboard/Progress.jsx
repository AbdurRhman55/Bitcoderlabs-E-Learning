import React from 'react';
import { FaClock, FaCalendarCheck, FaFire, FaBookOpen } from "react-icons/fa";
import { useSelector } from 'react-redux';
import { selectCourses } from '../../../slices/courseSlice';

const Progress = () => {
  const enrolledCourses = useSelector(selectCourses);

  // Map enrolled courses to recent activity/progress cards
  const activeLearning = enrolledCourses.map(course => ({
    title: course.title,
    progress: course.progress || 0,
    status: course.status,
    category: course.category?.name || 'General',
    instructor: course.instructor?.name || 'Instructor'
  }));

  const stats = {
    totalCourses: enrolledCourses.length,
    completed: enrolledCourses.filter(c => c.status === 'completed' || c.progress === 100).length,
    inProgress: enrolledCourses.filter(c => c.status === 'active' && c.progress < 100).length,
    avgProgress: enrolledCourses.length > 0
      ? Math.round(enrolledCourses.reduce((acc, curr) => acc + (curr.progress || 0), 0) / enrolledCourses.length)
      : 0
  };

  const weeklyProgress = [
    { day: 'Mon', hours: 0 },
    { day: 'Tue', hours: 0 },
    { day: 'Wed', hours: 0 },
    { day: 'Thu', hours: 0 },
    { day: 'Fri', hours: 0 },
    { day: 'Sat', hours: 0 },
    { day: 'Sun', hours: 0 }
  ];

  const maxHours = Math.max(...weeklyProgress.map(day => day.hours));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Learning Progress</h1>
        <p className="text-gray-600 mt-1">Track your journey and achievements</p>
      </div>

      {/* Weekly Activity */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Weekly Activity</h2>
        <div className="flex items-end justify-between space-x-2 h-32">
          {weeklyProgress.map((day) => (
            <div key={day.day} className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-gradient-to-t from-primary to-primary-light rounded-t-lg transition-all duration-300 hover:opacity-80"
                style={{ height: `${(day.hours / maxHours) * 80}%` }}
              ></div>
              <div className="text-xs text-gray-600 mt-2">{day.day}</div>
              <div className="text-xs font-medium text-gray-900">{day.hours}h</div>
            </div>
          ))}
        </div>
      </div>

      {/* Learning Progress List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {activeLearning.map((path, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900">{path.title}</h3>
                <p className="text-sm text-gray-600">by {path.instructor}</p>
              </div>
              <span className="text-2xl font-bold text-primary">{path.progress}%</span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
              <div
                className="h-3 rounded-full transition-all duration-500 bg-primary"
                style={{ width: `${path.progress}%` }}
              ></div>
            </div>

            <div className="flex justify-between text-sm text-gray-600 mb-4">
              <span className="capitalize">Status: {path.status}</span>
              <span>{path.category}</span>
            </div>
          </div>
        ))}

        {activeLearning.length === 0 && (
          <div className="lg:col-span-2 text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
            <FaBookOpen className="text-4xl text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900">No active progress</h3>
            <p className="text-gray-600">Start learning to see your progress here!</p>
          </div>
        )}
      </div>

      {/* Time Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
          <FaBookOpen className="text-primary text-3xl mx-auto mb-2" />
          <div className="text-3xl font-bold text-primary mb-2">{stats.totalCourses}</div>
          <div className="text-sm text-gray-600">Total Enrolled</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
          <FaCalendarCheck className="text-green-600 text-3xl mx-auto mb-2" />
          <div className="text-3xl font-bold text-green-600 mb-2">{stats.completed}</div>
          <div className="text-sm text-gray-600">Courses Completed</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
          <FaFire className="text-purple-600 text-3xl mx-auto mb-2" />
          <div className="text-3xl font-bold text-purple-600 mb-2">{stats.avgProgress}%</div>
          <div className="text-sm text-gray-600">Average Progress</div>
        </div>

      </div>

    </div>
  );
};

export default Progress;

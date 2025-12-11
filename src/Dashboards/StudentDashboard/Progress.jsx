// components/Progress.jsx
import React from 'react';
import { FaClock, FaCalendarCheck, FaFire } from "react-icons/fa";

const Progress = () => {
  const learningPaths = [
    {
      title: 'Frontend Development',
      progress: 75,
      courses: 8,
      completed: 6,
      color: 'primary',
      skills: ['React', 'JavaScript', 'CSS', 'HTML']
    },
    {
      title: 'Backend Development',
      progress: 45,
      courses: 6,
      completed: 2,
      color: 'green',
      skills: ['Node.js', 'Express', 'MongoDB', 'API Design']
    },
    {
      title: 'DevOps & Cloud',
      progress: 20,
      courses: 5,
      completed: 1,
      color: 'purple',
      skills: ['Docker', 'AWS', 'CI/CD', 'Linux']
    }
  ];

  const weeklyProgress = [
    { day: 'Mon', hours: 2.5 },
    { day: 'Tue', hours: 1.8 },
    { day: 'Wed', hours: 3.2 },
    { day: 'Thu', hours: 2.1 },
    { day: 'Fri', hours: 4.0 },
    { day: 'Sat', hours: 1.5 },
    { day: 'Sun', hours: 2.8 }
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

      {/* Learning Paths */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {learningPaths.map((path, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <h3 className="font-semibold text-gray-900">{path.title}</h3>
              <span className="text-2xl font-bold text-primary">{path.progress}%</span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
              <div 
                className={`h-3 rounded-full transition-all duration-500 bg-${path.color}-500`}
                style={{ width: `${path.progress}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between text-sm text-gray-600 mb-4">
              <span>{path.completed}/{path.courses} courses completed</span>
              <span>{100 - path.progress}% to complete</span>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-900">Skills Gained:</h4>
              <div className="flex flex-wrap gap-2">
                {path.skills.map((skill, skillIndex) => (
                  <span 
                    key={skillIndex}
                    className="px-2 py-1 bg-primary-light text-primary text-xs rounded-lg"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Time Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
          <FaClock className="text-primary text-3xl mx-auto mb-2" />
          <div className="text-3xl font-bold text-primary mb-2">42.5h</div>
          <div className="text-sm text-gray-600">Total Learning Time</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
          <FaCalendarCheck className="text-green-600 text-3xl mx-auto mb-2" />
          <div className="text-3xl font-bold text-green-600 mb-2">2.8h</div>
          <div className="text-sm text-gray-600">Daily Average</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
          <FaFire className="text-purple-600 text-3xl mx-auto mb-2" />
          <div className="text-3xl font-bold text-purple-600 mb-2">14</div>
          <div className="text-sm text-gray-600">Consecutive Days</div>
        </div>

      </div>

    </div>
  );
};

export default Progress;

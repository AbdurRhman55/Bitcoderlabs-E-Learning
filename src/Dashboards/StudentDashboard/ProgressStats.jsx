// ProgressStats.jsx
import React from 'react';

const ProgressStats = ({ userData }) => {
  const stats = [
    {
      label: 'Overall Progress',
      value: userData.completionRate,
      color: 'primary'
    },
    {
      label: 'Courses Enrolled',
      value: userData.enrolledCourses,
      color: 'green'
    },
    {
      label: 'Learning Streak',
      value: 14,
      color: 'orange'
    }
  ];

  const getColorClass = (color) => {
    const colors = {
      primary: 'bg-primary',
      green: 'bg-green-500',
      orange: 'bg-orange-500'
    };
    return colors[color] || colors.primary;
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Learning Progress</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            <div className="relative inline-block">
              <svg className="w-20 h-20" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#E5E7EB"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke={stat.color === 'primary' ? '#3baee9' : ''}
                  strokeWidth="3"
                  strokeDasharray={`${stat.value}, 100`}
                />
                <text x="18" y="20.35" className="text-sm font-semibold fill-gray-900" textAnchor="middle">
                  {stat.value}%
                </text>
              </svg>
            </div>
            <p className="mt-2 text-sm font-medium text-gray-600">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressStats;

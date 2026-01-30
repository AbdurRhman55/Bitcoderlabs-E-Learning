// RecentActivity.jsx
import React from 'react';

const RecentActivity = () => {
  const activities = [
    {
      id: 1,
      type: 'course_completed',
      title: 'Completed "JavaScript Fundamentals"',
      time: '2 hours ago',
      icon: '🎓'
    },
    {
      id: 2,
      type: 'quiz_passed',
      title: 'Passed React Basics Quiz with 95%',
      time: '1 day ago',
      icon: '✅'
    },
    {
      id: 3,
      type: 'course_enrolled',
      title: 'Enrolled in "Advanced CSS Techniques"',
      time: '2 days ago',
      icon: '📚'
    },
    {
      id: 4,
      type: 'achievement',
      title: 'Earned "Quick Learner" badge',
      time: '3 days ago',
      icon: '🏆'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-primary-light rounded-lg transition-colors duration-200">
            <div className="flex-shrink-0 w-8 h-8 bg-primary-light rounded-full flex items-center justify-center text-sm">
              {activity.icon}
            </div>
            <div className="flex-1">
              <p className="text-gray-900 font-medium">{activity.title}</p>
              <p className="text-gray-500 text-sm">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;

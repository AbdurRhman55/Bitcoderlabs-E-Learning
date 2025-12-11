// ActivityFeed.jsx
import React from 'react';

const ActivityFeed = () => {
  const activities = [
    {
      id: 1,
      type: 'completion',
      course: 'Advanced React Patterns',
      action: 'Course completed',
      time: '2 hours ago',
      score: '98%',
      icon: '🎓',
      color: 'green'
    },
    {
      id: 2,
      type: 'achievement',
      course: 'Quick Learner',
      action: 'Badge earned',
      time: '1 day ago',
      score: null,
      icon: '🏆',
      color: 'yellow'
    },
    {
      id: 3,
      type: 'progress',
      course: 'Node.js Security',
      action: 'Milestone reached',
      time: '2 days ago',
      score: 'Chapter 5',
      icon: '📍',
      color: 'blue'
    },
    {
      id: 4,
      type: 'social',
      course: 'Study Group',
      action: 'Joined group',
      time: '3 days ago',
      score: null,
      icon: '👥',
      color: 'purple'
    }
  ];

  const getColorClass = (color) => {
    const colors = {
      green: 'bg-green-100 text-green-700',
      yellow: 'bg-yellow-100 text-yellow-700',
      blue: 'bg-blue-100 text-blue-700',
      purple: 'bg-purple-100 text-purple-700'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-sm p-6">
      <h3 className="font-semibold text-gray-900 mb-6">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-4 group p-3 rounded-xl hover:bg-gray-50/50 transition-all duration-200">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm ${getColorClass(activity.color)}`}>
              {activity.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium text-gray-900 group-hover:text-primary transition-colors duration-200">
                    {activity.course}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">{activity.action}</p>
                </div>
                {activity.score && (
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900">{activity.score}</div>
                    <div className="text-xs text-gray-500">{activity.time}</div>
                  </div>
                )}
              </div>
              {!activity.score && (
                <div className="text-xs text-gray-500 mt-2">{activity.time}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed;
// QuickActions.jsx
import React from 'react';

const QuickActions = () => {
  const actions = [
    {
      icon: '🚀',
      label: 'Continue Learning',
      description: 'Pick up where you left off',
      action: '#continue',
      color: 'primary'
    },
    {
      icon: '🎯',
      label: 'Set Goal',
      description: 'Define learning objectives',
      action: '#goal',
      color: 'green'
    },
    {
      icon: '📚',
      label: 'Browse Courses',
      description: 'Discover new content',
      action: '#browse',
      color: 'purple'
    },
    {
      icon: '👥',
      label: 'Study Group',
      description: 'Join peers learning',
      action: '#group',
      color: 'orange'
    }
  ];

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-sm p-6">
      <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => (
          <button
            key={index}
            className="p-3 rounded-xl bg-gray-50 hover:bg-primary/5 border border-gray-200/50 hover:border-primary/30 transition-all duration-200 group text-left"
          >
            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-200">
              {action.icon}
            </div>
            <div className="font-medium text-gray-900 text-sm mb-1">
              {action.label}
            </div>
            <div className="text-xs text-gray-600">
              {action.description}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
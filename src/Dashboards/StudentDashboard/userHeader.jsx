// UserHeader.jsx
import React from 'react';

const UserHeader = ({ userData, activeView, setActiveView }) => {
  const views = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'courses', label: 'My Courses', icon: '🎓' },
    { id: 'projects', label: 'Projects', icon: '💼' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
  ];

  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
      {/* User Identity */}
      <div className="flex items-center space-x-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-bold text-lg">
            {userData.avatar && userData.avatar.startsWith('data:') ? (
              <img
                src={userData.avatar}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              userData.name.split(' ').map(n => n[0]).join('')
            )}
          </div>
          <div className="absolute -bottom-1 -right-1 bg-green-500 border-2 border-white rounded-full w-4 h-4"></div>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{userData.name}</h1>
          <p className="text-gray-600 flex items-center space-x-2">
            <span>{userData.title}</span>
            <span>•</span>
            <span className="text-primary font-medium">Level {userData.level}</span>
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex space-x-1 mt-4 lg:mt-0 bg-white/80 backdrop-blur-sm rounded-xl p-1 border border-white/20 shadow-sm">
        {views.map((view) => (
          <button
            key={view.id}
            onClick={() => setActiveView(view.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeView === view.id
                ? 'bg-primary text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
              }`}
          >
            <span>{view.icon}</span>
            <span>{view.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default UserHeader;

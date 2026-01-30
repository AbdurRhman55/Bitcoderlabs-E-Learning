// UserInfo.jsx
import React from 'react';

const UserInfo = ({ userData }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex flex-col items-center text-center">
        {/* Avatar */}
        <div className="relative">
          <img
            className="h-24 w-24 rounded-full object-cover border-4 border-primary-light"
            src={userData.avatar}
            alt={userData.name}
          />
          <div className="absolute -bottom-2 -right-2 bg-primary text-white rounded-full px-2 py-1 text-xs font-medium">
            {userData.level}
          </div>
        </div>

        {/* User Details */}
        <h2 className="mt-4 text-xl font-semibold text-gray-900">{userData.name}</h2>
        <p className="text-gray-600 text-sm mt-1">{userData.email}</p>
        <p className="text-gray-500 text-sm mt-2">{userData.bio}</p>

        {/* Join Date */}
        <div className="mt-4 text-sm text-gray-500">
          Member since {userData.joinDate}
        </div>

        {/* Edit Profile Button */}
        <button className="mt-6 w-full bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200">
          Edit Profile
        </button>

        {/* Quick Stats */}
        <div className="mt-6 grid grid-cols-2 gap-4 w-full">
          <div className="text-center p-3 bg-primary-light rounded-lg">
            <div className="text-2xl font-bold text-primary">{userData.completedCourses}</div>
            <div className="text-xs text-gray-600">Courses Completed</div>
          </div>
          <div className="text-center p-3 bg-primary-light rounded-lg">
            <div className="text-2xl font-bold text-primary">{userData.points}</div>
            <div className="text-xs text-gray-600">Points</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;

// src/components/sections/ProfileOverview.jsx
import React from "react";
import {
  FaEdit,
  FaStar,
  FaUsers,
  FaClock,
  FaBook,
  FaTasks,
  FaChartLine,
  FaChartBar,
} from "react-icons/fa";
import { MdSchool, MdWork } from "react-icons/md";

const PLACEHOLDER_IMAGE = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmVmZWZlIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZpbGw9IiM5OTkiIGZvbnQtc2l6ZT0iMTQiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZHk9Ii4zZW0iIHRleHQtYW5jaG9yPSJtaWRkbGUiPkJpdGNvZGVyIExhYnM8L3RleHQ+PC9zdmc+";

const ProfileOverview = ({ profile, stats, recentActivities }) => {
  // This component ONLY receives data when ALL is loaded
  // No fallbacks, no loading states

  const approvalStatus = profile.approvalStatus || "pending";
  const statusBadge = (() => {
    switch (approvalStatus) {
      case "approved":
        return { label: "Verified", className: "bg-green-100 text-green-800" };
      case "submitted":
        return {
          label: "Under Review",
          className: "bg-amber-100 text-amber-800",
        };
      case "rejected":
        return { label: "Rejected", className: "bg-red-100 text-red-800" };
      case "draft":
        return { label: "Draft", className: "bg-gray-100 text-gray-800" };
      default:
        return { label: "Pending", className: "bg-gray-100 text-gray-800" };
    }
  })();

  const handleEditProfile = () => {
    window.location.href = "/teacherprofile";
  };

  // Format stats data from API
  const displayStats = [
    {
      label: "Total Students",
      value: stats.total_students?.toString() || "0",
      icon: <FaUsers />,
      change: stats.students_change || "",
    },
    {
      label: "Active Courses",
      value: stats.active_courses?.toString() || "0",
      icon: <MdSchool />,
      change: stats.courses_change || "",
    },
    {
      label: "Teaching Hours",
      value: `${stats.teaching_hours || 0}h`,
      icon: <FaClock />,
      change: stats.hours_change || "",
    },
    {
      label: "Avg. Rating",
      value: stats.average_rating?.toFixed(1) || "0.0",
      icon: <FaStar />,
      change: stats.rating_change || "",
    },
  ];

  // Use real activities or show empty state
  const displayActivities =
    recentActivities.length > 0
      ? recentActivities
      : [
        {
          id: 1,
          type: "course",
          title: "No recent activities",
          description: "Your recent activities will appear here",
          time: "",
        },
      ];

  return (
    <div className="space-y-6">
      {/* Header - Real API data */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Teacher Dashboard
          </h1>
          <p className="text-gray-600">Welcome back, {profile.name}</p>
        </div>
      </div>

      {/* Stats Grid - Real API data */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayStats.map((stat, index) => (
          <div
            key={index}
            className="relative bg-white rounded-2xl p-6 border border-gray-200 shadow-sm 
                 hover:shadow-md transition-all duration-300 group"
          >
            {/* Top Section */}
            <div className="flex items-center justify-between mb-6">
              <div
                className="flex items-center justify-center w-11 h-11 rounded-xl bg-gray-100 
                        group-hover:bg-primary-light transition-colors text-primary text-2xl"
              >
                {stat.icon}
              </div>

              {stat.change && (
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full
              ${stat.change.startsWith("+")
                      ? "bg-gray-100 text-primary"
                      : "bg-red-100 text-red-700"
                    }`}
                >
                  {stat.change}
                </span>
              )}
            </div>

            <p className="text-3xl font-bold text-gray-900 leading-tight">
              {stat.value}
            </p>

            <p className="mt-1 text-sm font-medium text-gray-500">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Profile Card - Real API data */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start space-x-6">
              <img
                src={profile.profileImage || PLACEHOLDER_IMAGE}
                alt={profile.name}
                className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
                onError={(e) => {
                  if (e.target.src !== PLACEHOLDER_IMAGE) {
                    e.target.onerror = null;
                    e.target.src = PLACEHOLDER_IMAGE;
                  }
                }}
              />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">
                      {profile.name}
                    </h2>
                    <p className="text-gray-600">{profile.qualification}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {profile.experience} of teaching experience
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 text-sm font-medium rounded-full ${statusBadge.className}`}
                  >
                    {statusBadge.label}
                  </span>
                </div>

                <div className="mt-4">
                  <p className="text-gray-700 mb-4">{profile.about}</p>

                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <MdWork className="mr-2 text-gray-500" />
                      <span>{stats.active_courses || 0} Courses</span>
                    </div>
                    <div className="flex items-center">
                      <FaUsers className="mr-2 text-gray-500" />
                      <span>{stats.total_students || 0} Students</span>
                    </div>
                    <div className="flex items-center">
                      <FaStar className="mr-2 text-gray-500" />
                      <span>
                        {stats.average_rating?.toFixed(1) || "0.0"} Rating
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Skills - Real API data */}
            {profile.skills?.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-800 mb-3">
                  Skills & Expertise
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary-light text-primary text-sm font-medium rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activities - Real API data */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            Recent Activities
          </h3>
          <div className="space-y-4">
            {displayActivities.slice(0, 2).map((activity) => (
              <div
                key={activity.id}
                className="flex items-start space-x-3  hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="p-2 rounded-lg bg-primary-light">
                  <FaChartBar className="text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm text-gray-800">
                    {activity.title}
                  </p>
                  <p className="text-xs text-gray-600">
                    {activity.description}
                  </p>
                  {activity.time && (
                    <p className="text-xs text-gray-500 mt-1">
                      {activity.time}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-2 text-center text-primary hover:text-primary-dark font-medium">
            View All Activities →
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex flex-col items-center justify-center p-6 border border-gray-200 rounded-xl hover:border-primary hover:bg-primary-light transition-colors">
            <FaBook className="text-2xl text-primary mb-3" />
            <span className="font-medium text-gray-800">Create New Course</span>
            <span className="text-sm text-gray-600 mt-1">
              Start teaching now
            </span>
          </button>
          <button className="flex flex-col items-center justify-center p-6 border border-gray-200 rounded-xl hover:border-primary hover:bg-primary-light transition-colors">
            <FaTasks className="text-2xl text-primary mb-3" />
            <span className="font-medium text-gray-800">Create Assignment</span>
            <span className="text-sm text-gray-600 mt-1">
              Add new assessment
            </span>
          </button>
          <button className="flex flex-col items-center justify-center p-6 border border-gray-200 rounded-xl hover:border-primary hover:bg-primary-light transition-colors">
            <FaChartLine className="text-2xl text-primary mb-3" />
            <span className="font-medium text-gray-800">View Analytics</span>
            <span className="text-sm text-gray-600 mt-1">
              Track performance
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileOverview;

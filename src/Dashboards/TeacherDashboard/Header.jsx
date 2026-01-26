// src/Dashboards/TeacherDashboard/Header.jsx
import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  FaBell,
  FaUserCircle,
  FaSearch,
  FaCog,
  FaSignOutAlt,
  FaTimes,
  FaEnvelope,
  FaGraduationCap,
  FaCheckCircle,
  FaExclamationTriangle,
  FaBook,
} from "react-icons/fa";
import { useDispatch } from "react-redux";
import { logoutAsync } from "../../../slices/AuthSlice";

const DashboardHeader = ({ profile, notifications = [], setActiveTab }) => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotificationDropdown, setShowNotificationDropdown] =
    useState(false);

  const profileDropdownRef = useRef(null);
  const notificationDropdownRef = useRef(null);
  const dispatch = useDispatch();

  // Helper to format/map notifications from API
  const formattedNotifications = useMemo(() => {
    return notifications.map(notif => {
      // Basic formatting for API data
      const type = notif.type || 'system';
      let icon = <FaBell className="text-gray-500" />;

      if (type.includes('course') || type.includes('approval')) {
        icon = <FaCheckCircle className="text-green-500" />;
      } else if (type.includes('enroll')) {
        icon = <FaGraduationCap className="text-blue-500" />;
      } else if (type.includes('payment') || type.includes('money')) {
        icon = <FaEnvelope className="text-yellow-500" />;
      } else if (type.includes('assignment')) {
        icon = <FaBook className="text-purple-500" />;
      }

      return {
        id: notif.id,
        title: notif.title || (type.charAt(0).toUpperCase() + type.slice(1)),
        message: notif.message || notif.data?.message || "New notification",
        time: notif.created_at ? new Date(notif.created_at).toLocaleDateString() : "Just now",
        read: !!notif.read_at || notif.read,
        icon: icon,
      };
    });
  }, [notifications]);

  const unreadCount = useMemo(() => {
    return formattedNotifications.filter(n => !n.read).length;
  }, [formattedNotifications]);

  const handleLogout = () => {
    dispatch(logoutAsync());
  };

  const handleEditProfile = () => {
    setActiveTab("settings");
  };

  const handleNotificationClick = () => {
    setShowNotificationDropdown(!showNotificationDropdown);
  };

  const handleMarkAllAsRead = () => {
    // In a real app, this would call an API. 
    // For now we'll just close and assume the parent might handle it if we passed a callback.
    // But we can at least reflect it in UI if we had local state.
    // Since it's a dashboard, we'll keep it simple.
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setShowProfileDropdown(false);
      }
      if (
        notificationDropdownRef.current &&
        !notificationDropdownRef.current.contains(event.target)
      ) {
        setShowNotificationDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50 border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Profile Dropdown */}
          <div className="flex items-center">
            <div className="relative" ref={profileDropdownRef}>
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="cursor-pointer flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <img
                  src={profile.profileImage}
                  alt={profile.name}
                  className="w-9 h-9 rounded-full border-2 border-white shadow-sm object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://images.unsplash.com/photo-1582750433449-648ed127bb54?crop=faces&fit=crop&w=200&h=200";
                  }}
                />
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-800">
                    {profile.name}
                  </p>
                  <p className="text-xs text-gray-600">Teacher</p>
                </div>
              </button>

              {showProfileDropdown && (
                <div className="absolute left-0 mt-2 w-44 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="py-2">
                    <button
                      onClick={handleEditProfile}
                      className="flex items-center cursor-pointer w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <FaUserCircle className="mr-3 text-gray-400" />
                      My Profile
                    </button>
                    <button className="flex items-center cursor-pointer w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <FaCog className="mr-3 text-gray-400" />
                      Settings
                    </button>
                    <div className="border-t border-gray-200"></div>
                    <button
                      onClick={() => {
                        handleLogout();
                        setShowProfileDropdown(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <FaSignOutAlt className="mr-3" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Notifications */}
          <div className="relative" ref={notificationDropdownRef}>
            <button
              onClick={handleNotificationClick}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative"
            >
              <FaBell className="text-gray-600 text-xl" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotificationDropdown && (
              <div className="fixed  inset-0 z-50">
                {/* Overlay */}
                <div
                  className="fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity"
                  onClick={() => setShowNotificationDropdown(false)}
                />

                {/* Notification Panel */}
                <div className="fixed shadow-2xl inset-y-0 right-0 flex max-w-full">
                  <div className="relative w-screen max-w-md">
                    <div className="h-full flex flex-col bg-white shadow-xl">
                      {/* Header */}
                      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">Notifications</h3>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {unreadCount} unread messages
                          </p>
                        </div>
                        <button
                          onClick={() => setShowNotificationDropdown(false)}
                          className="p-2 rounded-full hover:bg-gray-200 text-gray-500 transition-colors"
                        >
                          <FaTimes />
                        </button>
                      </div>

                      {/* Notification List */}
                      <div className="flex-1 overflow-y-auto">
                        {formattedNotifications.length === 0 ? (
                          <div className="flex flex-col items-center justify-center h-64 text-center px-10">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                              <FaBell className="text-gray-300 text-2xl" />
                            </div>
                            <h4 className="text-gray-900 font-medium">All caught up!</h4>
                            <p className="text-gray-500 text-sm mt-1">
                              You don't have any notifications at the moment.
                            </p>
                          </div>
                        ) : (
                          <div className="divide-y divide-gray-100">
                            {formattedNotifications.map((notification) => (
                              <div
                                key={notification.id}
                                className={`p-5 hover:bg-gray-50 cursor-pointer transition-colors relative ${!notification.read ? "bg-blue-50/50" : ""}`}
                              >
                                <div className="flex items-start">
                                  <div className="flex-shrink-0 mt-1">
                                    <div className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center shadow-sm">
                                      {notification.icon}
                                    </div>
                                  </div>
                                  <div className="ml-4 flex-1">
                                    <div className="flex justify-between items-start">
                                      <p className={`text-sm font-semibold ${!notification.read ? "text-gray-900" : "text-gray-700"}`}>
                                        {notification.title}
                                      </p>
                                      <span className="text-[10px] text-gray-400 font-medium uppercase shrink-0 ml-2">
                                        {notification.time}
                                      </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                                      {notification.message}
                                    </p>
                                    {!notification.read && (
                                      <div className="mt-2 flex items-center">
                                        <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                                        <span className="text-[11px] font-bold text-primary uppercase tracking-wider">New</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Footer */}
                      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                        <button
                          onClick={() => {
                            setShowNotificationDropdown(false);
                            setActiveTab("messages");
                          }}
                          className="w-full py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all text-center"
                        >
                          View All Notifications
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;

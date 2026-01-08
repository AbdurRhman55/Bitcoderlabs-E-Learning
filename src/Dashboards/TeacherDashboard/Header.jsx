// src/components/DashboardHeader.jsx
import React, { useState, useEffect, useRef } from "react";
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
} from "react-icons/fa";
import { useDispatch } from "react-redux";
import { logoutAsync } from "../../../slices/AuthSlice";

const DashboardHeader = ({ profile, notifications, setActiveTab }) => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotificationDropdown, setShowNotificationDropdown] =
    useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(notifications);
  const profileDropdownRef = useRef(null);
  const notificationDropdownRef = useRef(null);
  const dispatch = useDispatch();

  // Mock notification data
  const [notificationList, setNotificationList] = useState([
    {
      id: 1,
      title: "New Student Enrollment",
      message: 'John Doe enrolled in your "React Masterclass" course',
      time: "10 minutes ago",
      type: "enrollment",
      read: false,
      icon: <FaGraduationCap className="text-green-500" />,
    },
    {
      id: 2,
      title: "Assignment Submitted",
      message: 'Sarah Smith submitted assignment for "Advanced JavaScript"',
      time: "1 hour ago",
      type: "assignment",
      read: false,
      icon: <FaCheckCircle className="text-blue-500" />,
    },
    {
      id: 3,
      title: "Course Review",
      message: 'Your "Web Development Bootcamp" course has been approved',
      time: "2 hours ago",
      type: "course",
      read: true,
      icon: <FaCheckCircle className="text-purple-500" />,
    },
    {
      id: 4,
      title: "Payment Received",
      message: "You received $249.99 for course sales",
      time: "1 day ago",
      type: "payment",
      read: false,
      icon: <FaEnvelope className="text-yellow-500" />,
    },
    {
      id: 5,
      title: "System Maintenance",
      message: "Scheduled maintenance on Saturday, 10 PM - 2 AM",
      time: "2 days ago",
      type: "system",
      read: true,
      icon: <FaExclamationTriangle className="text-orange-500" />,
    },
  ]);

  const handleLogout = () => {
    dispatch(logoutAsync());
  };

  const handleEditProfile = () => {
    setActiveTab("settings");
  };

  const handleNotificationClick = () => {
    setShowNotificationDropdown(!showNotificationDropdown);
    if (!showNotificationDropdown) {
      // Mark all as read when opening
      const updatedNotifications = notificationList.map((notif) => ({
        ...notif,
        read: true,
      }));
      setNotificationList(updatedNotifications);
      setUnreadNotifications(0);
    }
  };

  const handleMarkAllAsRead = () => {
    const updatedNotifications = notificationList.map((notif) => ({
      ...notif,
      read: true,
    }));
    setNotificationList(updatedNotifications);
    setUnreadNotifications(0);
  };

  const handleDeleteNotification = (id, e) => {
    e.stopPropagation();
    const updatedNotifications = notificationList.filter(
      (notif) => notif.id !== id
    );
    setNotificationList(updatedNotifications);

    // Update unread count
    const unreadCount = updatedNotifications.filter(
      (notif) => !notif.read
    ).length;
    setUnreadNotifications(unreadCount);
  };

  const handleNotificationItemClick = (id) => {
    const updatedNotifications = notificationList.map((notif) =>
      notif.id === id ? { ...notif, read: true } : notif
    );
    setNotificationList(updatedNotifications);

    const unreadCount = updatedNotifications.filter(
      (notif) => !notif.read
    ).length;
    setUnreadNotifications(unreadCount);
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

  // Calculate unread notifications
  useEffect(() => {
    const unreadCount = notificationList.filter((notif) => !notif.read).length;
    setUnreadNotifications(unreadCount);
  }, [notificationList]);

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
                  className="w-9 h-9 rounded-full border-2 border-white shadow-sm"
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
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadNotifications}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotificationDropdown && (
              <div className="fixed  inset-0 z-50">
                {/* Overlay */}
                <div
                  className="fixed inset-0 bg-opacity-30 backdrop-blur-sm transition-opacity"
                  onClick={() => setShowNotificationDropdown(false)}
                />

                {/* Notification Panel */}
                <div className="fixed shadow-lg inset-y-0 right-0 flex max-w-full">
                  <div className="relative w-screen max-w-md">
                    <div className="h-full flex flex-col bg-white shadow-xl transition-transform transform translate-x-0">
                      {/* Header */}
                      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium text-gray-900">
                            Notifications
                          </h3>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={handleMarkAllAsRead}
                              className="text-sm text-primary hover:text-primary-dark"
                            >
                              Mark all as read
                            </button>
                            <button
                              onClick={() => setShowNotificationDropdown(false)}
                              className="p-1 rounded-full hover:bg-gray-200"
                            >
                              <FaTimes className="text-gray-500" />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {unreadNotifications > 0
                            ? `${unreadNotifications} unread notifications`
                            : "All notifications read"}
                        </p>
                      </div>

                      {/* Notification List */}
                      <div className="flex-1 overflow-y-auto">
                        {notificationList.length === 0 ? (
                          <div className="text-center py-12">
                            <FaBell className="mx-auto text-gray-400 text-4xl mb-3" />
                            <p className="text-gray-500">
                              No notifications yet
                            </p>
                          </div>
                        ) : (
                          <div className="divide-y divide-gray-200">
                            {notificationList.map((notification) => (
                              <div
                                key={notification.id}
                                onClick={() =>
                                  handleNotificationItemClick(notification.id)
                                }
                                className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                                  !notification.read ? "bg-blue-50" : ""
                                }`}
                              >
                                <div className="flex items-start">
                                  <div className="flex-shrink-0 pt-1">
                                    {notification.icon}
                                  </div>
                                  <div className="ml-3 flex-1">
                                    <div className="flex justify-between">
                                      <p className="text-sm font-medium text-gray-900">
                                        {notification.title}
                                      </p>
                                      <button
                                        onClick={(e) =>
                                          handleDeleteNotification(
                                            notification.id,
                                            e
                                          )
                                        }
                                        className="text-gray-400 hover:text-red-500 ml-2"
                                      >
                                        <FaTimes className="w-3 h-3" />
                                      </button>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">
                                      {notification.message}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-2">
                                      {notification.time}
                                    </p>
                                  </div>
                                  {!notification.read && (
                                    <div className="ml-2">
                                      <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Footer */}
                      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                        <div className="flex justify-center">
                          <button
                            onClick={() => setShowNotificationDropdown(false)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                          >
                            Close
                          </button>
                        </div>
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

// src/Dashboards/TeacherDashboard/Header.jsx
import React, { useState, useEffect, useRef, useMemo } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
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
  FaBars,
} from "react-icons/fa";
import { useDispatch } from "react-redux";
import { logoutAsync } from "../../../slices/AuthSlice";

const DashboardHeader = ({ profile, notifications = [], setActiveTab, setSidebarOpen }) => {
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
    <header className="bg-white/80 backdrop-blur-md shadow-sm border-b sticky top-0 z-50 border-gray-100 transition-all duration-300">
      <div className="px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Left: Mobile Menu + Profile */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2.5 rounded-xl bg-gray-50 text-gray-500 hover:bg-primary-light hover:text-primary transition-all duration-300 cursor-pointer shadow-sm active:scale-90"
            >
              <FaBars size={18} />
            </button>

            <div className="relative" ref={profileDropdownRef}>
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="cursor-pointer flex items-center gap-3 p-1.5 pr-4 rounded-2xl hover:bg-gray-50 transition-all duration-300 active:scale-95 group"
              >
                <div className="relative">
                  <img
                    src={profile.profileImage}
                    alt={profile.name}
                    className="w-9 h-9 lg:w-11 lg:h-11 rounded-xl border-2 border-white shadow-md object-cover ring-2 ring-primary/5"
                  />
                  <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full transition-transform group-hover:scale-110"></div>
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-extrabold text-gray-900 leading-tight">
                    {profile.name}
                  </p>
                  <p className="text-[10px] text-primary font-bold uppercase tracking-widest">Premium Instructor</p>
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
              className="p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors relative"
            >
              <FaBell className="text-gray-600 text-xl" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {/* Notification Dropdown - Portaled to Body for correct stacking context */}
            {createPortal(
              <AnimatePresence>
                {showNotificationDropdown && (
                  <div className="fixed inset-0 z-[9999] overflow-hidden">
                    {/* Overlay */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity"
                      onClick={() => setShowNotificationDropdown(false)}
                    />

                    {/* Notification Panel */}
                    <div className="fixed inset-y-0 right-0 flex max-w-full pointer-events-none">
                      <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        className="pointer-events-auto w-screen max-w-md"
                      >
                        <div className="h-full flex flex-col bg-white shadow-2xl overflow-hidden border-l border-gray-100">
                          {/* Header */}
                          <div className="px-6 py-5 border-b border-gray-100 bg-white flex items-center justify-between sticky top-0 z-10">
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 tracking-tight">Notifications</h3>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                                <p className="text-xs text-primary font-bold uppercase tracking-wider">
                                  {unreadCount} UNREAD MESSAGES
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => setShowNotificationDropdown(false)}
                              className="p-2.5 rounded-xl hover:bg-gray-50 text-gray-400 hover:text-gray-900 transition-all active:scale-95 border border-transparent hover:border-gray-100"
                            >
                              <FaTimes size={18} />
                            </button>
                          </div>

                          {/* Notification List */}
                          <div className="flex-1 overflow-y-auto bg-white">
                            {formattedNotifications.length === 0 ? (
                              <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-10">
                                <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mb-6 shadow-inner ring-1 ring-gray-100">
                                  <FaBell className="text-gray-200 text-3xl" />
                                </div>
                                <h4 className="text-gray-900 font-bold text-lg">All caught up!</h4>
                                <p className="text-gray-500 text-sm mt-2 max-w-[200px] leading-relaxed">
                                  You've read all your notifications. We'll let you know when something new arrives.
                                </p>
                              </div>
                            ) : (
                              <div className="divide-y divide-gray-50">
                                {formattedNotifications.map((notification) => (
                                  <div
                                    key={notification.id}
                                    className={`group p-5 hover:bg-gray-50/80 cursor-pointer transition-all relative ${!notification.read ? "bg-primary/[0.02]" : ""}`}
                                  >
                                    <div className="flex items-start">
                                      <div className="flex-shrink-0 mt-0.5">
                                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-sm ring-1 ring-black/5 transition-transform group-hover:scale-105 ${!notification.read ? "bg-white" : "bg-gray-50"}`}>
                                          {notification.icon}
                                        </div>
                                      </div>
                                      <div className="ml-4 flex-1">
                                        <div className="flex justify-between items-start gap-2">
                                          <p className={`text-sm tracking-tight ${!notification.read ? "font-bold text-gray-900" : "font-semibold text-gray-700"}`}>
                                            {notification.title}
                                          </p>
                                          <span className="text-[10px] text-gray-400 font-bold uppercase whitespace-nowrap bg-gray-100/50 px-2 py-0.5 rounded-full">
                                            {notification.time}
                                          </span>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1.5 leading-relaxed font-medium">
                                          {notification.message}
                                        </p>
                                        {!notification.read && (
                                          <div className="mt-3 flex items-center">
                                            <span className="text-[10px] font-black text-primary uppercase tracking-[0.1em] px-2 py-0.5 bg-primary/10 rounded-md">New</span>
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
                          <div className="px-6 py-5 border-t border-gray-100 bg-white sticky bottom-0">
                            <button
                              onClick={() => {
                                setShowNotificationDropdown(false);
                                setActiveTab("messages");
                              }}
                              className="w-full flex items-center justify-center gap-2 py-3.5 bg-gray-900 hover:bg-black text-white rounded-xl text-sm font-bold transition-all shadow-lg active:scale-[0.98]"
                            >
                              <span>View All Notifications</span>
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                )}
              </AnimatePresence>,
              document.body
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;

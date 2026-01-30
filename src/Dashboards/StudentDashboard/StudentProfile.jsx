// components/UserDashboard.jsx
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import DashboardOverview from "./DashboardOverview";
import MyCourses from "./Mycourses";
import Progress from "./Progress";
import Settings from "./Settings";
import Certificates from "./Certificates";
import { fetchMyCourses, selectMyCourses } from "../../../slices/courseSlice";
import { apiClient, API_ORIGIN } from "../../api/index";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaBell,
  FaTimes,
  FaCheckCircle,
  FaGraduationCap,
  FaEnvelope,
  FaBook,
} from "react-icons/fa";

const UserDashboard = () => {
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, user } = useSelector((state) => state.auth);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !loading) {
      navigate("/login");
    }
  }, [isAuthenticated, loading, navigate]);

  const enrolledCoursesList = useSelector(selectMyCourses);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchMyCourses());
    }
  }, [dispatch, user?.id]);

  const completedCount = enrolledCoursesList.filter(
    (c) => c.status === "completed" || c.progress === 100,
  ).length;
  const totalEnrolled = enrolledCoursesList.length;
  const avgProgress =
    totalEnrolled > 0
      ? Math.round(
        enrolledCoursesList.reduce(
          (acc, curr) => acc + (curr.progress || 0),
          0,
        ) / totalEnrolled,
      )
      : 0;

  const userData = {
    id: user?.id || 1,
    name: user?.name || "Student",
    email: user?.email || "student@example.com",
    avatar: user?.avatar || null,
    joinDate: user?.created_at
      ? new Date(user.created_at).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
      : "March 2024",
    title: user?.role === "student" ? "Student" : user?.role || "Learner",
    bio:
      user?.bio ||
      "Passionate about building digital experiences that make a difference.",
    level:
      avgProgress > 70
        ? "Advanced"
        : avgProgress > 30
          ? "Intermediate"
          : "Beginner",
    points: user?.points || completedCount * 100,
    streak: user?.streak || 0,
    completedCourses: completedCount,
    enrolledCourses: totalEnrolled,
    completionRate: avgProgress,
    weeklyGoal: user?.weekly_goal || 10,
    weeklyCompleted: user?.weekly_completed || Math.floor(avgProgress / 10),
    daysLeft: 7 - new Date().getDay() || 7,
    learningHours:
      user?.learning_hours ||
      Math.round(totalEnrolled * avgProgress * 0.4) ||
      0,
  };

  // Notifications state for slide-in panel
  const [notifications, setNotifications] = useState([]);
  const [showNotificationsPanel, setShowNotificationsPanel] = useState(false);

  const fetchNotifications = async () => {
    try {
      const res = await apiClient.getNotifications({});
      const data = Array.isArray(res) ? res : res?.data || [];
      setNotifications(data);
    } catch (err) {
      console.warn("Failed to fetch notifications:", err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) fetchNotifications();
  }, [isAuthenticated]);

  // Resolve avatar to absolute URL and provide fallback
  const resolveAvatar = (avatar) => {
    if (!avatar) return null;
    const s = String(avatar).trim();
    if (s.startsWith("http") || s.startsWith("data")) return s;
    const clean = s.replace(/^\//, "");
    if (clean.startsWith("storage/")) return `${API_ORIGIN}/${clean}`;
    return `${API_ORIGIN}/storage/${clean}`;
  };

  const renderMainContent = () => {
    switch (activeSection) {
      case "overview":
        return (
          <DashboardOverview
            userData={userData}
            setActiveSection={setActiveSection}
          />
        );
      case "courses":
        return <MyCourses />;
      case "progress":
        return <Progress />;

      case "certificates":
        return <Certificates />;
      case "settings":
        return <Settings userData={userData} />;
      default:
        return <DashboardOverview userData={userData} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        userData={userData}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Premium Desktop & Mobile Header */}
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 lg:h-20">
              {/* Left Side: Mobile Menu Button & Welcome Text */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2.5 rounded-xl bg-gray-50 text-gray-500 hover:bg-primary-light hover:text-primary transition-all duration-300 cursor-pointer shadow-sm active:scale-90"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>

                <div className="hidden sm:block">
                  <h1 className="text-lg lg:text-xl text-gray-900">
                    Student Dashboard
                  </h1>
                  <p className="text-xs text-primary  uppercase tracking-widest mt-0.5">
                    Welcome back, {userData.name}!
                  </p>
                </div>
                <div className="sm:hidden">
                  <h1 className="text-base font-bold text-gray-900">
                    Dashboard
                  </h1>
                </div>
              </div>

              {/* Right Side: Notifications (bell) - XP & avatar moved into notifications panel */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <button
                    onClick={() => setShowNotificationsPanel(true)}
                    className="p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors relative"
                    aria-label="Open notifications"
                  >
                    <FaBell className="text-gray-700 text-xl" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>
        {/* Main content area */}
        <main className="flex-1 overflow-auto p-4 lg:p-8">
          {renderMainContent()}
        </main>
        {/* Notifications Slide Panel - portaled */}
        {createPortal(
          <AnimatePresence>
            {showNotificationsPanel && (
              <div className="fixed inset-0 z-[9999]">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="fixed inset-0 bg-black/20 backdrop-blur-sm"
                  onClick={() => setShowNotificationsPanel(false)}
                />

                <div className="fixed inset-y-0 right-0 flex max-w-full pointer-events-none">
                  <motion.div
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ type: "spring", damping: 30, stiffness: 300 }}
                    className="pointer-events-auto w-screen max-w-md"
                  >
                    <div className="h-full flex flex-col bg-white shadow-2xl overflow-hidden border-l border-gray-100">
                      <div className="px-6 py-5 border-b border-gray-100 bg-white flex items-center justify-between sticky top-0 z-10">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0">
                            <div className="w-11 h-11 rounded-lg overflow-hidden border-2 border-white shadow-sm">
                              {userData.avatar ? (
                                <img
                                  src={resolveAvatar(userData.avatar)}
                                  alt={userData.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-primary flex items-center justify-center text-white font-bold">
                                  {userData.name.charAt(0)}
                                </div>
                              )}
                            </div>
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900 tracking-tight">
                              Notifications
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-sm font-bold text-gray-900">
                                {userData.points} XP
                              </span>
                              <p className="text-xs text-primary font-bold uppercase tracking-wider">
                                {notifications.filter((n) => !n.read).length}{" "}
                                UNREAD
                              </p>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => setShowNotificationsPanel(false)}
                          className="p-2.5 rounded-xl hover:bg-gray-50 text-gray-400 hover:text-gray-900 transition-all active:scale-95 border border-transparent hover:border-gray-100"
                        >
                          <FaTimes size={18} />
                        </button>
                      </div>

                      <div className="flex-1 overflow-y-auto bg-white">
                        {notifications.length === 0 ? (
                          <div className="flex flex-col items-center justify-center min-h-[300px] text-center px-10">
                            <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mb-6 shadow-inner ring-1 ring-gray-100">
                              <FaBell className="text-gray-200 text-3xl" />
                            </div>
                            <h4 className="text-gray-900 font-bold text-lg">
                              You're all caught up
                            </h4>
                            <p className="text-gray-500 text-sm mt-2 max-w-[220px] leading-relaxed">
                              Notifications about progress, approvals, and
                              messages will show here.
                            </p>
                          </div>
                        ) : (
                          <div className="divide-y divide-gray-50">
                            {notifications.map((notif) => (
                              <div
                                key={notif.id}
                                className={`group p-5 hover:bg-gray-50/80 cursor-pointer transition-all relative ${!notif.read ? "bg-primary/[0.03]" : ""}`}
                              >
                                <div className="flex items-start">
                                  <div className="flex-shrink-0 mt-0.5">
                                    <div
                                      className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-sm ring-1 ring-black/5 transition-transform group-hover:scale-105 bg-white`}
                                    >
                                      {notif.type?.includes("approval") ? (
                                        <FaCheckCircle className="text-green-500" />
                                      ) : notif.type?.includes("enroll") ? (
                                        <FaGraduationCap className="text-blue-500" />
                                      ) : notif.type?.includes("message") ? (
                                        <FaEnvelope className="text-yellow-500" />
                                      ) : (
                                        <FaBook className="text-gray-500" />
                                      )}
                                    </div>
                                  </div>
                                  <div className="ml-4 flex-1">
                                    <div className="flex justify-between items-start gap-2">
                                      <p
                                        className={`text-sm tracking-tight ${!notif.read ? "font-bold text-gray-900" : "font-semibold text-gray-700"}`}
                                      >
                                        {notif.title || "Notification"}
                                      </p>
                                      <span className="text-[10px] text-gray-400 font-bold uppercase whitespace-nowrap bg-gray-100/50 px-2 py-0.5 rounded-full">
                                        {new Date(
                                          notif.created_at || Date.now(),
                                        ).toLocaleDateString()}
                                      </span>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1.5 leading-relaxed font-medium">
                                      {notif.message ||
                                        notif.data?.message ||
                                        ""}
                                    </p>
                                    {!notif.read && (
                                      <div className="mt-3 flex items-center">
                                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.1em] px-2 py-0.5 bg-primary/10 rounded-md">
                                          New
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="px-6 py-5 border-t border-gray-100 bg-white sticky bottom-0">
                        <button
                          onClick={() => setShowNotificationsPanel(false)}
                          className="w-full flex items-center justify-center gap-2 py-3.5 bg-gray-900 hover:bg-black text-white rounded-xl text-sm font-bold transition-all shadow-lg active:scale-[0.98]"
                        >
                          <span>Close</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            )}
          </AnimatePresence>,
          document.body,
        )}
      </div>
    </div>
  );
};

export default UserDashboard;

import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import StudentTable from "./StudentsTable";
import EnrolledStudentsTable from "./EnrolledStudentsTable.jsx";
import { apiClient } from "../../../src/api/index.js";

import {
  X,
  Menu,
  BookOpen,
  Users,
  ShoppingBag,
  BarChart3,
  TrendingUp,
  Download,
  UserPlus,
  Bell,
  Mail,
  Search,
  ChevronDown,
  Clock,
  UserCheck,
  AlertCircle,
  CheckCircle,
  MoreVertical,
  LogOut,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { logoutAsync } from "../../../slices/AuthSlice";
import AllCourses from "./AllCourses";
import TeachersTable from "./TeacherTable.jsx";
import CourseRequests from "./CourseRequests";
import CourseCategories from "./CourseCategories";
import Contacts from "./Contacts";
import Orders from "./Orders";

const Card = ({ children, className = "", hover = false }) => (
  <div
    className={`bg-white rounded-2xl p-2 sm:p-4 shadow-sm border border-gray-100 transition-all duration-300
      ${hover ? "hover:shadow-lg hover:border-blue-100" : ""} ${className}`}
  >
    {children}
  </div>
);

// Helper to getting full image URL
const getImageUrl = (path) => {
  if (!path) return null;
  // console.log("Processing image path:", path);
  if (path.startsWith("http")) return path;
  const cleanPath = path.replace(/^\/+/, "").replace(/^public\//, "");
  return `http://127.0.0.1:8000/storage/${cleanPath}`;
};

// Image component with robust fallback
const NotificationImage = ({ notif }) => {
  const [imgError, setImgError] = React.useState(false);

  if (notif.image && !imgError) {
    return (
      <img
        src={getImageUrl(notif.image)}
        alt=""
        className="w-full h-full object-cover"
        onError={(e) => {
          // console.warn("Image failed to load, falling back to icon:", notif.image);
          setImgError(true);
        }}
      />
    );
  }

  // Fallback Icon
  return (
    <div
      className={`w-full h-full flex items-center justify-center ${
        notif.type === "teacher"
          ? "bg-primary/10 text-primary"
          : "bg-primary/10 text-primary"
      }`}
    >
      {notif.type === "teacher" ? (
        <UserPlus size={18} />
      ) : (
        <BookOpen size={18} />
      )}
    </div>
  );
};

function NotificationSidebar({
  isOpen,
  onClose,
  notifications = [],
  onNotificationClick,
}) {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-[1px] z-40"
        onClick={onClose}
      />
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Bell className="text-gray-700" size={20} />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white" />
                )}
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Notifications
                </h2>
                <p className="text-xs text-gray-500">
                  {notifications.length} unread updates
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 cursor-pointer rounded-full transition-colors text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50">
            {notifications.length > 0 ? (
              notifications.map((notif, index) => (
                <div
                  key={`${notif.type}-${notif.id}-${index}`}
                  onClick={() => onNotificationClick(notif)}
                  className="group bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all cursor-pointer relative overflow-hidden"
                >
                  <div
                    className={`absolute left-0 top-0 bottom-0 w-1 ${notif.type === "teacher" ? "bg-primary" : "bg-primary"}`}
                  />
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full flex-shrink-0 overflow-hidden border border-gray-100">
                      <NotificationImage notif={notif} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-semibold text-gray-900 text-sm truncate pr-2">
                          {notif.title}
                        </h3>
                        <span className="text-[10px] text-gray-400 whitespace-nowrap bg-gray-50 px-1.5 py-0.5 rounded">
                          {new Date(notif.time).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                        {notif.message}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <span
                          className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                            notif.type === "teacher"
                              ? "bg-primary/10 text-primary"
                              : "bg-primary/10 text-primary"
                          }`}
                        >
                          {notif.type === "teacher"
                            ? "Instructor Request"
                            : "Course Request"}
                        </span>
                        <span className="text-[10px] text-gray-400 flex items-center gap-1">
                          <Clock size={10} />
                          Pending
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                  <Bell size={24} />
                </div>
                <h3 className="text-gray-900 font-medium mb-1">
                  No new notifications
                </h3>
                <p className="text-gray-500 text-sm px-6">
                  You're all caught up! Check back later for new requests.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function DashboardCards() {
  const [stats, setStats] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await apiClient.getAdminStats();

        // Transform stats data for display
        const transformedStats = [
          {
            title: "Total Courses",
            value: response.total_courses?.toString() || "0",
            change: "+12%",
            icon: <BookOpen />,
          },
          {
            title: "Active Students",
            value: response.total_students?.toString() || "0",
            change: "+8%",
            icon: <Users />,
          },
          {
            title: "Total Enrollments",
            value: response.total_enrollments?.toString() || "0",
            change: "+23%",
            icon: <ShoppingBag />,
          },
          {
            title: "Pending Instructors",
            value: response.pending_instructors_count?.toString() || "0",
            change: "0",
            icon: <UserPlus />,
          },
          {
            title: "Pending Students",
            value: response.pending_requests_count?.toString() || "0",
            change: "+5%",
            icon: <Clock />,
          },
        ];

        // Transform recent activities
        const transformedActivities =
          response.recent_activities?.map((activity) => ({
            user: activity.user?.name || "Unknown User",
            action: "enrolled in",
            course: activity.course?.title || "Unknown Course",
            time: activity.created_at
              ? new Date(activity.created_at).toLocaleString()
              : "Recently",
          })) || [];

        setStats(transformedStats);
        setRecentActivities(transformedActivities);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        console.error("Error details:", err.message);
        setError(`Failed to load dashboard data: ${err.message}`);
        // Fallback to mock data if API fails
        setStats([
          {
            title: "Total Courses",
            value: "82",
            change: "+12%",
            icon: <BookOpen />,
          },
          {
            title: "Active Students",
            value: "1,240",
            change: "+8%",
            icon: <Users />,
          },
          {
            title: "Total Orders",
            value: "350",
            change: "+23%",
            icon: <ShoppingBag />,
          },
          {
            title: "Course Rating",
            value: "4.8/5",
            change: "+0.2",
            icon: <TrendingUp />,
          },
        ]);
        setRecentActivities([
          {
            user: "John Doe",
            action: "purchased",
            course: "Web Dev Bootcamp",
            time: "2 min ago",
          },
          {
            user: "Sarah Smith",
            action: "completed",
            course: "React Mastery",
            time: "1 hour ago",
          },
          {
            user: "Mike Johnson",
            action: "enrolled in",
            course: "JS Advanced",
            time: "3 hours ago",
          },
          {
            user: "Emily Davis",
            action: "rated",
            course: "React Mastery",
            time: "5 hours ago",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <Card key={index}>
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} hover>
            <div className=" flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm">{stat.title}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
                <p className="text-primary-dark text-sm mt-2 font-medium">
                  {stat.change}
                </p>
              </div>
              <div className="p-2 bg-primary rounded-xl text-white">
                {stat.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts & Recent Activities */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg text-gray-900">
              Revenue Overview
            </h3>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark cursor-pointer transition-colors">
              <Download size={16} />
              Export
            </button>
          </div>
          <div className="h-64 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl flex flex-col items-center justify-center">
            <BarChart3 size={48} className="text-primary-dark mb-3" />
            <p className="text-gray-600">Revenue chart visualization</p>
            <h2 className="text-2xl font-bold mt-2 text-gray-900">$24,580</h2>
            <p className="text-primary-dark text-sm font-medium mt-1">
              +18% from last month
            </p>
          </div>
        </Card>

        <Card>
          <h3 className="font-bold text-lg text-gray-900 mb-4">
            Recent Activities
          </h3>

          <div className="space-y-4">
            {recentActivities.length > 0 ? (
              recentActivities.slice(0, 3).map((act, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="w-10 h-10 bg-primary-dark rounded-full flex items-center justify-center text-white flex-shrink-0">
                    <UserPlus size={18} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm text-gray-800">
                      <span className="font-medium">{act.user}</span>{" "}
                      {act.action}{" "}
                      <span className="font-semibold text-gray-900">
                        {act.course}
                      </span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{act.time}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">
                No recent activities
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function DashboardView() {
  const [open, setOpen] = useState(true);
  const [active, setActive] = useState("Dashboard");
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logoutAsync());
  };

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      navigate("/login");
    }
  }, [isAuthenticated, loading, navigate]);

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // 1. Fetch Instructor Requests
        const instRes = await apiClient.getInstructors({
          approval_status: "submitted",
        });
        const instData = instRes.data || [];

        const instNotifs = instData.map((i) => ({
          id: i.id,
          type: "teacher",
          title: i.name,
          image: i.image || i.profile_image || i.avatar,
          message: `Specialization: ${Array.isArray(i.specialization) ? i.specialization.join(", ") : i.specialization || "General"}`,
          time: i.created_at || new Date().toISOString(),
          targetTab: "Teachers",
        }));

        // 2. Fetch Course Requests
        const courseRes = await apiClient.getCourseRequests({
          status: "pending",
        });
        const courseData = Array.isArray(courseRes?.data)
          ? courseRes.data
          : Array.isArray(courseRes?.data?.data)
            ? courseRes.data.data
            : [];
        const courseNotifs = courseData.map((c) => {
          const courseTitle =
            c.course?.title || c.title || c.course_title || "Untitled Course";

          return {
            id: c.id,
            type: "course",
            title:
              c.instructor?.name ||
              c.instructor?.user?.name ||
              "Unknown Instructor",
            image: c.instructor?.image || c.instructor?.user?.image,
            message: `Requesting approval for course: "${courseTitle}"`,
            time: c.created_at || new Date().toISOString(),
            targetTab: "Course Requests",
          };
        });

        const allNotifs = [...instNotifs, ...courseNotifs].sort(
          (a, b) => new Date(b.time) - new Date(a.time),
        );
        setNotifications(allNotifs);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    if (isAuthenticated) {
      fetchNotifications();
      // Optional: Poll every 30s
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const handleNotificationClick = (notification) => {
    setActive(notification.targetTab);
    setNotificationOpen(false);
  };

  const handleReject = async (id) => {
    try {
      await apiClient.rejectInstructor(id);
      setPendingRequests((prev) => prev.filter((request) => request.id !== id));
    } catch (error) {
      console.error("Error rejecting instructor:", error);
      alert("Failed to reject instructor.");
    }
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar
        open={open}
        setOpen={setOpen}
        active={active}
        setActive={setActive}
      />

      <main
        className={`flex-1 p-4 sm:p-6 ml-20 lg:ml-0 transition-all duration-500`}
      >
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {active}
          </h1>

          <div className="hidden sm:flex items-center gap-4">
            <button
              className="relative p-2 bg-white rounded-lg cursor-pointer shadow-sm border border-gray-300 hover:bg-gray-50 transition-colors"
              onClick={() => setNotificationOpen(true)}
            >
              <Bell size={18} className="text-gray-700" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-[10px] text-white font-medium">
                    {notifications.length}
                  </span>
                </span>
              )}
            </button>

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setProfileDropdown(!profileDropdown)}
                className="flex items-center gap-3 pl-1 p-2 cursor-pointer rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <img
                    src="https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff"
                    className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                    alt="Admin"
                  />
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-gray-900">Admin</p>
                    <p className="text-xs text-gray-500">Super Admin</p>
                  </div>
                </div>
                <ChevronDown size={16} className="text-gray-500" />
              </button>

              {profileDropdown && (
                <div className="absolute right-0 top-full mt-2 w-36 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className=" ">
                    <button
                      onClick={() => {
                        handleLogout();
                        setProfileDropdown(false);
                      }}
                      className="flex items-center w-full rounded-lg px-4 py-2 w-full text-sm text-primary hover:bg-red-500 hover:text-white cursor-pointer"
                    >
                      <LogOut className="mr-3" size={16} />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="sm:hidden p-2 bg-white shadow-sm rounded-lg border border-gray-300"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Content Area */}
        <div className="space-y-6">
          {active === "Dashboard" && <DashboardCards />}
          {active === "Courses" && <AllCourses />}
          {active === "Course Categories" && <CourseCategories />}
          {active === "Course Requests" && <CourseRequests />}
          {active === "Students" && <StudentTable />}
          {active === "Teachers" && <TeachersTable />}
          {active === "Enrolled Students" && <EnrolledStudentsTable />}
          {active === "Contacts" && <Contacts />}
          {active === "Orders" && <Orders />}
          {/* {active === "Pending Approvals" && <PendingApprovals />} */}
        </div>
      </main>

      {/* Notification Sidebar */}
      <NotificationSidebar
        isOpen={notificationOpen}
        onClose={() => setNotificationOpen(false)}
        notifications={notifications}
        onNotificationClick={handleNotificationClick}
      />
    </div>
  );
}

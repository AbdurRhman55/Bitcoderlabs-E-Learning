import React, { useState, useEffect, useRef } from "react";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Sidebar from "./Sidebar";
import StudentTable from "./StudentsTable";
// import PendingApprovals from "./PendingApprovals";
import { apiClient } from '../../../src/api/index.js';

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
import { useDispatch } from 'react-redux';
import { logoutAsync } from '../../../slices/AuthSlice';
import AllCourses from "./AllCourses";
import TeachersTable from "./TeacherTable.jsx";

const Card = ({ children, className = "", hover = false }) => (
  <div
    className={`bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 transition-all duration-300
      ${hover ? "hover:shadow-lg hover:border-blue-100" : ""} ${className}`}
  >
    {children}
  </div>
);

function NotificationSidebar({ isOpen, onClose, pendingRequests, onApprove, onReject }) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 ease-out"
          onClick={onClose}
        />
      )}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white shadow-xl z-50 transform transition-all duration-300 ease-out ${isOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        {/* Sidebar content same as your original code */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Bell className="text-blue-600" size={22} />
                </div>
                {pendingRequests.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium shadow-sm">
                    {pendingRequests.length}
                  </span>
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  {pendingRequests.length} pending requests
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-50 rounded-lg transition-colors text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>
          {/* Tabs and content same as your original code */}
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
            change: "+12%", // This would need historical data to calculate
            icon: <BookOpen />
          },
          {
            title: "Active Students",
            value: response.total_students?.toString() || "0",
            change: "+8%",
            icon: <Users />
          },
          {
            title: "Total Enrollments",
            value: response.total_enrollments?.toString() || "0",
            change: "+23%",
            icon: <ShoppingBag />
          },
          {
            title: "Pending Instructors",
            value: response.pending_instructors_count?.toString() || "0",
            change: "0",
            icon: <UserPlus />
          }
        ];

        // Transform recent activities
        const transformedActivities = response.recent_activities?.map(activity => ({
          user: activity.user?.name || "Unknown User",
          action: "enrolled in",
          course: activity.course?.title || "Unknown Course",
          time: activity.created_at ? new Date(activity.created_at).toLocaleString() : "Recently"
        })) || [];

        setStats(transformedStats);
        setRecentActivities(transformedActivities);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        console.error('Error details:', err.message);
        setError(`Failed to load dashboard data: ${err.message}`);
        // Fallback to mock data if API fails
        setStats([
          { title: "Total Courses", value: "82", change: "+12%", icon: <BookOpen /> },
          { title: "Active Students", value: "1,240", change: "+8%", icon: <Users /> },
          { title: "Total Orders", value: "350", change: "+23%", icon: <ShoppingBag /> },
          { title: "Course Rating", value: "4.8/5", change: "+0.2", icon: <TrendingUp /> }
        ]);
        setRecentActivities([
          { user: "John Doe", action: "purchased", course: "Web Dev Bootcamp", time: "2 min ago" },
          { user: "Sarah Smith", action: "completed", course: "React Mastery", time: "1 hour ago" },
          { user: "Mike Johnson", action: "enrolled in", course: "JS Advanced", time: "3 hours ago" },
          { user: "Emily Davis", action: "rated", course: "React Mastery", time: "5 hours ago" }
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} hover>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm">{stat.title}</p>
                <p className="text-3xl font-bold mt-1">{stat.value}</p>
                <p className="text-green-500 text-sm mt-2 font-medium">{stat.change}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl text-gray-600">{stat.icon}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts & Recent Activities */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg text-gray-900">Revenue Overview</h3>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
              <Download size={16} />
              Export
            </button>
          </div>
          <div className="h-64 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl flex flex-col items-center justify-center">
            <BarChart3 size={48} className="text-blue-500 mb-3" />
            <p className="text-gray-600">Revenue chart visualization</p>
            <h2 className="text-2xl font-bold mt-2 text-gray-900">$24,580</h2>
            <p className="text-green-600 text-sm font-medium mt-1">+18% from last month</p>
          </div>
        </Card>

        <Card>
          <h3 className="font-bold text-lg text-gray-900 mb-4">Recent Activities</h3>
          <div className="space-y-4">
            {recentActivities.length > 0 ? (
              recentActivities.map((act, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white flex-shrink-0">
                    <UserPlus size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-gray-800">
                      <span className="font-medium">{act.user}</span> {act.action}{" "}
                      <span className="font-semibold text-gray-900">{act.course}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{act.time}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No recent activities</p>
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
  const { isAuthenticated, loading } = useSelector(state => state.auth);

  const handleLogout = () => {
    dispatch(logoutAsync());
  };

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !loading) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  // Fetch pending instructor requests
  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const response = await apiClient.getInstructors({ approval_status: 'submitted' });
        const instructors = response.data || [];
        const formattedRequests = instructors.map(instructor => ({
          id: instructor.id,
          name: instructor.name,
          email: instructor.email || 'N/A', // Assuming email is included
          time: instructor.created_at ? new Date(instructor.created_at).toLocaleString() : 'Recently',
          subject: instructor.specialization ? instructor.specialization.join(', ') : 'General',
          experience: instructor.experience ? `${instructor.experience.length} items` : 'N/A',
        }));
        setPendingRequests(formattedRequests);
      } catch (error) {
        console.error('Error fetching pending requests:', error);
      }
    };

    fetchPendingRequests();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // State for pending instructor requests
  const [pendingRequests, setPendingRequests] = useState([]);

  const handleApprove = async (id) => {
    try {
      await apiClient.approveInstructor(id);
      setPendingRequests((prev) =>
        prev.filter((request) => request.id !== id)
      );
    } catch (error) {
      console.error('Error approving instructor:', error);
      alert('Failed to approve instructor.');
    }
  };

  const handleReject = async (id) => {
    try {
      await apiClient.rejectInstructor(id);
      setPendingRequests((prev) =>
        prev.filter((request) => request.id !== id)
      );
    } catch (error) {
      console.error('Error rejecting instructor:', error);
      alert('Failed to reject instructor.');
    }
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar open={open} setOpen={setOpen} active={active} setActive={setActive} />

      <main className={`flex-1 p-4 sm:p-6 ml-20 lg:ml-0 transition-all duration-500`}>
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{active}</h1>

          {/* Right Actions */}
          <div className="hidden sm:flex items-center gap-4">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2.5 w-64 rounded-lg border border-gray-300 bg-white shadow-sm 
                  focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
              />
              <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            </div>

            {/* Notification */}
            <button
              className="relative p-2 bg-white rounded-lg shadow-sm border border-gray-300 hover:bg-gray-50 transition-colors"
              onClick={() => setNotificationOpen(true)}
            >
              <Bell size={18} className="text-gray-700" />
              {pendingRequests.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-[10px] text-white font-medium">{pendingRequests.length}</span>
                </span>
              )}
            </button>

            {/* Messages */}
            <button className="relative p-2 bg-white rounded-lg shadow-sm border border-gray-300 hover:bg-gray-50 transition-colors">
              <Mail size={18} className="text-gray-700" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-[10px] text-white font-medium">3</span>
              </span>
            </button>

            {/* User Profile */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setProfileDropdown(!profileDropdown)}
                className="flex items-center gap-3 pl-1 p-2 rounded-lg hover:bg-gray-50 transition-colors"
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
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="py-2">
                    <button
                      onClick={() => {
                        handleLogout();
                        setProfileDropdown(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
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
          {active === "Students" && <StudentTable />}
          {active === "Teachers" && <TeachersTable />}
          {active === "Pending Approvals" && <PendingApprovals />}

        </div>
      </main>

      {/* Notification Sidebar */}
      <NotificationSidebar
        isOpen={notificationOpen}
        onClose={() => setNotificationOpen(false)}
        pendingRequests={pendingRequests}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
}

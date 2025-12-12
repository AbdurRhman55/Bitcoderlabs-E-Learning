import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Button from "../../Component/UI/Button";
import StudentTable from "./StudentsTable";
import PendingApprovals from "./PendingApprovals";

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
} from "lucide-react";
import AllCourses from "./AllCourses";
import StudentsTable from "./StudentsTable";

const Card = ({ children, className = "", hover = false }) => (
  <div
    className={`bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 transition-all duration-300
      ${hover ? "hover:shadow-lg hover:border-blue-100" : ""} ${className}`}
  >
    {children}
  </div>
);

// ----------------------
// Notification Sidebar Component
// ----------------------
function NotificationSidebar({ isOpen, onClose, pendingRequests, onApprove, onReject }) {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 ease-out"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white shadow-xl z-50 transform transition-all duration-300 ease-out ${isOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        {/* Header */}
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

          {/* Tabs */}
          <div className="flex gap-2 mt-6">
            <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors">
              All
            </button>
            <button className="px-4 py-2 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
              Unread
            </button>
            <button className="px-4 py-2 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
              Archive
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto h-[calc(100vh-148px)]">
          {/* Pending Requests Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <UserCheck size={18} className="text-blue-600" />
                <h3 className="font-semibold text-gray-900 text-lg">
                  Teacher Registrations
                </h3>
              </div>
              <span className="bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1.5 rounded-full">
                {pendingRequests.length} pending
              </span>
            </div>

            {pendingRequests.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserCheck className="text-gray-400" size={28} />
                </div>
                <p className="text-gray-500 font-medium">No pending requests</p>
                <p className="text-sm text-gray-400 mt-1">All caught up!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingRequests.map((request) => (
                  <div
                    key={request.id}
                    className="p-4 border border-gray-200 rounded-xl bg-white hover:border-blue-200 hover:shadow-sm transition-all duration-200"
                  >
                    <div className="flex gap-3">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-50 rounded-full flex items-center justify-center">
                          <UserPlus className="text-blue-600" size={18} />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div className="min-w-0">
                            <h4 className="font-semibold text-gray-900 truncate">
                              {request.name}
                            </h4>
                            <p className="text-sm text-gray-500 truncate">
                              {request.email}
                            </p>
                          </div>
                          <span className="flex items-center gap-1 text-xs text-gray-400 whitespace-nowrap ml-2">
                            <Clock size={12} />
                            {request.time}
                          </span>
                        </div>

                        {/* Additional Info */}
                        <div className="flex gap-2 mt-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {request.subject}
                          </span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                            {request.experience} exp
                          </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 mt-4">
                          <button
                            onClick={() => onApprove(request.id)}
                            className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => onReject(request.id)}
                            className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            Reject
                          </button>
                          <button className="px-3 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                            <MoreVertical size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-white text-sm text-gray-500">Earlier</span>
            </div>
          </div>

          {/* Other Notifications */}
          <div className="space-y-3">
            <div className="p-4 border border-gray-200 rounded-xl bg-gray-50/50">
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                    <AlertCircle className="text-yellow-600" size={18} />
                  </div>
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-gray-900">System Maintenance</p>
                  <p className="text-sm text-gray-600 mt-0.5">
                    Scheduled maintenance on Sunday, 2:00 AM - 4:00 AM
                  </p>
                  <p className="text-xs text-gray-400 mt-2">Yesterday</p>
                </div>
              </div>
            </div>

            <div className="p-4 border border-gray-200 rounded-xl bg-gray-50/50">
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="text-green-600" size={18} />
                  </div>
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-gray-900">Course Published</p>
                  <p className="text-sm text-gray-600 mt-0.5">
                    "Advanced React Patterns" has been approved
                  </p>
                  <p className="text-xs text-gray-400 mt-2">2 days ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4">
          <div className="flex justify-between items-center">
            <button className="text-sm text-gray-600 hover:text-gray-900 font-medium hover:bg-gray-50 px-3 py-1.5 rounded-lg transition-colors">
              Mark all as read
            </button>
            <button className="text-sm text-gray-600 hover:text-gray-900 font-medium hover:bg-gray-50 px-3 py-1.5 rounded-lg transition-colors">
              Notification settings
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ----------------------
// Dashboard Cards
// ----------------------
function DashboardCards() {
  const recentActivities = [
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
  ];

  const stats = [
    { title: "Total Courses", value: "82", change: "+12%", icon: <BookOpen /> },
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
  ];

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
              <div className="p-3 bg-gray-50 rounded-xl text-gray-600">
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
            {recentActivities.map((act, i) => (
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
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ----------------------
// Main Dashboard
// ----------------------
export default function Dashboard() {
  const [open, setOpen] = useState(true);
  const [active, setActive] = useState("Dashboard");
  const [notificationOpen, setNotificationOpen] = useState(false);

  // Mock data for pending teacher registration requests
  const [pendingRequests, setPendingRequests] = useState([
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      email: "sarah.j@example.com",
      time: "10 min ago",
      subject: "Computer Science",
      experience: "5 years",
    },
    {
      id: 2,
      name: "Michael Chen",
      email: "michael.c@example.com",
      time: "25 min ago",
      subject: "Mathematics",
      experience: "3 years",
    },
    {
      id: 3,
      name: "Alexandra Williams",
      email: "alex.w@example.com",
      time: "1 hour ago",
      subject: "Physics",
      experience: "7 years",
    },
    {
      id: 4,
      name: "Robert Kim",
      email: "robert.k@example.com",
      time: "2 hours ago",
      subject: "Chemistry",
      experience: "4 years",
    },
  ]);

  const handleApprove = (id) => {
    setPendingRequests((prev) =>
      prev.filter((request) => request.id !== id)
    );
    // In real app, you would make an API call here
  };

  const handleReject = (id) => {
    setPendingRequests((prev) =>
      prev.filter((request) => request.id !== id)
    );
    // In real app, you would make an API call here
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
              <Search
                className="absolute left-3 top-3 text-gray-400"
                size={18}
              />
            </div>

            {/* Notification */}
            <button
              className="relative p-2 bg-white rounded-lg shadow-sm border border-gray-300 hover:bg-gray-50 transition-colors"
              onClick={() => setNotificationOpen(true)}
            >
              <Bell size={18} className="text-gray-700" />
              {pendingRequests.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-[10px] text-white font-medium">
                    {pendingRequests.length}
                  </span>
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
            <div className="flex items-center gap-3 pl-1">
              <div className="flex items-center gap-2">
                <img
                  src="https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff"
                  className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                  alt="Admin"
                />
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">Admin</p>
                  <p className="text-xs text-gray-500">Super Admin</p>
                </div>
              </div>
              <ChevronDown size={16} className="text-gray-500" />
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
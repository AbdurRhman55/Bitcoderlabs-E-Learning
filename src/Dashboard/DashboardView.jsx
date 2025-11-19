import React, { act, useState } from "react";
import Sidebar from "./Sidebar";
import Button from "../Component/UI/Button";
import UsersTable from "../Dashboard/UsersTable";

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
} from "lucide-react";
import AllCourses from "../Dashboard/AllCourses";

// ----------------------
// Reusable Components
// ----------------------
// const Button = ({ children, className = "", variant = "primary", size = "md", ...props }) => {
//   const baseClasses = "rounded-xl font-medium transition-all duration-300 flex items-center gap-2 shadow-sm";

//   const sizes = {
//     sm: "px-3 py-2 text-sm",
//     md: "px-4 py-2",
//     lg: "px-6 py-3 text-lg",
//   };

//   const variants = {
//     primary: "bg-blue-600 text-white hover:bg-blue-700",
//     secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200",
//     danger: "bg-red-500 text-white hover:bg-red-600",
//   };

//   return (
//     <button {...props} className={`${baseClasses} ${sizes[size]} ${variants[variant]} ${className}`}>
//       {children}
//     </button>
//   );
// };

const Card = ({ children, className = "", hover = false }) => (
  <div
    className={`bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 transition-all duration-300
      ${hover ? "hover:shadow-lg hover:border-blue-100" : ""} ${className}`}
  >
    {children}
  </div>
);

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
                <p className="text-3xl font-bold">{stat.value}</p>
                <p className="text-green-500 text-sm mt-2">{stat.change}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">{stat.icon}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts & Recent Activities */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg">Revenue Overview</h3>
            <div className="flex items-center justify-center pl-3 rounded-lg bg-primary text-white "> 
              <Download size={14} className="" />
              <Button variant="secondary" size="sm" text="Export" className="cursor-pointer" />
            </div>
          </div>
          <div className="h-64 bg-blue-50 rounded-xl flex flex-col items-center justify-center">
            <BarChart3 size={48} className="text-blue-400 mb-3" />
            <p className="text-gray-500">Revenue chart visualization</p>
            <h2 className="text-2xl font-bold mt-2">$24,580</h2>
            <p className="text-green-500 text-sm">+18% from last month</p>
          </div>
        </Card>

        <Card>
          <h3 className="font-bold text-lg mb-4">Recent Activities</h3>
          <div className="space-y-4">
            {recentActivities.map((act, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50"
              >
                <div className="w-10 h-10 bg-primary-dark rounded-full flex items-center justify-center text-white">
                  <UserPlus size={16} />
                </div>
                <div>
                  <p className="text-sm">
                    <strong>{act.user}</strong> {act.action} <b>{act.course}</b>
                  </p>
                  <p className="text-xs text-gray-500">{act.time}</p>
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

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar
        open={open}
        setOpen={setOpen}
        active={active}
        setActive={setActive}
      />

      <main
        className={`flex-1 p-4 sm:p-6 ml-20 lg:ml-0 transition-all duration-500`}
      >
        {/* -------------------------
            TOP RIGHT PROFESSIONAL HEADER
        --------------------------- */}
        <div className="flex justify-between items-center mb-6">
          {/* Page Title */}
          <h1 className="text-2xl sm:text-3xl font-bold">{active}</h1>

          {/* Right Icons */}
          <div className="hidden sm:flex items-center gap-5">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 w-64 rounded-xl border border-gray-200 bg-white shadow-sm 
                  focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
              <Search
                className="absolute left-3 top-2.5 text-gray-400"
                size={18}
              />
            </div>

            {/* Notification */}
            <button className="relative p-2 bg-white rounded-full shadow cursor-pointer hover:bg-gray-100 transition">
              <Bell size={18} className="text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Messages */}
            <button className="relative p-2 bg-white rounded-full cursor-pointer shadow hover:bg-gray-100 transition">
              <Mail size={18} className="text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary-dark rounded-full"></span>
            </button>

            {/* User Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-2 bg-white px-3 py-1 rounded-lg border-primary-dark border shadow hover:bg-gray-50">
                <img
                  src="https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff"
                  className="w-7 h-7 rounded-full"
                />
                <span className="font-medium text-gray-700">Admin</span>
                <ChevronDown size={16} className="text-gray-500" />
              </button>

              <div className="absolute right-0 mt-2 bg-white w-34 border border-primary-dark space-y-2 py-2 place-items-center shadow-lg rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <Button text="Profile" size="sm" />
                <Button text="Settings" size="sm" />
                <Button text="Logout" size="sm"/>
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="sm:hidden p-2 bg-white shadow rounded-full"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Pages */}
        {active === "Dashboard" && <DashboardCards />}
        {active === "Courses" && <AllCourses />}
        {active === "Users" && <UsersTable />}

      </main>
    </div>
  );
}

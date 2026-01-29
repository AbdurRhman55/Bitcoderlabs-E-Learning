// src/Dashboards/StudentDashboard/Sidebar.jsx
import React from "react";
import {
  FaHome,
  FaBook,
  FaChartLine,
  FaFileAlt,
  FaCog,
  FaSignOutAlt,
  FaTimes,
  FaGraduationCap,
  FaClock,
  FaTrophy
} from "react-icons/fa";
import { useDispatch } from 'react-redux';
import { logoutAsync } from '../../../slices/AuthSlice';

const Sidebar = ({
  activeSection,
  setActiveSection,
  sidebarOpen,
  setSidebarOpen,
  userData,
}) => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutAsync());
  };

  const menuItems = [
    { id: "overview", label: "Overview", icon: <FaHome /> },
    { id: "courses", label: "My Courses", icon: <FaBook />, badge: userData.enrolledCourses },
    { id: "progress", label: "Progress", icon: <FaChartLine /> },
    { id: "certificates", label: "Certificates", icon: <FaFileAlt />, badge: userData.completedCourses },
    { id: "settings", label: "Settings", icon: <FaCog /> },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-[70] w-72 bg-primary-dark shadow-2xl transform transition-transform duration-300 ease-in-out 
        lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen lg:z-0 lg:block 
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="h-full flex flex-col border-r border-white/5 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">

          {/* Mobile Header (Close Button) */}
          <div className="lg:hidden flex justify-end p-4">
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-xl bg-white/5 text-white hover:bg-white/10 transition-colors"
            >
              <FaTimes size={20} />
            </button>
          </div>

          {/* Profile Section (Added for professional touch) */}
          <div className="px-6 py-8 text-center border-b border-white/5">
            <div className="relative inline-block group">
              <div className="w-20 h-20 mx-auto rounded-3xl overflow-hidden ring-4 ring-primary/20 transition-transform group-hover:scale-105 shadow-2xl">
                {userData.avatar ? (
                  <img
                    src={userData.avatar}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white text-2xl font-black">
                    {userData.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-4 border-primary-dark rounded-full"></div>
            </div>
            <h3 className="mt-4 text-white font-bold tracking-tight">{userData.name}</h3>
            <p className="text-[10px] text-white font-black uppercase tracking-[0.2em] mt-1">{userData.level} Learner</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1.5">
            <div className="mb-4 px-4">
              <p className="text-[10px] font-bold text-white uppercase tracking-widest">Student Portal</p>
            </div>
            {menuItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`group flex items-center w-full px-4 py-3.5 text-sm font-semibold rounded-2xl transition-all duration-300 cursor-pointer ${isActive
                    ? "bg-white text-primary-dark shadow-xl shadow-black/20 translate-x-1"
                    : "text-white hover:bg-white/5 hover:text-white"
                    }`}
                >
                  <span
                    className={`mr-3.5 text-xl transition-colors duration-300 ${isActive ? "text-primary-dark" : "text-white group-hover:text-white"
                      }`}
                  >
                    {item.icon}
                  </span>
                  {item.label}
                  {item.badge > 0 && (
                    <span className={`ml-auto px-2 py-0.5 rounded-lg text-[10px] font-black ${isActive ? 'bg-primary-dark text-white' : 'bg-primary text-white shadow-lg shadow-primary/20'}`}>
                      {item.badge}
                    </span>
                  )}
                  {isActive && !item.badge && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-dark"></span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Stats Panel */}
          <div className="p-4 bg-black/20 m-4 rounded-2xl border border-white/5">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-primary rounded-xl">
                  <FaClock className="text-white text-sm" />
                </div>
                <div>
                  <p className="text-[10px] text-white font-bold uppercase tracking-tight">Focus Time</p>
                  <p className="text-xs text-white font-bold">{userData.learningHours} Hours</p>
                </div>
              </div>

              <div className="h-px bg-white/5 w-full"></div>

              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-primary rounded-xl">
                  <FaTrophy className="text-white text-sm" />
                </div>
                <div>
                  <p className="text-[10px] text-white font-bold uppercase tracking-tight">Achievements</p>
                  <p className="text-xs text-white font-bold">{userData.completedCourses} Certificates</p>
                </div>
              </div>
            </div>
          </div>

          {/* Logout Section */}
          <div className="px-4 mt-4">
            <button
              onClick={handleLogout}
              className="group flex items-center w-full px-4 py-3.5 text-sm font-bold text-red-500 hover:text-white hover:bg-red-500 bg-white text-red-500 rounded-2xl transition-all duration-300 cursor-pointer"
            >
              <FaSignOutAlt className="mr-3.5 text-lg transition-transform group-hover:-translate-x-1" />
              Logout Account
            </button>
          </div>

          {/* Branding/Quote */}
          <div className="p-6 text-center mt-auto">
            <div className="inline-flex px-3 py-1 bg-white/5 rounded-full border border-white/10 mb-3">
              <span className="text-[10px] font-bold text-gray-500">V.2.0.4 Premium</span>
            </div>
            <p className="text-[10px] text-white/60 leading-relaxed italic">
              "Education is the most powerful weapon which you can use to change the world."
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;


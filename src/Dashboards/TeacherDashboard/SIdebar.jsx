// src/components/DashboardSidebar.jsx
import React from "react";
import {
  FaHome,
  FaBook,
  FaUserGraduate,
  FaTasks,
  FaEnvelope,
  FaMoneyBillAlt,
  FaChartLine,
  FaCog,
  FaGraduationCap,
  FaFileAlt,
  FaTimes,
} from "react-icons/fa";

const DashboardSidebar = ({ activeTab, setActiveTab, stats, sidebarOpen, setSidebarOpen }) => {
  const menuItems = [
    { id: "overview", label: "Overview", icon: <FaHome /> },
    { id: "courses", label: "Courses", icon: <FaBook /> },
    { id: "students", label: "Students", icon: <FaUserGraduate /> },
    { id: "messages", label: "Messages", icon: <FaEnvelope /> },
    { id: "analytics", label: "Analytics", icon: <FaChartLine /> },
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
        lg:translate-x-0 lg:sticky lg:top-20 lg:h-[calc(100vh-80px)] lg:z-0 lg:block 
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

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 lg:py-8 space-y-1.5">
            <div className="mb-4 px-4">
              <p className="text-[10px] font-bold text-white uppercase tracking-widest">Main Menu</p>
            </div>
            {menuItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false); // Close on selection for mobile
                  }}
                  className={`group flex items-center w-full px-4 py-3.5 text-sm font-semibold rounded-2xl transition-all duration-300 cursor-pointer ${isActive
                    ? "bg-white text-primary-dark shadow-xl shadow-black/20 translate-x-1"
                    : "text-gray-50 hover:bg-white/5 hover:text-white"
                    }`}
                >
                  <span
                    className={`mr-3.5 text-xl transition-colors duration-300 ${isActive ? "text-primary-dark" : "text-gray-50 group-hover:text-white"
                      }`}
                  >
                    {item.icon}
                  </span>
                  {item.label}
                  {isActive && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-dark shadow-sm"></span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Stats Panel */}
          <div className="p-4 bg-black/20 m-4 rounded-2xl border border-white/5">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/20 rounded-lg">
                  <FaGraduationCap className="text-primary" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Experience</p>
                  <p className="text-xs text-white font-bold">{stats?.teaching_hours ?? 0} Teaching Hours</p>
                </div>
              </div>

              <div className="h-px bg-white/5 w-full"></div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <FaUserGraduate className="text-green-500" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Network</p>
                  <p className="text-xs text-white font-bold">{stats?.total_students ?? 0} Students</p>
                </div>
              </div>
            </div>
          </div>

          {/* Branding/Quote */}
          <div className="p-6 text-center mt-auto">
            <div className="inline-flex px-3 py-1 bg-white/5 rounded-full border border-white/10 mb-3">
              <span className="text-[10px] font-bold text-gray-300">V.2.0.4 Premium</span>
            </div>
            <p className="text-[10px] text-gray-500 leading-relaxed italic">
              "To teach is to learn twice."
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default DashboardSidebar;

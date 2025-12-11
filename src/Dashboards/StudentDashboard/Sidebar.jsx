// components/Sidebar.jsx
import React from "react";
import {
  AiOutlineBarChart,
  AiOutlineBook,
  AiOutlinePieChart,
  AiOutlineTrophy,
  AiOutlineFileText,
  AiOutlineSetting,
} from "react-icons/ai";

const Sidebar = ({
  activeSection,
  setActiveSection,
  sidebarOpen,
  setSidebarOpen,
  userData,
}) => {
  const menuItems = [
    { id: "overview", label: "Overview", icon: AiOutlineBarChart },
    { id: "courses", label: "My Courses", icon: AiOutlineBook, badge: userData.enrolledCourses },
    { id: "progress", label: "Progress", icon: AiOutlinePieChart },
    { id: "achievements", label: "Achievements", icon: AiOutlineTrophy, badge: "12" },
    { id: "certificates", label: "Certificates", icon: AiOutlineFileText, badge: userData.completedCourses },
    { id: "settings", label: "Settings", icon: AiOutlineSetting },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-xl transform 
        transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Scroll Wrapper + Hidden Scrollbar */}
        <div className="h-full overflow-y-auto 
        [scrollbar-width:none] [-ms-overflow-style:none]
        [&::-webkit-scrollbar]:hidden relative">

          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
            <div className=" ml-7 place-items-center ">
              <div className="w-30 h-30 bg-gradient-to-br from-primary to-primary-dark 
              rounded-full flex items-center justify-center text-5xl text-white font-bold">
                {userData.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div className="text-center">
                <h2 className="text-lg font-semibold text-gray-900">{userData.name}</h2>
                <p className="text-sm text-gray-500">{userData.title}</p>
              </div>
            </div>

            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Menu */}
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeSection === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`group w-full flex items-center cursor-pointer justify-between px-4 py-3 
                  rounded-xl text-left transition-all duration-200
                  ${
                    isActive
                      ? "bg-primary-light text-primary border border-primary/20"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <div
                    className={`flex items-center space-x-3
                    ${isActive ? "text-primary" : "text-gray-500 group-hover:text-gray-700"}`}
                  >
                    <IconComponent size={22} />
                    <span className="font-medium">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full
                    ${
                      isActive
                        ? "bg-primary text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Stats */}
          <div className="p-6 border-t border-gray-200 mt-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">{userData.points}</div>
                <div className="text-xs text-gray-500">Points</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{userData.streak}</div>
                <div className="text-xs text-gray-500">Day Streak</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default Sidebar;

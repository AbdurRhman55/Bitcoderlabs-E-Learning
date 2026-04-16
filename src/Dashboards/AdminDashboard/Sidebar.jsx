import React from "react";
import {
  Menu,
  X,
  BookOpen,
  Users,
  ShoppingBag,
  BarChart3,
  Phone,
  Settings,
  ChevronRight,
  LayoutDashboard,
  UserCheck,
  UserPlus,
  Layers
} from "lucide-react";

export default function Sidebar({ open, setOpen, active, setActive, pendingCounts = {} }) {
  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    {
      icon: <BookOpen size={20} />,
      label: "Courses",
      badge: pendingCounts.courses > 0 ? pendingCounts.courses : null
    },
    { icon: <Layers size={20} />, label: "Course Categories" },
    {
      icon: <UserCheck size={20} />,
      label: "Course Requests",
      badge: pendingCounts.courses > 0 ? pendingCounts.courses : null
    },
    {
      icon: <Users size={20} />,
      label: "Students",
      badge: pendingCounts.students > 0 ? pendingCounts.students : null
    },
    {
      icon: <UserPlus size={20} />,
      label: "Enrolled Students",
      badge: pendingCounts.enrollments > 0 ? pendingCounts.enrollments : null
    },
    {
      icon: <Users size={20} />,
      label: "Teachers",
      badge: pendingCounts.teachers > 0 ? pendingCounts.teachers : null
    },
    { icon: <Phone size={20} />, label: "Contacts" },
    { icon: <ShoppingBag size={20} />, label: "Orders" },
    { icon: <BarChart3 size={20} />, label: "Analytics" },
    { icon: <Settings size={20} />, label: "Settings" },
  ];

  return (
    <aside
      className={`${open ? "w-64" : "w-20"} sticky top-0 left-0 h-screen z-50
    bg-gradient-to-b from-gray-900 to-gray-800 text-white p-5
    transition-all duration-500 ease-in-out`}
      style={{
        overflowY: "auto",
        scrollbarWidth: "none", // Firefox
        msOverflowStyle: "none" // IE 10+
      }}
    >
      <style>
        {`
      aside::-webkit-scrollbar {
        display: none;
      }
    `}
      </style>

      {/* Logo */}
      <div className="flex items-center gap-3 mb-10 mt-10">
        <div className="bg-primary-dark text-white w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg">
          B
        </div>
        {open && (
          <div>
            <h1 className="text-xl font-bold">BitcoderLabs</h1>
            <p className="text-xs text-gray-400 -mt-1">Admin Panel</p>
          </div>
        )}
      </div>

      {/* Menu */}
      <nav className="space-y-1">
        {menuItems.map((item) => (
          <div
            key={item.label}
            onClick={() => setActive(item.label)}
            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-300 relative
            ${active === item.label
                ? "bg-blue-500/20 text-white border-l-4 border-blue-400"
                : "text-gray-300 hover:bg-white/10 hover:text-white"
              }`}
          >
            {item.icon}
            {open && (
              <div className="flex items-center justify-between flex-1">
                <span className="font-medium">{item.label}</span>
                <div className="flex items-center gap-2">
                  {item.badge && (
                    <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight
                    size={16}
                    className={`transition-all ${active === item.label
                      ? "rotate-90 text-blue-300"
                      : "text-gray-400"
                      }`}
                  />
                </div>
              </div>
            )}
            {!open && item.badge && (
              <span className="absolute top-2 right-2 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}

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
  UserCheck
} from "lucide-react";

export default function Sidebar({ open, setOpen, active, setActive }) {
  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    { icon: <BookOpen size={20} />, label: "Courses" },
    { icon: <UserCheck size={20} />, label: "Course Requests" },
    { icon: <Users size={20} />, label: "Students" },
    { icon: <Users size={20} />, label: "Teachers" },
    // { icon: <UserCheck size={20} />, label: "Pending Approvals" },
    { icon: <Phone size={20} />, label: "Contacts" },
    { icon: <ShoppingBag size={20} />, label: "Orders" },
    { icon: <BarChart3 size={20} />, label: "Analytics" },
    { icon: <Settings size={20} />, label: "Settings" },
  ];


  return (
    <aside
      className={`${open ? "w-64" : "w-20"
        } fixed sm:static top-0 left-0 h-100% z-50
      bg-gradient-to-b from-gray-900 to-gray-800 text-white p-5 transition-all duration-500 ease-in-out`}
    >
      {/* Toggle */}
      <button
        className={`absolute top-4 cursor-pointer p-2 rounded-full ${open ? "left-54" : "left-6"}`}
        onClick={() => setOpen(!open)}
      >
        {open ? <X size={18} /> : <Menu size={18} />}
      </button>

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
            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-300
            ${active === item.label
                ? "bg-blue-500/20 text-white border-l-4 border-blue-400"
                : "text-gray-300 hover:bg-white/10 hover:text-white"
              }`}
          >
            {item.icon}
            {open && <span className="font-medium">{item.label}</span>}
            {open && (
              <ChevronRight
                size={16}
                className={`ml-auto transition-all ${active === item.label
                  ? "rotate-90 text-blue-300"
                  : "text-gray-400"
                  }`}
              />
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}

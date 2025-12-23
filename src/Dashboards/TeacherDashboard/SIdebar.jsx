// src/components/DashboardSidebar.jsx
import React from 'react';
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
    FaFileAlt
} from 'react-icons/fa';

const DashboardSidebar = ({ activeTab, setActiveTab, stats }) => {
    const menuItems = [
        { id: 'overview', label: 'Overview', icon: <FaHome /> },
        { id: 'courses', label: 'Courses', icon: <FaBook /> },
        { id: 'students', label: 'Students', icon: <FaUserGraduate /> },
        { id: 'assignments', label: 'Assignments', icon: <FaTasks /> },
        { id: 'messages', label: 'Messages', icon: <FaEnvelope /> },
        { id: 'analytics', label: 'Analytics', icon: <FaChartLine /> },
        { id: 'settings', label: 'Settings', icon: <FaCog /> },
    ];

    return (
        <aside className="hidden lg:flex lg:flex-shrink-0">
            <div className="flex flex-col w-64 border-r border-gray-200 bg-white">
                {/* Logo */}
                <div className="flex items-center h-16 flex-shrink-0 px-6 border-b border-gray-200">
                    <FaGraduationCap className="text-primary text-2xl mr-3" />
                    <span className="text-xl font-bold text-gray-800">TeachPro</span>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-1">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-all ${activeTab === item.id
                                ? 'bg-primary text-white shadow-sm'
                                : 'text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            <span className={`mr-3 text-lg ${activeTab === item.id ? 'text-white' : 'text-gray-500'}`}>
                                {item.icon}
                            </span>
                            {item.label}
                        </button>
                    ))}
                </nav>

                {/* Quick Stats */}
                <div className="p-4 border-t border-gray-200">
                    <div className="bg-primary-light rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">Teaching Hours</span>
                            <span className="text-sm font-bold text-primary">{stats?.teaching_hours ?? 0}h</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">Students</span>
                            <span className="text-sm font-bold text-primary">{stats?.total_students ?? 0}</span>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default DashboardSidebar;
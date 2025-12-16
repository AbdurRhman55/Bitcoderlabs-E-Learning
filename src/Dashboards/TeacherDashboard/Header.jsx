// src/components/DashboardHeader.jsx
import React, { useState } from 'react';
import { FaBell, FaUserCircle, FaSearch, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { logout } from '../../../slices/AuthSlice'; // adjust path if needed
import { useNavigate } from 'react-router-dom';

const DashboardHeader = ({ profile, notifications }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login'); // redirect to login page
    }



    return (
        <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Left: Search */}
                    <div className="flex-1 flex items-center">
                        <div className="max-w-lg w-full lg:max-w-xs">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaSearch className="text-gray-400" />
                                </div>
                                <input
                                    type="search"
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                                    placeholder="Search..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right: Icons & Profile */}
                    <div className="flex items-center space-x-4">
                        {/* Notifications */}
                        <div className="relative">
                            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
                                <FaBell className="text-gray-600 text-xl" />
                                {notifications > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                        {notifications}
                                    </span>
                                )}
                            </button>
                        </div>

                        {/* Settings */}
                        <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                            <FaCog className="text-gray-600 text-xl" />
                        </button>

                        {/* Profile Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setShowDropdown(!showDropdown)}
                                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <img
                                    src={profile.profileImage}
                                    alt={profile.name}
                                    className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                                />
                                <div className="hidden md:block text-left">
                                    <p className="text-sm font-medium text-gray-800">{profile.name}</p>
                                    <p className="text-xs text-gray-600">Teacher</p>
                                </div>
                            </button>

                            {showDropdown && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                                    <div className="py-2">
                                        <a
                                            href="#"
                                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            <FaUserCircle className="mr-3 text-gray-400" />
                                            My Profile
                                        </a>
                                        <a
                                            href="#"
                                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            <FaCog className="mr-3 text-gray-400" />
                                            Settings
                                        </a>
                                        <div className="border-t border-gray-200"></div>
                                        <button onClick={handleLogout} >
                                            <a
                                                href="#"
                                                className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                            >
                                                <FaSignOutAlt className="mr-3" />
                                                Logout
                                            </a>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default DashboardHeader;
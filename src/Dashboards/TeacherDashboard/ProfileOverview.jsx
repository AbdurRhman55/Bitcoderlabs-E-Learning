// src/components/sections/ProfileOverview.jsx
import React from 'react';
import { FaDownload, FaEdit, FaStar, FaUsers, FaClock, FaBook, FaTasks, FaChartLine, FaChartBar } from 'react-icons/fa';
import { MdSchool, MdWork } from 'react-icons/md';

const ProfileOverview = ({ profile }) => {
    const stats = [
        { label: 'Total Students', value: '243', icon: <FaUsers className="text-blue-500" />, change: '+12%' },
        { label: 'Active Courses', value: '8', icon: <MdSchool className="text-green-500" />, change: '+2' },
        { label: 'Teaching Hours', value: '156h', icon: <FaClock className="text-purple-500" />, change: '+18h' },
        { label: 'Avg. Rating', value: '4.8', icon: <FaStar className="text-amber-500" />, change: '↑0.2' },
    ];

    const recentActivities = [
        { id: 1, type: 'course', title: 'Published new course', description: 'Introduction to Quantum Physics', time: '2 hours ago' },
        { id: 2, type: 'student', title: 'New student enrolled', description: 'John Doe in Calculus 101', time: '4 hours ago' },
        { id: 3, type: 'assignment', title: 'Assignment graded', description: '45 assignments in Math 101', time: '1 day ago' },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Teacher Dashboard</h1>
                    <p className="text-gray-600">Welcome back, {profile.name}</p>
                </div>
                <div className="flex space-x-3">
                    <button className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
                        <FaDownload className="mr-2" />
                        Download CV
                    </button>
                    <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <FaEdit className="mr-2 text-gray-600" />
                        Edit Profile
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 rounded-lg bg-gray-50">
                                {stat.icon}
                            </div>
                            <span className="text-sm font-medium text-green-600">{stat.change}</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                        <p className="text-sm text-gray-600">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Profile Card */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-start space-x-6">
                            <img
                                src={profile.profileImage}
                                alt={profile.name}
                                className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
                            />
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-800">{profile.name}</h2>
                                        <p className="text-gray-600">{profile.qualification}</p>
                                        <p className="text-sm text-gray-500 mt-1">{profile.experience} of teaching experience</p>
                                    </div>
                                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                                        Verified
                                    </span>
                                </div>

                                <div className="mt-4">
                                    <p className="text-gray-700 mb-4">{profile.about}</p>

                                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                                        <div className="flex items-center">
                                            <MdWork className="mr-2 text-gray-500" />
                                            <span>10 Courses</span>
                                        </div>
                                        <div className="flex items-center">
                                            <FaUsers className="mr-2 text-gray-500" />
                                            <span>243 Students</span>
                                        </div>
                                        <div className="flex items-center">
                                            <FaStar className="mr-2 text-gray-500" />
                                            <span>4.8 Rating</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Skills */}
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <h3 className="text-lg font-medium text-gray-800 mb-3">Skills & Expertise</h3>
                            <div className="flex flex-wrap gap-2">
                                {profile.skills.map((skill, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 bg-primary-light text-primary text-sm font-medium rounded-full"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activities */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Recent Activities</h3>
                    <div className="space-y-4">
                        {recentActivities.map((activity) => (
                            <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                <div className="p-2 rounded-lg bg-primary-light">
                                    <FaChartBar className="text-primary" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-gray-800">{activity.title}</p>
                                    <p className="text-sm text-gray-600">{activity.description}</p>
                                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-4 py-2 text-center text-primary hover:text-primary-dark font-medium">
                        View All Activities →
                    </button>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button className="flex flex-col items-center justify-center p-6 border border-gray-200 rounded-xl hover:border-primary hover:bg-primary-light transition-colors">
                        <FaBook className="text-2xl text-primary mb-3" />
                        <span className="font-medium text-gray-800">Create New Course</span>
                        <span className="text-sm text-gray-600 mt-1">Start teaching now</span>
                    </button>
                    <button className="flex flex-col items-center justify-center p-6 border border-gray-200 rounded-xl hover:border-primary hover:bg-primary-light transition-colors">
                        <FaTasks className="text-2xl text-primary mb-3" />
                        <span className="font-medium text-gray-800">Create Assignment</span>
                        <span className="text-sm text-gray-600 mt-1">Add new assessment</span>
                    </button>
                    <button className="flex flex-col items-center justify-center p-6 border border-gray-200 rounded-xl hover:border-primary hover:bg-primary-light transition-colors">
                        <FaChartLine className="text-2xl text-primary mb-3" />
                        <span className="font-medium text-gray-800">View Analytics</span>
                        <span className="text-sm text-gray-600 mt-1">Track performance</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfileOverview;
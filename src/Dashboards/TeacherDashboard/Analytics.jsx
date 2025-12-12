// src/components/sections/AnalyticsTab.jsx
import React, { useState } from 'react';
import { FaChartLine, FaUsers, FaClock, FaStar, FaEye, FaChartBar, FaCalendarAlt, FaFilter } from 'react-icons/fa';

const AnalyticsTab = () => {
    const [timeRange, setTimeRange] = useState('30days');

    const analyticsData = {
        totalStudents: 243,
        totalWatchHours: 1560,
        avgCompletion: 78,
        avgRating: 4.8,
        engagementRate: 65,
        retentionRate: 82
    };

    const topCourses = [
        { name: 'Advanced Mathematics', students: 45, rating: 4.8, completion: 85, revenue: 4455 },
        { name: 'Calculus 101', students: 67, rating: 4.9, completion: 92, revenue: 3980 },
        { name: 'Physics Basics', students: 32, rating: 4.3, completion: 72, revenue: 2520 },
        { name: 'Chemistry Intro', students: 28, rating: 4.2, completion: 68, revenue: 1625 },
    ];

    const performanceMetrics = [
        { metric: 'Student Satisfaction', value: 92, change: '+5%', color: 'text-green-600', bgColor: 'bg-green-100' },
        { metric: 'Course Completion', value: 78, change: '+8%', color: 'text-blue-600', bgColor: 'bg-blue-100' },
        { metric: 'Student Retention', value: 82, change: '+3%', color: 'text-purple-600', bgColor: 'bg-purple-100' },
        { metric: 'Assignment Submission', value: 85, change: '+12%', color: 'text-amber-600', bgColor: 'bg-amber-100' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h1>
                    <p className="text-gray-600">Track performance and gain insights</p>
                </div>
                <div className="flex items-center space-x-3">
                    <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <FaCalendarAlt className="mr-2" />
                        Last 30 Days
                    </button>
                    <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <FaFilter className="mr-2" />
                        Filter
                    </button>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 rounded-lg bg-blue-100">
                            <FaUsers className="text-blue-600" />
                        </div>
                        <span className="text-sm font-medium text-green-600">+12%</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{analyticsData.totalStudents}</p>
                    <p className="text-sm text-gray-600">Total Students</p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 rounded-lg bg-green-100">
                            <FaClock className="text-green-600" />
                        </div>
                        <span className="text-sm font-medium text-green-600">+18%</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{analyticsData.totalWatchHours}h</p>
                    <p className="text-sm text-gray-600">Watch Hours</p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 rounded-lg bg-purple-100">
                            <FaChartLine className="text-purple-600" />
                        </div>
                        <span className="text-sm font-medium text-green-600">+8%</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{analyticsData.avgCompletion}%</p>
                    <p className="text-sm text-gray-600">Avg. Completion</p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 rounded-lg bg-amber-100">
                            <FaStar className="text-amber-600" />
                        </div>
                        <span className="text-sm font-medium text-green-600">+0.2</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{analyticsData.avgRating}</p>
                    <p className="text-sm text-gray-600">Avg. Rating</p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 rounded-lg bg-red-100">
                            <FaEye className="text-red-600" />
                        </div>
                        <span className="text-sm font-medium text-green-600">+15%</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{analyticsData.engagementRate}%</p>
                    <p className="text-sm text-gray-600">Engagement Rate</p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 rounded-lg bg-indigo-100">
                            <FaChartBar className="text-indigo-600" />
                        </div>
                        <span className="text-sm font-medium text-green-600">+3%</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{analyticsData.retentionRate}%</p>
                    <p className="text-sm text-gray-600">Retention Rate</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Performance Metrics */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-medium text-gray-800">Performance Metrics</h3>
                            <div className="flex space-x-2">
                                {['7days', '30days', '90days'].map((range) => (
                                    <button
                                        key={range}
                                        onClick={() => setTimeRange(range)}
                                        className={`px-3 py-1 text-sm rounded-lg transition-colors ${timeRange === range
                                                ? 'bg-primary text-white'
                                                : 'text-gray-600 hover:bg-gray-100'
                                            }`}
                                    >
                                        {range === '7days' ? '7D' : range === '30days' ? '30D' : '90D'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-6">
                            {performanceMetrics.map((metric, index) => (
                                <div key={index} className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium text-gray-800">{metric.metric}</span>
                                        <div className="flex items-center">
                                            <span className={`text-xl font-bold mr-2 ${metric.color}`}>{metric.value}%</span>
                                            <span className="text-sm font-medium text-green-600">{metric.change}</span>
                                        </div>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full ${metric.bgColor.replace('bg-', 'bg-').replace('100', '600')}`}
                                            style={{ width: `${metric.value}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Top Performing Courses */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-medium text-gray-800 mb-6">Top Performing Courses</h3>
                    <div className="space-y-4">
                        {topCourses.map((course, index) => (
                            <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-medium text-gray-800">{course.name}</h4>
                                    <div className="flex items-center">
                                        <FaStar className="text-amber-500 mr-1" />
                                        <span className="font-bold">{course.rating}</span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-600">Students:</span>
                                        <span className="font-medium ml-2">{course.students}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Completion:</span>
                                        <span className="font-medium ml-2">{course.completion}%</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Revenue:</span>
                                        <span className="font-medium ml-2">${course.revenue.toLocaleString()}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Rank:</span>
                                        <span className="font-medium ml-2">#{index + 1}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Student Demographics */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-800 mb-6">Student Demographics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm font-medium text-blue-800 mb-1">Age Group</p>
                        <p className="text-2xl font-bold text-blue-800">18-25</p>
                        <p className="text-sm text-blue-600">65% of students</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                        <p className="text-sm font-medium text-green-800 mb-1">Gender Ratio</p>
                        <p className="text-2xl font-bold text-green-800">60:40</p>
                        <p className="text-sm text-green-600">Male:Female ratio</p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                        <p className="text-sm font-medium text-purple-800 mb-1">Top Country</p>
                        <p className="text-2xl font-bold text-purple-800">USA</p>
                        <p className="text-sm text-purple-600">35% of students</p>
                    </div>
                    <div className="p-4 bg-amber-50 rounded-lg">
                        <p className="text-sm font-medium text-amber-800 mb-1">Study Time</p>
                        <p className="text-2xl font-bold text-amber-800">Evening</p>
                        <p className="text-sm text-amber-600">7-10 PM peak hours</p>
                    </div>
                </div>
            </div>

            {/* Course Engagement */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-medium text-gray-800 mb-6">Course Engagement</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-700">Video Completion Rate</span>
                            <div className="flex items-center">
                                <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                                    <div className="h-2 rounded-full bg-green-500" style={{ width: '78%' }}></div>
                                </div>
                                <span className="font-bold">78%</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-700">Assignment Submission</span>
                            <div className="flex items-center">
                                <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                                    <div className="h-2 rounded-full bg-blue-500" style={{ width: '85%' }}></div>
                                </div>
                                <span className="font-bold">85%</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-700">Quiz Participation</span>
                            <div className="flex items-center">
                                <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                                    <div className="h-2 rounded-full bg-purple-500" style={{ width: '92%' }}></div>
                                </div>
                                <span className="font-bold">92%</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-700">Forum Activity</span>
                            <div className="flex items-center">
                                <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                                    <div className="h-2 rounded-full bg-amber-500" style={{ width: '45%' }}></div>
                                </div>
                                <span className="font-bold">45%</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-medium text-gray-800 mb-6">Learning Patterns</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-700">Most Active Day</span>
                            <span className="font-bold">Wednesday</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-700">Peak Learning Hours</span>
                            <span className="font-bold">7-10 PM</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-700">Avg. Session Duration</span>
                            <span className="font-bold">42 min</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-700">Mobile vs Desktop</span>
                            <span className="font-bold">65% : 35%</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-700">Drop-off Rate</span>
                            <span className="font-bold text-red-600">18%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsTab;
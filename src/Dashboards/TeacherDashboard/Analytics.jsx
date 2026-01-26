// src/Dashboards/TeacherDashboard/Analytics.jsx
import React, { useState, useMemo } from 'react';
import { FaChartLine, FaUsers, FaClock, FaStar, FaEye, FaChartBar, FaCalendarAlt, FaFilter } from 'react-icons/fa';

const AnalyticsTab = ({ stats = {}, courses = [] }) => {
    const [timeRange, setTimeRange] = useState('30days');

    // Process analytics data from stats prop
    const analyticsData = useMemo(() => ({
        totalStudents: stats.total_students || 0,
        totalWatchHours: stats.teaching_hours || 0,
        avgCompletion: stats.avg_completion || 0, // Fallback if not in API
        avgRating: stats.average_rating || 0,
        engagementRate: stats.engagement_rate || 0, // Fallback if not in API
        retentionRate: stats.retention_rate || 0, // Fallback if not in API
        studentsChange: stats.students_change || "+0%",
        ratingChange: stats.rating_change || "+0.0",
        hoursChange: stats.hours_change || "+0%",
    }), [stats]);

    // Process top courses from courses prop
    const topPerformingCourses = useMemo(() => {
        return [...courses]
            .sort((a, b) => (b.students_count || 0) - (a.students_count || 0))
            .slice(0, 4)
            .map(course => ({
                name: course.title,
                students: course.students_count || 0,
                rating: course.average_rating || 0,
                completion: course.completion_rate || 0,
                revenue: (course.price || 0) * (course.students_count || 0),
                id: course.id
            }));
    }, [courses]);

    // Only show metrics we have real data for, or provide reasonable defaults if some are missing but expected
    const performanceMetrics = [
        {
            metric: 'Student satisfaction',
            value: Math.round((analyticsData.avgRating / 5) * 100) || 0,
            change: analyticsData.ratingChange,
            color: 'text-green-600',
            bgColor: 'bg-green-100'
        },
        {
            metric: 'Course Completion',
            value: analyticsData.avgCompletion || 0,
            change: '+0%', // Placeholder if not in API
            color: 'text-blue-600',
            bgColor: 'bg-blue-100'
        },
        {
            metric: 'Total Reach',
            value: Math.min(100, (analyticsData.totalStudents / 1000) * 100), // Normalized reach
            change: analyticsData.studentsChange,
            color: 'text-purple-600',
            bgColor: 'bg-purple-100'
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h1>
                    <p className="text-gray-600">Real-time performance metrics for your courses</p>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 rounded-lg bg-blue-100">
                            <FaUsers className="text-blue-600" />
                        </div>
                        <span className={`text-sm font-medium ${analyticsData.studentsChange.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                            {analyticsData.studentsChange}
                        </span>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{analyticsData.totalStudents.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">Total Students</p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 rounded-lg bg-green-100">
                            <FaClock className="text-green-600" />
                        </div>
                        <span className={`text-sm font-medium ${analyticsData.hoursChange.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                            {analyticsData.hoursChange}
                        </span>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{analyticsData.totalWatchHours}h</p>
                    <p className="text-sm text-gray-600">Teaching Hours</p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 rounded-lg bg-amber-100">
                            <FaStar className="text-amber-600" />
                        </div>
                        <span className={`text-sm font-medium ${analyticsData.ratingChange.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                            {analyticsData.ratingChange}
                        </span>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{analyticsData.avgRating.toFixed(1)}</p>
                    <p className="text-sm text-gray-600">Avg. Rating</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Performance Metrics */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-medium text-gray-800">Performance Overview</h3>
                        </div>

                        <div className="space-y-6">
                            {performanceMetrics.map((metric, index) => (
                                <div key={index} className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium text-gray-800">{metric.metric}</span>
                                        <div className="flex items-center">
                                            <span className={`text-xl font-bold mr-2 ${metric.color}`}>{Math.round(metric.value)}%</span>
                                            <span className={`text-sm font-medium ${metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                                                {metric.change}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full ${metric.color.replace('text-', 'bg-')}`}
                                            style={{ width: `${metric.value}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {performanceMetrics.length === 0 && (
                            <div className="text-center py-8 text-gray-500 italic">
                                No performance data available yet.
                            </div>
                        )}
                    </div>
                </div>

                {/* Top Performing Courses */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-medium text-gray-800 mb-6">Top Performing Courses</h3>
                    <div className="space-y-4">
                        {topPerformingCourses.length > 0 ? (
                            topPerformingCourses.map((course, index) => (
                                <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-medium text-gray-800 line-clamp-1">{course.name}</h4>
                                        <div className="flex items-center ml-2 shrink-0">
                                            <FaStar className="text-amber-500 mr-1" />
                                            <span className="font-bold">{course.rating.toFixed(1)}</span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                                        <div>
                                            <span>Students:</span>
                                            <span className="font-medium ml-2 text-gray-800">{course.students}</span>
                                        </div>
                                        <div>
                                            <span>Rank:</span>
                                            <span className="font-medium ml-2 text-primary">#{index + 1}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-500 italic">
                                No courses found.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Student Engagement & Activity Section (Simplified to hide dummy data) */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-medium text-gray-800">Recent Statistical Insights</h3>
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">Last updated: Just now</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 bg-blue-50 rounded-lg flex items-center gap-4">
                        <div className="p-3 bg-white rounded-full text-blue-600 shadow-sm">
                            <FaChartBar />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-blue-800">Course Reach</p>
                            <p className="text-xl font-bold text-blue-900">{analyticsData.totalStudents} Global Students</p>
                        </div>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg flex items-center gap-4">
                        <div className="p-3 bg-white rounded-full text-green-600 shadow-sm">
                            <FaStar />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-green-800">Quality Index</p>
                            <p className="text-xl font-bold text-green-900">{analyticsData.avgRating.toFixed(1)} Avg. Star Rating</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsTab;
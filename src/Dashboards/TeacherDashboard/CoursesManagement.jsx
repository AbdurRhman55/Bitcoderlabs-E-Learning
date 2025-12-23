// src/components/sections/CoursesManagement.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaEye, FaClock, FaUsers, FaStar, FaCheckCircle, FaHourglassHalf, FaTimesCircle } from 'react-icons/fa';
import { apiClient } from '../../api/index.js';

const CoursesManagement = ({ showNotification }) => {
    const [courses, setCourses] = useState([]);
    const [availableCourses, setAvailableCourses] = useState([]);
    const [myRequests, setMyRequests] = useState([]);
    const [selectedCourseId, setSelectedCourseId] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const unwrapList = (res) => {
        const list = res?.data;
        return Array.isArray(list) ? list : [];
    };

    const refreshData = async () => {
        try {
            setLoading(true);
            const [myCoursesRes, availableRes, myRequestsRes] = await Promise.all([
                apiClient.getMyCourses(),
                apiClient.getAvailableCourses(),
                apiClient.getMyCourseRequests(),
            ]);

            setCourses(unwrapList(myCoursesRes));
            setAvailableCourses(unwrapList(availableRes));
            setMyRequests(unwrapList(myRequestsRes));
        } catch (e) {
            console.error('Failed to load course requests data:', e);
            showNotification?.(e?.message || 'Failed to load courses. Please refresh.', 'error');
            setCourses([]);
            setAvailableCourses([]);
            setMyRequests([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved': return 'bg-green-100 text-green-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'approved': return <FaCheckCircle className="text-green-500" />;
            case 'pending': return <FaHourglassHalf className="text-yellow-500" />;
            case 'rejected': return <FaTimesCircle className="text-red-500" />;
            default: return null;
        }
    };

    const handleCreateCourse = () => {
        showNotification?.('Course creation is managed by admin. Please request a course instead.', 'info');
    };

    const handleEditCourse = (id) => {
        showNotification?.(`Editing course #${id}`, 'info');
    };

    const handleDeleteCourse = (id) => {
        showNotification?.(`Deleting course #${id}`, 'info');
    };

    const handleSubmitRequest = async () => {
        if (!selectedCourseId) {
            showNotification?.('Please select a course first.', 'warning');
            return;
        }

        try {
            setSubmitting(true);
            await apiClient.createCourseRequest(Number(selectedCourseId));
            showNotification?.('Request submitted successfully.', 'success');
            setSelectedCourseId('');
            await refreshData();
        } catch (e) {
            console.error('Failed to submit course request:', e);
            showNotification?.(e?.message || 'Failed to submit request.', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const stats = useMemo(() => {
        const totalCourses = courses.length;
        const published = courses.filter(c => c.is_active).length;
        const totalStudents = courses.reduce((acc, c) => acc + (Number(c.students_count) || 0), 0);
        const totalRevenue = courses
            .filter(c => c.is_active)
            .reduce((acc, c) => acc + ((Number(c.price) || 0) * (Number(c.students_count) || 0)), 0);

        return { totalCourses, published, totalStudents, totalRevenue };
    }, [courses]);

    return (
        <div className="space-y-6 ">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Courses Management</h1>
                    <p className="text-gray-600">Manage your courses and track their performance</p>
                </div>

                <button
                    onClick={handleCreateCourse}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center"
                >
                    <FaPlus className="mr-2" />
                    Create Course
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <p className="text-2xl font-bold text-gray-800">{stats.totalCourses}</p>
                    <p className="text-sm text-gray-600">Total Courses</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <p className="text-2xl font-bold text-gray-800">{stats.published}</p>
                    <p className="text-sm text-gray-600">Published</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <p className="text-2xl font-bold text-gray-800">{stats.totalStudents}</p>
                    <p className="text-sm text-gray-600">Total Students</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <p className="text-2xl font-bold text-gray-800">${Math.round(stats.totalRevenue)}</p>
                    <p className="text-sm text-gray-600">Total Revenue</p>
                </div>
            </div>

            {/* Request a course */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Request a Course to Teach</h3>
                {loading ? (
                    <div className="text-gray-600">Loading available courses...</div>
                ) : (
                    <div className="flex flex-col md:flex-row gap-3 md:items-center">
                        <select
                            value={selectedCourseId}
                            onChange={(e) => setSelectedCourseId(e.target.value)}
                            className="w-full md:flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        >
                            <option value="">Select a course</option>
                            {availableCourses.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.title}
                                </option>
                            ))}
                        </select>

                        <button
                            onClick={handleSubmitRequest}
                            disabled={submitting || !selectedCourseId}
                            className="px-5 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-60"
                        >
                            {submitting ? 'Submitting...' : 'Send Request'}
                        </button>
                    </div>
                )}
            </div>

            {/* Courses Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-800">My Courses</h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Students</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {courses.map((course) => {
                                const status = course.is_active ? 'approved' : 'pending';

                                return (
                                <tr key={course.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">{course.title}</div>
                                            <div className="text-sm text-gray-500">{course.category?.name || '—'}</div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <FaUsers className="mr-2 text-gray-400" />
                                            <span className="text-sm text-gray-900">{course.students_count ?? 0}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <FaStar className="mr-2 text-amber-500" />
                                            <span className="text-sm text-gray-900">{course.rating ?? 0}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <FaClock className="mr-2 text-gray-400" />
                                            <span className="text-sm text-gray-900">{course.duration || '—'}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                        ${Number(course.price || 0)}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            {getStatusIcon(status)}
                                            <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(status)}`}>
                                                {status.charAt(0).toUpperCase() + status.slice(1)}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => handleEditCourse(course.id)}
                                                className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button className="text-gray-600 hover:text-gray-900 p-2 hover:bg-gray-50 rounded-lg">
                                                <FaEye />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteCourse(course.id)}
                                                className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                );
                            })}

                            {!loading && courses.length === 0 && (
                                <tr>
                                    <td className="px-4 py-6 text-sm text-gray-600" colSpan={7}>
                                        No courses assigned yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Requests Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-800">My Course Requests</h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {myRequests.map((req) => (
                                <tr key={req.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">{req.course?.title || '—'}</div>
                                            <div className="text-sm text-gray-500">{req.course?.category?.name || '—'}</div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            {getStatusIcon(req.status)}
                                            <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(req.status)}`}>
                                                {req.status ? (req.status.charAt(0).toUpperCase() + req.status.slice(1)) : '—'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        {req.status === 'rejected' ? (
                                            <p className="text-sm text-red-700">{req.reason || '—'}</p>
                                        ) : (
                                            <span className="text-sm text-gray-500">—</span>
                                        )}
                                    </td>
                                </tr>
                            ))}

                            {!loading && myRequests.length === 0 && (
                                <tr>
                                    <td className="px-4 py-6 text-sm text-gray-600" colSpan={3}>
                                        No course requests yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
);

};

export default CoursesManagement;
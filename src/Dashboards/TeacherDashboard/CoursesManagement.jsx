// src/components/sections/CoursesManagement.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaEye, FaClock, FaUsers, FaStar, FaCheckCircle, FaHourglassHalf, FaTimesCircle, FaChevronDown, FaChevronUp, FaFileVideo, FaFileAlt, FaQuestionCircle } from 'react-icons/fa';
import { apiClient } from '../../api/index.js';

const CoursesManagement = ({ showNotification }) => {
    const [courses, setCourses] = useState([]);
    const [availableCourses, setAvailableCourses] = useState([]);
    const [myRequests, setMyRequests] = useState([]);
    const [selectedCourseId, setSelectedCourseId] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // New state for modules and lessons
    const [expandedCourses, setExpandedCourses] = useState({});
    const [modules, setModules] = useState({});
    const [expandedModules, setExpandedModules] = useState({});
    const [lessons, setLessons] = useState({});
    const [loadingModules, setLoadingModules] = useState({});
    const [loadingLessons, setLoadingLessons] = useState({});

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

    const getLessonIcon = (type) => {
        switch (type) {
            case 'video': return <FaFileVideo className="text-red-500" />;
            case 'text': return <FaFileAlt className="text-blue-500" />;
            case 'quiz': return <FaQuestionCircle className="text-purple-500" />;
            default: return <FaFileAlt className="text-gray-500" />;
        }
    };

    const toggleCourseModules = async (courseId) => {
        setExpandedCourses(prev => ({ ...prev, [courseId]: !prev[courseId] }));

        // Only fetch modules if not already loaded
        if (!expandedCourses[courseId] && !modules[courseId]) {
            try {
                setLoadingModules(prev => ({ ...prev, [courseId]: true }));

                // Fetch modules from API
                const res = await apiClient.getCourseModules(courseId);
                const modulesData = unwrapList(res);

                // Sort modules by order_index
                const sortedModules = modulesData.sort((a, b) => a.order_index - b.order_index);

                setModules(prev => ({ ...prev, [courseId]: sortedModules }));

                // If first module exists and has lessons_count > 0, auto-expand it
                if (sortedModules.length > 0 && sortedModules[0].lessons_count > 0) {
                    setExpandedModules(prev => ({ ...prev, [sortedModules[0].id]: true }));
                }
            } catch (e) {
                console.error('Failed to load modules:', e);
                showNotification?.('Failed to load modules.', 'error');
                setModules(prev => ({ ...prev, [courseId]: [] }));
            } finally {
                setLoadingModules(prev => ({ ...prev, [courseId]: false }));
            }
        }
    };

    const toggleModuleLessons = async (moduleId, courseId) => {
        setExpandedModules(prev => ({ ...prev, [moduleId]: !prev[moduleId] }));

        // Only fetch lessons if not already loaded
        if (!expandedModules[moduleId] && !lessons[moduleId]) {
            try {
                setLoadingLessons(prev => ({ ...prev, [moduleId]: true }));

                // Fetch lessons from API
                const res = await apiClient.getModuleLessons(moduleId);
                const lessonsData = unwrapList(res);

                // Sort lessons by order_index
                const sortedLessons = lessonsData.sort((a, b) => a.order_index - b.order_index);

                setLessons(prev => ({ ...prev, [moduleId]: sortedLessons }));
            } catch (e) {
                console.error('Failed to load lessons:', e);
                showNotification?.('Failed to load lessons.', 'error');
                setLessons(prev => ({ ...prev, [moduleId]: [] }));
            } finally {
                setLoadingLessons(prev => ({ ...prev, [moduleId]: false }));
            }
        }
    };

    const handleViewModule = (moduleId, courseId, e) => {
        e.stopPropagation();
        showNotification?.(`Viewing module #${moduleId} of course #${courseId}`, 'info');
    };

    const handleEditModule = (moduleId, courseId, e) => {
        e.stopPropagation();
        showNotification?.(`Editing module #${moduleId} of course #${courseId}`, 'info');
    };

    const handleAddLesson = (moduleId, courseId, e) => {
        e.stopPropagation();
        showNotification?.(`Adding lesson to module #${moduleId} of course #${courseId}`, 'info');
    };

    const handleViewLesson = (lessonId, moduleId, e) => {
        e.stopPropagation();
        showNotification?.(`Viewing lesson #${lessonId} of module #${moduleId}`, 'info');
    };

    const handleEditLesson = (lessonId, moduleId, e) => {
        e.stopPropagation();
        showNotification?.(`Editing lesson #${lessonId} of module #${moduleId}`, 'info');
    };

    const handleDeleteLesson = (lessonId, moduleId, e) => {
        e.stopPropagation();
        showNotification?.(`Deleting lesson #${lessonId} of module #${moduleId}`, 'info');
    };

    return (
        <div className="space-y-6 ">
            {/* Top Section & Stats */}
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
                                const courseModules = modules[course.id] || [];
                                const hasModules = courseModules.length > 0;

                                return (
                                    <React.Fragment key={course.id}>
                                        <tr className="hover:bg-gray-50 cursor-pointer" onClick={() => toggleCourseModules(course.id)}>
                                            <td className="px-4 py-4 whitespace-nowrap flex items-center justify-between">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900 truncate max-w-[220px]">
                                                        {course.title}
                                                    </div>
                                                    <div className="text-sm text-gray-500 truncate max-w-[220px]">
                                                        {course.category?.name || '—'}
                                                    </div>
                                                </div>

                                                <div className="ml-2">
                                                    {expandedCourses[course.id] ? <FaChevronUp /> : <FaChevronDown />}
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
                                                        onClick={(e) => { e.stopPropagation(); handleEditCourse(course.id); }}
                                                        className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg"
                                                    >
                                                        <FaEdit />
                                                    </button>
                                                    <button className="text-gray-600 hover:text-gray-900 p-2 hover:bg-gray-50 rounded-lg">
                                                        <FaEye />
                                                    </button>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleDeleteCourse(course.id); }}
                                                        className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>

                                        {/* Modules Section */}
                                        {expandedCourses[course.id] && (
                                            <tr>
                                                <td colSpan={7} className="bg-gray-50 px-4 py-6">
                                                    <div className="ml-8">
                                                        <div className="flex justify-between items-center mb-4">
                                                            <h4 className="font-medium text-gray-800">Modules ({courseModules.length})</h4>
                                                            <div className="text-sm text-gray-500">
                                                                {hasModules ? `Total Duration: ${courseModules.reduce((acc, mod) => acc + (parseInt(mod.duration) || 0), 0)}h` : ''}
                                                            </div>
                                                        </div>

                                                        {loadingModules[course.id] ? (
                                                            <div className="text-center py-4">
                                                                <div className="text-gray-500">Loading modules...</div>
                                                            </div>
                                                        ) : hasModules ? (
                                                            <div className="space-y-4">
                                                                {courseModules.map((module) => {
                                                                    const moduleLessons = lessons[module.id] || [];
                                                                    const isExpanded = expandedModules[module.id];

                                                                    return (
                                                                        <div key={module.id} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                                                                            {/* Module Header */}
                                                                            <div
                                                                                className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50"
                                                                                onClick={() => toggleModuleLessons(module.id, course.id)}
                                                                            >
                                                                                <div className="flex-1">
                                                                                    <div className="flex items-start">
                                                                                        <div className="flex-shrink-0 pt-1">
                                                                                            <div className="w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full">
                                                                                                {module.order_index}
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="ml-3 flex-1">
                                                                                            <div className="flex items-center justify-between">
                                                                                                <h5 className="font-medium text-gray-900">{module.title}</h5>
                                                                                                <div className="flex items-center space-x-2">
                                                                                                    <span className="text-xs text-gray-500">{module.duration}</span>
                                                                                                    {isExpanded ? <FaChevronUp className="text-gray-400" /> : <FaChevronDown className="text-gray-400" />}
                                                                                                </div>
                                                                                            </div>
                                                                                            {module.description && (
                                                                                                <p className="text-sm text-gray-600 mt-1">{module.description}</p>
                                                                                            )}
                                                                                            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                                                                                                <span>{module.lessons_count} lessons</span>
                                                                                                <span>Order: {module.order_index}</span>
                                                                                                <span>Progress: {module.progress_percentage}%</span>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>

                                                                            {/* Lessons Section */}
                                                                            {isExpanded && (
                                                                                <div className="border-t border-gray-200 bg-gray-50">
                                                                                    <div className="p-4">
                                                                                        <div className="flex justify-between items-center mb-3">
                                                                                            <h6 className="font-medium text-gray-700">Lessons ({moduleLessons.length})</h6>

                                                                                        </div>

                                                                                        {loadingLessons[module.id] ? (
                                                                                            <div className="text-center py-2">
                                                                                                <div className="text-gray-500">Loading lessons...</div>
                                                                                            </div>
                                                                                        ) : moduleLessons.length > 0 ? (
                                                                                            <div className="space-y-2">
                                                                                                {moduleLessons.map((lesson) => (
                                                                                                    <div key={lesson.id} className="bg-white rounded border border-gray-200 p-3 hover:bg-gray-50">
                                                                                                        <div className="flex items-start">
                                                                                                            <div className="flex-shrink-0 pt-1">
                                                                                                                {getLessonIcon(lesson.type)}
                                                                                                            </div>
                                                                                                            <div className="ml-3 flex-1">
                                                                                                                <div className="flex justify-between items-start">
                                                                                                                    <div>
                                                                                                                        <div className="font-medium text-gray-900">{lesson.title}</div>
                                                                                                                        {lesson.description && (
                                                                                                                            <p className="text-sm text-gray-600 mt-1">{lesson.description}</p>
                                                                                                                        )}
                                                                                                                    </div>
                                                                                                                    <div className="flex items-center space-x-2">
                                                                                                                        <span className="text-xs text-gray-500">{lesson.duration}</span>
                                                                                                                        <span className={`text-xs px-2 py-1 rounded-full ${lesson.type === 'video' ? 'bg-red-100 text-red-800' : lesson.type === 'text' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                                                                                                                            {lesson.type}
                                                                                                                        </span>
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="flex items-center justify-between mt-2">
                                                                                                                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                                                                                                                        <span>Order: {lesson.order_index}</span>
                                                                                                                        <span>•</span>
                                                                                                                        <span>ID: {lesson.id}</span>
                                                                                                                        {lesson.content_url && (
                                                                                                                            <>
                                                                                                                                <span>•</span>
                                                                                                                                <span className="text-blue-600">Has Content</span>
                                                                                                                            </>
                                                                                                                        )}
                                                                                                                    </div>
                                                                                                                    <div className="flex items-center space-x-2">
                                                                                                                        <button
                                                                                                                            onClick={(e) => handleViewLesson(lesson.id, module.id, e)}
                                                                                                                            className="text-xs px-2 py-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                                                                                                                        >
                                                                                                                            View
                                                                                                                        </button>
                                                                                                                        <button
                                                                                                                            onClick={(e) => handleEditLesson(lesson.id, module.id, e)}
                                                                                                                            className="text-xs px-2 py-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded"
                                                                                                                        >
                                                                                                                            Edit
                                                                                                                        </button>
                                                                                                                        <button
                                                                                                                            onClick={(e) => handleDeleteLesson(lesson.id, module.id, e)}
                                                                                                                            className="text-xs px-2 py-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                                                                                                                        >
                                                                                                                            Delete
                                                                                                                        </button>
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                ))}
                                                                                            </div>
                                                                                        ) : (
                                                                                            <div className="text-center py-4 bg-white rounded border border-gray-200">
                                                                                                <div className="text-gray-500">No lessons found</div>
                                                                                                <button
                                                                                                    onClick={(e) => handleAddLesson(module.id, course.id, e)}
                                                                                                    className="mt-2 text-sm text-primary hover:text-primary-dark"
                                                                                                >
                                                                                                    Add your first lesson
                                                                                                </button>
                                                                                            </div>
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        ) : (
                                                            <div className="text-center py-6 bg-white rounded-lg border border-gray-200">
                                                                <div className="text-gray-500">No modules found for this course</div>
                                                                <div className="text-sm text-gray-400 mt-1">Modules will appear here once they are created</div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
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
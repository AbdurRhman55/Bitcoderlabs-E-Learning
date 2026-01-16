// src/Dashboards/TeacherDashboard/CoursesManagement.jsx
import React, { useEffect, useMemo, useState } from 'react';
import {
    FaPlus, FaEdit, FaTrash, FaEye, FaClock, FaUsers,
    FaStar, FaCheckCircle, FaHourglassHalf, FaTimesCircle,
    FaChevronDown, FaChevronUp, FaFileVideo, FaFileAlt,
    FaQuestionCircle, FaBook, FaChalkboardTeacher, FaSearch
} from 'react-icons/fa';
import { apiClient } from '../../api/index.js';

const CoursesManagement = ({ showNotification }) => {
    // ================= STATE =================
    // 1. Approved Courses (My Courses)
    const [myCourses, setMyCourses] = useState([]);

    // 2. All Available Courses (For Request Dropdown)
    const [allCatalogCourses, setAllCatalogCourses] = useState([]);

    // 3. Request History (For Requests Table)
    const [requestHistory, setRequestHistory] = useState([]);

    const [selectedCourseId, setSelectedCourseId] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Expansion States
    const [expandedCourses, setExpandedCourses] = useState({});
    const [modules, setModules] = useState({});
    const [expandedModules, setExpandedModules] = useState({});
    const [lessons, setLessons] = useState({});
    const [loadingContent, setLoadingContent] = useState({});

    // HELPERS 
    const unwrapList = (res) => {
        const list = res?.data;
        return Array.isArray(list) ? list : [];
    };

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

    // ================= DATA FETCHING =================
    const refreshData = async () => {
        try {
            setLoading(true);
            const [myCoursesRes, catalogRes, requestsRes] = await Promise.all([
                apiClient.getMyCourses(),      // ONLY Approved/Assigned courses
                apiClient.getCourses(),        // ALL Courses for the dropdown
                apiClient.getMyCourseRequests() // Request History
            ]);

            // Filter My Courses to ensure we ONLY show active/approved ones if API returns mix
            // Assuming getMyCourses returns the teacher's active assignments
            const fetchedMyCourses = unwrapList(myCoursesRes);
            setMyCourses(fetchedMyCourses);

            setAllCatalogCourses(unwrapList(catalogRes));
            setRequestHistory(unwrapList(requestsRes));
        } catch (e) {
            console.error('Failed to load data:', e);
            showNotification?.(e?.message || 'Failed to load data.', 'error');
            setMyCourses([]);
            setAllCatalogCourses([]);
            setRequestHistory([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshData();
    }, []);

    // ================= ACTIONS =================
    const handleSubmitRequest = async () => {
        if (!selectedCourseId) {
            showNotification?.('Please select a course first.', 'warning');
            return;
        }

        try {
            setSubmitting(true);
            await apiClient.createCourseRequest(Number(selectedCourseId));
            showNotification?.('Request submitted successfully. Waiting for Admin approval.', 'success');
            setSelectedCourseId(''); // Reset dropdown
            await refreshData(); // Refresh to update lists
        } catch (e) {
            console.error('Failed to submit request:', e);
            showNotification?.(e?.message || 'Failed to submit request.', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    // ================= EXPANSION LOGIC =================
    const toggleCourseModules = async (courseId) => {
        setExpandedCourses(prev => ({ ...prev, [courseId]: !prev[courseId] }));

        if (!expandedCourses[courseId] && !modules[courseId]) {
            try {
                setLoadingContent(prev => ({ ...prev, [`c_${courseId}`]: true }));

                // Pass as object for query param: ?course_id=ID
                const res = await apiClient.getCourseModules({ course_id: courseId });

                // Unwarp and STRICTLY filter on client side (like Admin Dashboard)
                const modulesData = unwrapList(res).filter(m => m.course_id == courseId);

                setModules(prev => ({
                    ...prev,
                    [courseId]: modulesData.sort((a, b) => a.order_index - b.order_index)
                }));
            } catch (e) { console.error(e); }
            finally { setLoadingContent(prev => ({ ...prev, [`c_${courseId}`]: false })); }
        }
    };

    const toggleModuleLessons = async (moduleId) => {
        setExpandedModules(prev => ({ ...prev, [moduleId]: !prev[moduleId] }));

        if (!expandedModules[moduleId] && !lessons[moduleId]) {
            try {
                setLoadingContent(prev => ({ ...prev, [`m_${moduleId}`]: true }));

                // Pass as object for query param: ?module_id=ID
                const res = await apiClient.getModuleLessons({ module_id: moduleId });

                // Unwarp and STRICTLY filter on client side (like Admin Dashboard)
                const lessonsData = unwrapList(res).filter(l => l.module_id == moduleId);

                setLessons(prev => ({
                    ...prev,
                    [moduleId]: lessonsData.sort((a, b) => a.order_index - b.order_index)
                }));
            } catch (e) { console.error(e); }
            finally { setLoadingContent(prev => ({ ...prev, [`m_${moduleId}`]: false })); }
        }
    };

    // ================= STATS =================
    const stats = useMemo(() => {
        return {
            totalCourses: myCourses.length,
            totalStudents: myCourses.reduce((acc, c) => acc + (Number(c.students_count) || 0), 0),
            pendingRequests: requestHistory.filter(r => r.status === 'pending').length
        };
    }, [myCourses, requestHistory]);

    // ================= RENDER =================
    return (
        <div className="space-y-8 p-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <FaChalkboardTeacher className="text-primary" />
                    Courses Management
                </h1>
                <p className="text-gray-600 mt-1">Request courses to teach and manage your approved curriculum.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><FaBook size={24} /></div>
                    <div>
                        <p className="text-sm text-gray-500">My Approved Courses</p>
                        <p className="text-2xl font-bold">{stats.totalCourses}</p>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
                    <div className="p-3 bg-green-50 text-green-600 rounded-lg"><FaUsers size={24} /></div>
                    <div>
                        <p className="text-sm text-gray-500">Total Students</p>
                        <p className="text-2xl font-bold">{stats.totalStudents}</p>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
                    <div className="p-3 bg-yellow-50 text-yellow-600 rounded-lg"><FaHourglassHalf size={24} /></div>
                    <div>
                        <p className="text-sm text-gray-500">Pending Requests</p>
                        <p className="text-2xl font-bold">{stats.pendingRequests}</p>
                    </div>
                </div>
            </div>

            {/* 1. Request Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <FaPlus className="text-primary" />
                    Request New Course
                </h3>
                <div className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="w-full md:flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Select a course from database</label>
                        <div className="relative">
                            <select
                                value={selectedCourseId}
                                onChange={(e) => setSelectedCourseId(e.target.value)}
                                className="w-full p-3 pl-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none appearance-none bg-white"
                            >
                                <option value="">-- Select a course to request --</option>
                                {allCatalogCourses.map(course => {
                                    // Check status
                                    const isAssigned = myCourses.some(my => my.id === course.id);
                                    const pending = requestHistory.find(r => r.course_id === course.id && r.status === 'pending');

                                    // Disable if assigned OR pending
                                    const isDisabled = isAssigned || !!pending;

                                    return (
                                        <option key={course.id} value={course.id} disabled={isDisabled} className="py-2">
                                            {course.title}
                                            {isAssigned ? ' (Already Assigned)' : pending ? ' (Request Pending)' : ''}
                                        </option>
                                    );
                                })}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                                <FaChevronDown size={12} />
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={handleSubmitRequest}
                        disabled={submitting || !selectedCourseId}
                        className="px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed min-w-[150px]"
                    >
                        {submitting ? 'Sending...' : 'Send Request'}
                    </button>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                    * Only unassigned courses are shown. Pending requests are disabled.
                </p>
            </div>

            {/* 2. My Courses Table (APPROVED ONLY) */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                        <FaBook className="text-gray-600" />
                        My Approved Courses
                    </h3>
                    <span className="text-xs font-semibold px-2 py-1 bg-green-100 text-green-800 rounded-full">
                        Strictly Approved Only
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-medium">
                            <tr>
                                <th className="px-6 py-3 text-left">Course Name</th>
                                <th className="px-6 py-3 text-left">Category</th>
                                <th className="px-6 py-3 text-left">Students</th>
                                <th className="px-6 py-3 text-left">Status</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">Loading your courses...</td></tr>
                            ) : myCourses.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center text-gray-500">
                                            <FaChalkboardTeacher size={48} className="text-gray-300 mb-4" />
                                            <p className="text-lg font-medium">No approved courses yet</p>
                                            <p className="text-sm">Request a course above and wait for admin approval.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                myCourses.map(course => (
                                    <React.Fragment key={course.id}>
                                        <tr
                                            className="hover:bg-gray-50 transition-colors cursor-pointer"
                                            onClick={() => toggleCourseModules(course.id)}
                                        >
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-gray-900">{course.title}</div>
                                                <div className="text-xs text-gray-500">ID: {course.id}</div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{course.category?.name || '—'}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{course.students_count || 0}</td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    <FaCheckCircle size={10} /> Approved
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="text-gray-400 hover:text-primary transition-colors">
                                                    {expandedCourses[course.id] ? <FaChevronUp /> : <FaChevronDown />}
                                                </button>
                                            </td>
                                        </tr>
                                        {/* EXPANDED MODULES */}
                                        {expandedCourses[course.id] && (
                                            <tr>
                                                <td colSpan="5" className="px-0 py-0 border-b border-gray-100">
                                                    <div className="bg-gray-50 p-6 border-l-4 border-primary">
                                                        <h4 className="text-sm font-bold text-gray-700 mb-3 ml-2 uppercase tracking-wide">Course Curriculum</h4>

                                                        {loadingContent[`c_${course.id}`] ? (
                                                            <div className="text-center py-4 text-gray-500 flex items-center justify-center gap-2">
                                                                <FaHourglassHalf className="animate-spin text-primary" /> Loading modules...
                                                            </div>
                                                        ) : (modules[course.id] || []).length === 0 ? (
                                                            <div className="text-center py-4 text-gray-400 italic">No modules found.</div>
                                                        ) : (
                                                            <div className="space-y-3">
                                                                {(modules[course.id] || []).map((module) => (
                                                                    <div key={module.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                                                                        {/* Module Header */}
                                                                        <div
                                                                            className="flex justify-between items-center p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                toggleModuleLessons(module.id);
                                                                            }}
                                                                        >
                                                                            <div className="flex items-center gap-3">
                                                                                <span className="bg-blue-50 text-blue-600 text-xs font-bold w-6 h-6 flex items-center justify-center rounded">
                                                                                    {module.order_index}
                                                                                </span>
                                                                                <span className="font-medium text-gray-800">{module.title}</span>
                                                                            </div>
                                                                            <div className="flex items-center gap-2 text-gray-400 text-xs">
                                                                                <span>{module.lessons_count || 0} Lessons</span>
                                                                                {expandedModules[module.id] ? <FaChevronUp className="text-primary" /> : <FaChevronDown />}
                                                                            </div>
                                                                        </div>

                                                                        {/* Lessons List - Explicitly Dependent on Module ID */}
                                                                        {expandedModules[module.id] && (
                                                                            <div className="border-t border-gray-100 bg-gray-50/50">
                                                                                {loadingContent[`m_${module.id}`] ? (
                                                                                    <div className="p-4 text-center text-xs text-gray-500 flex justify-center gap-2">
                                                                                        <FaHourglassHalf className="animate-spin text-primary" /> Loading lessons...
                                                                                    </div>
                                                                                ) : (lessons[module.id] || []).length === 0 ? (
                                                                                    <div className="p-4 text-center text-xs text-gray-400 italic">No lessons in this module.</div>
                                                                                ) : (
                                                                                    <ul className="divide-y divide-gray-100">
                                                                                        {(lessons[module.id] || []).map((lesson, idx) => (
                                                                                            <li key={lesson.id || idx} className="p-3 pl-12 flex justify-between items-center hover:bg-white transition-colors">
                                                                                                <div className="flex items-center gap-3">
                                                                                                    <span className="text-gray-400 text-xs w-5">{idx + 1}.</span>
                                                                                                    {lesson.type === 'video' ? <FaFileVideo className="text-red-400" /> : <FaFileAlt className="text-blue-400" />}
                                                                                                    <div className='flex flex-col'>
                                                                                                        <span className="text-sm font-medium text-gray-700">{lesson.title}</span>
                                                                                                        <span className="text-[10px] text-gray-400 uppercase tracking-wider">{lesson.type}</span>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <button className="text-xs px-2 py-1 bg-white border border-gray-200 rounded text-gray-600 hover:bg-primary hover:text-white hover:border-primary transition-all">
                                                                                                    View Content
                                                                                                </button>
                                                                                            </li>
                                                                                        ))}
                                                                                    </ul>
                                                                                )}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 3. My Requests History */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="font-bold text-gray-800">My Requests History</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-medium">
                            <tr>
                                <th className="px-6 py-3 text-left">Course Name</th>
                                <th className="px-6 py-3 text-left">Date Requested</th>
                                <th className="px-6 py-3 text-left">Status</th>
                                <th className="px-6 py-3 text-left">Admin Note</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {requestHistory.length === 0 ? (
                                <tr><td colSpan="4" className="px-6 py-8 text-center text-gray-500">No request history found.</td></tr>
                            ) : (
                                requestHistory.map(req => (
                                    <tr key={req.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900">{req.course?.title || 'Unknown Course'}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {req.created_at ? new Date(req.created_at).toLocaleDateString() : '—'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {getStatusIcon(req.status)}
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(req.status)}`}>
                                                    {req.status}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 italic">
                                            {req.reason || req.admin_note || '—'}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CoursesManagement;

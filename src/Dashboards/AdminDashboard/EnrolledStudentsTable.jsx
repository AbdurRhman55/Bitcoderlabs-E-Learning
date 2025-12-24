import React, { useEffect, useState, useCallback } from "react";
import { Eye } from "lucide-react";
import { apiClient } from "../../../src/api/index.js";

export default function EnrolledStudentsTable() {
    const [enrollments, setEnrollments] = useState([]);
    const [users, setUsers] = useState({}); // { userId: userData }
    const [courses, setCourses] = useState({}); // { courseId: courseData }
    const [loading, setLoading] = useState(true);
    const [selectedEnrollment, setSelectedEnrollment] = useState(null);

    // ================= FETCH STUDENT BY ID =================
    const fetchStudentById = async (userId) => {
        if (!userId) return null;
        try {
            const res = await apiClient.getUserById(userId);
            return res.data || null;
        } catch (err) {
            console.error(`Failed to fetch student ${userId}`, err);
            return null;
        }
    };


    // ================= FETCH COURSE BY ID =================
    const fetchCourseById = async (courseId) => {
        if (!courseId) return null;

        try {
            const res = await apiClient.getCourseById(courseId);
            const course =
                Array.isArray(res?.data?.data)
                    ? res.data.data[0]          // first course object
                    : res?.data?.data || res?.data;
            return course || null;
        } catch (err) {
            console.error(`Failed to fetch course ${courseId}`, err);
            return null;
        }
    };



    // ================= FETCH ALL ENROLLMENTS =================
    const fetchEnrollments = useCallback(async () => {
        try {
            setLoading(true);
            const res = await apiClient.getEnrollments();
            const enrollmentsData = res.data ? (Array.isArray(res.data) ? res.data : [res.data]) : [];
            setEnrollments(enrollmentsData);

            // Collect unique user IDs and course IDs
            const userIds = [...new Set(enrollmentsData.map(e => e.user_id).filter(Boolean))];
            const courseIds = [...new Set(enrollmentsData.map(e => e.course_id).filter(Boolean))];

            // Fetch all users
            const usersPromises = userIds.map(async (userId) => {
                const userData = await fetchStudentById(userId);
                return { userId, userData };
            });

            // Fetch all courses
            const coursesPromises = courseIds.map(async (courseId) => {
                const courseData = await fetchCourseById(courseId);
                return { courseId, courseData };
            });

            const usersResults = await Promise.all(usersPromises);
            const coursesResults = await Promise.all(coursesPromises);

            // Convert to objects for easy lookup
            const usersMap = {};
            usersResults.forEach(({ userId, userData }) => {
                if (userData) {
                    usersMap[userId] = userData;
                }
            });

            const coursesMap = {};
            coursesResults.forEach(({ courseId, courseData }) => {
                if (courseData) {
                    coursesMap[courseId] = courseData;
                }
            });

            setUsers(usersMap);
            setCourses(coursesMap);
        } catch (err) {
            console.error("Failed to fetch enrollments:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchEnrollments();
    }, [fetchEnrollments]);

    // ================= GET STUDENT NAME =================
    const getStudentName = (userId) => {
        if (!userId) return "—";
        const user = users[userId];
        return user?.name || user?.username || user?.email || "—";
    };

    // ================= GET STUDENT EMAIL =================
    const getStudentEmail = (userId) => {
        if (!userId) return "—";
        const user = users[userId];
        return user?.email || "—";
    };

    // ================= GET COURSE TITLE =================
    const getCourseTitle = (courseId) => {
        if (!courseId) return "—";
        const course = courses[courseId];
        return course?.title || course?.name || "—";
    };

    // ================= FILTER =================
    const pendingEnrollments = enrollments.filter(e => !e.is_active);
    const activeEnrollments = enrollments.filter(e => e.is_active);

    // ================= VIEW =================
    const handleView = (enrollment) => {
        const enrichedEnrollment = {
            ...enrollment,
            user: users[enrollment.user_id] || null,
            course: courses[enrollment.course_id] || null
        };
        setSelectedEnrollment(enrichedEnrollment);
    };

    // ================= REFRESH =================
    const handleRefresh = () => {
        fetchEnrollments();
    };

    return (
        <div className="space-y-10">
            {/* Header with Refresh Button */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Enrolled Students</h1>
                    <p className="text-gray-600">Manage student enrollments and track progress</p>
                </div>
                <button
                    onClick={handleRefresh}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                    disabled={loading}
                >
                    {loading ? "Loading..." : "Refresh"}
                </button>
            </div>

            {loading ? (
                <div className="text-center py-10">
                    <div className="text-gray-500">Loading enrollments...</div>
                </div>
            ) : (
                <>
                    {/* ================= PENDING ENROLLMENT REQUESTS ================= */}
                    {pendingEnrollments.length > 0 && (
                        <section>
                            <h2 className="text-xl font-bold text-[#2a9fd8] mb-4">
                                Pending Enrollment Requests ({pendingEnrollments.length})
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                {pendingEnrollments.map((enrollment) => (
                                    <div
                                        key={enrollment.id}
                                        className="bg-white border border-[#3baee9]/30 rounded-xl p-4 shadow-sm hover:shadow-md transition"
                                    >
                                        <p className="text-lg font-semibold">
                                            {getStudentName(enrollment.user_id)}
                                        </p>

                                        <p className="text-xs text-gray-500">
                                            {getStudentEmail(enrollment.user_id)}
                                        </p>

                                        <div className="mt-3 bg-[#e8f7ff] rounded-lg p-2 text-xs text-gray-700 space-y-1">
                                            <p><b>Course:</b> {getCourseTitle(enrollment.course_id)}</p>
                                            <p><b>Progress:</b> {enrollment.progress_percentage ?? 0}%</p>
                                            <p><b>Enrollment ID:</b> {enrollment.id}</p>
                                        </div>

                                        <button
                                            onClick={() => handleView(enrollment)}
                                            className="mt-3 w-full text-xs py-2 border rounded-lg text-[#3baee9] flex items-center justify-center gap-1 hover:bg-[#e8f7ff]"
                                            disabled={loading}
                                        >
                                            <Eye size={14} /> View Details
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* ================= ACTIVE ENROLLED STUDENTS ================= */}
                    <section className="bg-white rounded-xl border border-gray-200 shadow-sm">
                        <div className="px-6 py-4 border-b border-gray-200 bg-primary rounded-t-xl">
                            <h2 className="text-3xl font-bold text-white">Enrolled Students</h2>
                            <p className="text-sm text-white">
                                {activeEnrollments.length} active enrollments
                            </p>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50">
                                    <tr className="border-gray-200 border-b">
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Student ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Email</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Course</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Progress</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">View</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y">
                                    {activeEnrollments.length > 0 ? (
                                        activeEnrollments.map((enrollment) => (
                                            <tr key={enrollment.id} className="hover:bg-gray-50 border-gray-200 border-b">
                                                <td className="px-6 py-4">
                                                    <span className="text-xs text-gray-500">#{enrollment.user_id}</span>
                                                </td>
                                                <td className="px-6 py-4 font-medium">
                                                    {getStudentName(enrollment.user_id)}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {getStudentEmail(enrollment.user_id)}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {getCourseTitle(enrollment.course_id)}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center">
                                                        <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                                                            <div
                                                                className="bg-green-500 h-2 rounded-full"
                                                                style={{ width: `${enrollment.progress_percentage || 0}%` }}
                                                            ></div>
                                                        </div>
                                                        <span>{enrollment.progress_percentage ?? 0}%</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="px-2 py-1 text-xs rounded-full bg-primary text-white">
                                                        Enrolled
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <button
                                                        onClick={() => handleView(enrollment)}
                                                        className="text-[#3baee9] cursor-pointer flex items-center gap-1 hover:text-primary-dark"
                                                        disabled={loading}
                                                    >
                                                        <Eye size={16} /> View
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                                                No active enrollments found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* ================= VIEW MODAL ================= */}
                    {selectedEnrollment && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                            <div className="bg-white w-full max-w-lg  rounded-2xl shadow-lg p-6 relative">
                                <button
                                    onClick={() => setSelectedEnrollment(null)}
                                    className="absolute top-4 right-4  text-gray-400 hover:text-black cursor-pointer text-lg"
                                >
                                    ✕
                                </button>

                                <h3 className="text-2xl font-bold">
                                    {selectedEnrollment.user?.name || getStudentName(selectedEnrollment.user_id)}
                                </h3>

                                <p className="text-sm text-gray-500">
                                    {selectedEnrollment.user?.email || getStudentEmail(selectedEnrollment.user_id)}
                                </p>

                                <div className="mt-3 space-y-3">
                                    <div className="bg-primary rounded-lg p-4">
                                        <h4 className="font-medium text-white mb-2">Student Information</h4>
                                        <div className="grid grid-cols-2 gap-3 text-sm">
                                            <div>
                                                <p className="text-white">Student ID</p>
                                                <p className="font-medium text-white">#{selectedEnrollment.user_id}</p>
                                            </div>
                                            <div>
                                                <p className="text-white">User ID</p>
                                                <p className="font-medium text-white " >#{selectedEnrollment.user?.id || "N/A"}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <h4 className="font-medium font-bold text-gray-800 mb-2">Course Information</h4>
                                        <div className="text-xs space-y-2">
                                            <p><b>Course:</b> {selectedEnrollment.course?.title || getCourseTitle(selectedEnrollment.course_id)}</p>
                                            <p><b>Course ID:</b> #{selectedEnrollment.course_id}</p>
                                            {selectedEnrollment.course?.description && (
                                                <p><b>Description:</b> {selectedEnrollment.course.description}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <h4 className="font-medium text-gray-800 mb-2">Enrollment Details</h4>
                                        <div className="text-xs space-y-2">
                                            <p><b>Progress:</b> {selectedEnrollment.progress_percentage ?? 0}%</p>
                                            <p><b>Enrollment ID:</b> #{selectedEnrollment.id}</p>
                                            <p><b>Status:</b> {selectedEnrollment.is_active ? "Active" : "Pending"}</p>
                                            <p><b>Enrolled At:</b> {selectedEnrollment.enrolled_at || "Not available"}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
// src/components/sections/StudentsSection.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { FaSearch, FaUserGraduate, FaChartLine, FaEnvelope, FaCalendarAlt, FaDownload, FaRedoAlt } from 'react-icons/fa';
import { apiClient } from "../../../src/api/index.js";

const StudentsSection = () => {
    const [students, setStudents] = useState([]);
    const [users, setUsers] = useState({});
    const [courses, setCourses] = useState({});
    const [teacherCourses, setTeacherCourses] = useState([]); // Teacher's assigned courses
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        onTrack: 0,
        average: 0,
        needsHelp: 0
    });

    // ================= FETCH TEACHER'S ASSIGNED COURSES =================
    const fetchTeacherCourses = async () => {
        try {
            const res = await apiClient.getMyCourses();
            const coursesData = res?.data || res || [];
            const activeCourses = Array.isArray(coursesData) ? coursesData : [coursesData];
            setTeacherCourses(activeCourses);
            return activeCourses.map(course => course.id);
        } catch (err) {
            console.error("Failed to fetch teacher courses:", err);
            return [];
        }
    };

    // ================= FETCH ALL DATA =================
    const fetchAllData = useCallback(async () => {
        try {
            setLoading(true);

            // First, get teacher's assigned courses
            const teacherCourseIds = await fetchTeacherCourses();

            if (teacherCourseIds.length === 0) {
                setStudents([]);
                setUsers({});
                setCourses({});
                setStats({ onTrack: 0, average: 0, needsHelp: 0 });
                return;
            }

            // Fetch enrollments using your existing apiClient method
            const enrollmentsRes = await apiClient.getEnrollments();
            let enrollmentsData = enrollmentsRes?.data || enrollmentsRes || [];

            // Make sure it's an array
            enrollmentsData = Array.isArray(enrollmentsData) ? enrollmentsData : [enrollmentsData];

            // Filter only active enrollments AND enrollments in teacher's courses
            const activeEnrollments = enrollmentsData.filter(e =>
                (e.is_active === true ||
                    e.status === 'active' ||
                    e.enrollment_status === 'active') &&
                teacherCourseIds.includes(e.course_id)
            );

            setStudents(activeEnrollments);

            // Extract unique user IDs and course IDs from filtered enrollments
            const userIds = [...new Set(activeEnrollments
                .map(e => e.user_id)
                .filter(Boolean)
            )];

            const courseIds = [...new Set(activeEnrollments
                .map(e => e.course_id)
                .filter(Boolean)
            )];

            // Fetch users in parallel using your existing getUserById method
            const usersPromises = userIds.map(async (userId) => {
                try {
                    const userRes = await apiClient.getUserById(userId);
                    return {
                        userId,
                        userData: userRes?.data || userRes || null
                    };
                } catch (err) {
                    console.error(`Failed to fetch user ${userId}`, err);
                    return { userId, userData: null };
                }
            });

            // Fetch courses in parallel using your existing getCourseById method
            const coursesPromises = courseIds.map(async (courseId) => {
                try {
                    const courseRes = await apiClient.getCourseById(courseId);
                    let courseData = courseRes?.data || courseRes;

                    // Handle array response (if API returns array of courses)
                    if (Array.isArray(courseData)) {
                        courseData = courseData[0] || null;
                    }

                    return {
                        courseId,
                        courseData
                    };
                } catch (err) {
                    console.error(`Failed to fetch course ${courseId}`, err);
                    return { courseId, courseData: null };
                }
            });

            // Wait for all promises
            const [usersResults, coursesResults] = await Promise.all([
                Promise.all(usersPromises),
                Promise.all(coursesPromises)
            ]);

            // Convert to lookup objects
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

            // Calculate stats
            calculateStats(activeEnrollments);

        } catch (err) {
            console.error("Failed to fetch data:", err);
            alert("Failed to load students data. Please try again.");
        } finally {
            setLoading(false);
        }
    }, []);

    // ================= CALCULATE STATISTICS =================
    const calculateStats = (enrollments) => {
        let onTrack = 0;
        let average = 0;
        let needsHelp = 0;

        enrollments.forEach(enrollment => {
            const progress = getProgressPercentage(enrollment);
            if (progress >= 80) onTrack++;
            else if (progress >= 60) average++;
            else needsHelp++;
        });

        const total = enrollments.length || 1;
        setStats({
            onTrack: Math.round((onTrack / total) * 100),
            average: Math.round((average / total) * 100),
            needsHelp: Math.round((needsHelp / total) * 100)
        });
    };

    // ================= INITIAL FETCH =================
    useEffect(() => {
        fetchAllData();
    }, [fetchAllData]);

    // ================= HELPER FUNCTIONS =================
    const getStudentName = (userId) => {
        if (!userId) return "—";
        const user = users[userId];
        return user?.name || user?.full_name || user?.username || user?.email || "—";
    };

    const getStudentEmail = (userId) => {
        if (!userId) return "—";
        const user = users[userId];
        return user?.email || "—";
    };

    const getCourseTitle = (courseId) => {
        if (!courseId) return "—";
        const course = courses[courseId];
        return course?.title || course?.name || course?.course_name || "—";
    };

    const getProgressPercentage = (enrollment) => {
        return enrollment?.progress_percentage ||
            enrollment?.progress ||
            enrollment?.completion_percentage ||
            0;
    };

    const getProgressColor = (progress) => {
        if (progress >= 80) return 'bg-green-500';
        if (progress >= 60) return 'bg-blue-500';
        if (progress >= 40) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (err) {
            return dateString;
        }
    };

    const getGrade = (progress) => {
        if (progress >= 90) return 'A+';
        if (progress >= 80) return 'A';
        if (progress >= 70) return 'B+';
        if (progress >= 60) return 'B';
        if (progress >= 50) return 'C+';
        if (progress >= 40) return 'C';
        return 'D';
    };

    // ================= FILTER STUDENTS =================
    const filteredStudents = students.filter(student => {
        if (!searchTerm) return true;

        const name = getStudentName(student.user_id).toLowerCase();
        const email = getStudentEmail(student.user_id).toLowerCase();
        const course = getCourseTitle(student.course_id).toLowerCase();
        const search = searchTerm.toLowerCase();

        return name.includes(search) ||
            email.includes(search) ||
            course.includes(search);
    });

    // ================= HANDLE STUDENT SELECTION =================
    const handleStudentSelect = (student) => {
        const enrichedStudent = {
            ...student,
            name: getStudentName(student.user_id),
            email: getStudentEmail(student.user_id),
            course: getCourseTitle(student.course_id),
            progress: getProgressPercentage(student),
            grade: getGrade(getProgressPercentage(student)),
            enrolled: formatDate(student.enrolled_at || student.created_at),
            user: users[student.user_id] || null,
            courseData: courses[student.course_id] || null
        };
        setSelectedStudent(enrichedStudent);
    };

    // ================= EXPORT DATA =================
    const handleExportData = () => {
        // Create CSV content
        const headers = ['Student Name', 'Email', 'Course', 'Enrollment Date', 'Progress', 'Grade'];
        const csvContent = [
            headers.join(','),
            ...filteredStudents.map(student => [
                `"${getStudentName(student.user_id)}"`,
                `"${getStudentEmail(student.user_id)}"`,
                `"${getCourseTitle(student.course_id)}"`,
                `"${formatDate(student.enrolled_at || student.created_at)}"`,
                `${getProgressPercentage(student)}%`,
                getGrade(getProgressPercentage(student))
            ].join(','))
        ].join('\n');

        // Create and download file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `students_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                    <h1 className="text-xl lg:text-2xl text-gray-900">Students Management</h1>
                    <p className="text-sm text-gray-500 mt-1 ">Track and support your student community in real-time.</p>
                </div>
                <div className="flex w-full sm:w-auto gap-3">
                    <button
                        onClick={fetchAllData}
                        disabled={loading}
                        className="flex-1 sm:flex-none justify-center px-4 py-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-700 font-bold text-sm transition-all flex items-center shadow-sm"
                    >
                        <FaRedoAlt className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
                        {loading ? '...' : 'Refresh'}
                    </button>
                    <button
                        onClick={handleExportData}
                        disabled={loading || students.length === 0}
                        className="flex-1 sm:flex-none justify-center px-4 py-2.5 bg-primary text-white rounded-xl hover:bg-primary-dark transition-all flex items-center  text-sm shadow-lg shadow-primary/20 disabled:opacity-50"
                    >
                        <FaDownload className="mr-2" />
                        Export
                    </button>
                </div>
            </div>

            {/* Search and Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 lg:gap-6">
                <div className="sm:col-span-3">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                            <FaSearch size={14} />
                        </div>
                        <input
                            type="search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-2xl bg-white focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary font-medium text-sm transition-all shadow-sm"
                            placeholder="Search by student name, email, or course..."
                            disabled={loading}
                        />
                    </div>
                </div>
                <div className="bg-white rounded-2xl flex flex-col justify-center items-center py-3 px-6 shadow-sm border border-gray-100">
                    <p className="text-2xl font-black text-primary">{students.length}</p>
                    <p className="text-[10px] text-gray-400  uppercase tracking-wider">Total Active Enrolled</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Students List */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg  text-gray-800">My Students ({students.length})</h3>
                            {teacherCourses.length > 0 && (
                                <p className="text-sm text-gray-500 mt-1">
                                    Showing students from {teacherCourses.length} assigned courses
                                </p>
                            )}
                        </div>

                        <div className="overflow-x-auto">
                            {loading ? (
                                <div className="text-center py-12">
                                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                                    <p className="mt-4 text-gray-500">Loading students data...</p>
                                </div>
                            ) : teacherCourses.length === 0 ? (
                                <div className="text-center py-12">
                                    <FaUserGraduate className="text-4xl text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-600">No courses assigned to you</p>
                                    <p className="text-sm text-gray-500 mt-2">
                                        You need to have courses assigned by admin to view students
                                    </p>
                                </div>
                            ) : filteredStudents.length === 0 ? (
                                <div className="text-center py-12">
                                    <FaUserGraduate className="text-4xl text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-600">No students found</p>
                                    {searchTerm ? (
                                        <p className="text-sm text-gray-500 mt-2">
                                            Try a different search term
                                        </p>
                                    ) : (
                                        <p className="text-sm text-gray-500 mt-2">
                                            No students enrolled in your courses yet
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs  text-gray-500 uppercase tracking-wider">Student</th>
                                            <th className="px-6 py-3 text-left text-xs  text-gray-500 uppercase tracking-wider">Course</th>
                                            <th className="px-6 py-3 text-left text-xs  text-gray-500 uppercase tracking-wider">Enrolled</th>
                                            <th className="px-6 py-3 text-left text-xs  text-gray-500 uppercase tracking-wider">Progress</th>
                                            <th className="px-6 py-3 text-left text-xs  text-gray-500 uppercase tracking-wider">Grade</th>
                                            <th className="px-6 py-3 text-left text-xs  text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredStudents.map((student) => {
                                            const progress = getProgressPercentage(student);
                                            const grade = getGrade(progress);

                                            return (
                                                <tr
                                                    key={student.id}
                                                    className={`hover:bg-gray-50 cursor-pointer ${selectedStudent?.id === student.id ? 'bg-primary-light' : ''}`}
                                                    onClick={() => handleStudentSelect(student)}
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-10 w-10 bg-primary-light rounded-full flex items-center justify-center">
                                                                <FaUserGraduate className="text-primary" />
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {getStudentName(student.user_id)}
                                                                </div>
                                                                <div className="text-sm text-gray-500">
                                                                    {getStudentEmail(student.user_id)}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">
                                                            {getCourseTitle(student.course_id)}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center text-sm text-gray-900">
                                                            <FaCalendarAlt className="mr-2 text-gray-400" />
                                                            {formatDate(student.enrolled_at || student.created_at)}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                                                                <div
                                                                    className={`h-2 rounded-full ${getProgressColor(progress)}`}
                                                                    style={{ width: `${progress}%` }}
                                                                ></div>
                                                            </div>
                                                            <span className="text-sm font-medium">{progress}%</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 py-1 text-xs  rounded-full ${grade === 'A+' ? 'bg-green-100 text-green-800' :
                                                            grade.includes('A') ? 'bg-blue-100 text-blue-800' :
                                                                grade.includes('B') ? 'bg-yellow-100 text-yellow-800' :
                                                                    'bg-red-100 text-red-800'
                                                            }`}>
                                                            {grade}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <button
                                                            onClick={() => handleStudentSelect(student)}
                                                            className="text-primary hover:text-primary-dark text-sm font-medium"
                                                        >
                                                            View Details
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>

                {/* Student Details */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg  text-gray-800 mb-6">Student Details</h3>

                    {selectedStudent ? (
                        <div className="space-y-6">
                            <div className="flex items-center space-x-4">
                                <div className="h-16 w-16 bg-primary-light rounded-full flex items-center justify-center">
                                    <FaUserGraduate className="text-primary text-2xl" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-gray-800">{selectedStudent.name}</h4>
                                    <p className="text-gray-600">{selectedStudent.email}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-500">Course</p>
                                    <p className="">{selectedStudent.course}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Enrollment Date</p>
                                    <p className="">{selectedStudent.enrolled}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Current Progress</p>
                                    <div className="flex items-center mt-1">
                                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full ${getProgressColor(selectedStudent.progress)}`}
                                                style={{ width: `${selectedStudent.progress}%` }}
                                            ></div>
                                        </div>
                                        <span className="ml-3 font-bold">{selectedStudent.progress}%</span>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Current Grade</p>
                                    <p className="text-2xl font-bold text-gray-800">{selectedStudent.grade}</p>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-gray-200">
                                <h4 className=" text-gray-800 mb-3">Enrollment Details</h4>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">Enrollment ID</span>
                                        <span className="">#{selectedStudent.id}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">Student ID</span>
                                        <span className="">#{selectedStudent.user_id}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">Course ID</span>
                                        <span className="">#{selectedStudent.course_id}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">Status</span>
                                        <span className="text-green-600">Active</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex space-x-3 pt-6 border-t border-gray-200">
                                <button className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center justify-center">
                                    <FaEnvelope className="mr-2" />
                                    Message
                                </button>
                                <button className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center">
                                    <FaChartLine className="mr-2" />
                                    Analytics
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <FaUserGraduate className="text-4xl text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-600">Select a student to view details</p>
                            {students.length === 0 && !loading && teacherCourses.length > 0 && (
                                <p className="text-sm text-gray-500 mt-2">No students enrolled in your courses yet</p>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Progress Analytics - Only show if students exist */}
            {students.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg  text-gray-800 mb-4">Class Progress Overview</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-4 bg-green-50 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm  text-green-800">On Track</span>
                                <span className="text-2xl  text-green-800">{stats.onTrack}%</span>
                            </div>
                            <p className="text-sm text-green-600">Students with 80%+ progress</p>
                        </div>
                        <div className="p-4 bg-blue-50 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm  text-blue-800">Average</span>
                                <span className="text-2xl  text-blue-800">{stats.average}%</span>
                            </div>
                            <p className="text-sm text-blue-600">Students with 60-80% progress</p>
                        </div>
                        <div className="p-4 bg-red-50 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm  text-red-800">Needs Help</span>
                                <span className="text-2xl  text-red-800">{stats.needsHelp}%</span>
                            </div>
                            <p className="text-sm text-red-600">Students with 60% progress</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentsSection;

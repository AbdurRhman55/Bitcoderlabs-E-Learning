// src/components/sections/StudentsSection.jsx
import React, { useState } from 'react';
import { FaSearch, FaFilter, FaUserGraduate, FaChartLine, FaEnvelope, FaPhone, FaCalendarAlt } from 'react-icons/fa';

const StudentsSection = () => {
    const [students, setStudents] = useState([
        { id: 1, name: 'John Doe', email: 'john@example.com', course: 'Advanced Mathematics', enrolled: '2024-01-15', progress: 85, grade: 'A' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', course: 'Calculus 101', enrolled: '2024-02-20', progress: 72, grade: 'B+' },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com', course: 'Physics Basics', enrolled: '2024-03-10', progress: 45, grade: 'C' },
        { id: 4, name: 'Alice Brown', email: 'alice@example.com', course: 'Advanced Mathematics', enrolled: '2024-01-25', progress: 95, grade: 'A+' },
    ]);

    const [selectedStudent, setSelectedStudent] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.course.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getProgressColor = (progress) => {
        if (progress >= 80) return 'bg-green-500';
        if (progress >= 60) return 'bg-blue-500';
        if (progress >= 40) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Students Management</h1>
                    <p className="text-gray-600">Track student progress and performance</p>
                </div>
                <div className="flex space-x-3">
                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
                        <FaFilter className="mr-2" />
                        Filter
                    </button>
                    <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
                        Export Data
                    </button>
                </div>
            </div>

            {/* Search and Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaSearch className="text-gray-400" />
                        </div>
                        <input
                            type="search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            placeholder="Search students by name, email, or course..."
                        />
                    </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <p className="text-2xl font-bold text-gray-800">{students.length}</p>
                    <p className="text-sm text-gray-600">Total Students</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Students List */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-800">Enrolled Students</h3>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enrolled</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredStudents.map((student) => (
                                        <tr
                                            key={student.id}
                                            className={`hover:bg-gray-50 cursor-pointer ${selectedStudent?.id === student.id ? 'bg-primary-light' : ''}`}
                                            onClick={() => setSelectedStudent(student)}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10 bg-primary-light rounded-full flex items-center justify-center">
                                                        <FaUserGraduate className="text-primary" />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">{student.name}</div>
                                                        <div className="text-sm text-gray-500">{student.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{student.course}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center text-sm text-gray-900">
                                                    <FaCalendarAlt className="mr-2 text-gray-400" />
                                                    {student.enrolled}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                                                        <div
                                                            className={`h-2 rounded-full ${getProgressColor(student.progress)}`}
                                                            style={{ width: `${student.progress}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-sm font-medium">{student.progress}%</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${student.grade === 'A+' ? 'bg-green-100 text-green-800' :
                                                    student.grade.includes('A') ? 'bg-blue-100 text-blue-800' :
                                                        student.grade.includes('B') ? 'bg-yellow-100 text-yellow-800' :
                                                            'bg-red-100 text-red-800'
                                                    }`}>
                                                    {student.grade}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <button className="text-primary hover:text-primary-dark text-sm font-medium">
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Student Details */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-medium text-gray-800 mb-6">Student Details</h3>

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
                                    <p className="font-medium">{selectedStudent.course}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Enrollment Date</p>
                                    <p className="font-medium">{selectedStudent.enrolled}</p>
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
                                <h4 className="font-medium text-gray-800 mb-3">Recent Activity</h4>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">Last Login</span>
                                        <span className="font-medium">2 hours ago</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">Assignments Completed</span>
                                        <span className="font-medium">12/15</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">Quiz Average</span>
                                        <span className="font-medium">85%</span>
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
                        </div>
                    )}
                </div>
            </div>

            {/* Progress Analytics */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Class Progress Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-4 bg-green-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-green-800">On Track</span>
                            <span className="text-2xl font-bold text-green-800">65%</span>
                        </div>
                        <p className="text-sm text-green-600">Students with 80% progress</p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-blue-800">Average</span>
                            <span className="text-2xl font-bold text-blue-800">25%</span>
                        </div>
                        <p className="text-sm text-blue-600">Students with 60-80% progress</p>
                    </div>
                    <div className="p-4 bg-red-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-red-800">Needs Help</span>
                            <span className="text-2xl font-bold text-red-800">10%</span>
                        </div>
                        <p className="text-sm text-red-600">Students with 60% progress</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentsSection;
// src/components/sections/CoursesManagement.jsx
import React, { useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaEye, FaClock, FaUsers, FaStar, FaCheckCircle, FaHourglassHalf, FaTimesCircle } from 'react-icons/fa';

const CoursesManagement = ({ showNotification }) => {
    const [courses, setCourses] = useState([
        { id: 1, title: 'Advanced Mathematics', students: 45, rating: 4.8, duration: '12 weeks', price: '$99', status: 'approved', category: 'Mathematics' },
        { id: 2, title: 'Introduction to Physics', students: 32, rating: 4.5, duration: '8 weeks', price: '$79', status: 'pending', category: 'Science' },
        { id: 3, title: 'Calculus 101', students: 67, rating: 4.9, duration: '10 weeks', price: '$89', status: 'approved', category: 'Mathematics' },
        { id: 4, title: 'Chemistry Basics', students: 28, rating: 4.3, duration: '6 weeks', price: '$69', status: 'rejected', category: 'Science', rejectionReason: 'Course content needs improvement' },
    ]);

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
        showNotification('Course creation form opened', 'info');
        // Implement course creation logic
    };

    const handleEditCourse = (id) => {
        showNotification(`Editing course #${id}`, 'info');
    };

    const handleDeleteCourse = (id) => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            setCourses(courses.filter(course => course.id !== id));
            showNotification('Course deleted successfully', 'success');
        }
    };

    return (
        <div className="space-y-6 ">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Courses Management</h1>
                    <p className="text-gray-600">Manage your courses and track their performance</p>
                </div>
                <button
                    onClick={handleCreateCourse}
                    className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                >
                    <FaPlus className="mr-2" />
                    Create New Course
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <p className="text-2xl font-bold text-gray-800">{courses.length}</p>
                    <p className="text-sm text-gray-600">Total Courses</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <p className="text-2xl font-bold text-gray-800">{courses.filter(c => c.status === 'approved').length}</p>
                    <p className="text-sm text-gray-600">Published</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <p className="text-2xl font-bold text-gray-800">{courses.reduce((acc, c) => acc + c.students, 0)}</p>
                    <p className="text-sm text-gray-600">Total Students</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <p className="text-2xl font-bold text-gray-800">${courses.filter(c => c.status === 'approved').reduce((acc, c) => acc + parseInt(c.price.slice(1)) * c.students, 0)}</p>
                    <p className="text-sm text-gray-600">Total Revenue</p>
                </div>
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
                            {courses.map((course) => (
                                <tr key={course.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">{course.title}</div>
                                            <div className="text-sm text-gray-500">{course.category}</div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <FaUsers className="mr-2 text-gray-400" />
                                            <span className="text-sm text-gray-900">{course.students}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <FaStar className="mr-2 text-amber-500" />
                                            <span className="text-sm text-gray-900">{course.rating}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <FaClock className="mr-2 text-gray-400" />
                                            <span className="text-sm text-gray-900">{course.duration}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {course.price}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            {getStatusIcon(course.status)}
                                            <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(course.status)}`}>
                                                {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                                            </span>
                                        </div>
                                        {course.rejectionReason && (
                                            <p className="text-xs text-red-600 mt-1">{course.rejectionReason}</p>
                                        )}
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
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Course Form (Collapsed by default) */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Create New Course</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Course Title</label>
                        <input
                            type="text"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            placeholder="Enter course title"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                        <select className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                            <option>Mathematics</option>
                            <option>Science</option>
                            <option>Computer Science</option>
                            <option>Language</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
                        <input
                            type="number"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            placeholder="Enter price"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                        <input
                            type="text"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            placeholder="e.g., 8 weeks"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                            rows="4"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            placeholder="Describe your course..."
                        />
                    </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                    <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        Cancel
                    </button>
                    <button className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
                        Create Course
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CoursesManagement;
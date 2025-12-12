// src/components/sections/AssignmentsQuizzes.jsx
import React, { useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaFileAlt, FaQuestionCircle, FaClock, FaUsers, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const AssignmentsQuizzes = () => {
    const [activeTab, setActiveTab] = useState('assignments');

    const assignments = [
        { id: 1, title: 'Math Homework #1', course: 'Calculus 101', dueDate: '2024-03-15', submissions: 45, graded: 38, averageGrade: '85%' },
        { id: 2, title: 'Physics Lab Report', course: 'Physics Basics', dueDate: '2024-03-20', submissions: 32, graded: 25, averageGrade: '78%' },
        { id: 3, title: 'Algebra Practice', course: 'Advanced Mathematics', dueDate: '2024-03-10', submissions: 50, graded: 50, averageGrade: '92%' },
    ];

    const quizzes = [
        { id: 1, title: 'Quiz: Derivatives', course: 'Calculus 101', questions: 20, attempts: 45, averageScore: '88%', status: 'active' },
        { id: 2, title: 'Physics Fundamentals', course: 'Physics Basics', questions: 15, attempts: 32, averageScore: '76%', status: 'draft' },
        { id: 3, title: 'Algebra Basics', course: 'Advanced Mathematics', questions: 25, attempts: 50, averageScore: '94%', status: 'active' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Assignments & Quizzes</h1>
                    <p className="text-gray-600">Create and manage assessments for your students</p>
                </div>
                <button className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
                    <FaPlus className="mr-2" />
                    Create New
                </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('assignments')}
                    className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === 'assignments'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <FaFileAlt className="inline mr-2" />
                    Assignments
                </button>
                <button
                    onClick={() => setActiveTab('quizzes')}
                    className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === 'quizzes'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <FaQuestionCircle className="inline mr-2" />
                    Quizzes
                </button>
            </div>

            {activeTab === 'assignments' ? (
                <div className="space-y-6">
                    {/* Assignment Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                            <p className="text-2xl font-bold text-gray-800">{assignments.length}</p>
                            <p className="text-sm text-gray-600">Total Assignments</p>
                        </div>
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                            <p className="text-2xl font-bold text-gray-800">{assignments.reduce((acc, a) => acc + a.submissions, 0)}</p>
                            <p className="text-sm text-gray-600">Total Submissions</p>
                        </div>
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                            <p className="text-2xl font-bold text-gray-800">{assignments.reduce((acc, a) => acc + a.graded, 0)}</p>
                            <p className="text-sm text-gray-600">Graded</p>
                        </div>
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                            <p className="text-2xl font-bold text-gray-800">84%</p>
                            <p className="text-sm text-gray-600">Average Completion</p>
                        </div>
                    </div>

                    {/* Assignments Table */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-800">Active Assignments</h3>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assignment</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submissions</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Graded</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Grade</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {assignments.map((assignment) => (
                                        <tr key={assignment.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{assignment.title}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{assignment.course}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center text-sm text-gray-900">
                                                    <FaClock className="mr-2 text-gray-400" />
                                                    {assignment.dueDate}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <FaUsers className="mr-2 text-gray-400" />
                                                    <span className="text-sm">{assignment.submissions}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <FaCheckCircle className={`mr-2 ${assignment.graded === assignment.submissions ? 'text-green-500' : 'text-yellow-500'}`} />
                                                    <span className="text-sm">{assignment.graded}/{assignment.submissions}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                                                    {assignment.averageGrade}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex items-center space-x-2">
                                                    <button className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg">
                                                        <FaEdit />
                                                    </button>
                                                    <button className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg">
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

                    {/* Create Assignment Form */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-medium text-gray-800 mb-4">Create New Assignment</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Assignment Title</label>
                                <input
                                    type="text"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                    placeholder="Enter assignment title"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Course</label>
                                <select className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                                    <option>Calculus 101</option>
                                    <option>Physics Basics</option>
                                    <option>Advanced Mathematics</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                                <input
                                    type="date"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Max Points</label>
                                <input
                                    type="number"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                    placeholder="100"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Instructions</label>
                                <textarea
                                    rows="4"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                    placeholder="Provide detailed instructions for the assignment..."
                                />
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end space-x-3">
                            <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                Cancel
                            </button>
                            <button className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
                                Create Assignment
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Quizzes Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                            <p className="text-2xl font-bold text-gray-800">{quizzes.length}</p>
                            <p className="text-sm text-gray-600">Total Quizzes</p>
                        </div>
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                            <p className="text-2xl font-bold text-gray-800">{quizzes.reduce((acc, q) => acc + q.attempts, 0)}</p>
                            <p className="text-sm text-gray-600">Total Attempts</p>
                        </div>
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                            <p className="text-2xl font-bold text-gray-800">86%</p>
                            <p className="text-sm text-gray-600">Average Score</p>
                        </div>
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                            <p className="text-2xl font-bold text-gray-800">{quizzes.filter(q => q.status === 'active').length}</p>
                            <p className="text-sm text-gray-600">Active</p>
                        </div>
                    </div>

                    {/* Quizzes Table */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-800">My Quizzes</h3>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quiz</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Questions</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attempts</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Score</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {quizzes.map((quiz) => (
                                        <tr key={quiz.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{quiz.title}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{quiz.course}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <FaQuestionCircle className="mr-2 text-gray-400" />
                                                    <span className="text-sm">{quiz.questions}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <FaUsers className="mr-2 text-gray-400" />
                                                    <span className="text-sm">{quiz.attempts}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                                    {quiz.averageScore}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${quiz.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {quiz.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex items-center space-x-2">
                                                    <button className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg">
                                                        <FaEdit />
                                                    </button>
                                                    <button className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg">
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

                    {/* Create Quiz Form */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-medium text-gray-800 mb-4">Create New Quiz</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Quiz Title</label>
                                <input
                                    type="text"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                    placeholder="Enter quiz title"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Course</label>
                                <select className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                                    <option>Calculus 101</option>
                                    <option>Physics Basics</option>
                                    <option>Advanced Mathematics</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Number of Questions</label>
                                <input
                                    type="number"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                    placeholder="20"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Time Limit (minutes)</label>
                                <input
                                    type="number"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                    placeholder="30"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Max Points</label>
                                <input
                                    type="number"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                    placeholder="100"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Quiz Type</label>
                                <select className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                                    <option>Multiple Choice</option>
                                    <option>True/False</option>
                                    <option>Short Answer</option>
                                    <option>Mixed</option>
                                </select>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end space-x-3">
                            <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                Cancel
                            </button>
                            <button className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
                                Create Quiz
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AssignmentsQuizzes;
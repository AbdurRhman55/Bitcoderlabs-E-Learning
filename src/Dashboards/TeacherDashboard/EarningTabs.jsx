// src/components/sections/EarningsTab.jsx
import React, { useState } from 'react';
import { FaMoneyBillAlt, FaChartLine, FaCalendarAlt, FaDownload, FaExchangeAlt, FaHistory } from 'react-icons/fa';

const EarningsTab = () => {
    const [timeRange, setTimeRange] = useState('monthly');

    const earningsData = {
        total: 12580,
        pending: 3200,
        withdrawn: 9380,
        thisMonth: 2450,
        lastMonth: 2100
    };

    const transactions = [
        { id: 1, type: 'withdrawal', amount: 1500, date: '2024-03-15', status: 'completed', description: 'Bank Transfer' },
        { id: 2, type: 'earning', amount: 850, date: '2024-03-10', status: 'completed', description: 'Course Sales' },
        { id: 3, type: 'withdrawal', amount: 2000, date: '2024-03-05', status: 'pending', description: 'Bank Transfer' },
        { id: 4, type: 'earning', amount: 1200, date: '2024-02-28', status: 'completed', description: 'Course Sales' },
    ];

    const courseEarnings = [
        { course: 'Advanced Mathematics', students: 45, earnings: 4455, percentage: 35 },
        { course: 'Calculus 101', students: 67, earnings: 3980, percentage: 32 },
        { course: 'Physics Basics', students: 32, earnings: 2520, percentage: 20 },
        { course: 'Chemistry Intro', students: 28, earnings: 1625, percentage: 13 },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Earnings Dashboard</h1>
                    <p className="text-gray-600">Track your earnings and manage payments</p>
                </div>
                <div className="flex space-x-3">
                    <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <FaDownload className="mr-2" />
                        Export Report
                    </button>
                    <button className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
                        <FaExchangeAlt className="mr-2" />
                        Withdraw Funds
                    </button>
                </div>
            </div>

            {/* Earnings Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 rounded-lg bg-green-100">
                            <FaMoneyBillAlt className="text-green-600" />
                        </div>
                        <span className="text-sm font-medium text-green-600">+12%</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">${earningsData.total.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">Total Earnings</p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 rounded-lg bg-blue-100">
                            <FaCalendarAlt className="text-blue-600" />
                        </div>
                        <span className="text-sm font-medium text-blue-600">+16%</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">${earningsData.thisMonth.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">This Month</p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 rounded-lg bg-amber-100">
                            <FaChartLine className="text-amber-600" />
                        </div>
                        <span className="text-sm font-medium text-amber-600">Pending</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">${earningsData.pending.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">Pending Balance</p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 rounded-lg bg-purple-100">
                            <FaExchangeAlt className="text-purple-600" />
                        </div>
                        <span className="text-sm font-medium text-purple-600">Withdrawn</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">${earningsData.withdrawn.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">Total Withdrawn</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Earnings Chart (Placeholder) */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-medium text-gray-800">Earnings Overview</h3>
                            <div className="flex space-x-2">
                                {['weekly', 'monthly', 'yearly'].map((range) => (
                                    <button
                                        key={range}
                                        onClick={() => setTimeRange(range)}
                                        className={`px-3 py-1 text-sm rounded-lg transition-colors ${timeRange === range
                                                ? 'bg-primary text-white'
                                                : 'text-gray-600 hover:bg-gray-100'
                                            }`}
                                    >
                                        {range.charAt(0).toUpperCase() + range.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Placeholder for Chart */}
                        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                            <div className="text-center">
                                <FaChartLine className="text-4xl text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-600">Earnings chart would appear here</p>
                                <p className="text-sm text-gray-500 mt-1">Monthly trend visualization</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Course-wise Earnings */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-medium text-gray-800 mb-6">Course-wise Earnings</h3>
                    <div className="space-y-4">
                        {courseEarnings.map((course, index) => (
                            <div key={index} className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="font-medium text-gray-800">{course.course}</span>
                                    <span className="font-bold">${course.earnings.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    <span>{course.students} students</span>
                                    <span className="mx-2">•</span>
                                    <span>{course.percentage}% of total</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="h-2 rounded-full bg-primary"
                                        style={{ width: `${course.percentage}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-800">Recent Transactions</h3>
                    <button className="text-primary hover:text-primary-dark font-medium">
                        <FaHistory className="inline mr-2" />
                        View All Transactions
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {transactions.map((transaction) => (
                                <tr key={transaction.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{transaction.date}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${transaction.type === 'earning' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                                            }`}>
                                            {transaction.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{transaction.description}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className={`text-sm font-medium ${transaction.type === 'earning' ? 'text-green-600' : 'text-blue-600'
                                            }`}>
                                            ${transaction.amount.toLocaleString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${transaction.status === 'completed'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {transaction.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Withdrawal Request */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Request Withdrawal</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Amount to Withdraw</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-gray-500">$</span>
                            </div>
                            <input
                                type="number"
                                className="block w-full pl-8 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                placeholder="Enter amount"
                            />
                        </div>
                        <p className="text-sm text-gray-500 mt-2">Available balance: ${earningsData.pending.toLocaleString()}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                        <select className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                            <option>Bank Transfer</option>
                            <option>PayPal</option>
                            <option>Stripe</option>
                        </select>
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Account Details</label>
                        <textarea
                            rows="3"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            placeholder="Enter your account details..."
                        />
                    </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                    <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        Cancel
                    </button>
                    <button className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
                        Submit Request
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EarningsTab;
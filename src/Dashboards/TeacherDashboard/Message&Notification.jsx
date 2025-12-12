// src/components/sections/MessagesNotifications.jsx
import React, { useState } from 'react';
import { FaBell, FaEnvelope, FaUserGraduate, FaBook, FaCheckCircle, FaTimesCircle, FaExclamationTriangle, FaFilter } from 'react-icons/fa';

const MessagesNotifications = ({ notifications, markAsRead, showNotification }) => {
    const [activeTab, setActiveTab] = useState('notifications');
    const [messages, setMessages] = useState([
        { id: 1, sender: 'Admin Team', subject: 'Course Approval Update', preview: 'Your course "Physics 101" has been reviewed...', time: '2 hours ago', read: false, type: 'admin' },
        { id: 2, sender: 'John Doe', subject: 'Question about Assignment', preview: 'Hi, I have a question regarding problem #3...', time: '1 day ago', read: true, type: 'student' },
        { id: 3, sender: 'System', subject: 'Payment Processed', preview: 'Your payment for March has been processed...', time: '2 days ago', read: true, type: 'system' },
    ]);

    const [newMessage, setNewMessage] = useState('');

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'student': return <FaUserGraduate className="text-blue-500" />;
            case 'admin': return <FaBook className="text-green-500" />;
            case 'assignment': return <FaExclamationTriangle className="text-amber-500" />;
            default: return <FaBell className="text-gray-500" />;
        }
    };

    const sendMessage = () => {
        if (newMessage.trim()) {
            showNotification('Message sent successfully', 'success');
            setNewMessage('');
        }
    };

    const markAllAsRead = () => {
        notifications.forEach(notif => {
            if (!notif.read) markAsRead(notif.id);
        });
        showNotification('All notifications marked as read', 'info');
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Messages & Notifications</h1>
                    <p className="text-gray-600">Stay updated with important updates and communicate</p>
                </div>
                <div className="flex space-x-3">
                    <button
                        onClick={markAllAsRead}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Mark All as Read
                    </button>
                    <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
                        Compose
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('notifications')}
                    className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === 'notifications'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <FaBell className="inline mr-2" />
                    Notifications ({notifications.filter(n => !n.read).length})
                </button>
                <button
                    onClick={() => setActiveTab('messages')}
                    className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === 'messages'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <FaEnvelope className="inline mr-2" />
                    Messages ({messages.filter(m => !m.read).length})
                </button>
            </div>

            {activeTab === 'notifications' ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Notifications List */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                                <h3 className="text-lg font-medium text-gray-800">Recent Notifications</h3>
                                <button className="flex items-center text-sm text-gray-600 hover:text-gray-800">
                                    <FaFilter className="mr-2" />
                                    Filter
                                </button>
                            </div>

                            <div className="divide-y divide-gray-200">
                                {notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={`p-6 hover:bg-gray-50 transition-colors ${!notification.read ? 'bg-blue-50' : ''}`}
                                    >
                                        <div className="flex items-start space-x-4">
                                            <div className="p-2 rounded-lg bg-white border border-gray-200">
                                                {getNotificationIcon(notification.type)}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start">
                                                    <p className="font-medium text-gray-800">{notification.message}</p>
                                                    {!notification.read && (
                                                        <button
                                                            onClick={() => markAsRead(notification.id)}
                                                            className="text-sm text-primary hover:text-primary-dark"
                                                        >
                                                            Mark as read
                                                        </button>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-500 mt-1">{notification.time}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Notification Summary */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-medium text-gray-800 mb-4">Notification Summary</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Unread Notifications</span>
                                    <span className="font-bold text-primary">{notifications.filter(n => !n.read).length}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Today</span>
                                    <span className="font-bold">3</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">This Week</span>
                                    <span className="font-bold">12</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">This Month</span>
                                    <span className="font-bold">45</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-medium text-gray-800 mb-4">Notification Settings</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-700">New Student Enrollments</span>
                                    <div className="relative inline-block w-12 h-6">
                                        <input type="checkbox" className="sr-only" id="enrollments" defaultChecked />
                                        <label htmlFor="enrollments" className="block w-12 h-6 bg-green-500 rounded-full cursor-pointer"></label>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-700">Assignment Submissions</span>
                                    <div className="relative inline-block w-12 h-6">
                                        <input type="checkbox" className="sr-only" id="assignments" defaultChecked />
                                        <label htmlFor="assignments" className="block w-12 h-6 bg-green-500 rounded-full cursor-pointer"></label>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-700">Course Approvals</span>
                                    <div className="relative inline-block w-12 h-6">
                                        <input type="checkbox" className="sr-only" id="approvals" />
                                        <label htmlFor="approvals" className="block w-12 h-6 bg-gray-300 rounded-full cursor-pointer"></label>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-700">Payment Updates</span>
                                    <div className="relative inline-block w-12 h-6">
                                        <input type="checkbox" className="sr-only" id="payments" defaultChecked />
                                        <label htmlFor="payments" className="block w-12 h-6 bg-green-500 rounded-full cursor-pointer"></label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Messages List */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-medium text-gray-800">Messages</h3>
                            </div>

                            <div className="divide-y divide-gray-200">
                                {messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`p-6 hover:bg-gray-50 transition-colors ${!message.read ? 'bg-blue-50' : ''}`}
                                    >
                                        <div className="flex items-start space-x-4">
                                            <div className="p-2 rounded-lg bg-primary-light">
                                                <FaEnvelope className="text-primary" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="font-medium text-gray-800">{message.sender}</p>
                                                        <p className="text-sm text-gray-700">{message.subject}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm text-gray-500">{message.time}</p>
                                                        {!message.read && (
                                                            <span className="inline-block mt-1 h-2 w-2 bg-red-500 rounded-full"></span>
                                                        )}
                                                    </div>
                                                </div>
                                                <p className="text-sm text-gray-600 mt-2">{message.preview}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Compose Message */}
                        <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-medium text-gray-800 mb-4">Compose Message</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
                                    <input
                                        type="text"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                        placeholder="Enter recipient email"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                                    <input
                                        type="text"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                        placeholder="Enter subject"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                                    <textarea
                                        rows="4"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                        placeholder="Type your message here..."
                                    />
                                </div>
                                <div className="flex justify-end">
                                    <button
                                        onClick={sendMessage}
                                        className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                                    >
                                        Send Message
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-medium text-gray-800 mb-4">Quick Actions</h3>
                            <div className="space-y-3">
                                <button className="w-full px-4 py-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                    <FaUserGraduate className="inline mr-2 text-blue-500" />
                                    Message All Students
                                </button>
                                <button className="w-full px-4 py-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                    <FaBook className="inline mr-2 text-green-500" />
                                    Contact Admin
                                </button>
                                <button className="w-full px-4 py-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                    <FaBell className="inline mr-2 text-amber-500" />
                                    Send Announcement
                                </button>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-medium text-gray-800 mb-4">Recent Contacts</h3>
                            <div className="space-y-4">
                                <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                                    <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                        <span className="font-bold text-blue-600">JD</span>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800">John Doe</p>
                                        <p className="text-sm text-gray-600">Student</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                                    <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                                        <span className="font-bold text-green-600">AT</span>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800">Admin Team</p>
                                        <p className="text-sm text-gray-600">Support</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                                    <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                                        <span className="font-bold text-purple-600">JS</span>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800">Jane Smith</p>
                                        <p className="text-sm text-gray-600">Student</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MessagesNotifications;
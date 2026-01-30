// src/Dashboards/TeacherDashboard/Message&Notification.jsx
import React, { useState, useMemo } from 'react';
import { FaBell, FaEnvelope, FaUserGraduate, FaBook, FaCheckCircle, FaTimesCircle, FaExclamationTriangle, FaFilter } from 'react-icons/fa';

const MessagesNotifications = ({ notifications = [], markAsRead, showNotification }) => {
    const [activeTab, setActiveTab] = useState('notifications');
    const [messages, setMessages] = useState([
        { id: 1, sender: 'Admin Team', subject: 'Course Approval Update', preview: 'Your course "Physics 101" has been reviewed...', time: '2 hours ago', read: false, type: 'admin' },
        { id: 2, sender: 'John Doe', subject: 'Question about Assignment', preview: 'Hi, I have a question regarding problem #3...', time: '1 day ago', read: true, type: 'student' },
        { id: 3, sender: 'System', subject: 'Payment Processed', preview: 'Your payment for March has been processed...', time: '2 days ago', read: true, type: 'system' },
    ]);

    const [newMessage, setNewMessage] = useState('');

    const formattedNotifications = useMemo(() => {
        return notifications.map(notif => {
            const type = notif.type || 'system';
            let icon = <FaBell className="text-gray-500" />;

            if (type.includes('course') || type.includes('approval')) {
                icon = <FaCheckCircle className="text-green-500" />;
            } else if (type.includes('enroll')) {
                icon = <FaUserGraduate className="text-blue-500" />;
            } else if (type.includes('payment') || type.includes('money')) {
                icon = <FaEnvelope className="text-yellow-500" />;
            } else if (type.includes('assignment')) {
                icon = <FaExclamationTriangle className="text-amber-500" />;
            }

            return {
                id: notif.id,
                message: notif.message || notif.data?.message || "New activity recorded",
                time: notif.created_at ? new Date(notif.created_at).toLocaleDateString() : "Recently",
                read: !!notif.read_at || notif.read,
                type: type,
                icon: icon
            };
        });
    }, [notifications]);

    const sendMessage = () => {
        if (newMessage.trim()) {
            showNotification('Message sent successfully', 'success');
            setNewMessage('');
        }
    };

    const markAllAsRead = () => {
        if (notifications.length > 0) {
            notifications.forEach(notif => {
                if (!(notif.read_at || notif.read)) markAsRead?.(notif.id);
            });
            showNotification('Marked all as read', 'info');
        }
    };

    const unreadCount = formattedNotifications.filter(n => !n.read).length;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                    <h1 className="text-xl lg:text-2xl font-extrabold text-gray-900 tracking-tight">Messages & Notifications</h1>
                    <p className="text-sm text-gray-500 mt-1 font-medium">Keep track of your interactions and system updates.</p>
                </div>
                <div className="flex w-full sm:w-auto gap-3">
                    <button
                        onClick={markAllAsRead}
                        className="flex-1 sm:flex-none justify-center px-4 py-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-700 font-bold text-sm transition-all flex items-center shadow-sm"
                    >
                        Mark Read
                    </button>
                    <button className="flex-1 sm:flex-none justify-center px-4 py-2.5 bg-primary text-white rounded-xl hover:bg-primary-dark transition-all flex items-center font-bold text-sm shadow-lg shadow-primary/20">
                        Compose
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-100 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                <button
                    onClick={() => setActiveTab('notifications')}
                    className={`flex-shrink-0 px-6 py-4 font-bold text-sm border-b-2 transition-all duration-300 ${activeTab === 'notifications'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-gray-400 hover:text-gray-600'
                        }`}
                >
                    <FaBell className="inline mr-2" />
                    Notifications ({unreadCount})
                </button>
                <button
                    onClick={() => setActiveTab('messages')}
                    className={`flex-shrink-0 px-6 py-4 font-bold text-sm border-b-2 transition-all duration-300 ${activeTab === 'messages'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-gray-400 hover:text-gray-600'
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
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                                <h3 className="text-lg font-bold text-gray-800">Recent Notifications</h3>
                                <button className="flex items-center text-sm font-medium text-gray-600 hover:text-primary transition-colors">
                                    <FaFilter className="mr-2" />
                                    Filter
                                </button>
                            </div>

                            <div className="divide-y divide-gray-100">
                                {formattedNotifications.length === 0 ? (
                                    <div className="p-12 text-center text-gray-500 italic">
                                        No notifications found.
                                    </div>
                                ) : (
                                    formattedNotifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            className={`p-6 hover:bg-gray-50 transition-colors relative ${!notification.read ? 'bg-blue-50/40' : ''}`}
                                        >
                                            <div className="flex items-start space-x-4">
                                                <div className="p-3 rounded-xl bg-white border border-gray-100 shadow-sm shrink-0">
                                                    {notification.icon}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start">
                                                        <p className={`font-semibold ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                                                            {notification.message}
                                                        </p>
                                                        {!notification.read && (
                                                            <button
                                                                onClick={() => markAsRead?.(notification.id)}
                                                                className="text-xs font-bold text-primary hover:underline ml-4 uppercase tracking-wider"
                                                            >
                                                                Mark as read
                                                            </button>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-gray-500 font-medium mt-2 flex items-center">
                                                        <FaBell className="mr-1.5 opacity-50" />
                                                        {notification.time}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Meta Info */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Notification Status</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                    <span className="text-sm font-medium text-blue-700">Unread</span>
                                    <span className="text-xl font-bold text-blue-800">{unreadCount}</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                    <span className="text-sm font-medium text-green-700">Read</span>
                                    <span className="text-xl font-bold text-green-800">{formattedNotifications.length - unreadCount}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Email Preferences</h3>
                            <div className="space-y-4">
                                {[
                                    { id: 'enroll', label: 'Student Enrollments', active: true },
                                    { id: 'assign', label: 'Assignment Submissions', active: true },
                                    { id: 'approve', label: 'Course Approvals', active: false },
                                    { id: 'pay', label: 'Payments', active: true }
                                ].map(item => (
                                    <div key={item.id} className="flex items-center justify-between">
                                        <span className="text-sm text-gray-700 font-medium">{item.label}</span>
                                        <div className="relative inline-block w-10 h-5">
                                            <input type="checkbox" className="sr-only" defaultChecked={item.active} />
                                            <div className={`block w-10 h-5 rounded-full transition-colors cursor-pointer ${item.active ? 'bg-primary' : 'bg-gray-300'}`}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Messages Placeholder */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                                <h3 className="text-lg font-bold text-gray-800">Messages</h3>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {messages.map((message) => (
                                    <div key={message.id} className={`p-6 hover:bg-gray-50 transition-colors ${!message.read ? 'bg-blue-50/40' : ''}`}>
                                        <div className="flex items-start space-x-4">
                                            <div className="p-3 rounded-xl bg-primary-light shrink-0">
                                                <FaEnvelope className="text-primary" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="font-bold text-gray-900">{message.sender}</p>
                                                        <p className="text-sm font-medium text-gray-600 italic">{message.subject}</p>
                                                    </div>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase">{message.time}</p>
                                                </div>
                                                <p className="text-sm text-gray-600 mt-2 line-clamp-2">{message.preview}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    {/* Message Actions */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-fit">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Contact</h3>
                        <div className="space-y-3">
                            <button className="w-full flex items-center p-3 text-sm font-semibold border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-primary transition-all group">
                                <FaUserGraduate className="mr-3 text-blue-500 group-hover:scale-110 transition-transform" />
                                Contact All Students
                            </button>
                            <button className="w-full flex items-center p-3 text-sm font-semibold border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-primary transition-all group">
                                <FaBook className="mr-3 text-green-500 group-hover:scale-110 transition-transform" />
                                Support Ticket
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MessagesNotifications;

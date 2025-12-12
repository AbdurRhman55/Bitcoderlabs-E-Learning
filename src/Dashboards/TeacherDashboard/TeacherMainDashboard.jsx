// src/components/TeacherDashboard.jsx
import React, { useState, useEffect } from 'react';
import DashboardSidebar from './SIdebar';
import DashboardHeader from './Header';
import ProfileOverview from './ProfileOverview';
import CoursesManagement from './CoursesManagement';
import StudentsSection from './Student';
import AssignmentsQuizzes from './Asssignment&quiz';
import MessagesNotifications from './Message&Notification';
import EarningsTab from './EarningTabs';
import AnalyticsTab from './Analytics';
import SettingsTab from './Settings';
import Notification from './Notifications';

const TeacherMainDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [notifications, setNotifications] = useState([]);
    const [userProfile, setUserProfile] = useState({
        name: 'Dr. Sarah Johnson',
        email: 'sarah.johnson@example.edu',
        profileImage: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?crop=faces&fit=crop&w=200&h=200',
        qualification: 'Ph.D. in Education',
        experience: '10+ years',
        skills: ['Mathematics', 'Curriculum Design', 'STEM Education', 'EdTech'],
        about: 'Dedicated educator with 10+ years of experience in STEM education...',
        socialLinks: {
            linkedin: '',
            twitter: '',
            github: ''
        }
    });

    const [showNotification, setShowNotification] = useState({ show: false, message: '', type: '' });

    // Load mock data
    useEffect(() => {
        // Simulate loading notifications
        const mockNotifications = [
            { id: 1, type: 'student', message: 'John Doe enrolled in your course "Advanced Mathematics"', time: '2 hours ago', read: false },
            { id: 2, type: 'admin', message: 'Your course "Introduction to Physics" has been approved', time: '1 day ago', read: true },
            { id: 3, type: 'assignment', message: '5 new assignments submitted in "Calculus 101"', time: '2 days ago', read: false },
        ];
        setNotifications(mockNotifications);
    }, []);

    const showToastNotification = (message, type) => {
        setShowNotification({ show: true, message, type });
        setTimeout(() => {
            setShowNotification({ show: false, message: '', type: '' });
        }, 4000);
    };

    const markNotificationAsRead = (id) => {
        setNotifications(notifications.map(notif =>
            notif.id === id ? { ...notif, read: true } : notif
        ));
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return <ProfileOverview profile={userProfile} />;
            case 'courses':
                return <CoursesManagement showNotification={showToastNotification} />;
            case 'students':
                return <StudentsSection />;
            case 'assignments':
                return <AssignmentsQuizzes />;
            case 'messages':
                return <MessagesNotifications
                    notifications={notifications}
                    markAsRead={markNotificationAsRead}
                    showNotification={showToastNotification}
                />;
            case 'earnings':
                return <EarningsTab />;
            case 'analytics':
                return <AnalyticsTab />;
            case 'settings':
                return <SettingsTab
                    profile={userProfile}
                    setProfile={setUserProfile}
                    showNotification={showToastNotification}
                />;
            default:
                return <ProfileOverview profile={userProfile} />;
        }
    };

    return (
        <div className="min-h-screen  bg-gray-50">
            <DashboardHeader
                profile={userProfile}
                notifications={notifications.filter(n => !n.read).length}
            />

            {showNotification.show && (
                <Notification
                    message={showNotification.message}
                    type={showNotification.type}
                />
            )}

            <div className="flex">
                <DashboardSidebar
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />

                <main className="flex-1 p-6 lg:p-8">
                    <div className="max-w-7xl mx-auto">
                        {renderContent()}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default TeacherMainDashboard;
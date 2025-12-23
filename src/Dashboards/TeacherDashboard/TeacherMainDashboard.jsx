// src/components/TeacherDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../../src/api/index.js';
import DashboardSidebar from './SIdebar';
import DashboardHeader from './Header';
import ProfileOverview from './ProfileOverview';
import CoursesManagement from './CoursesManagement';
import StudentsSection from './Student';
import AssignmentsQuizzes from './Asssignment&quiz';
import MessagesNotifications from './Message&Notification';
import AnalyticsTab from './Analytics';
import SettingsTab from './Settings';
import Notification from './Notifications';

const TeacherMainDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [notifications, setNotifications] = useState([
        { id: 1, message: 'John Doe enrolled in your "React Masterclass" course', time: '10 minutes ago', type: 'student', read: false },
        { id: 2, message: 'Sarah Smith submitted an assignment for "Advanced JavaScript"', time: '1 hour ago', type: 'assignment', read: false },
        { id: 3, message: 'Your course "Web Development Bootcamp" has been approved', time: '2 hours ago', type: 'admin', read: true },
        { id: 4, message: 'You received $249.99 for course sales', time: '1 day ago', type: 'admin', read: false },
        { id: 5, message: 'Scheduled maintenance on Saturday, 10 PM - 2 AM', time: '2 days ago', type: 'admin', read: true },
    ]);
    const [userProfile, setUserProfile] = useState({
        name: 'Unknown Instructor',
        email: '',
        profileImage: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?crop=faces&fit=crop&w=200&h=200',
        qualification: 'Instructor',
        experience: 'Teaching',
        skills: [],
        about: 'Profile information unavailable',
        socialLinks: {},
        approvalStatus: 'pending'
    });
    const [stats, setStats] = useState(null);
    const [recentActivities, setRecentActivities] = useState([]);
    const [dashboardLoading, setDashboardLoading] = useState(true);

    const [showNotification, setShowNotification] = useState({ show: false, message: '', type: '' });
    const navigate = useNavigate();
    const { isAuthenticated, loading: authLoading, user } = useSelector(state => state.auth);

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!isAuthenticated && !authLoading) {
            navigate('/login');
        }
    }, [isAuthenticated, authLoading, navigate]);

    // Redirect instructors who are not approved to profile page
    useEffect(() => {
        if (isAuthenticated && user && user.role === 'instructor' && !user.instructor_approved) {
            navigate('/teacherprofile');
        }
    }, [isAuthenticated, user, navigate]);

    // Load dashboard data
    useEffect(() => {
        const loadDashboardData = async () => {
            if (!isAuthenticated || authLoading || user?.role !== 'instructor') return;

            try {
                setDashboardLoading(true);

                // apiClient returns parsed JSON (not an Axios-style { data: ... } response).
                // Depending on backend wrappers, responses may be shaped as:
                // - { data: payload }
                // - { data: { data: payload } }
                // - payload
                const unwrap = (res) => res?.data?.data ?? res?.data ?? res;

                // Fetch only endpoints that exist in the backend.
                const [profileResult, statsResult, activitiesResult] = await Promise.allSettled([
                    apiClient.getMyProfile(),
                    apiClient.getTeacherStats(),
                    apiClient.getRecentActivities()
                ]);

                // Set profile data
                const instructor = profileResult.status === 'fulfilled' ? (unwrap(profileResult.value) || {}) : {};
                setUserProfile({
                    name: instructor.name || 'Unknown',
                    email: instructor.email || '',
                    profileImage: instructor.image ? `http://127.0.0.1:8000/storage/${instructor.image}` : 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?crop=faces&fit=crop&w=200&h=200',
                    qualification: instructor.bio || 'Instructor',
                    experience: 'Teaching',
                    skills: Array.isArray(instructor.specialization) ? instructor.specialization : (instructor.specialization ? [instructor.specialization] : []),
                    about: instructor.bio || 'Dedicated educator',
                    socialLinks: instructor.social_links || {},
                    approvalStatus: instructor.approval_status || 'pending'
                });

                // Set stats
                setStats(statsResult.status === 'fulfilled' ? unwrap(statsResult.value) : null);

                // Set recent activities
                if (activitiesResult.status === 'fulfilled') {
                    const activitiesData = unwrap(activitiesResult.value);
                    setRecentActivities(Array.isArray(activitiesData) ? activitiesData : (activitiesData?.items || []));
                } else {
                    setRecentActivities([]);
                }

            } catch (error) {
                console.error('Error loading dashboard data:', error);

                // Set default values on error
                setUserProfile({
                    name: 'Unknown Instructor',
                    email: '',
                    profileImage: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?crop=faces&fit=crop&w=200&h=200',
                    qualification: 'Instructor',
                    experience: 'Teaching',
                    skills: [],
                    about: 'Profile information unavailable',
                    socialLinks: {},
                    approvalStatus: 'pending'
                });
                setStats(null);
                setRecentActivities([]);
            } finally {
                setDashboardLoading(false);
            }
        };

        loadDashboardData();
    }, [isAuthenticated, authLoading, user]);

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
        if (dashboardLoading) {
            return (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    <span className="ml-3 text-gray-600">Loading dashboard...</span>
                </div>
            );
        }

        switch (activeTab) {
            case 'overview':
                return <ProfileOverview
                    profile={userProfile}
                    stats={stats}
                    recentActivities={recentActivities}
                />;
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
                return <ProfileOverview
                    profile={userProfile}
                    stats={stats}
                    recentActivities={recentActivities}
                />;
            case 'analytics':
                return <AnalyticsTab />;
            case 'settings':
                return <SettingsTab
                    profile={userProfile}
                    setProfile={setUserProfile}
                    showNotification={showToastNotification}
                />;
            default:
                return <ProfileOverview
                    profile={userProfile}
                    stats={stats}
                    recentActivities={recentActivities}
                />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
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
                    stats={stats}
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
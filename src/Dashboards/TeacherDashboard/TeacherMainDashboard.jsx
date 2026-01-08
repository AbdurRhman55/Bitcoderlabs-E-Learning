// src/components/TeacherDashboard.jsx
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../../../src/api/index.js";
import DashboardSidebar from "./SIdebar";
import DashboardHeader from "./Header";
import ProfileOverview from "./ProfileOverview";
import CoursesManagement from "./CoursesManagement";
import StudentsSection from "./Student";
import MessagesNotifications from "./Message&Notification";
import AnalyticsTab from "./Analytics";
import SettingsTab from "./Settings";
import Notification from "./Notifications";

const TeacherMainDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: 'John Doe enrolled in your "React Masterclass" course',
      time: "10 minutes ago",
      type: "student",
      read: false,
    },
    {
      id: 2,
      message: 'Sarah Smith submitted an assignment for "Advanced JavaScript"',
      time: "1 hour ago",
      type: "assignment",
      read: false,
    },
    {
      id: 3,
      message: 'Your course "Web Development Bootcamp" has been approved',
      time: "2 hours ago",
      type: "admin",
      read: true,
    },
    {
      id: 4,
      message: "You received $249.99 for course sales",
      time: "1 day ago",
      type: "admin",
      read: false,
    },
    {
      id: 5,
      message: "Scheduled maintenance on Saturday, 10 PM - 2 AM",
      time: "2 days ago",
      type: "admin",
      read: true,
    },
  ]);
  const [userProfile, setUserProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [recentActivities, setRecentActivities] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [allDataLoaded, setAllDataLoaded] = useState(false);

  const [showNotification, setShowNotification] = useState({
    show: false,
    message: "",
    type: "",
  });
  const navigate = useNavigate();
  const {
    isAuthenticated,
    loading: authLoading,
    user,
  } = useSelector((state) => state.auth);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !authLoading) {
      navigate("/login");
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Redirect instructors who are not approved to profile page
  useEffect(() => {
    if (
      isAuthenticated &&
      user &&
      user.role === "instructor" &&
      !user.instructor_approved
    ) {
      navigate("/teacherprofile");
    }
  }, [isAuthenticated, user, navigate]);

  // Load dashboard data - ONLY show skeleton until ALL data is loaded
  useEffect(() => {
    const loadDashboardData = async () => {
      if (!isAuthenticated || authLoading || user?.role !== "instructor")
        return;

      try {
        setIsLoading(true);
        setAllDataLoaded(false);

        const unwrap = (res) => res?.data?.data ?? res?.data ?? res;

        // Fetch all data in parallel
        const [profileResult, statsResult, activitiesResult] =
          await Promise.allSettled([
            apiClient.getMyProfile(),
            apiClient.getTeacherStats(),
            apiClient.getRecentActivities(),
          ]);

        // Wait for ALL data to be ready
        const profileData =
          profileResult.status === "fulfilled"
            ? unwrap(profileResult.value)
            : null;
        const statsData =
          statsResult.status === "fulfilled" ? unwrap(statsResult.value) : null;
        const activitiesData =
          activitiesResult.status === "fulfilled"
            ? unwrap(activitiesResult.value)
            : null;

        // Only update state when we have ALL data
        if (profileData && statsData && activitiesData !== null) {
          // Process profile
          const processedProfile = {
            name: profileData.name || "",
            email: profileData.email || "",
            profileImage: profileData.image
              ? `http://127.0.0.1:8000/storage/${profileData.image}`
              : "https://images.unsplash.com/photo-1582750433449-648ed127bb54?crop=faces&fit=crop&w=200&h=200",
            qualification: profileData.bio || "Instructor",
            experience: "Teaching",
            skills: Array.isArray(profileData.specialization)
              ? profileData.specialization
              : profileData.specialization
              ? [profileData.specialization]
              : [],
            about: profileData.bio || "Dedicated educator",
            socialLinks: profileData.social_links || {},
            approvalStatus: profileData.approval_status || "pending",
          };

          // Process stats
          const processedStats = statsData || {};

          // Process activities
          const processedActivities = Array.isArray(activitiesData)
            ? activitiesData
            : activitiesData?.items || [];

          // Set ALL data at once
          setUserProfile(processedProfile);
          setStats(processedStats);
          setRecentActivities(processedActivities);
          setAllDataLoaded(true);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [isAuthenticated, authLoading, user]);

  const showToastNotification = (message, type) => {
    setShowNotification({ show: true, message, type });
    setTimeout(() => {
      setShowNotification({ show: false, message: "", type: "" });
    }, 4000);
  };

  const markNotificationAsRead = (id) => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const renderContent = () => {
    if (
      activeTab === "overview" &&
      (!allDataLoaded ||
        isLoading ||
        !userProfile ||
        !stats ||
        !recentActivities)
    ) {
      return (
        <div className="animate-pulse">
          {/* Header skeleton */}
          <div className="mb-8">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>

          {/* Stats cards skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 rounded-lg bg-gray-100">
                    <div className="h-6 w-6 bg-gray-300 rounded"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
                <div className="h-8 bg-gray-300 rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>

          {/* Main content skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-start space-x-6">
                  <div className="w-24 h-24 rounded-full bg-gray-300 border-4 border-white shadow-lg"></div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <div className="space-y-2">
                        <div className="h-7 bg-gray-300 rounded w-1/3"></div>
                        <div className="h-5 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </div>
                      <div className="h-6 bg-gray-200 rounded-full w-24"></div>
                    </div>
                    <div className="space-y-2 mb-6">
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center">
                        <div className="h-4 w-4 bg-gray-300 rounded mr-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                      </div>
                      <div className="flex items-center">
                        <div className="h-4 w-4 bg-gray-300 rounded mr-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                      </div>
                      <div className="flex items-center">
                        <div className="h-4 w-4 bg-gray-300 rounded mr-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                      </div>
                    </div>
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                      <div className="flex flex-wrap gap-2">
                        <div className="h-8 bg-gray-200 rounded-full w-24"></div>
                        <div className="h-8 bg-gray-200 rounded-full w-20"></div>
                        <div className="h-8 bg-gray-200 rounded-full w-28"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="h-7 bg-gray-200 rounded w-1/3 mb-6"></div>
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-start space-x-3 p-3">
                    <div className="p-2 rounded-lg bg-gray-100">
                      <div className="h-5 w-5 bg-gray-300 rounded"></div>
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
              </div>
            </div>
          </div>

          {/* Quick Actions skeleton */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
            <div className="h-7 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center justify-center p-6 border border-gray-200 rounded-xl"
                >
                  <div className="h-8 w-8 bg-gray-300 rounded-full mb-3"></div>
                  <div className="h-5 bg-gray-200 rounded w-2/3 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case "overview":
        // Only pass data when ALL is loaded
        return (
          <ProfileOverview
            profile={userProfile}
            stats={stats}
            recentActivities={recentActivities}
          />
        );
      case "courses":
        return <CoursesManagement showNotification={showToastNotification} />;
      case "students":
        return <StudentsSection />;
      case "assignments":
        return <AssignmentsQuizzes />;
      case "messages":
        return (
          <MessagesNotifications
            notifications={notifications}
            markAsRead={markNotificationAsRead}
            showNotification={showToastNotification}
          />
        );
      case "earnings":
        return (
          <ProfileOverview
            profile={userProfile}
            stats={stats}
            recentActivities={recentActivities}
          />
        );
      case "analytics":
        return <AnalyticsTab />;
      case "settings":
        return (
          <SettingsTab
            profile={userProfile}
            setProfile={setUserProfile}
            showNotification={showToastNotification}
          />
        );
      default:
        return (
          <ProfileOverview
            profile={userProfile}
            stats={stats}
            recentActivities={recentActivities}
          />
        );
    }
  };

  // Header should also show loading state
  const headerProfile =
    !allDataLoaded || isLoading || !userProfile
      ? {
          name: "Loading...",
          profileImage:
            "https://images.unsplash.com/photo-1582750433449-648ed127bb54?crop=faces&fit=crop&w=200&h=200",
        }
      : userProfile;

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader
        profile={headerProfile}
        notifications={notifications.filter((n) => !n.read).length}
        setActiveTab={setActiveTab}
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
          isLoading={!allDataLoaded}
        />

        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">{renderContent()}</div>
        </main>
      </div>
    </div>
  );
};

export default TeacherMainDashboard;

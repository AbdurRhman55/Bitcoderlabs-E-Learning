// components/UserDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import DashboardOverview from './DashboardOverview';
import MyCourses from './Mycourses';
import Progress from './Progress';
import Settings from './Settings';
import Certificates from './Certificates';
import { fetchMyCourses, selectMyCourses } from '../../../slices/courseSlice';

const UserDashboard = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, user } = useSelector(state => state.auth);


  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !loading) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  const enrolledCoursesList = useSelector(selectMyCourses);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchMyCourses());
    }
  }, [dispatch, user?.id]);

  const completedCount = enrolledCoursesList.filter(c => c.status === 'completed' || c.progress === 100).length;
  const totalEnrolled = enrolledCoursesList.length;
  const avgProgress = totalEnrolled > 0
    ? Math.round(enrolledCoursesList.reduce((acc, curr) => acc + (curr.progress || 0), 0) / totalEnrolled)
    : 0;

  const userData = {
    id: user?.id || 1,
    name: user?.name || 'Student',
    email: user?.email || 'student@example.com',
    avatar: user?.avatar || null,
    joinDate: user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'March 2024',
    title: user?.role === 'student' ? 'Student' : (user?.role || 'Learner'),
    bio: user?.bio || 'Passionate about building digital experiences that make a difference.',
    level: avgProgress > 70 ? 'Advanced' : (avgProgress > 30 ? 'Intermediate' : 'Beginner'),
    points: user?.points || (completedCount * 100),
    streak: user?.streak || 0,
    completedCourses: completedCount,
    enrolledCourses: totalEnrolled,
    completionRate: avgProgress,
    weeklyGoal: user?.weekly_goal || 10,
    weeklyCompleted: user?.weekly_completed || Math.floor(avgProgress / 10),
    daysLeft: 7 - new Date().getDay() || 7,
    learningHours: user?.learning_hours || Math.round((totalEnrolled * avgProgress * 0.4)) || 0
  };

  const renderMainContent = () => {
    switch (activeSection) {
      case 'overview':
        return <DashboardOverview userData={userData} setActiveSection={setActiveSection} />;
      case 'courses':
        return <MyCourses />;
      case 'progress':
        return <Progress />;

      case 'certificates':
        return <Certificates />;
      case 'settings':
        return <Settings userData={userData} />;
      default:
        return <DashboardOverview userData={userData} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        userData={userData}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Premium Desktop & Mobile Header */}
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 lg:h-20">
              {/* Left Side: Mobile Menu Button & Welcome Text */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2.5 rounded-xl bg-gray-50 text-gray-500 hover:bg-primary-light hover:text-primary transition-all duration-300 cursor-pointer shadow-sm active:scale-90"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>

                <div className="hidden sm:block">
                  <h1 className="text-lg lg:text-xl font-extrabold text-gray-900 tracking-tight">Student Dashboard</h1>
                  <p className="text-xs text-primary font-bold uppercase tracking-widest mt-0.5">Welcome back, {userData.name}!</p>
                </div>
                <div className="sm:hidden">
                  <h1 className="text-base font-bold text-gray-900">Dashboard</h1>
                </div>
              </div>

              {/* Right Side: Quick Stats / User Info */}
              <div className="flex items-center gap-4">
                <div className="hidden md:flex flex-col items-end mr-2">
                  <span className="text-xs font-black text-gray-900 leading-none">{userData.points} XP</span>
                  <span className="text-[10px] text-primary font-bold uppercase tracking-tighter mt-1">Learning Score</span>
                </div>
                <div className="relative group">
                  <div className="w-10 h-10 lg:w-11 lg:h-11 rounded-xl overflow-hidden border-2 border-white shadow-md ring-2 ring-primary/5 group-hover:ring-primary/20 transition-all">
                    {userData.avatar ? (
                      <img src={userData.avatar} alt={userData.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-primary flex items-center justify-center text-white font-bold">
                        {userData.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-auto p-4 lg:p-8">
          {renderMainContent()}
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;
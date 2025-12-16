// components/UserDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import DashboardOverview from './DashboardOverview';
import MyCourses from './Mycourses';
import Progress from './Progress';
import Achievements from './Achievements';
import Settings from './Settings';
import Certificates from './Certificates';
import { FiLogOut } from 'react-icons/fi';
import { logoutAsync } from '../../../slices/AuthSlice';

const UserDashboard = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useSelector(state => state.auth);

  const handleLogout = () => {
    dispatch(logoutAsync());
  };

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !loading) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  const userData = {
    id: 1,
    name: 'Mia Dawood',
    email: 'bitcoderlsb@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&crop=face',
    joinDate: 'March 2010',
    title: 'Full Stack Developer',
    bio: 'Passionate about building digital experiences that make a difference.',
    level: 'Advanced',
    points: 1842,
    streak: 14,
    completedCourses: 12,
    enrolledCourses: 8,
    completionRate: 78
  };

  const renderMainContent = () => {
    switch (activeSection) {
      case 'overview':
        return <DashboardOverview userData={userData} />;
      case 'courses':
        return <MyCourses />;
      case 'progress':
        return <Progress />;
      case 'achievements':
        return <Achievements />;
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
         {/* Desktop Header */}
         <header className="hidden lg:flex items-center justify-between bg-white shadow-sm border-b border-gray-200 px-6 py-4">
           <div>
             <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
             <p className="text-sm text-gray-500 mt-1">Welcome back, {userData.name}!</p>
           </div>
           <button
             onClick={handleLogout}
             className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
           >
             <FiLogOut size={18} />
             Logout
           </button>
         </header>

         {/* Mobile header */}
         <header className="lg:hidden bg-white shadow-sm border-b border-gray-200">
           <div className="flex items-center justify-between p-4">
             <button
               onClick={() => setSidebarOpen(true)}
               className="text-gray-500 hover:text-gray-600"
             >
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
               </svg>
             </button>
             <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
             <button
               onClick={handleLogout}
               className="text-red-600 hover:text-red-700 p-1"
               title="Logout"
             >
               <FiLogOut size={20} />
             </button>
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
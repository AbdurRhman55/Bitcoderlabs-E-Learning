// components/UserDashboard.jsx
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import DashboardOverview from './DashboardOverview';
import MyCourses from './MyCourses';
import Progress from './Progress';
import Achievements from './Achievements';
import Settings from './Settings';
import Certificates from './Certificates';

const UserDashboard = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
            <div className="w-6"></div>
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
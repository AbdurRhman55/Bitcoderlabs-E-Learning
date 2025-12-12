// components/DashboardHeader.jsx
import React from 'react';
import { FaUser, FaCheck } from 'react-icons/fa';

const DashboardHeader = ({ profile }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'draft': return 'text-amber-600 bg-amber-100';
            case 'submitted': return 'text-blue-600 bg-blue-100';
            case 'approved': return 'text-emerald-600 bg-emerald-100';
            case 'rejected': return 'text-red-600 bg-red-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    return (
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-primary-light">
                            <FaUser className="text-xl text-primary" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Teacher Profile Dashboard</h1>
                            <p className="text-gray-600 text-sm">Build and manage your professional profile</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="font-medium text-gray-800">{profile.fullName || 'Your Name'}</p>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">Status:</span>
                                <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${getStatusColor(profile.status)}`}>
                                    {profile.status}
                                </span>
                            </div>
                        </div>
                        <div className="relative">
                            <img
                                src={profile.profileImageUrl || 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?crop=faces&fit=crop&w=100&h=100'}
                                alt="Profile"
                                className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
                            />
                            {profile.status === 'approved' && (
                                <div className="absolute -top-1 -right-1 bg-emerald-500 text-white rounded-full p-1 border border-white">
                                    <FaCheck className="text-xs" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default DashboardHeader;
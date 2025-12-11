// components/ProgressSidebar.jsx
import React from 'react';
import { FaUser, FaGraduationCap, FaBriefcase, FaImage, FaFileAlt, FaPaperPlane, FaHistory, FaCheck, FaSpinner } from 'react-icons/fa';

const ProgressSidebar = ({
    activeTab,
    setActiveTab,
    profile,
    isSubmitting,
    completionPercentage,
    handleSubmitForApproval
}) => {
    const tabs = [
        { id: 'personal', label: 'Personal Info', icon: <FaUser /> },
        { id: 'education', label: 'Education', icon: <FaGraduationCap /> },
        { id: 'experience', label: 'Work Experience', icon: <FaBriefcase /> },
        { id: 'workPics', label: 'Work Photos', icon: <FaImage /> },
        { id: 'preview', label: 'Profile Preview', icon: <FaFileAlt /> },
    ];

    const getSubmitButtonContent = () => {
        if (isSubmitting) {
            return (
                <>
                    <FaSpinner className="animate-spin mr-2" />
                    Submitting...
                </>
            );
        }
        if (profile.status === 'submitted') {
            return (
                <>
                    <FaHistory className="mr-2" />
                    Submitted for Approval
                </>
            );
        }
        if (profile.status === 'approved') {
            return (
                <>
                    <FaCheck className="mr-2" />
                    Profile Approved
                </>
            );
        }
        return (
            <>
                <FaPaperPlane className="mr-2" />
                Submit for Admin Approval
            </>
        );
    };

    const getProgressHint = () => {
        if (completionPercentage < 50) {
            return 'Complete more sections to submit your profile';
        }
        if (completionPercentage < 80) {
            return 'Good progress! Add more details for a complete profile';
        }
        return 'Almost ready! Review and submit for approval';
    };

    return (
        <div className="lg:w-80 space-y-6">
            {/* Progress Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Profile Completion</h2>
                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-700 font-medium">Progress</span>
                            <span className="font-bold text-primary">{completionPercentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="h-2 rounded-full bg-gradient-to-r from-primary to-primary-dark transition-all duration-500"
                                style={{ width: `${completionPercentage}%` }}
                            ></div>
                        </div>
                    </div>
                    <p className="text-sm text-gray-600">{getProgressHint()}</p>
                </div>
            </div>

            {/* Navigation Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Navigation</h2>
                <nav className="space-y-2">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center w-full p-3 rounded-xl transition-all duration-200 ${activeTab === tab.id
                                ? 'bg-primary text-white shadow-sm'
                                : 'text-gray-700 hover:bg-gray-50 hover:text-primary'
                                }`}
                        >
                            <span className="mr-3 text-lg">{tab.icon}</span>
                            <span className="font-medium">{tab.label}</span>
                        </button>
                    ))}
                </nav>

                <button
                    onClick={handleSubmitForApproval}
                    disabled={isSubmitting || profile.status === 'submitted' || profile.status === 'approved' || completionPercentage < 80}
                    className={`w-full mt-6 p-4 rounded-xl font-bold text-white transition-all duration-200 flex items-center justify-center gap-2 ${profile.status === 'submitted' || profile.status === 'approved' || completionPercentage < 80
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-primary hover:bg-primary-dark hover:shadow-md'
                        }`}
                >
                    {getSubmitButtonContent()}
                </button>

                {profile.status === 'draft' && completionPercentage < 80 && (
                    <p className="text-sm text-gray-600 mt-3 text-center">
                        Complete {80 - completionPercentage}% more to submit
                    </p>
                )}
            </div>
        </div>
    );
};

export default ProgressSidebar;
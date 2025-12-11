// TeacherDashboard.jsx
import React, { useState, useEffect } from 'react';
import DashboardHeader from './HeaderComponent';
import ProgressSidebar from './ProgressSidebar';
import TabContent from './TabContent';
import Notification from './Notification';
import { calculateCompletion } from './UpdateCalculateCompletion';
import { loadMockData } from './MockData';

const TeacherDashboard = () => {
    const [activeTab, setActiveTab] = useState('personal');
    const [profile, setProfile] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        bio: '',
        profileImage: null,
        profileImageUrl: '',
        status: 'draft',
    });

    const [educationList, setEducationList] = useState([]);
    const [experienceList, setExperienceList] = useState([]);
    const [workPics, setWorkPics] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });

    useEffect(() => {
        const data = loadMockData();
        setProfile(data.profile);
        setEducationList(data.educationList);
        setExperienceList(data.experienceList);
        setWorkPics(data.workPics);
    }, []);

    const showNotification = (message, type) => {
        setNotification({ show: true, message, type });
        setTimeout(() => {
            setNotification({ show: false, message: '', type: '' });
        }, 4000);
    };

    const handleSubmitForApproval = () => {
        setIsSubmitting(true);

        if (!profile.fullName || !profile.email || educationList.length === 0) {
            showNotification('Please fill in all required fields and add at least one education entry', 'error');
            setIsSubmitting(false);
            return;
        }

        setTimeout(() => {
            setProfile(prev => ({ ...prev, status: 'submitted' }));
            setIsSubmitting(false);
            showNotification('Profile submitted successfully for admin approval!', 'success');
        }, 1500);
    };

    const completionPercentage = calculateCompletion(profile, educationList, experienceList, workPics);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <DashboardHeader profile={profile} />

            {notification.show && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                />
            )}

            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    <ProgressSidebar
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        profile={profile}
                        isSubmitting={isSubmitting}
                        completionPercentage={completionPercentage}
                        handleSubmitForApproval={handleSubmitForApproval}
                    />

                    <div className="lg:flex-1">
                        <TabContent
                            activeTab={activeTab}
                            profile={profile}
                            setProfile={setProfile}
                            educationList={educationList}
                            setEducationList={setEducationList}
                            experienceList={experienceList}
                            setExperienceList={setExperienceList}
                            workPics={workPics}
                            setWorkPics={setWorkPics}
                            showNotification={showNotification}
                        />
                    </div>
                </div>

                <footer className="mt-12 pt-8 border-t border-gray-200 text-center text-gray-600">
                    <p>Teacher Profile Dashboard • {new Date().getFullYear()} • All data is securely stored</p>
                    <p className="text-sm mt-2">
                        Once submitted, your profile will be reviewed by administration within 3-5 business days
                    </p>
                </footer>
            </div>
        </div>
    );
};

export default TeacherDashboard;
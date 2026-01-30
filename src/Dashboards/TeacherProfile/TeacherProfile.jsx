// TeacherDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import DashboardHeader from './HeaderComponent';
import ProgressSidebar from './ProgressSidebar';
import TabContent from './TabContent';
import Notification from './Notification';
import { calculateCompletion } from './UpdateCalculateCompletion';
import { apiClient } from '../../../src/api/index.js';

const TeacherDashboard = () => {
    const { user, isAuthenticated } = useSelector(state => state.auth);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('personal');
    const [profile, setProfile] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        bio: '',
        profileImage: null,
        profileImageUrl: '',
        status: 'pending',
    });

    const [educationList, setEducationList] = useState([]);
    const [experienceList, setExperienceList] = useState([]);
    const [ProjectList, setProjectList] = useState([]);
    const [CertificationList, setCertificationList] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });

    const showNotification = (message, type) => {
        setNotification({ show: true, message, type });
        setTimeout(() => {
            setNotification({ show: false, message: '', type: '' });
        }, 4000);
    };

    // Check authentication and instructor role
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        if (user && user.role !== 'instructor') {
            navigate('/'); // Redirect to home if not an instructor
            return;
        }
    }, [isAuthenticated, user, navigate]);

    // Load existing instructor profile data
    useEffect(() => {
        const loadProfileData = async () => {
            if (isAuthenticated && user?.role === 'instructor') {
                try {
                    const data = await apiClient.getMyProfile();
                    const instructor = data.data; // API returns { data: instructor }

                    // Populate profile state
                    setProfile({
                        fullName: instructor.name || '',
                        email: instructor.email || '',
                        phone: instructor.phone || '',
                        address: '', // Address field not implemented in database
                        bio: instructor.bio || '',
                        profileImage: null,
                        profileImageUrl: (instructor.image && typeof instructor.image === 'string')
                            ? `http://127.0.0.1:8000/storage/${instructor.image.replace(/^\/+/, '').replace(/^public\//, '')}`
                            : '',
                        status: instructor.approval_status || 'pending',
                    });

                    // Populate related lists
                    setEducationList(Array.isArray(instructor.education) ? instructor.education : []);
                    setExperienceList(Array.isArray(instructor.work_experience) ? instructor.work_experience : []);
                    setProjectList(Array.isArray(instructor.projects) ? instructor.projects : []);
                    setCertificationList((instructor.certifications || []).map(cert => ({
                        id: cert.id || Date.now() + Math.random(),
                        name: cert.name || '',
                        issuer: cert.issuer || '',
                        issueDate: cert.issue_date || '',
                        expiryDate: cert.expiry_date || '',
                        credentialId: cert.credential_id || '',
                        credentialUrl: cert.credential_url || '',
                        description: cert.description
                    })));

                    // If already approved, redirect immediately
                    if (instructor.approval_status === 'approved') {
                        navigate('/teachermaindashboard');
                        return;
                    }
                } catch (error) {
                    console.error('Error loading profile:', error);
                    console.error('User data:', user);
                    console.error('Response data:', error.response?.data);
                    showNotification('Failed to load profile data. Please try refreshing the page.', 'error');
                }
            }
        };

        loadProfileData();
    }, [isAuthenticated, user, navigate]);

    // Polling for approval status change
    useEffect(() => {
        if (!isAuthenticated || user?.role !== 'instructor') return;

        const pollInterval = setInterval(async () => {
            try {
                const data = await apiClient.getMyProfile();
                const instructor = data.data;
                const currentStatus = instructor.approval_status || 'pending';

                if (currentStatus !== profile.status) {
                    setProfile(prev => ({ ...prev, status: currentStatus }));

                    if (currentStatus === 'approved') {
                        showNotification('Congratulations! Your profile has been approved. Redirecting to dashboard...', 'success');
                        setTimeout(() => {
                            navigate('/teachermaindashboard');
                        }, 3000); // Give time for notification to be seen
                    }
                }
            } catch (error) {
                console.error('Error polling profile status:', error);
            }
        }, 10000); // Poll every 10 seconds

        return () => clearInterval(pollInterval);
    }, [isAuthenticated, user, profile.status, navigate]);

    // Show loading or redirect if not authenticated or not instructor
    if (!isAuthenticated || !user || user.role !== 'instructor') {
        return <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-gray-600">Loading...</p>
            </div>
        </div>;
    }



    const saveProfileData = async () => {
        setIsSaving(true);

        try {
            // Prepare data for API
            const profileData = {
                name: profile.fullName,
                bio: profile.bio,
                email: profile.email,
                phone: profile.phone,
            };

            const relatedData = {
                education: educationList.map(edu => ({
                    institution: edu.institution,
                    degree: edu.degree,
                    year: edu.year,
                    description: edu.description
                })),
                work_experience: experienceList.map(exp => ({
                    institution: exp.institution,
                    position: exp.position,
                    duration: exp.duration,
                    description: exp.description
                })),
                projects: ProjectList.map(proj => ({
                    title: proj.title,
                    organization: proj.organization,
                    role: proj.role,
                    duration: proj.duration,
                    technologies: proj.technologies,
                    link: proj.link,
                    description: proj.description
                })),
                certifications: CertificationList.map(cert => ({
                    name: cert.name,
                    issuer: cert.issuer,
                    issue_date: cert.issueDate,
                    expiry_date: cert.expiryDate,
                    credential_id: cert.credentialId,
                    credential_url: cert.credentialUrl,
                    description: cert.description
                }))
            };

            const payload = { ...profileData, ...relatedData };

            if (profile.profileImage) {
                const formData = new FormData();
                Object.entries(profileData).forEach(([key, value]) => {
                    if (value !== undefined && value !== null) {
                        formData.append(key, value);
                    }
                });

                formData.append('education', JSON.stringify(relatedData.education));
                formData.append('work_experience', JSON.stringify(relatedData.work_experience));
                formData.append('projects', JSON.stringify(relatedData.projects));
                formData.append('certifications', JSON.stringify(relatedData.certifications));
                formData.append('image', profile.profileImage);

                await apiClient.updateInstructorProfile(formData);
            } else {
                await apiClient.updateInstructorProfile(payload);
            }

            // --- REFETCH PROFILE TO GET CONFIRMED IMAGE URL ---
            const freshProfile = await apiClient.getMyProfile();
            const instructor = freshProfile.data; // or freshProfile.data.data? consistency check
            if (instructor) {
                setProfile(prev => ({
                    ...prev,
                    profileImageUrl: (instructor.image && typeof instructor.image === 'string' && !instructor.image.includes('C:'))
                        ? `http://127.0.0.1:8000/storage/${instructor.image.replace(/^\/+/, '').replace(/^public\//, '')}`
                        : prev.profileImageUrl
                }));
            }
            // --------------------------------------------------

            showNotification('Profile saved successfully!', 'success');
        } catch (error) {
            console.error('Error saving profile:', error);
            showNotification('Failed to save profile. Please try again.', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleSubmitForApproval = async () => {
        setIsSubmitting(true);

        try {
            // First save the complete profile
            await saveProfileData();

            // Get instructor profile data to get the ID
            const profileData = await apiClient.getMyProfile();
            const instructorId = profileData.data.id;

            if (!instructorId) {
                showNotification('Unable to identify instructor profile. Please contact support.', 'error');
                setIsSubmitting(false);
                return;
            }

            // Then submit for approval
            await apiClient.submitInstructorForApproval(instructorId);
            setProfile(prev => ({ ...prev, status: 'submitted' }));
            showNotification('Profile submitted successfully for admin approval!', 'success');
        } catch (error) {
            console.error('Error submitting for approval:', error);
            showNotification('Failed to submit profile for approval. Please try again.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const completionPercentage = calculateCompletion(profile, educationList, experienceList,);

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
                        isSaving={isSaving}
                        completionPercentage={completionPercentage}
                        handleSubmitForApproval={handleSubmitForApproval}
                        onSave={saveProfileData}
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
                            project={ProjectList}
                            setProjectList={setProjectList}
                            Certification={CertificationList}
                            setCertificationList={setCertificationList}
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

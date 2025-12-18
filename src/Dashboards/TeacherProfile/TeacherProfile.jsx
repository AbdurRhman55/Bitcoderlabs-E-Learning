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
             if (user?.instructor_id) {
                 try {
                     const data = await apiClient.getInstructor(user.instructor_id);
                     const instructor = data.data; // Assuming API returns { data: instructor }

                     // Populate profile state
                     setProfile({
                         fullName: instructor.name || '',
                         email: instructor.email || '',
                         phone: instructor.phone || '',
                         address: instructor.address || '',
                         bio: instructor.bio || '',
                         profileImage: null,
                         profileImageUrl: instructor.image ? `http://localhost:8000/storage/${instructor.image}` : '',
                         status: instructor.approval_status || 'draft',
                     });

                     // Populate related lists
                     setEducationList(instructor.education || []);
                     setExperienceList(instructor.experience || []);
                     setProjectList(instructor.projects || []);
                     setCertificationList(instructor.certifications || []);
                 } catch (error) {
                     console.error('Error loading profile:', error);
                     showNotification('Failed to load profile data.', 'error');
                 }
             }
         };

         loadProfileData();
     }, [user?.instructor_id]);

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
                // Add other personal fields as needed
                // Note: File uploads need special handling
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

            // For now, we'll assume creating/updating instructor profile
            // This needs to be integrated with actual API endpoints
            console.log('Saving profile data:', { profileData, relatedData });

             // Call API to update instructor profile
             const instructorId = user?.instructor_id;
             if (instructorId) {
                 await apiClient.updateInstructor(instructorId, { ...profileData, ...relatedData });
             }

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

            // Get instructor ID from user data
            const instructorId = user?.instructor_id || user?.id;

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
// src/components/sections/SettingsTab.jsx
import React, { useState } from 'react';
import { FaUser, FaLock, FaEnvelope, FaPhone, FaMapMarkerAlt, FaLinkedin, FaTwitter, FaGithub, FaSave, FaUpload } from 'react-icons/fa';

const SettingsTab = ({ profile, setProfile, showNotification }) => {
    const [activeSection, setActiveSection] = useState('profile');
    const [formData, setFormData] = useState({
        name: profile.name,
        email: profile.email,
        phone: '',
        address: '',
        qualification: profile.qualification,
        about: profile.about,
        social: { ...profile.socialLinks },
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleInputChange = (field, value) => {
        if (field.includes('.')) {
            const [parent, child] = field.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [field]: value
            }));
        }
    };

    const handleSaveProfile = () => {
        setProfile(prev => ({
            ...prev,
            name: formData.name,
            email: formData.email,
            qualification: formData.qualification,
            about: formData.about,
            socialLinks: formData.social
        }));
        showNotification('Profile updated successfully', 'success');
    };

    const handleSavePassword = () => {
        if (formData.newPassword !== formData.confirmPassword) {
            showNotification('Passwords do not match', 'error');
            return;
        }
        showNotification('Password updated successfully', 'success');
        setFormData(prev => ({
            ...prev,
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        }));
    };

    const sections = [
        { id: 'profile', label: 'Profile', icon: <FaUser /> },
        { id: 'security', label: 'Security', icon: <FaLock /> },
        { id: 'notifications', label: 'Notifications', icon: <FaEnvelope /> },
        { id: 'billing', label: 'Billing', icon: <FaEnvelope /> },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
                    <p className="text-gray-600">Manage your account settings and preferences</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                        <nav className="space-y-1">
                            {sections.map((section) => (
                                <button
                                    key={section.id}
                                    onClick={() => setActiveSection(section.id)}
                                    className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-all ${activeSection === section.id
                                            ? 'bg-primary text-white'
                                            : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    <span className={`mr-3 ${activeSection === section.id ? 'text-white' : 'text-gray-500'}`}>
                                        {section.icon}
                                    </span>
                                    {section.label}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-3">
                    {activeSection === 'profile' && (
                        <div className="space-y-6">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h3 className="text-lg font-medium text-gray-800 mb-6">Personal Information</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <FaUser className="text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => handleInputChange('name', e.target.value)}
                                                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                                placeholder="Enter your name"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <FaEnvelope className="text-gray-400" />
                                            </div>
                                            <input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => handleInputChange('email', e.target.value)}
                                                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                                placeholder="Enter your email"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <FaPhone className="text-gray-400" />
                                            </div>
                                            <input
                                                type="tel"
                                                value={formData.phone}
                                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                                placeholder="Enter your phone number"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <FaMapMarkerAlt className="text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                value={formData.address}
                                                onChange={(e) => handleInputChange('address', e.target.value)}
                                                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                                placeholder="Enter your address"
                                            />
                                        </div>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Qualification</label>
                                        <input
                                            type="text"
                                            value={formData.qualification}
                                            onChange={(e) => handleInputChange('qualification', e.target.value)}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                            placeholder="Enter your qualification"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">About Me</label>
                                        <textarea
                                            rows="4"
                                            value={formData.about}
                                            onChange={(e) => handleInputChange('about', e.target.value)}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                            placeholder="Tell us about yourself..."
                                        />
                                    </div>
                                </div>

                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <h4 className="text-lg font-medium text-gray-800 mb-4">Social Links</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <FaLinkedin className="inline mr-2 text-blue-600" />
                                                LinkedIn
                                            </label>
                                            <input
                                                type="url"
                                                value={formData.social.linkedin}
                                                onChange={(e) => handleInputChange('social.linkedin', e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                                placeholder="https://linkedin.com/in/..."
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <FaTwitter className="inline mr-2 text-blue-400" />
                                                Twitter
                                            </label>
                                            <input
                                                type="url"
                                                value={formData.social.twitter}
                                                onChange={(e) => handleInputChange('social.twitter', e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                                placeholder="https://twitter.com/..."
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <FaGithub className="inline mr-2 text-gray-800" />
                                                GitHub
                                            </label>
                                            <input
                                                type="url"
                                                value={formData.social.github}
                                                onChange={(e) => handleInputChange('social.github', e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                                placeholder="https://github.com/..."
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-end">
                                    <button
                                        onClick={handleSaveProfile}
                                        className="flex items-center px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                                    >
                                        <FaSave className="mr-2" />
                                        Save Changes
                                    </button>
                                </div>
                            </div>

                            {/* Profile Picture */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h3 className="text-lg font-medium text-gray-800 mb-4">Profile Picture</h3>
                                <div className="flex items-center space-x-8">
                                    <img
                                        src={profile.profileImage}
                                        alt={profile.name}
                                        className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
                                    />
                                    <div>
                                        <p className="text-sm text-gray-600 mb-4">Upload a new profile picture. JPG, PNG up to 2MB.</p>
                                        <div className="flex space-x-3">
                                            <button className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
                                                <FaUpload className="mr-2" />
                                                Upload Photo
                                            </button>
                                            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeSection === 'security' && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-medium text-gray-800 mb-6">Security Settings</h3>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FaLock className="text-gray-400" />
                                        </div>
                                        <input
                                            type="password"
                                            value={formData.currentPassword}
                                            onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                            placeholder="Enter current password"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FaLock className="text-gray-400" />
                                        </div>
                                        <input
                                            type="password"
                                            value={formData.newPassword}
                                            onChange={(e) => handleInputChange('newPassword', e.target.value)}
                                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                            placeholder="Enter new password"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FaLock className="text-gray-400" />
                                        </div>
                                        <input
                                            type="password"
                                            value={formData.confirmPassword}
                                            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                            placeholder="Confirm new password"
                                        />
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-gray-200">
                                    <h4 className="text-lg font-medium text-gray-800 mb-4">Two-Factor Authentication</h4>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-gray-800">Enable 2FA</p>
                                            <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                                        </div>
                                        <div className="relative inline-block w-12 h-6">
                                            <input type="checkbox" className="sr-only" id="2fa-toggle" />
                                            <label htmlFor="2fa-toggle" className="block w-12 h-6 bg-gray-300 rounded-full cursor-pointer"></label>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        onClick={handleSavePassword}
                                        className="flex items-center px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                                    >
                                        <FaSave className="mr-2" />
                                        Update Password
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeSection === 'notifications' && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-medium text-gray-800 mb-6">Notification Preferences</h3>

                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-gray-800">Email Notifications</p>
                                        <p className="text-sm text-gray-600">Receive email updates about your courses</p>
                                    </div>
                                    <div className="relative inline-block w-12 h-6">
                                        <input type="checkbox" className="sr-only" id="email-notifications" defaultChecked />
                                        <label htmlFor="email-notifications" className="block w-12 h-6 bg-green-500 rounded-full cursor-pointer"></label>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-gray-800">Student Activity</p>
                                        <p className="text-sm text-gray-600">Get notified when students enroll or submit work</p>
                                    </div>
                                    <div className="relative inline-block w-12 h-6">
                                        <input type="checkbox" className="sr-only" id="student-activity" defaultChecked />
                                        <label htmlFor="student-activity" className="block w-12 h-6 bg-green-500 rounded-full cursor-pointer"></label>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-gray-800">Course Updates</p>
                                        <p className="text-sm text-gray-600">Notifications about course reviews and approvals</p>
                                    </div>
                                    <div className="relative inline-block w-12 h-6">
                                        <input type="checkbox" className="sr-only" id="course-updates" />
                                        <label htmlFor="course-updates" className="block w-12 h-6 bg-gray-300 rounded-full cursor-pointer"></label>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-gray-800">Payment Notifications</p>
                                        <p className="text-sm text-gray-600">Get updates about earnings and withdrawals</p>
                                    </div>
                                    <div className="relative inline-block w-12 h-6">
                                        <input type="checkbox" className="sr-only" id="payment-notifications" defaultChecked />
                                        <label htmlFor="payment-notifications" className="block w-12 h-6 bg-green-500 rounded-full cursor-pointer"></label>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-gray-800">Promotional Emails</p>
                                        <p className="text-sm text-gray-600">Receive updates about new features and promotions</p>
                                    </div>
                                    <div className="relative inline-block w-12 h-6">
                                        <input type="checkbox" className="sr-only" id="promotional-emails" />
                                        <label htmlFor="promotional-emails" className="block w-12 h-6 bg-gray-300 rounded-full cursor-pointer"></label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SettingsTab;
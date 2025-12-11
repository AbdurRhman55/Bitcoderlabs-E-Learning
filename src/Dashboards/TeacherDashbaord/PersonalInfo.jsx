// components/tabs/PersonalInfoTab.jsx
import React from 'react';
import { FaUser, FaCloudUploadAlt, FaTrash } from 'react-icons/fa';

const PersonalInfoTab = ({ profile, setProfile, showNotification }) => {
    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                showNotification('File size should be less than 2MB', 'error');
                return;
            }

            const reader = new FileReader();
            reader.onload = (event) => {
                setProfile(prev => ({
                    ...prev,
                    profileImage: file,
                    profileImageUrl: event.target.result
                }));
                showNotification('Profile image uploaded successfully!', 'success');
            };
            reader.readAsDataURL(file);
        }
    };

    const removeProfileImage = () => {
        setProfile(prev => ({
            ...prev,
            profileImage: null,
            profileImageUrl: ''
        }));
        showNotification('Profile image removed', 'info');
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 animate-fadeIn">
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 rounded-xl bg-primary-light">
                    <FaUser className="text-2xl text-primary" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Personal Information</h2>
                    <p className="text-gray-600">Tell us about yourself</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-2">
                    <label className="block text-gray-700 font-medium">
                        Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="fullName"
                        value={profile.fullName}
                        onChange={handleProfileChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                        placeholder="Enter your full name"
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-gray-700 font-medium">
                        Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={profile.email}
                        onChange={handleProfileChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                        placeholder="Enter your email"
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-gray-700 font-medium">Phone Number</label>
                    <input
                        type="text"
                        name="phone"
                        value={profile.phone}
                        onChange={handleProfileChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                        placeholder="Enter your phone number"
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-gray-700 font-medium">Address</label>
                    <input
                        type="text"
                        name="address"
                        value={profile.address}
                        onChange={handleProfileChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                        placeholder="Enter your address"
                    />
                </div>
            </div>

            <div className="mb-8">
                <label className="block text-gray-700 font-medium mb-2">
                    Professional Bio <span className="text-red-500">*</span>
                </label>
                <textarea
                    name="bio"
                    value={profile.bio}
                    onChange={handleProfileChange}
                    rows="4"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    placeholder="Tell us about your teaching philosophy, experience, and qualifications..."
                />
            </div>

            <div>
                <label className="block text-gray-700 font-medium mb-4">Profile Photo</label>
                <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
                    <div className="relative">
                        <img
                            src={profile.profileImageUrl || 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?crop=faces&fit=crop&w=150&h=150'}
                            alt="Profile"
                            className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
                        />
                        {profile.profileImageUrl && (
                            <button
                                onClick={removeProfileImage}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-md"
                                aria-label="Remove profile image"
                            >
                                <FaTrash className="text-xs" />
                            </button>
                        )}
                    </div>

                    <div className="flex-1">
                        <label className="flex flex-col items-center justify-center w-full h-full p-8 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-primary hover:bg-primary-light/10 transition-all group">
                            <FaCloudUploadAlt className="text-3xl mb-4 text-primary group-hover:scale-110 transition-transform" />
                            <p className="text-gray-700 font-medium text-lg">Click to upload profile photo</p>
                            <p className="text-gray-500 text-sm mt-1">JPG, PNG up to 2MB</p>
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageUpload}
                            />
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PersonalInfoTab;
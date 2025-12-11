// components/tabs/PreviewTab.jsx
import React from 'react';
import { FaFileAlt, FaEnvelope, FaPhone, FaMapMarkerAlt, FaGraduationCap, FaBriefcase, FaImage } from 'react-icons/fa';

const PreviewTab = ({ profile, educationList, experienceList, workPics }) => {
    const getStatusConfig = (status) => {
        switch (status) {
            case 'draft':
                return { color: 'bg-amber-100 text-amber-800', message: 'Your profile is currently in draft mode. Submit for admin approval when ready.' };
            case 'submitted':
                return { color: 'bg-blue-100 text-blue-800', message: 'Your profile has been submitted for admin approval. You will be notified once reviewed.' };
            case 'approved':
                return { color: 'bg-emerald-100 text-emerald-800', message: 'Congratulations! Your profile has been approved by the admin.' };
            case 'rejected':
                return { color: 'bg-red-100 text-red-800', message: 'Your profile needs revisions. Please review admin feedback and resubmit.' };
            default:
                return { color: 'bg-gray-100 text-gray-800', message: '' };
        }
    };

    const statusConfig = getStatusConfig(profile.status);

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 animate-fadeIn">
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 rounded-xl bg-primary-light">
                    <FaFileAlt className="text-2xl text-primary" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Profile Preview</h2>
                    <p className="text-gray-600">How your profile will appear to admins</p>
                </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 md:p-8">
                {/* Profile Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center gap-8 mb-8 pb-8 border-b border-gray-200">
                    <div className="flex-shrink-0">
                        <img
                            src={profile.profileImageUrl || 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?crop=faces&fit=crop&w=150&h=150'}
                            alt="Profile"
                            className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
                        />
                    </div>
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-gray-800 mb-3">{profile.fullName || 'Your Name'}</h1>
                        <p className="text-gray-600 text-lg mb-4 leading-relaxed">
                            {profile.bio || 'Professional bio will appear here'}
                        </p>
                        <div className="flex flex-wrap gap-4">
                            {profile.email && (
                                <div className="flex items-center gap-2 text-gray-700">
                                    <FaEnvelope className="text-primary" />
                                    <span>{profile.email}</span>
                                </div>
                            )}
                            {profile.phone && (
                                <div className="flex items-center gap-2 text-gray-700">
                                    <FaPhone className="text-primary" />
                                    <span>{profile.phone}</span>
                                </div>
                            )}
                            {profile.address && (
                                <div className="flex items-center gap-2 text-gray-700">
                                    <FaMapMarkerAlt className="text-primary" />
                                    <span>{profile.address}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Education Section */}
                {educationList.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200 flex items-center gap-3">
                            <FaGraduationCap className="text-primary" />
                            Education
                        </h2>
                        <div className="space-y-6">
                            {educationList.map((edu) => (
                                <div key={edu.id} className="pl-4 border-l-4 border-primary-light">
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                                        <h3 className="text-xl font-bold text-gray-800">{edu.degree}</h3>
                                        {edu.year && (
                                            <span className="text-gray-600 bg-gray-100 px-3 py-1 rounded-full text-sm">
                                                {edu.year}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-gray-700 font-medium mb-1">{edu.institution}</p>
                                    {edu.description && (
                                        <p className="text-gray-600">{edu.description}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Experience Section */}
                {experienceList.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200 flex items-center gap-3">
                            <FaBriefcase className="text-primary" />
                            Work Experience
                        </h2>
                        <div className="space-y-6">
                            {experienceList.map((exp) => (
                                <div key={exp.id} className="pl-4 border-l-4 border-primary-light">
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                                        <h3 className="text-xl font-bold text-gray-800">{exp.position}</h3>
                                        {exp.duration && (
                                            <span className="text-gray-600 bg-gray-100 px-3 py-1 rounded-full text-sm">
                                                {exp.duration}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-gray-700 font-medium mb-1">{exp.institution}</p>
                                    {exp.description && (
                                        <p className="text-gray-600 whitespace-pre-line">{exp.description}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Work Photos Section */}
                {workPics.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200 flex items-center gap-3">
                            <FaImage className="text-primary" />
                            Work Gallery
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                            {workPics.slice(0, 6).map((pic) => (
                                <div key={pic.id} className="rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-shadow">
                                    <img
                                        src={pic.url}
                                        alt={pic.caption}
                                        className="w-full h-40 object-cover"
                                    />
                                    <div className="p-3 bg-white">
                                        <p className="text-gray-700 text-sm text-center">{pic.caption}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {workPics.length > 6 && (
                            <p className="text-center text-gray-600 text-sm">
                                + {workPics.length - 6} more photo{workPics.length - 6 !== 1 ? 's' : ''}
                            </p>
                        )}
                    </div>
                )}

                {/* Status Section */}
                <div className="mt-8 p-6 rounded-xl bg-primary-light">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-800 mb-2">Submission Status</h3>
                            <p className="text-gray-700">{statusConfig.message}</p>
                        </div>
                        <div className={`px-4 py-2 rounded-full font-bold ${statusConfig.color} text-sm`}>
                            {profile.status.toUpperCase()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PreviewTab;
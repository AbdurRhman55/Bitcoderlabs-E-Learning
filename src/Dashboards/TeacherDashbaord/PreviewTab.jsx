// components/tabs/PreviewTab.jsx
import React from 'react';
import {
    FaFileAlt,
    FaEnvelope,
    FaPhone,
    FaMapMarkerAlt,
    FaGraduationCap,
    FaBriefcase,
    FaImage,
    FaProjectDiagram,
    FaAward,
    FaExternalLinkAlt
} from 'react-icons/fa';

const PreviewTab = ({ profile, educationList, experienceList, workPics, projectsList, certificationsList }) => {
    const getStatusConfig = (status) => {
        switch (status) {
            case 'draft':
                return {
                    color: 'bg-amber-100 text-amber-800',
                    message: 'Your profile is currently in draft mode. Submit for admin approval when ready.'
                };
            case 'submitted':
                return {
                    color: 'bg-blue-100 text-blue-800',
                    message: 'Your profile has been submitted for admin approval. You will be notified once reviewed.'
                };
            case 'approved':
                return {
                    color: 'bg-emerald-100 text-emerald-800',
                    message: 'Congratulations! Your profile has been approved by the admin.'
                };
            case 'rejected':
                return {
                    color: 'bg-red-100 text-red-800',
                    message: 'Your profile needs revisions. Please review admin feedback and resubmit.'
                };
            default:
                return { color: 'bg-gray-100 text-gray-800', message: '' };
        }
    };

    const statusConfig = getStatusConfig(profile.status);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

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
                                            <span className="text-gray-600 bg-gray-100 px-3 py-1 rounded-full text-sm font-medium">
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
                                            <span className="text-gray-600 bg-gray-100 px-3 py-1 rounded-full text-sm font-medium">
                                                {exp.duration}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-gray-700 font-medium mb-1">{exp.institution}</p>
                                    {exp.description && (
                                        <p className="text-gray-600 whitespace-pre-line leading-relaxed">{exp.description}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Projects Section */}
                {projectsList && projectsList.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200 flex items-center gap-3">
                            <FaProjectDiagram className="text-purple-500" />
                            Projects
                        </h2>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {projectsList.map((project) => (
                                <div key={project.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-sm transition-shadow">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-xl font-bold text-gray-800">{project.title}</h3>
                                        {project.link && (
                                            <a
                                                href={project.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-primary hover:text-primary-dark transition-colors"
                                                title="View Project"
                                            >
                                                <FaExternalLinkAlt />
                                            </a>
                                        )}
                                    </div>

                                    <div className="flex flex-wrap items-center gap-3 mb-4">
                                        <span className="text-gray-700 font-medium text-sm">{project.organization}</span>
                                        {project.role && (
                                            <span className="px-2 py-1 bg-primary-light text-primary text-xs font-medium rounded-full">
                                                {project.role}
                                            </span>
                                        )}
                                        {project.duration && (
                                            <span className="text-gray-600 text-sm">{project.duration}</span>
                                        )}
                                    </div>

                                    {project.technologies && (
                                        <div className="mb-4">
                                            <p className="text-sm text-gray-700 font-medium mb-2">Technologies Used:</p>
                                            <div className="flex flex-wrap gap-2">
                                                {project.technologies.split(',').map((tech, index) => (
                                                    <span
                                                        key={index}
                                                        className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                                                    >
                                                        {tech.trim()}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {project.description && (
                                        <p className="text-gray-600 text-sm leading-relaxed">{project.description}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Certifications Section */}
                {certificationsList && certificationsList.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200 flex items-center gap-3">
                            <FaAward className="text-amber-500" />
                            Certifications
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {certificationsList.map((cert) => (
                                <div key={cert.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-sm transition-shadow">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-xl font-bold text-gray-800">{cert.name}</h3>
                                        {cert.credentialUrl && (
                                            <a
                                                href={cert.credentialUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-amber-600 hover:text-amber-700 transition-colors"
                                                title="Verify Certificate"
                                            >
                                                <FaExternalLinkAlt />
                                            </a>
                                        )}
                                    </div>

                                    <div className="mb-4">
                                        <p className="text-gray-700 font-medium mb-2">{cert.issuer}</p>
                                        {cert.credentialId && (
                                            <p className="text-sm text-gray-600 mb-2">
                                                Credential ID: <span className="font-mono">{cert.credentialId}</span>
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex flex-wrap gap-4 mb-4">
                                        {cert.issueDate && (
                                            <div>
                                                <p className="text-xs text-gray-500 font-medium">Issued</p>
                                                <p className="text-sm text-gray-700">{formatDate(cert.issueDate)}</p>
                                            </div>
                                        )}
                                        {cert.expiryDate && (
                                            <div>
                                                <p className="text-xs text-gray-500 font-medium">Expires</p>
                                                <p className="text-sm text-gray-700">{formatDate(cert.expiryDate)}</p>
                                            </div>
                                        )}
                                    </div>

                                    {cert.description && (
                                        <p className="text-gray-600 text-sm leading-relaxed">{cert.description}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Work Photos Section */}
                {workPics && workPics.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200 flex items-center gap-3">
                            <FaImage className="text-primary" />
                            Work Gallery
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                            {workPics.slice(0, 6).map((pic) => (
                                <div key={pic.id} className="rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-shadow group">
                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={pic.url}
                                            alt={pic.caption}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
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

                {/* Summary Stats */}
                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {educationList.length > 0 && (
                        <div className="bg-white p-4 rounded-xl border border-gray-200 text-center">
                            <p className="text-2xl font-bold text-primary">{educationList.length}</p>
                            <p className="text-sm text-gray-600">Education</p>
                        </div>
                    )}
                    {experienceList.length > 0 && (
                        <div className="bg-white p-4 rounded-xl border border-gray-200 text-center">
                            <p className="text-2xl font-bold text-primary">{experienceList.length}</p>
                            <p className="text-sm text-gray-600">Experience</p>
                        </div>
                    )}
                    {projectsList && projectsList.length > 0 && (
                        <div className="bg-white p-4 rounded-xl border border-gray-200 text-center">
                            <p className="text-2xl font-bold text-purple-600">{projectsList.length}</p>
                            <p className="text-sm text-gray-600">Projects</p>
                        </div>
                    )}
                    {certificationsList && certificationsList.length > 0 && (
                        <div className="bg-white p-4 rounded-xl border border-gray-200 text-center">
                            <p className="text-2xl font-bold text-amber-600">{certificationsList.length}</p>
                            <p className="text-sm text-gray-600">Certifications</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PreviewTab;
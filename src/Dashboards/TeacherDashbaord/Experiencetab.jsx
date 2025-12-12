// components/tabs/ExperienceTab.jsx
import React from 'react';
import { FaBriefcase, FaTrash, FaProjectDiagram, FaAward } from 'react-icons/fa';
import { MdWork } from 'react-icons/md';

const ExperienceTab = ({
    experienceList,
    setExperienceList,
    projectsList,
    setProjectsList,
    Certification,
    setCertificationsList,
    showNotification
}) => {
    // Experience Functions
    const addExperience = () => {
        const newId = experienceList.length > 0
            ? Math.max(...experienceList.map(item => item.id)) + 1
            : 1;
        setExperienceList([
            ...experienceList,
            {
                id: newId,
                institution: '',
                position: '',
                duration: '',
                description: ''
            }
        ]);
        showNotification('New experience entry added', 'info');
    };

    const updateExperience = (id, field, value) => {
        setExperienceList(experienceList.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        ));
    };

    const removeExperience = (id) => {
        setExperienceList(experienceList.filter(item => item.id !== id));
        showNotification('Experience entry removed', 'info');
    };

    const isExperienceValid = (exp) => {
        return exp.institution.trim() && exp.position.trim();
    };

    // Projects Functions
    const addProject = () => {
        const newId = projectsList.length > 0
            ? Math.max(...projectsList.map(item => item.id)) + 1
            : 1;
        setProjectsList([
            ...projectsList,
            {
                id: newId,
                title: '',
                organization: '',
                duration: '',
                description: '',
                role: '',
                technologies: '',
                link: ''
            }
        ]);
        showNotification('New project entry added', 'info');
    };

    const updateProject = (id, field, value) => {
        setProjectsList(projectsList.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        ));
    };

    const removeProject = (id) => {
        setProjectsList(projectsList.filter(item => item.id !== id));
        showNotification('Project entry removed', 'info');
    };

    const isProjectValid = (project) => {
        return project.title.trim() && project.organization.trim();
    };

    // Certifications Functions
    const addCertification = () => {
        const newId = Certification?.length > 0
            ? Math.max(...Certification.map(item => item.id)) + 1
            : 1;
        setCertificationsList([
            ...Certification,
            {
                id: newId,
                name: '',
                issuer: '',
                issueDate: '',
                expiryDate: '',
                credentialId: '',
                credentialUrl: '',
                description: ''
            }
        ]);
        showNotification('New certification entry added', 'info');
    };

    const updateCertification = (id, field, value) => {
        setCertificationsList(Certification.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        ));
    };

    const removeCertification = (id) => {
        setCertificationsList(Certification.filter(item => item.id !== id));
        showNotification('Certification entry removed', 'info');
    };

    const isCertificationValid = (cert) => {
        return cert.name.trim() && cert.issuer.trim();
    };

    // Handle form submission for Experience
    const handleExperienceSubmit = (e, expId) => {
        e.preventDefault();
        const experience = experienceList.find(exp => exp.id === expId);
        if (isExperienceValid(experience)) {
            showNotification(`Experience entry #${experienceList.findIndex(exp => exp.id === expId) + 1} saved successfully!`, 'success');
        }
    };

    // Handle form submission for Projects
    const handleProjectSubmit = (e, projectId) => {
        e.preventDefault();
        const project = projectsList.find(proj => proj.id === projectId);
        if (isProjectValid(project)) {
            showNotification(`Project entry #${projectsList.findIndex(proj => proj.id === projectId) + 1} saved successfully!`, 'success');
        }
    };

    // Handle form submission for Certifications
    const handleCertificationSubmit = (e, certId) => {
        e.preventDefault();
        const certification = Certification.find(cert => cert.id === certId);
        if (isCertificationValid(certification)) {
            showNotification(`Certification entry #${Certification.findIndex(cert => cert.id === certId) + 1} saved successfully!`, 'success');
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 animate-fadeIn">
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 rounded-xl bg-primary-light">
                    <FaBriefcase className="text-2xl text-primary" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Professional Portfolio</h2>
                    <p className="text-gray-600">Add your work experience, projects, and certifications</p>
                </div>
            </div>

            {/* Work Experience Section */}
            <div className="mb-12">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-50">
                            <FaBriefcase className="text-xl text-blue-500" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">Work Experience</h3>
                    </div>
                    <button
                        onClick={addExperience}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium text-sm"
                    >
                        <MdWork />
                        Add Experience
                    </button>
                </div>

                <div className="space-y-6">
                    {experienceList.map((exp, index) => (
                        <form
                            key={exp.id}
                            onSubmit={(e) => handleExperienceSubmit(e, exp.id)}
                            className="border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-colors"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-3">
                                    <h4 className="text-lg font-bold text-gray-800">Experience #{index + 1}</h4>
                                    {isExperienceValid(exp) && (
                                        <span className="px-2 py-1 text-xs font-medium bg-emerald-100 text-emerald-800 rounded-full">
                                            Complete ✓
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium text-sm"
                                    >
                                        Save Experience
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => removeExperience(exp.id)}
                                        className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                                        aria-label="Remove experience entry"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-gray-700 font-medium text-sm">
                                        Institution/School <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={exp.institution}
                                        onChange={(e) => updateExperience(exp.id, 'institution', e.target.value)}
                                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors ${exp.institution ? 'border-emerald-300' : 'border-gray-300 focus:border-primary'
                                            }`}
                                        placeholder="School/Organization name"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-gray-700 font-medium text-sm">
                                        Position <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={exp.position}
                                        onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors ${exp.position ? 'border-emerald-300' : 'border-gray-300 focus:border-primary'
                                            }`}
                                        placeholder="e.g., Mathematics Teacher"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-gray-700 font-medium text-sm">Duration</label>
                                    <input
                                        type="text"
                                        value={exp.duration}
                                        onChange={(e) => updateExperience(exp.id, 'duration', e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                                        placeholder="e.g., 2019-Present"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-gray-700 font-medium text-sm">Description</label>
                                    <textarea
                                        value={exp.description}
                                        onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                                        rows="3"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                                        placeholder="Responsibilities, achievements, etc."
                                    />
                                </div>
                            </div>
                        </form>
                    ))}

                    {experienceList.length === 0 && (
                        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-2xl">
                            <FaBriefcase className="text-4xl mx-auto mb-3 text-gray-300" />
                            <h4 className="text-lg font-bold text-gray-700 mb-1">No work experience yet</h4>
                            <p className="text-gray-600 mb-4 max-w-md mx-auto text-sm">
                                Add your teaching experience to showcase your professional background
                            </p>
                            <button
                                onClick={addExperience}
                                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium text-sm"
                            >
                                Add Your First Experience Entry
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Projects Section */}
            <div className="mb-12">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-purple-50">
                            <FaProjectDiagram className="text-xl text-purple-500" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">Projects</h3>
                    </div>
                    <button
                        onClick={addProject}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium text-sm"
                    >
                        <FaProjectDiagram />
                        Add Project
                    </button>
                </div>

                <div className="space-y-6">
                    {projectsList.map((project, index) => (
                        <form
                            key={project.id}
                            onSubmit={(e) => handleProjectSubmit(e, project.id)}
                            className="border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-colors"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-3">
                                    <h4 className="text-lg font-bold text-gray-800">Project #{index + 1}</h4>
                                    {isProjectValid(project) && (
                                        <span className="px-2 py-1 text-xs font-medium bg-emerald-100 text-emerald-800 rounded-full">
                                            Complete ✓
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium text-sm"
                                    >
                                        Save Project
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => removeProject(project.id)}
                                        className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                                        aria-label="Remove project entry"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-gray-700 font-medium text-sm">
                                        Project Title <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={project.title}
                                        onChange={(e) => updateProject(project.id, 'title', e.target.value)}
                                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-colors ${project.title ? 'border-emerald-300' : 'border-gray-300 focus:border-purple-500'
                                            }`}
                                        placeholder="Project name"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-gray-700 font-medium text-sm">
                                        Organization <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={project.organization}
                                        onChange={(e) => updateProject(project.id, 'organization', e.target.value)}
                                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-colors ${project.organization ? 'border-emerald-300' : 'border-gray-300 focus:border-purple-500'
                                            }`}
                                        placeholder="School/Institution"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-gray-700 font-medium text-sm">Your Role</label>
                                    <input
                                        type="text"
                                        value={project.role}
                                        onChange={(e) => updateProject(project.id, 'role', e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-colors"
                                        placeholder="e.g., Project Lead, Developer"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-gray-700 font-medium text-sm">Duration</label>
                                    <input
                                        type="text"
                                        value={project.duration}
                                        onChange={(e) => updateProject(project.id, 'duration', e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-colors"
                                        placeholder="e.g., Jan 2023 - Mar 2023"
                                    />
                                </div>

                                <div className="md:col-span-2 space-y-2">
                                    <label className="block text-gray-700 font-medium text-sm">Technologies Used</label>
                                    <input
                                        type="text"
                                        value={project.technologies}
                                        onChange={(e) => updateProject(project.id, 'technologies', e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-colors"
                                        placeholder="e.g., React, Node.js, MongoDB"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-gray-700 font-medium text-sm">Project Link</label>
                                    <input
                                        type="url"
                                        value={project.link}
                                        onChange={(e) => updateProject(project.id, 'link', e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-colors"
                                        placeholder="https://..."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-gray-700 font-medium text-sm">Description</label>
                                    <textarea
                                        value={project.description}
                                        onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                                        rows="2"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-colors"
                                        placeholder="Project objectives, outcomes, and your contributions..."
                                    />
                                </div>
                            </div>
                        </form>
                    ))}

                    {projectsList.length === 0 && (
                        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-2xl">
                            <FaProjectDiagram className="text-4xl mx-auto mb-3 text-gray-300" />
                            <h4 className="text-lg font-bold text-gray-700 mb-1">No projects yet</h4>
                            <p className="text-gray-600 mb-4 max-w-md mx-auto text-sm">
                                Add your educational projects to showcase your work
                            </p>
                            <button
                                onClick={addProject}
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium text-sm"
                            >
                                Add Your First Project Entry
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Certifications Section */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-amber-50">
                            <FaAward className="text-xl text-amber-500" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">Certifications</h3>
                    </div>
                    <button
                        onClick={addCertification}
                        className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium text-sm"
                    >
                        <FaAward />
                        Add Certification
                    </button>
                </div>

                <div className="space-y-6">
                    {Certification?.map((cert, index) => (
                        <form
                            key={cert.id}
                            onSubmit={(e) => handleCertificationSubmit(e, cert.id)}
                            className="border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-colors"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-3">
                                    <h4 className="text-lg font-bold text-gray-800">Certification #{index + 1}</h4>
                                    {isCertificationValid(cert) && (
                                        <span className="px-2 py-1 text-xs font-medium bg-emerald-100 text-emerald-800 rounded-full">
                                            Complete ✓
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium text-sm"
                                    >
                                        Save Certification
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => removeCertification(cert.id)}
                                        className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                                        aria-label="Remove certification entry"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-gray-700 font-medium text-sm">
                                        Certification Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={cert.name}
                                        onChange={(e) => updateCertification(cert.id, 'name', e.target.value)}
                                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-colors ${cert.name ? 'border-emerald-300' : 'border-gray-300 focus:border-amber-500'
                                            }`}
                                        placeholder="e.g., Google Certified Educator"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-gray-700 font-medium text-sm">
                                        Issuing Organization <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={cert.issuer}
                                        onChange={(e) => updateCertification(cert.id, 'issuer', e.target.value)}
                                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-colors ${cert.issuer ? 'border-emerald-300' : 'border-gray-300 focus:border-amber-500'
                                            }`}
                                        placeholder="e.g., Google, Microsoft"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-gray-700 font-medium text-sm">Issue Date</label>
                                    <input
                                        type="date"
                                        value={cert.issueDate}
                                        onChange={(e) => updateCertification(cert.id, 'issueDate', e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-colors"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-gray-700 font-medium text-sm">Expiry Date</label>
                                    <input
                                        type="date"
                                        value={cert.expiryDate}
                                        onChange={(e) => updateCertification(cert.id, 'expiryDate', e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-colors"
                                        placeholder="Leave empty if no expiry"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-gray-700 font-medium text-sm">Credential ID</label>
                                    <input
                                        type="text"
                                        value={cert.credentialId}
                                        onChange={(e) => updateCertification(cert.id, 'credentialId', e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-colors"
                                        placeholder="e.g., ABC123XYZ"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-gray-700 font-medium text-sm">Credential URL</label>
                                    <input
                                        type="url"
                                        value={cert.credentialUrl}
                                        onChange={(e) => updateCertification(cert.id, 'credentialUrl', e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-colors"
                                        placeholder="https://..."
                                    />
                                </div>

                                <div className="md:col-span-2 space-y-2">
                                    <label className="block text-gray-700 font-medium text-sm">Description</label>
                                    <textarea
                                        value={cert.description}
                                        onChange={(e) => updateCertification(cert.id, 'description', e.target.value)}
                                        rows="2"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-colors"
                                        placeholder="Skills demonstrated, relevance to teaching..."
                                    />
                                </div>
                            </div>
                        </form>
                    ))}

                    {Certification?.length === 0 && (
                        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-2xl">
                            <FaAward className="text-4xl mx-auto mb-3 text-gray-300" />
                            <h4 className="text-lg font-bold text-gray-700 mb-1">No certifications yet</h4>
                            <p className="text-gray-600 mb-4 max-w-md mx-auto text-sm">
                                Add your professional certifications to showcase your qualifications
                            </p>
                            <button
                                onClick={addCertification}
                                className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium text-sm"
                            >
                                Add Your First Certification Entry
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ExperienceTab;
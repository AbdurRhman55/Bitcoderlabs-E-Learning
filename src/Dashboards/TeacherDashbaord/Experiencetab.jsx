// components/tabs/ExperienceTab.jsx
import React from 'react';
import { FaBriefcase, FaTrash } from 'react-icons/fa';
import { MdWork } from 'react-icons/md';

const ExperienceTab = ({ experienceList, setExperienceList, showNotification }) => {
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

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 animate-fadeIn">
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 rounded-xl bg-primary-light">
                    <FaBriefcase className="text-2xl text-primary" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Work Experience</h2>
                    <p className="text-gray-600">Add your professional teaching experience</p>
                </div>
            </div>

            <button
                onClick={addExperience}
                className="flex items-center gap-2 px-4 py-3 mb-6 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
            >
                <MdWork />
                Add Experience Entry
            </button>

            <div className="space-y-6">
                {experienceList.map((exp, index) => (
                    <div key={exp.id} className="border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-colors">
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-3">
                                <h3 className="text-xl font-bold text-gray-800">Experience #{index + 1}</h3>
                                {isExperienceValid(exp) && (
                                    <span className="px-2 py-1 text-xs font-medium bg-emerald-100 text-emerald-800 rounded-full">
                                        Complete ✓
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={() => removeExperience(exp.id)}
                                className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                                aria-label="Remove experience entry"
                            >
                                <FaTrash />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-gray-700 font-medium">
                                    Institution/School <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={exp.institution}
                                    onChange={(e) => updateExperience(exp.id, 'institution', e.target.value)}
                                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors ${exp.institution ? 'border-emerald-300' : 'border-gray-300 focus:border-primary'
                                        }`}
                                    placeholder="School/Organization name"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-gray-700 font-medium">
                                    Position <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={exp.position}
                                    onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors ${exp.position ? 'border-emerald-300' : 'border-gray-300 focus:border-primary'
                                        }`}
                                    placeholder="e.g., Mathematics Teacher"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-gray-700 font-medium">Duration</label>
                                <input
                                    type="text"
                                    value={exp.duration}
                                    onChange={(e) => updateExperience(exp.id, 'duration', e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                                    placeholder="e.g., 2019-Present"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-gray-700 font-medium">Description</label>
                                <textarea
                                    value={exp.description}
                                    onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                                    rows="3"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                                    placeholder="Responsibilities, achievements, etc."
                                />
                            </div>
                        </div>
                    </div>
                ))}

                {experienceList.length === 0 && (
                    <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-2xl">
                        <FaBriefcase className="text-5xl mx-auto mb-4 text-gray-300" />
                        <h3 className="text-xl font-bold text-gray-700 mb-2">No work experience yet</h3>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto">
                            Add your teaching experience to showcase your professional background
                        </p>
                        <button
                            onClick={addExperience}
                            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
                        >
                            Add Your First Experience Entry
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExperienceTab;
// components/tabs/EducationTab.jsx
import React from 'react';
import { FaGraduationCap, FaEdit, FaTrash } from 'react-icons/fa';

const EducationTab = ({ educationList, setEducationList, showNotification }) => {

    const addEducation = () => {
        const newId = educationList.length > 0
            ? Math.max(...educationList.map(item => item.id)) + 1
            : 1;
        setEducationList([
            ...educationList,
            {
                id: newId,
                institution: '',
                degree: '',
                year: '',
                description: ''
            }
        ]);
        showNotification('New education entry added', 'info');
    };

    const updateEducation = (id, field, value) => {
        setEducationList(educationList.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        ));
    };

    const removeEducation = (id) => {
        setEducationList(educationList.filter(item => item.id !== id));
        showNotification('Education entry removed', 'info');
    };

    const isEducationValid = (edu) => {
        return edu.institution.trim() && edu.degree.trim();
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 animate-fadeIn">
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 rounded-xl bg-primary-light">
                    <FaGraduationCap className="text-2xl text-primary" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Education Background</h2>
                    <p className="text-gray-600">Add your academic qualifications</p>
                </div>
            </div>

            <button
                onClick={addEducation}
                className="flex items-center gap-2 px-4 py-3 mb-6 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
            >
                <FaEdit />
                Add Education Entry
            </button>

            <div className="space-y-6">
                {educationList?.map((edu, index) => (
                    <div key={edu.id} className="border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-colors">
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-3">
                                <h3 className="text-xl font-bold text-gray-800">Education #{index + 1}</h3>
                                {isEducationValid(edu) && (
                                    <span className="px-2 py-1 text-xs font-medium bg-emerald-100 text-emerald-800 rounded-full">
                                        Complete ✓
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={() => removeEducation(edu.id)}
                                className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                                aria-label="Remove education entry"
                            >
                                <FaTrash />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-gray-700 font-medium">
                                    Institution <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={edu.institution}
                                    onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors ${edu.institution ? 'border-emerald-300' : 'border-gray-300 focus:border-primary'
                                        }`}
                                    placeholder="University/College name"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-gray-700 font-medium">
                                    Degree/Qualification <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={edu.degree}
                                    onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors ${edu.degree ? 'border-emerald-300' : 'border-gray-300 focus:border-primary'
                                        }`}
                                    placeholder="e.g., Master of Education"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-gray-700 font-medium">Year/Duration</label>
                                <input
                                    type="text"
                                    value={edu.year}
                                    onChange={(e) => updateEducation(edu.id, 'year', e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                                    placeholder="e.g., 2015-2019"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-gray-700 font-medium">Description</label>
                                <input
                                    type="text"
                                    value={edu.description}
                                    onChange={(e) => updateEducation(edu.id, 'description', e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                                    placeholder="Specialization, honors, etc."
                                />
                            </div>
                        </div>
                    </div>
                ))}

                {educationList?.length === 0 && (
                    <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-2xl">
                        <FaGraduationCap className="text-5xl mx-auto mb-4 text-gray-300" />
                        <h3 className="text-xl font-bold text-gray-700 mb-2">No education entries yet</h3>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto">
                            Add your educational background to showcase your qualifications
                        </p>
                        <button
                            onClick={addEducation}
                            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
                        >
                            Add Your First Education Entry
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EducationTab;

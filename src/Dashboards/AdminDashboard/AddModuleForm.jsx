import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { apiClient } from '../../../src/api/index.js';

export default function AddModuleForm({ onClose, onSubmit, initialData, courseId, courses = [] }) {
    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        description: initialData?.description || '',
        course_id: courseId || initialData?.course_id || '',
        is_published: initialData?.is_published ?? true,
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (!formData.title.trim()) {
                throw new Error('Module title is required');
            }
            if (!formData.course_id) {
                throw new Error('Please select a course');
            }

            const submitData = {
                ...formData,
                course_id: parseInt(formData.course_id),
            };

            // Call onSubmit with data, parent handles the API call
            onSubmit(submitData);
            onClose();
        } catch (error) {
            console.error('Error preparing module data:', error);
            setError(error.message || 'An error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50 backdrop-blur-[2px]">
            <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col">
                {/* Header */}
                <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">
                            {initialData?.id ? 'Edit Module' : 'Add New Module'}
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">Organize your course content into modules</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-50 rounded-lg transition-colors group"
                    >
                        <X className="w-5 h-5 text-slate-400 group-hover:text-slate-600" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-8 overflow-y-auto">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
                            <X className="w-5 h-5 text-red-500 mt-0.5" />
                            <p className="text-sm text-red-600 font-medium">{error}</p>
                        </div>
                    )}

                    <form id="module-form" onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                Module Title
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white outline-none transition-all font-medium text-slate-900"
                                placeholder="e.g. Getting Started with React"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="3"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white outline-none transition-all resize-none font-medium text-slate-900"
                                placeholder="What will students learn in this module?"
                            />
                        </div>

                        {!courseId && (
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                    Select Course
                                </label>
                                <select
                                    name="course_id"
                                    value={formData.course_id}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white outline-none transition-all font-medium text-slate-900 appearance-none cursor-pointer"
                                    required
                                >
                                    <option value="">Select a course</option>
                                    {courses.map(course => (
                                        <option key={course.id} value={course.id}>{course.title}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    id="is_published"
                                    name="is_published"
                                    checked={formData.is_published}
                                    onChange={handleChange}
                                    className="w-5 h-5 rounded-md border-slate-300 text-primary focus:ring-primary transition-all cursor-pointer"
                                />
                                <span className="text-sm font-semibold text-slate-600 group-hover:text-slate-900 transition-colors">
                                    Publish module immediately
                                </span>
                            </label>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="px-8 py-6 border-t border-slate-100 flex justify-end gap-3 bg-white">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        form="module-form"
                        type="submit"
                        className="px-8 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={loading}
                    >
                        {loading ? 'Saving...' : initialData?.id ? 'Update Module' : 'Create Module'}
                    </button>
                </div>
            </div>
        </div>
    );
}

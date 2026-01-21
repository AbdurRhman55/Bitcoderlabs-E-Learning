import React, { useState } from 'react';
import { X, Video, Clock } from 'lucide-react';
import { apiClient } from '../../../src/api/index.js';

export default function AddLessonForm({ onClose, onSubmit, initialData, moduleId }) {
    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        description: initialData?.description || '',
        type: 'video',
        video_url: initialData?.video_url || '',
        duration: initialData?.duration || '',
        order: initialData?.order || '',
        module_id: moduleId || initialData?.module_id || '',
        is_free: initialData?.is_free || false,
        is_preview: initialData?.is_preview || false,
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
            // Validation
            if (!formData.title.trim()) {
                throw new Error('Lesson title is required');
            }
            if (!formData.module_id) {
                throw new Error('Module is required');
            }

            // Prepare data
            const submitData = {
                ...formData,
                order: formData.order ? parseInt(formData.order) : null,
                module_id: parseInt(formData.module_id),
                duration: formData.duration || null,
            };

            // Call onSubmit with data, parent handles the API call
            onSubmit(submitData);
            onClose();
        } catch (error) {
            console.error('Error preparing lesson data:', error);
            setError(error.message || 'An error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50 backdrop-blur-[2px]">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col">
                {/* Header */}
                <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">
                            {initialData?.id ? 'Edit Video Lesson' : 'Add New Video Lesson'}
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">Configure your lesson details and video content</p>
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

                    <form id="lesson-form" onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="col-span-2">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                    Lesson Title
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white outline-none transition-all font-medium text-slate-900"
                                    placeholder="Enter a descriptive title"
                                    required
                                />
                            </div>

                            <div className="col-span-2">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="3"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white outline-none transition-all resize-none font-medium text-slate-900"
                                    placeholder="Briefly describe what this lesson covers"
                                />
                            </div>

                            <div className="col-span-2">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <Video className="w-3.5 h-3.5" />
                                    Video URL
                                </label>
                                <input
                                    type="url"
                                    name="video_url"
                                    value={formData.video_url}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white outline-none transition-all font-medium text-slate-900"
                                    placeholder="https://www.youtube.com/watch?v=..."
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <Clock className="w-3.5 h-3.5" />
                                    Duration
                                </label>
                                <input
                                    type="text"
                                    name="duration"
                                    value={formData.duration}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white outline-none transition-all font-medium text-slate-900"
                                    placeholder="e.g. 10:30"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                    Display Order
                                </label>
                                <input
                                    type="number"
                                    name="order"
                                    value={formData.order}
                                    onChange={handleChange}
                                    min="1"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white outline-none transition-all font-medium text-slate-900"
                                    placeholder="1"
                                />
                            </div>

                            <div className="hidden">
                                <input type="checkbox" name="is_free" checked={formData.is_free} onChange={handleChange} />
                                <input type="checkbox" name="is_preview" checked={formData.is_preview} onChange={handleChange} />
                                <input type="checkbox" name="is_published" checked={formData.is_published} onChange={handleChange} />
                            </div>
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
                        form="lesson-form"
                        type="submit"
                        className="px-8 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={loading}
                    >
                        {loading ? 'Saving...' : initialData?.id ? 'Update Lesson' : 'Add Lesson'}
                    </button>
                </div>
            </div>
        </div>
    );
}

import React, { useState } from 'react';
import { X, Video, FileText, Link, Clock } from 'lucide-react';
import { apiClient } from '../../../src/api/index.js';

export default function AddLessonForm({ onClose, onSubmit, initialData, moduleId }) {
    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        description: initialData?.description || '',
        content: initialData?.content || '',
        lesson_type: initialData?.lesson_type || 'video',
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

    const handleSubmit = async (e) => {
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

            console.log('Submitting lesson data:', submitData);

            // Call API
            if (initialData?.id) {
                const response = await apiClient.updateLesson(initialData.id, submitData);
                console.log('Update response:', response);
            } else {
                const response = await apiClient.createLesson(submitData);
                console.log('Create response:', response);
            }

            onSubmit();
            onClose();
        } catch (error) {
            console.error('Error saving lesson:', error);
            setError(error.message || 'Failed to save lesson. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">
                            {initialData?.id ? 'Edit Lesson' : 'Add New Lesson'}
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-700 text-sm">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Lesson Title *
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter lesson title"
                                    required
                                />
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="2"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Brief description of the lesson"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Lesson Type *
                                </label>
                                <div className="flex gap-4">
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="lesson_type"
                                            value="video"
                                            checked={formData.lesson_type === 'video'}
                                            onChange={handleChange}
                                            className="h-4 w-4 text-blue-600"
                                        />
                                        <div className="flex items-center">
                                            <Video className="w-4 h-4 mr-2" />
                                            <span>Video</span>
                                        </div>
                                    </label>
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="lesson_type"
                                            value="article"
                                            checked={formData.lesson_type === 'article'}
                                            onChange={handleChange}
                                            className="h-4 w-4 text-blue-600"
                                        />
                                        <div className="flex items-center">
                                            <FileText className="w-4 h-4 mr-2" />
                                            <span>Article</span>
                                        </div>
                                    </label>
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="lesson_type"
                                            value="quiz"
                                            checked={formData.lesson_type === 'quiz'}
                                            onChange={handleChange}
                                            className="h-4 w-4 text-blue-600"
                                        />
                                        <div className="flex items-center">
                                            <Link className="w-4 h-4 mr-2" />
                                            <span>Quiz</span>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <div className="flex items-center">
                                        <Clock className="w-4 h-4 mr-2" />
                                        Duration
                                    </div>
                                </label>
                                <input
                                    type="text"
                                    name="duration"
                                    value={formData.duration}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="e.g., 15:30 or 45 min"
                                />
                            </div>

                            {formData.lesson_type === 'video' && (
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Video URL (YouTube, Vimeo, etc.)
                                    </label>
                                    <input
                                        type="url"
                                        name="video_url"
                                        value={formData.video_url}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="https://www.youtube.com/watch?v=..."
                                    />
                                </div>
                            )}

                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Lesson Content *
                                </label>
                                <textarea
                                    name="content"
                                    value={formData.content}
                                    onChange={handleChange}
                                    rows="6"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                                    placeholder="Enter your lesson content here..."
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-2">
                                    For articles: Write your content. For quizzes: Enter quiz questions and answers in JSON format.
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Order (Optional)
                                </label>
                                <input
                                    type="number"
                                    name="order"
                                    value={formData.order}
                                    onChange={handleChange}
                                    min="1"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Display order"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="is_free"
                                        checked={formData.is_free}
                                        onChange={handleChange}
                                        className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                    />
                                    <span className="text-sm text-gray-700">Free Lesson</span>
                                </label>

                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="is_preview"
                                        checked={formData.is_preview}
                                        onChange={handleChange}
                                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-700">Available as Preview</span>
                                </label>

                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="is_published"
                                        checked={formData.is_published}
                                        onChange={handleChange}
                                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-700">Publish Immediately</span>
                                </label>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={loading}
                            >
                                {loading ? 'Saving...' : initialData?.id ? 'Update Lesson' : 'Create Lesson'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
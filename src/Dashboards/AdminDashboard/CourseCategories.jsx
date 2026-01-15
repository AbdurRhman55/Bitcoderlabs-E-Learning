import React, { useState, useEffect } from "react";
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    X,
    Loader2,
    FolderTree,
    AlertCircle
} from "lucide-react";
import { apiClient } from '../../../src/api/index.js';
import Button from "../../Component/UI/Button";

// Add/Edit Category Modal
function AddCategoryForm({ onClose, onSubmit, initialData }) {
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        slug: initialData?.slug || '',
        description: initialData?.description || ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (!formData.name.trim()) {
                throw new Error('Category name is required');
            }

            await onSubmit(formData);
            onClose();
        } catch (err) {
            console.error('Error saving category:', err);
            setError(err.message || 'Failed to save category');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-fadeIn">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">
                            {initialData ? 'Edit Category' : 'Add New Category'}
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
                            <AlertCircle size={18} />
                            <p className="text-sm">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Category Name *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="e.g., Web Development"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Slug (Optional)
                            </label>
                            <input
                                type="text"
                                name="slug"
                                value={formData.slug}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="e.g., web-development"
                            />
                            <p className="text-xs text-gray-500 mt-1">Leave empty to auto-generate from name</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="4"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Brief description of this category..."
                            />
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
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                                disabled={loading}
                            >
                                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                                {initialData ? 'Update Category' : 'Create Category'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default function CourseCategories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const response = await apiClient.getCategories();
            if (response && response.data) {
                setCategories(response.data);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleCreate = async (formData) => {
        await apiClient.createCategory(formData);
        fetchCategories();
    };

    const handleUpdate = async (formData) => {
        if (!editingCategory) return;
        await apiClient.updateCategory(editingCategory.id, formData);
        fetchCategories();
        setEditingCategory(null);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                await apiClient.deleteCategory(id);
                fetchCategories();
            } catch (error) {
                console.error('Error deleting category:', error);
                alert('Failed to delete category');
            }
        }
    };

    const filteredCategories = categories.filter(cat =>
        cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (cat.description && cat.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Course Categories</h1>
                    <p className="text-gray-500 mt-1">Manage your course categories and topics</p>
                </div>
                <Button
                    onClick={() => {
                        setEditingCategory(null);
                        setIsModalOpen(true);
                    }}
                    text="Add Category"
                    icon={<Plus className="w-5 h-5" />}
                />
            </div>

            {/* Search and Filter Bar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full sm:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search categories..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                </div>
                <div className="text-sm text-gray-500">
                    Showing {filteredCategories.length} categories
                </div>
            </div>

            {/* Categories Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-6 py-4 font-semibold text-gray-700 w-16">#</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">Name</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">Slug</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">Description</th>
                                <th className="px-6 py-4 font-semibold text-gray-700 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-primary" />
                                        Loading categories...
                                    </td>
                                </tr>
                            ) : filteredCategories.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                        <FolderTree className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                        No categories found
                                    </td>
                                </tr>
                            ) : (
                                filteredCategories.map((category, index) => (
                                    <tr key={category.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4 text-gray-500 text-sm">{index + 1}</td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{category.name}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <code className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600 font-mono">
                                                {category.slug || '-'}
                                            </code>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 text-sm max-w-xs truncate">
                                            {category.description || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => {
                                                        setEditingCategory(category);
                                                        setIsModalOpen(true);
                                                    }}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(category.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <AddCategoryForm
                    onClose={() => {
                        setIsModalOpen(false);
                        setEditingCategory(null);
                    }}
                    onSubmit={editingCategory ? handleUpdate : handleCreate}
                    initialData={editingCategory}
                />
            )}
        </div>
    );
}

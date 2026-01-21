// src/components/dashboard/AddCourseForm.jsx
import React, { useState, useEffect } from "react";
import Button from "../../Component/UI/Button";
import { FiX } from "react-icons/fi";
import ImageUpload from "../../Component/UI/ImageUpload";
import { apiClient } from '../../../src/api/index.js';

export default function AddCourseForm({ onSubmit, onClose, initialData = null }) {
  const [course, setCourse] = useState({
    title: "",
    slug: "",
    category_id: "",
    level: "beginner",
    instructor_id: "",
    description: "",
    short_description: "",
    image: "",
    video_url: "",
    duration: "",
    price: 0,
    original_price: 0,
    language: "English",
    rating: 0,
    reviews_count: 0,
    students_count: 0,
    is_featured: false,
    is_active: true,
    features: [],
    tags: [],
  });

  const [instructors, setInstructors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  // If editing, populate form with initial data
  useEffect(() => {
    if (initialData) {
      setCourse({
        ...initialData,
        category_id: initialData.category_id || initialData.category?.id || "",
        instructor_id: initialData.instructor_id || initialData.instructor?.id || "",
        // Parse JSON strings back to arrays for form editing
        features: initialData.features ? (typeof initialData.features === 'string' ? JSON.parse(initialData.features) : initialData.features) : [],
        tags: initialData.tags ? (typeof initialData.tags === 'string' ? JSON.parse(initialData.tags) : initialData.tags) : [],
      });
    }
  }, [initialData]);

  // Fetch instructors and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [instructorsRes, categoriesRes] = await Promise.all([
          apiClient.getInstructors(),
          apiClient.getCategories()
        ]);
        setInstructors(instructorsRes.data || []);
        setCategories(categoriesRes.data || []);
        setDataLoaded(true);
      } catch (error) {
        console.error('Error fetching instructors/categories:', error);
        setDataLoaded(true); // Still set to true to allow form submission with error
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox"
      ? checked
      : type === "number"
        ? Number(value)
        : value;

    setCourse((prev) => {
      const updated = {
        ...prev,
        [name]: newValue,
      };

      // Auto-generate slug from title
      if (name === 'title') {
        updated.slug = value
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
          .replace(/\s+/g, '-') // Replace spaces with hyphens
          .replace(/-+/g, '-') // Replace multiple hyphens with single
          .replace(/^-+|-+$/g, '');
      }

      return updated;
    });
  };

  const handleCommaListChange = (name) => (e) => {
    const raw = e.target.value;
    const arr = raw
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
    setCourse(prev => ({
      ...prev,
      [name]: arr,
    }));
  };

  const handleImageChange = (file) => {
    setCourse((prev) => ({
      ...prev,
      image: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if required data is loaded
    if (!dataLoaded) {
      alert('Please wait for instructors and categories to load.');
      return;
    }

    setLoading(true);
    try {
      // Prepare data for submission
      let submitData;

      // If there's an image file, use FormData
      if (course.image && course.image instanceof File) {
        const formData = new FormData();

        // Add all course fields to FormData
        const requiredFields = ['title', 'slug', 'description', 'instructor_id', 'category_id', 'price', 'level', 'language'];

        Object.keys(course).forEach(key => {
          const value = course[key];
          const isRequiredField = requiredFields.includes(key);

          // Handle different field types
          if (key === 'features' || key === 'tags') {
            // JSON stringify arrays - ensure empty arrays if null/undefined
            formData.append(key, JSON.stringify(value || []));
          } else if (key === 'image') {
            // Only append if it's a File
            if (value instanceof File) {
              formData.append('image', value);
            }
          } else if (key === 'is_featured' || key === 'is_active') {
            // Convert boolean to integer for Laravel validation
            formData.append(key, value ? '1' : '0');
          } else if (value !== null && value !== undefined && (value !== '' || isRequiredField)) {
            // For numeric fields, ensure they have a value even if 0
            if (key === 'reviews_count' || key === 'students_count' || key === 'rating' || key === 'price' || key === 'original_price') {
              formData.append(key, value.toString()); // Convert to string
            } else {
              formData.append(key, value || '');
            }
          }
        });

        // Add method spoofing for PUT if editing
        if (initialData) {
          formData.append('_method', 'PUT');
        }

        submitData = formData;
      } else {
        // For non-File image (either existing URL string or empty)
        const cleanCourse = { ...course };

        // If image is a string, it means it hasn't changed. 
        // Laravel validation will fail if we send a string for an 'image' validated field.
        if (typeof cleanCourse.image === 'string') {
          delete cleanCourse.image;
        }

        submitData = {
          ...cleanCourse,
          short_description: cleanCourse.short_description || null,
          video_url: cleanCourse.video_url || null,
          duration: cleanCourse.duration || null,
          original_price: cleanCourse.original_price ? parseFloat(cleanCourse.original_price) : null,
          features: cleanCourse.features ? (typeof cleanCourse.features === 'string' ? cleanCourse.features : JSON.stringify(cleanCourse.features)) : "[]",
          tags: cleanCourse.tags ? (typeof cleanCourse.tags === 'string' ? cleanCourse.tags : JSON.stringify(cleanCourse.tags)) : "[]",
          price: parseFloat(cleanCourse.price) || 0,
          rating: cleanCourse.rating ? parseFloat(cleanCourse.rating) : 0,
          reviews_count: cleanCourse.reviews_count ? parseInt(cleanCourse.reviews_count) : 0,
          students_count: cleanCourse.students_count ? parseInt(cleanCourse.students_count) : 0,
          instructor_id: cleanCourse.instructor_id ? parseInt(cleanCourse.instructor_id) : undefined,
          category_id: cleanCourse.category_id ? parseInt(cleanCourse.category_id) : undefined,
          is_featured: Boolean(cleanCourse.is_featured),
          is_active: Boolean(cleanCourse.is_active),
        };
      }

      await onSubmit?.(submitData);
      // Reset form only if not editing
      if (!initialData) {
        setCourse({
          title: "",
          slug: "",
          category_id: "",
          level: "beginner",
          instructor_id: "",
          description: "",
          short_description: "",
          image: "",
          video_url: "",
          duration: "",
          price: 0,
          original_price: 0,
          language: "English",
          rating: 0,
          reviews_count: 0,
          students_count: 0,
          is_featured: false,
          is_active: true,
          features: [],
          tags: [],
        });
      }
    } catch (error) {
      console.error('Error submitting course:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-2xl shadow-lg space-y-6 max-w-4xl mx-auto "
    >
      {/* Header */}
      <div className="flex justify-between items-center border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-bold text-primary">
          {initialData ? 'Edit Course' : 'Create New Course'}
        </h2>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 cursor-pointer transition-colors duration-200"
          >
            <FiX className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Main Course Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Course Title *
          </label>
          <input
            type="text"
            name="title"
            value={course.title}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-3  focus:ring-primary focus:border-primary-dark outline-none transition-colors duration-200"
            placeholder="Enter course title"
            required
          />
        </div>

        {/* Slug */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Slug *
          </label>
          <input
            type="text"
            name="slug"
            value={course.slug}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-3  focus:ring-primary focus:border-primary-dark outline-none transition-colors duration-200"
            placeholder="course-slug-url"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <select
            name="category_id"
            value={course.category_id}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-primary focus:border-primary-dark outline-none transition-colors duration-200"
            required
          >
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Level *
          </label>
          <select
            name="level"
            value={course.level}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-3  focus:ring-primary focus:border-primary-dark outline-none transition-colors duration-200"
            required
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="all_levels">All Levels</option>
          </select>
        </div>

        {/* Language */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Language *
          </label>
          <select
            name="language"
            value={course.language}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-primary focus:border-primary-dark outline-none transition-colors duration-200"
            required
          >
            <option value="English">English</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
            <option value="German">German</option>
            <option value="Chinese">Chinese</option>
            <option value="Japanese">Japanese</option>
            <option value="Arabic">Arabic</option>
            <option value="Hindi">Hindi</option>
          </select>
        </div>


        {/* Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Duration
          </label>
          <input
            type="text"
            name="duration"
            value={course.duration}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-3  focus:ring-primary focus:border-primary-dark outline-none transition-colors duration-200"
            placeholder="e.g., 5h 30m"
          />
        </div>

        {/* Course Image */}
        <div className="md:col-span-2">
          <ImageUpload
            value={course.image}
            onChange={handleImageChange}
            label="Course Image"
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description *
        </label>
        <textarea
          name="description"
          value={course.description}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-4 py-3  focus:ring-primary focus:border-primary-dark outline-none transition-colors duration-200"
          rows={4}
          placeholder="Describe the course content, objectives, and what students will learn..."
          required
        />
      </div>

      {/* Features */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Features (comma separated)
        </label>
        <input
          type="text"
          value={(course.features || []).join(', ')}
          onChange={handleCommaListChange('features')}
          className="w-full border border-gray-300 rounded-lg px-4 py-3  focus:ring-primary focus:border-primary-dark outline-none transition-colors duration-200"
          placeholder="e.g., Certificate, Lifetime access, Projects"
        />
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tags (comma separated)
        </label>
        <input
          type="text"
          value={(course.tags || []).join(', ')}
          onChange={handleCommaListChange('tags')}
          className="w-full border border-gray-300 rounded-lg px-4 py-3  focus:ring-primary focus:border-primary-dark outline-none transition-colors duration-200"
          placeholder="e.g., React, Frontend, Beginner"
        />
      </div>

      {/* Short Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Short Description
        </label>
        <textarea
          name="short_description"
          value={course.short_description}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-4 py-3  focus:ring-primary focus:border-primary-dark outline-none transition-colors duration-200"
          rows={2}
          placeholder="A short tagline for the course (max ~500 characters)"
        />
      </div>

      {/* Video URL */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Video URL
        </label>
        <input
          type="url"
          name="video_url"
          value={course.video_url}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-4 py-3  focus:ring-primary focus:border-primary-dark outline-none transition-colors duration-200"
          placeholder="https://..."
        />
      </div>

      {/* Pricing Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-200">
        {/* Current Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Price ($)
          </label>
          <input
            type="number"
            step="0.01"
            name="price"
            value={course.price}
            onChange={handleChange}
            min="0"
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-primary focus:border-primary-dark outline-none transition-colors duration-200"
          />
        </div>
        {/* Original Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Original Price
          </label>
          <input
            type="number"
            step="0.01"
            name="original_price"
            value={course.original_price}
            onChange={handleChange}
            min="0"
            className="w-full border border-gray-300 rounded-lg px-4 py-3  focus:ring-primary focus:border-primary-dark outline-none transition-colors duration-200"
          />
        </div>

        {/* Featured Toggle */}
        <div className="flex items-center justify-end">
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <input
              type="checkbox"
              name="is_featured"
              checked={course.is_featured}
              onChange={handleChange}
              id="featured"
              className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="featured"
              className="text-sm font-medium text-gray-700"
            >
              Featured Course
            </label>
          </div>
        </div>
      </div>

      {/* Course Status */}
      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
        <input
          type="checkbox"
          name="is_active"
          checked={course.is_active}
          onChange={handleChange}
          id="active"
          className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label
          htmlFor="active"
          className="text-sm font-medium text-gray-700"
        >
          Course is Active
        </label>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
        {onClose && (
          <Button
            type="button"
            variant="outline"
            text="Cancel"
            onClick={onClose}
            className="px-8 py-3 border-gray-300 text-gray-700 hover:bg-gray-50"
          />
        )}
        <Button
          type="submit"
          variant="primary"
          text={loading ? "Creating..." : (initialData ? "Update Course" : "Create Course")}
          disabled={loading || !dataLoaded}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>
    </form>
  );
}

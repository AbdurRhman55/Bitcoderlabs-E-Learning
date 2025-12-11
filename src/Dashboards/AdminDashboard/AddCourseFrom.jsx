// src/components/dashboard/AddCourseForm.jsx
import React, { useState } from "react";
import Button from "../../Component/UI/Button";
import { FiX } from "react-icons/fi";

export default function AddCourseForm({ onSubmit, onClose }) {
  const [course, setCourse] = useState({
    title: "",
    category: "",
    level: "beginner",
    instructor: "",
    description: "",
    image: "",
    duration: "",
    students: 0,
    lessons: 0,
    rating: 0,
    reviews: 0,
    progress: 0,
    price: 0,
    originalPrice: 0,
    isWishlisted: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCourse((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(course);
    // Reset form
    setCourse({
      title: "",
      category: "",
      level: "beginner",
      instructor: "",
      description: "",
      image: "",
      duration: "",
      students: 0,
      lessons: 0,
      rating: 0,
      reviews: 0,
      progress: 0,
      price: 0,
      originalPrice: 0,
      isWishlisted: false,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-2xl shadow-lg space-y-6 max-w-4xl mx-auto "
    >
      {/* Header */}
      <div className="flex justify-between items-center border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-bold text-primary">Create New Course</h2>
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

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <input
            type="text"
            name="category"
            value={course.category}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-3  focus:ring-primary focus:border-primary-dark outline-none transition-colors duration-200"
            placeholder="e.g., Web Development"
            required
          />
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
          </select>
        </div>

        {/* Instructor */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Instructor *
          </label>
          <input
            type="text"
            name="instructor"
            value={course.instructor}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-3  focus:ring-primary focus:border-primary-dark outline-none transition-colors duration-200"
            placeholder="Instructor name"
            required
          />
        </div>

        {/* Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Duration *
          </label>
          <input
            type="text"
            name="duration"
            value={course.duration}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-3  focus:ring-primary focus:border-primary-dark outline-none transition-colors duration-200"
            placeholder="e.g., 5h 30m"
            required
          />
        </div>

        {/* Image URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image URL
          </label>
          <input
            type="url"
            name="image"
            value={course.image}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-3  focus:ring-primary focus:border-primary-dark outline-none transition-colors duration-200"
            placeholder="https://example.com/image.jpg"
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

      {/* Statistics Section */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Course Statistics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Students */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Students
            </label>
            <input
              type="number"
              name="students"
              value={course.students}
              onChange={handleChange}
              min="0"
              className="w-full border border-gray-300 rounded-lg px-4 py-3  focus:ring-primary focus:border-primary-dark outline-none transition-colors duration-200"
            />
          </div>

          {/* Lessons */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lessons
            </label>
            <input
              type="number"
              name="lessons"
              value={course.lessons}
              onChange={handleChange}
              min="0"
              className="w-full border border-gray-300 rounded-lg px-4 py-3  focus:ring-primary focus:border-primary-dark outline-none transition-colors duration-200"
            />
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating (0-5)
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="5"
              name="rating"
              value={course.rating}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3  focus:ring-primary focus:border-primary-dark outline-none transition-colors duration-200"
            />
          </div>

          {/* Reviews */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reviews
            </label>
            <input
              type="number"
              name="reviews"
              value={course.reviews}
              onChange={handleChange}
              min="0"
              className="w-full border border-gray-300 rounded-lg px-4 py-3  focus:ring-primary focus:border-primary-dark outline-none transition-colors duration-200"
            />
          </div>
        </div>
      </div>

      {/* Progress Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Progress */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Progress (%)
          </label>
          <input
            type="number"
            name="progress"
            value={course.progress}
            onChange={handleChange}
            min="0"
            max="100"
            className="w-full border border-gray-300 rounded-lg px-4 py-3  focus:ring-primary focus:border-primary-dark outline-none transition-colors duration-200"
          />
        </div>

        {/* Wishlist Toggle */}
        <div className="flex items-center justify-end">
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <input
              type="checkbox"
              name="isWishlisted"
              checked={course.isWishlisted}
              onChange={handleChange}
              id="wishlist"
              className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="wishlist"
              className="text-sm font-medium text-gray-700"
            >
              Add to Wishlist
            </label>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Current Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Price ($)
            </label>
            <input
              type="number"
              name="price"
              value={course.price}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              required
            />
          </div>

          {/* Original Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Original Price ($)
            </label>
            <input
              type="number"
              name="originalPrice"
              value={course.originalPrice}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            />
          </div>
        </div>
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
          text="Create Course"
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 font-semibold"
        />
      </div>
    </form>
  );
}

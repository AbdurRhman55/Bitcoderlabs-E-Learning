// src/components/dashboard/AddCourseForm.jsx
import React, { useState } from "react";
import Button from "../Component/UI/Button";

export default function AddCourseForm({ onSubmit }) {
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
    // reset form
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
      className="bg-white p-6 rounded-2xl shadow-lg space-y-4 max-w-4xl mx-auto"
    >
      <h2 className="text-2xl font-bold mb-4">Create New Course</h2>

      {/* Title */}
      <div>
        <label className="block mb-1 font-medium">Course Title</label>
        <input
          type="text"
          name="title"
          value={course.title}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
          required
        />
      </div>

      {/* Category */}
      <div>
        <label className="block mb-1 font-medium">Category</label>
        <input
          type="text"
          name="category"
          value={course.category}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
          required
        />
      </div>

      {/* Level */}
      <div>
        <label className="block mb-1 font-medium">Level</label>
        <select
          name="level"
          value={course.level}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
        >
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>

      {/* Instructor */}
      <div>
        <label className="block mb-1 font-medium">Instructor</label>
        <input
          type="text"
          name="instructor"
          value={course.instructor}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block mb-1 font-medium">Description</label>
        <textarea
          name="description"
          value={course.description}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
          rows={4}
        />
      </div>

      {/* Image */}
      <div>
        <label className="block mb-1 font-medium">Image URL</label>
        <input
          type="text"
          name="image"
          value={course.image}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
        />
      </div>

      {/* Duration */}
      <div>
        <label className="block mb-1 font-medium">Duration (e.g., 5h 30m)</label>
        <input
          type="text"
          name="duration"
          value={course.duration}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
        />
      </div>

      {/* Stats: Students, Lessons, Rating, Reviews, Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-medium">Students</label>
          <input
            type="number"
            name="students"
            value={course.students}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Lessons</label>
          <input
            type="number"
            name="lessons"
            value={course.lessons}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Rating</label>
          <input
            type="number"
            step="0.1"
            max="5"
            name="rating"
            value={course.rating}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Reviews</label>
          <input
            type="number"
            name="reviews"
            value={course.reviews}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>
          
      </div>

      {/* Price */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-medium">Price</label>
          <input
            type="number"
            name="price"
            value={course.price}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Original Price</label>
          <input
            type="number"
            name="originalPrice"
            value={course.originalPrice}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>
      </div>

      {/* Wishlist */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="isWishlisted"
          checked={course.isWishlisted}
          onChange={handleChange}
          id="wishlist"
        />
        <label htmlFor="wishlist" className="text-gray-700 font-medium">
          Wishlisted
        </label>
      </div>

      <Button type="submit" className="mt-4">
        Add Course
      </Button>
    </form>
  );
}

// src/components/courses/CoursesPage.jsx
import React, { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import AddCourseForm from "./AddCourseFrom";
import Button from "../../Component/UI/Button";
import { Edit2, RefreshCw, Trash2 } from "lucide-react";
import { apiClient } from '../../../src/api/index.js';
import { API_ORIGIN } from "../../api/index.js";


export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(12);
  const [openForm, setOpenForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const [isOperationInProgress, setIsOperationInProgress] = useState(false);

  const { user, isAuthenticated } = useSelector(state => state.auth);

  const resolveImageUrl = (image) => {
    if (!image) return null;
    if (typeof image !== "string") return null;
    if (image.startsWith("http://") || image.startsWith("https://")) return image;
    if (image.startsWith("/")) return `${API_ORIGIN}${image}`;
    return `${API_ORIGIN}/${image}`;
  };

  // Fetch courses from API
  const fetchCourses = async (page = 1, showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const response = await apiClient.getCourses({
        page: page,
        per_page: perPage
      });

      // Handle paginated response from Laravel API
      if (response && response.data) {
        setCourses(response.data);
        setPagination(response.meta || null);

      } else {
        // Fallback for non-paginated response
        setCourses([]);
        setPagination(null);

      }
      setLastUpdate(Date.now());
    } catch (error) {
      console.error('Error fetching courses:', error);
      // Keep existing data on error to avoid UI flicker
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses(currentPage, true);
  }, [currentPage, perPage]);

  // Disabled real-time polling for admin dashboard to prevent conflicts with pagination
  // Admins can manually refresh using the refresh button if needed

  // Force refresh function for manual updates
  const forceRefresh = () => {
    fetchCourses(currentPage, true);
  };

  const handleSubmitCourse = async (courseData) => {
    try {
      setLoading(true);
      setIsOperationInProgress(true);
      console.log('Submitting course data:', courseData);

      // Check if courseData is FormData (contains file upload)
      const isFormData = courseData instanceof FormData;

      let submitData;
      if (isFormData) {
        console.log('Received FormData, using directly for API call');
        submitData = courseData;

        // Add any missing fields that might not be in FormData
        if (!submitData.has('is_featured')) submitData.append('is_featured', '0');
        if (!submitData.has('is_active')) submitData.append('is_active', '1');
        if (!submitData.has('features')) submitData.append('features', '[]');
        if (!submitData.has('tags')) submitData.append('tags', '[]');
      } else {
        // Handle regular object data (no file upload)
        submitData = {
          ...courseData,
          // Handle optional text fields - convert empty strings to null
          short_description: courseData.short_description || null,
          image: courseData.image || null,
          video_url: courseData.video_url || null,
          duration: courseData.duration || null,
          original_price: courseData.original_price ? parseFloat(courseData.original_price) : null,
          features: courseData.features ? JSON.stringify(courseData.features) : "[]",
          tags: courseData.tags ? JSON.stringify(courseData.tags) : "[]",
          // Convert numeric fields
          price: parseFloat(courseData.price) || 0,
          rating: courseData.rating ? parseFloat(courseData.rating) : 0,
          reviews_count: courseData.reviews_count ? parseInt(courseData.reviews_count) : 0,
          students_count: courseData.students_count ? parseInt(courseData.students_count) : 0,
          // Convert IDs to integers (ensure they're not null for required fields)
          instructor_id: courseData.instructor_id ? parseInt(courseData.instructor_id) : undefined,
          category_id: courseData.category_id ? parseInt(courseData.category_id) : undefined,
          // Boolean fields
          is_featured: Boolean(courseData.is_featured),
          is_active: Boolean(courseData.is_active),
        };
      }

      console.log('Prepared data for API:', submitData);

      let response;
      if (editingCourse) {
        // Update existing course
        console.log('Updating course:', editingCourse.id);
        response = await apiClient.updateCourse(editingCourse.id, submitData);

        // Update the course in local state with server response for accurate data
        setCourses(prevCourses =>
          prevCourses.map(course =>
            course.id === editingCourse.id
              ? response.data // Use server response which has correct structure
              : course
          )
        );
      } else {
        // Check if user is authenticated and is admin
        if (!isAuthenticated) {
          throw new Error('You must be logged in to create courses.');
        }
        if (user?.role !== 'admin') {
          throw new Error('Only administrators can create courses.');
        }

        // For FormData, validation is handled by Laravel on the backend
        if (!isFormData) {
          // Validate required fields before creating (only for regular object data)
          const requiredFields = ['title', 'slug', 'description', 'instructor_id', 'category_id', 'price', 'level', 'language'];
          const missingFields = requiredFields.filter(field => !submitData[field] || submitData[field] === '' || submitData[field] === null || submitData[field] === undefined);

          if (missingFields.length > 0) {
            throw new Error(`Missing required fields: ${missingFields.join(', ')}. Please fill all required fields.`);
          }

          // Check if instructor_id and category_id are valid numbers
          if (isNaN(submitData.instructor_id) || isNaN(submitData.category_id)) {
            throw new Error('Please select a valid instructor and category.');
          }
        }

        console.log('Creating new course with data:', submitData);
        response = await apiClient.createCourse(submitData);
        console.log('Create response:', response);

        // Add new course to the beginning of the list
        if (response.data) {
          console.log('Adding new course to state:', response.data);
          setCourses(prevCourses => [response.data, ...prevCourses]);
          console.log('Updated courses state with new course');
        }
      }

      console.log('API response:', response);
      // Do a final refresh to ensure consistency
      setTimeout(() => fetchCourses(currentPage, false), 1000);
      setOpenForm(false);
      setEditingCourse(null);
    } catch (error) {
      console.error('Error saving course:', error);
      console.error('Error details:', error.message);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('Error headers:', error.response?.headers);

      // Show more specific error message
      const errorMessage = error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to save course. Please try again.';
      alert(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
      setIsOperationInProgress(false);
    }
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setOpenForm(true);
  };

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        setIsOperationInProgress(true);
        await apiClient.deleteCourse(courseId);
        setCourses((prev) => prev.filter((course) => course.id !== courseId));
        // Do a final refresh to ensure consistency
        setTimeout(() => fetchCourses(currentPage, false), 1000);
      } catch (error) {
        console.error('Error deleting course:', error);
        alert('Failed to delete course. Please try again.');
      } finally {
        setIsOperationInProgress(false);
      }
    }
  };





  const handlePageChange = (page) => {
    if (page !== currentPage && page >= 1 && page <= (pagination?.last_page || 1)) {
      setCurrentPage(page);
    }
  };

  const handlePerPageChange = (newPerPage) => {
    setPerPage(newPerPage);
    setCurrentPage(1); // Reset to first page when changing per page
  };



  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-dark"></div>
      </div>
    );
  }

  return (
    <div className=" bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Courses Management
          </h1>
          <p className="text-gray-600 mt-2">
            Manage and organize your course offerings
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={forceRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-1 cursor-pointer border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Refresh courses"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <Button
            variant="primary"
            text="+ Add New Course"
            onClick={() => setOpenForm(true)}
            className="bg-primary hover:bg-primary-dark text-white px-4 py-1 rounded-lg font-semibold transition-colors duration-200"
          />
        </div>
      </div>

      {/* Add Course Form Modal */}
      {openForm && (
        <div className="fixed inset-0 bg-black/70  flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-scroll no-scrollbar">
            <AddCourseForm
              onClose={() => {
                setOpenForm(false);
                setEditingCourse(null);
              }}
              onSubmit={handleSubmitCourse}
              initialData={editingCourse}
            />
          </div>
        </div>
      )}

      {/* Courses Table */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            All Courses ({pagination?.total || courses.length})
          </h2>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-primary  text-white">
                <tr>
                  <th className="text-left font-semibold px-4 py-3">Course</th>
                  <th className="text-left font-semibold px-4 py-3">Category</th>
                  <th className="text-left font-semibold px-4 py-3">Instructor</th>
                  <th className="text-left font-semibold px-4 py-3">Price</th>
                  <th className="text-left font-semibold px-4 py-3">Level</th>
                  <th className="text-left font-semibold px-4 py-3">Status</th>
                  <th className="text-right font-semibold px-4 py-3">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {courses.map((course) => (
                  <tr key={course.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={resolveImageUrl(course.image) || 'https://via.placeholder.com/80x60/4f46e5/ffffff?text=Img'}
                          alt={course.title}
                          className="w-16 h-12 rounded-md object-cover border border-gray-200 shrink-0"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/80x60/4f46e5/ffffff?text=Img';
                          }}
                        />
                        <div className="min-w-0">
                          <div className="font-semibold text-gray-900 truncate max-w-[18rem]">
                            {course.title}
                          </div>
                          <div className="text-gray-500 truncate max-w-[18rem]">
                            {course.slug}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-gray-700">
                      {course.category?.name || course.category || '-'}
                    </td>

                    <td className="px-4 py-3 text-gray-700">
                      {course.instructor?.user?.name || course.instructor?.name || course.instructor?.name || course.instructor?.user?.name || course.instructor?.name || course.instructor?.title || course.instructor || '-'}
                    </td>

                    <td className="px-4 py-3 text-gray-700">
                      ${Number(course.price || 0).toFixed(2)}
                    </td>

                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 capitalize">
                        {course.level || '-'}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${course.is_active ? 'bg-primary text-white' : 'bg-red-100 text-red-800'
                        }`}>
                        {course.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleEditCourse(course)}
                          className="inline-flex items-center gap-1  text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />

                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteCourse(course.id)}
                          className="inline-flex items-center gap-1  text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />

                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {pagination && pagination.last_page > 1 && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-gray-200">
            {/* Per Page Selector */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Show:</span>
              <select
                value={perPage}
                onChange={(e) => handlePerPageChange(Number(e.target.value))}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={6}>6</option>
                <option value={12}>12</option>
                <option value={24}>24</option>
                <option value={36}>36</option>
              </select>
              <span className="text-sm text-gray-600">per page</span>
            </div>

            {/* Pagination Info */}
            <div className="text-sm text-gray-600">
              Showing {pagination.from || 0} to {pagination.to || 0} of {pagination.total || 0} courses
            </div>

            {/* Page Navigation */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              {/* Page Numbers */}
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, pagination.last_page || 1) }, (_, i) => {
                  let pageNum;
                  const totalPages = pagination.last_page || 1;

                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else {
                    // Center around current page
                    const startPage = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
                    pageNum = startPage + i;
                  }

                  // Only show valid page numbers
                  if (pageNum > totalPages) return null;

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-1 border rounded-md text-sm ${currentPage === pageNum
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-300 hover:bg-gray-50'
                        }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= pagination.last_page}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {courses.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg
                className="mx-auto h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No courses found
            </h3>
            <p className="text-gray-500 mb-4">
              Get started by creating your first course.
            </p>
            <Button
              variant="primary"
              text="Create Course"
              onClick={() => {
                if (!isAuthenticated) {
                  alert('Please log in to create courses.');
                  return;
                }
                if (user?.role !== 'admin') {
                  alert('Only administrators can create courses.');
                  return;
                }
                setOpenForm(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            />
          </div>
        )}
      </div>
    </div>
  );
}

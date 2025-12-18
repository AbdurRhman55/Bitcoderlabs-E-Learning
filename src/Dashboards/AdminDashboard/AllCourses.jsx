// src/components/courses/CoursesPage.jsx
import React, { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import AddCourseForm from "./AddCourseFrom";
import Button from "../../Component/UI/Button";
import { Edit2, Trash2, RefreshCw } from "lucide-react";
import { apiClient } from '../../../src/api/index.js';


export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const [isOperationInProgress, setIsOperationInProgress] = useState(false);

  const { user, isAuthenticated } = useSelector(state => state.auth);

  // Fetch courses from API
  const fetchCourses = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const response = await apiClient.getCourses();
      setCourses(response.data || []);
      setLastUpdate(Date.now());
    } catch (error) {
      console.error('Error fetching courses:', error);
      // Keep existing data on error to avoid UI flicker
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Real-time polling for updates every 5 seconds (paused during operations)
  useEffect(() => {
    if (isOperationInProgress) return;

    const interval = setInterval(() => {
      fetchCourses(false); // Don't show loading spinner for background updates
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, [isOperationInProgress, lastUpdate]);

  // Force refresh function for manual updates
  const forceRefresh = () => {
    fetchCourses(true);
  };

  const handleSubmitCourse = async (courseData) => {
    try {
      setLoading(true);
      setIsOperationInProgress(true);
      console.log('Submitting course data:', courseData);

      // Prepare data for API - convert arrays to JSON strings as expected by backend
      const preparedData = {
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

      console.log('Prepared data for API:', preparedData);

       let response;
       if (editingCourse) {
         // Update existing course
         console.log('Updating course:', editingCourse.id);
         response = await apiClient.updateCourse(editingCourse.id, preparedData);

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

        // Validate required fields before creating
        const requiredFields = ['title', 'slug', 'description', 'instructor_id', 'category_id', 'price', 'level', 'language'];
        const missingFields = requiredFields.filter(field => !preparedData[field] || preparedData[field] === '' || preparedData[field] === null || preparedData[field] === undefined);

        if (missingFields.length > 0) {
          throw new Error(`Missing required fields: ${missingFields.join(', ')}. Please fill all required fields.`);
        }

        // Check if instructor_id and category_id are valid numbers
        if (isNaN(preparedData.instructor_id) || isNaN(preparedData.category_id)) {
          throw new Error('Please select a valid instructor and category.');
        }

        console.log('Creating new course with data:', preparedData);
        response = await apiClient.createCourse(preparedData);
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
      setTimeout(() => fetchCourses(false), 1000);
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
        setTimeout(() => fetchCourses(false), 1000);
      } catch (error) {
        console.error('Error deleting course:', error);
        alert('Failed to delete course. Please try again.');
      } finally {
        setIsOperationInProgress(false);
      }
    }
  };

  const refreshCourses = async () => {
    try {
      console.log('Refreshing courses from API...');
      const response = await apiClient.getCourses();
      console.log('Refresh response:', response);
      setCourses(response.data || []);
      console.log('Courses state updated from refresh');
    } catch (error) {
      console.error('Error refreshing courses:', error);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-dark"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
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
              className="flex items-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Refresh courses"
            >
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
            <Button
              variant="primary"
              text="+ Add New Course"
              onClick={() => setOpenForm(true)}
              className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
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
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            All Courses ({courses.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Instructor
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {courses.map((course) => (
                <tr
                  key={course.id}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                   <td className="px-6 py-4">
                     <div className="flex items-center">
                       <div>
                         <h3 className="font-semibold text-gray-900 text-sm">
                           {course.title}
                         </h3>
                         <p className="text-gray-500 text-xs mt-1 line-clamp-2 max-w-xs">
                           {course.description}
                         </p>
                         <div className="flex items-center mt-1">
                           <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2">
                             {course.category?.name || course.category}
                           </span>
                           <span
                             className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                               course.level === "beginner"
                                 ? "bg-green-100 text-green-800"
                                 : course.level === "intermediate"
                                 ? "bg-yellow-100 text-yellow-800"
                                 : "bg-red-100 text-red-800"
                             }`}
                           >
                             {course.level}
                           </span>
                         </div>
                       </div>
                     </div>
                   </td>
                   <td className="px-6 py-4">
                     <span className="text-sm text-gray-900">
                       {course.instructor?.user?.name || course.instructor?.name || course.instructor}
                     </span>
                   </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">
                      {course.duration}
                    </span>
                    <div className="text-xs text-gray-500 mt-1">
                      {course.lessons} lessons
                    </div>
                  </td>
                   <td className="px-6 py-4">
                     <span className="font-semibold text-gray-900">
                       {formatPrice(course.price || 0)}
                     </span>
                   </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col space-y-1">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 w-fit">
                        Active
                      </span>
                      <span className="text-xs text-gray-500">
                        {course.students} students
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      {/* Edit Icon */}
                       <button
                         className="text-blue-600 hover:text-blue-800 transition"
                         onClick={() => handleEditCourse(course)}
                         title="Edit Course"
                       >
                         <Edit2 size={18} />
                       </button>

                      {/* Delete Icon */}
                      <button
                        className="text-red-600 hover:text-red-800 transition"
                        onClick={() => handleDeleteCourse(course.id)}
                        title="Delete Course"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {courses.length === 0 && (
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

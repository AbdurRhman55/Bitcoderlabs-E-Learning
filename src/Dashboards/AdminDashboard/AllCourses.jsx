import React, { useState, useEffect, Fragment } from "react";
import { useSelector } from 'react-redux';
import AddCourseForm from "./AddCourseFrom";
import Button from "../../Component/UI/Button";
import { Edit2, RefreshCw, Trash2, ChevronDown, ChevronRight, Book, PlayCircle, Plus, Minus, FileText, Video, Link } from "lucide-react";
import { apiClient } from '../../../src/api/index.js';
import { API_ORIGIN } from "../../api/index.js";

const PLACEHOLDER_IMAGE = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmVmZWZlIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZpbGw9IiM5OTkiIGZvbnQtc2l6ZT0iMTQiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZHk9Ii4zZW0iIHRleHQtYW5jaG9yPSJtaWRkbGUiPkJpdGNvZGVyIExhYnM8L3RleHQ+PC9zdmc+";

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
  const [expandedCourses, setExpandedCourses] = useState({});
  const [courseModules, setCourseModules] = useState({});
  const [loadingModules, setLoadingModules] = useState({});
  const [expandedModules, setExpandedModules] = useState({});

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

      if (response && response.data) {
        setCourses(response.data);
        setPagination(response.meta || null);
        // Reset expanded states when fetching new courses
        setExpandedCourses({});
        setExpandedModules({});
      } else {
        setCourses([]);
        setPagination(null);
      }
      setLastUpdate(Date.now());
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses(currentPage, true);
  }, [currentPage, perPage]);

  const forceRefresh = () => {
    fetchCourses(currentPage, true);
  };

  const handleSubmitCourse = async (courseData) => {
    try {
      setLoading(true);
      setIsOperationInProgress(true);
      console.log('Submitting course data:', courseData);

      const isFormData = courseData instanceof FormData;
      let submitData;

      if (isFormData) {
        console.log('Received FormData, using directly for API call');
        submitData = courseData;
        if (!submitData.has('is_featured')) submitData.append('is_featured', '0');
        if (!submitData.has('is_active')) submitData.append('is_active', '1');
        if (!submitData.has('features')) submitData.append('features', '[]');
        if (!submitData.has('tags')) submitData.append('tags', '[]');
      } else {
        submitData = {
          ...courseData,
          short_description: courseData.short_description || null,
          image: courseData.image || null,
          video_url: courseData.video_url || null,
          duration: courseData.duration || null,
          original_price: courseData.original_price ? parseFloat(courseData.original_price) : null,
          features: courseData.features ? JSON.stringify(courseData.features) : "[]",
          tags: courseData.tags ? JSON.stringify(courseData.tags) : "[]",
          price: parseFloat(courseData.price) || 0,
          rating: courseData.rating ? parseFloat(courseData.rating) : 0,
          reviews_count: courseData.reviews_count ? parseInt(courseData.reviews_count) : 0,
          students_count: courseData.students_count ? parseInt(courseData.students_count) : 0,
          instructor_id: courseData.instructor_id ? parseInt(courseData.instructor_id) : undefined,
          category_id: courseData.category_id ? parseInt(courseData.category_id) : undefined,
          is_featured: Boolean(courseData.is_featured),
          is_active: Boolean(courseData.is_active),
        };
      }

      console.log('Prepared data for API:', submitData);

      let response;
      if (editingCourse) {
        console.log('Updating course:', editingCourse.id);
        response = await apiClient.updateCourse(editingCourse.id, submitData);
        setCourses(prevCourses =>
          prevCourses.map(course =>
            course.id === editingCourse.id
              ? response.data
              : course
          )
        );
        // Clear expanded state for updated course
        setExpandedCourses(prev => ({ ...prev, [editingCourse.id]: false }));
        setExpandedModules({});
      } else {
        if (!isAuthenticated) {
          throw new Error('You must be logged in to create courses.');
        }
        if (user?.role !== 'admin') {
          throw new Error('Only administrators can create courses.');
        }

        if (!isFormData) {
          const requiredFields = ['title', 'slug', 'description', 'instructor_id', 'category_id', 'price', 'level', 'language'];
          const missingFields = requiredFields.filter(field => !submitData[field] || submitData[field] === '' || submitData[field] === null || submitData[field] === undefined);

          if (missingFields.length > 0) {
            throw new Error(`Missing required fields: ${missingFields.join(', ')}. Please fill all required fields.`);
          }

          if (isNaN(submitData.instructor_id) || isNaN(submitData.category_id)) {
            throw new Error('Please select a valid instructor and category.');
          }
        }

        console.log('Creating new course with data:', submitData);
        response = await apiClient.createCourse(submitData);
        console.log('Create response:', response);

        if (response.data) {
          console.log('Adding new course to state:', response.data);
          setCourses(prevCourses => [response.data, ...prevCourses]);
        }
      }

      console.log('API response:', response);
      setTimeout(() => fetchCourses(currentPage, false), 1000);
      setOpenForm(false);
      setEditingCourse(null);
    } catch (error) {
      console.error('Error saving course:', error);
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
        // Remove course from expanded states
        setExpandedCourses(prev => {
          const newExpanded = { ...prev };
          delete newExpanded[courseId];
          return newExpanded;
        });
        setExpandedModules({});
        setTimeout(() => fetchCourses(currentPage, false), 1000);
      } catch (error) {
        console.error('Error deleting course:', error);
        alert('Failed to delete course. Please try again.');
      } finally {
        setIsOperationInProgress(false);
      }
    }
  };

  // Fetch modules and lessons for a specific course
  const fetchCourseModules = async (courseId) => {
    try {
      setLoadingModules(prev => ({ ...prev, [courseId]: true }));

      const modulesResponse = await apiClient.getCourseModules({ course_id: courseId });
      const modules = modulesResponse.data || [];

      const modulesWithLessons = await Promise.all(
        modules.map(async (module) => {
          try {
            const lessonsResponse = await apiClient.getModuleLessons({ module_id: module.id });
            return {
              ...module,
              lessons: lessonsResponse.data || []
            };
          } catch (error) {
            console.error(`Error fetching lessons for module ${module.id}:`, error);
            return {
              ...module,
              lessons: []
            };
          }
        })
      );

      setCourseModules(prev => ({
        ...prev,
        [courseId]: modulesWithLessons
      }));
    } catch (error) {
      console.error('Error fetching course modules:', error);
      setCourseModules(prev => ({
        ...prev,
        [courseId]: []
      }));
    } finally {
      setLoadingModules(prev => ({ ...prev, [courseId]: false }));
    }
  };

  // Toggle course expansion - ALL modules will be collapsed by default
  const toggleCourseExpansion = async (courseId) => {
    const isCurrentlyExpanded = expandedCourses[courseId];

    // If we're expanding, fetch modules if not already loaded
    if (!isCurrentlyExpanded && !courseModules[courseId]) {
      await fetchCourseModules(courseId);
    }

    // Toggle the course expansion
    setExpandedCourses(prev => ({
      ...prev,
      [courseId]: !isCurrentlyExpanded
    }));

    // Clear all module expansions when collapsing the course
    if (isCurrentlyExpanded) {
      setExpandedModules({});
    }
  };

  // Toggle module expansion - only one module can be expanded at a time
  const toggleModuleExpansion = (moduleId, courseId) => {
    setExpandedModules(prev => {
      const newExpanded = {};
      // Only expand the clicked module, collapse others
      if (!prev[moduleId]) {
        newExpanded[moduleId] = true;
      }
      return newExpanded;
    });
  };

  // Collapse all courses
  const collapseAllCourses = () => {
    setExpandedCourses({});
    setExpandedModules({});
  };

  // Collapse all modules for a specific course
  const collapseAllModulesForCourse = (courseId) => {
    setExpandedModules(prev => {
      const newExpanded = { ...prev };
      Object.keys(newExpanded).forEach(moduleId => {
        delete newExpanded[moduleId];
      });
      return newExpanded;
    });
  };

  const handlePageChange = (page) => {
    if (page !== currentPage && page >= 1 && page <= (pagination?.last_page || 1)) {
      setCurrentPage(page);
    }
  };

  const handlePerPageChange = (newPerPage) => {
    setPerPage(newPerPage);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-dark"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Courses Management
          </h1>
          <p className="text-gray-600 mt-2">
            Manage and organize your course offerings
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {Object.keys(expandedCourses).length > 0 && (
            <button
              onClick={collapseAllCourses}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors duration-200"
              title="Collapse all courses"
            >
              <Minus size={18} />
              Collapse All
            </button>
          )}
          <button
            onClick={forceRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Refresh courses"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <Button
            variant="primary"
            text="+ Add New Course"
            onClick={() => setOpenForm(true)}
            className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200"
          />
        </div>
      </div>

      {/* Add Course Form Modal */}
      {openForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
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

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-primary text-white">
                <tr>
                  <th className="text-left font-semibold px-4 py-3 w-12"></th>
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
                  <Fragment key={course.id}>
                    {/* Main Course Row */}
                    <tr className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-2 py-3">
                        <button
                          onClick={() => toggleCourseExpansion(course.id)}
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                          title={expandedCourses[course.id] ? "Collapse" : "Expand"}
                        >
                          {expandedCourses[course.id] ? (
                            <ChevronDown className="w-4 h-4 text-gray-600" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-gray-600" />
                          )}
                        </button>
                      </td>

                      <td className="px-2 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={resolveImageUrl(course.image) || PLACEHOLDER_IMAGE}
                            alt={course.title}
                            className="w-14 h-10 rounded-md object-cover border border-gray-200 shrink-0"
                            onError={(e) => {
                              if (e.target.src !== PLACEHOLDER_IMAGE) {
                                e.target.onerror = null;
                                e.target.src = PLACEHOLDER_IMAGE;
                              }
                            }}
                          />
                          <div className="min-w-0">
                            <div className="font-semibold text-gray-900 truncate max-w-[16rem]">
                              {course.title}
                            </div>
                            <div className="text-gray-500 text-xs truncate max-w-[16rem]">
                              {course.slug}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3 text-gray-700">
                        {course.category?.name || course.category || '-'}
                      </td>

                      <td className="px-4 py-3 text-gray-700">
                        {course.instructor?.user?.name || course.instructor?.name || course.instructor?.title || course.instructor || '-'}
                      </td>

                      <td className="px-4 py-3 text-gray-700 font-medium">
                        ${Number(course.price || 0).toFixed(2)}
                      </td>

                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 capitalize">
                          {course.level || '-'}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${course.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                          {course.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>

                      <td className="px-1 py-3">
                        <div className="flex items-center justify-end ">
                          <button
                            type="button"
                            onClick={() => handleEditCourse(course)}
                            className="inline-flex items-center gap-1 p-2 text-blue-600 hover:text-blue-800 rounded-lg hover:bg-blue-50 transition-colors"
                            title="Edit course"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteCourse(course.id)}
                            className="inline-flex items-center gap-1 p-2 text-red-600 hover:text-red-800 rounded-lg hover:bg-red-50 transition-colors"
                            title="Delete course"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Expanded Course Details Row */}
                    {expandedCourses[course.id] && (
                      <tr className="bg-gray-50">
                        <td colSpan="8" className="px-4 py-6">
                          <div className="pl-8 border-l-2 border-primary">
                            <div className="flex justify-between items-center mb-4">
                              <h3 className="font-bold text-gray-900 text-lg">Course Content</h3>
                              <div className="flex items-center gap-2">
                                {Object.keys(expandedModules).length > 0 && (
                                  <button
                                    onClick={() => collapseAllModulesForCourse(course.id)}
                                    className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-md transition-colors"
                                  >
                                    <Minus size={14} />
                                    Collapse Modules
                                  </button>
                                )}
                              </div>
                            </div>

                            {loadingModules[course.id] ? (
                              <div className="flex justify-center items-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                <span className="ml-3 text-gray-600">Loading modules and lessons...</span>
                              </div>
                            ) : courseModules[course.id]?.length > 0 ? (
                              <div className="space-y-4">
                                {courseModules[course.id].map((module, moduleIndex) => (
                                  <div key={module.id} className="bg-white rounded-lg border border-gray-300 shadow-sm overflow-hidden">
                                    {/* Module Header */}
                                    <div className="p-4 border-b border-gray-200 bg-gray-50">
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                          <button
                                            onClick={() => toggleModuleExpansion(module.id, course.id)}
                                            className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
                                          >
                                            {expandedModules[module.id] ? (
                                              <ChevronDown className="w-4 h-4" />
                                            ) : (
                                              <ChevronRight className="w-4 h-4" />
                                            )}
                                            <div className="flex items-center gap-3">
                                              <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold text-sm">
                                                {moduleIndex + 1}
                                              </div>
                                              <div>
                                                <h4 className="font-semibold text-gray-900">{module.title}</h4>
                                                {module.description && (
                                                  <p className="text-sm text-gray-600 mt-1">{module.description}</p>
                                                )}
                                              </div>
                                            </div>
                                          </button>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <span className="text-xs font-medium text-gray-500">
                                            {module.lessons?.length || 0} lessons
                                          </span>
                                          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                                            Module
                                          </span>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Module Content (Lessons) - Only shown when expanded */}
                                    {expandedModules[module.id] && module.lessons && module.lessons.length > 0 && (
                                      <div className="p-4 bg-gray-50">
                                        <div className="space-y-2">
                                          {module.lessons.map((lesson, lessonIndex) => (
                                            <div key={lesson.id} className="bg-white rounded border border-gray-200 p-3 hover:border-primary transition-colors">
                                              <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                  <div className="flex-shrink-0">
                                                    {lesson.lesson_type === 'video' ? (
                                                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                                        <Video className="w-4 h-4 text-red-600" />
                                                      </div>
                                                    ) : lesson.lesson_type === 'article' ? (
                                                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                        <FileText className="w-4 h-4 text-blue-600" />
                                                      </div>
                                                    ) : (
                                                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                                        <Link className="w-4 h-4 text-green-600" />
                                                      </div>
                                                    )}
                                                  </div>
                                                  <div>
                                                    <h5 className="font-medium text-gray-900">{lesson.title}</h5>
                                                    {lesson.description && (
                                                      <p className="text-sm text-gray-600 mt-1">{lesson.description}</p>
                                                    )}
                                                    <div className="flex items-center gap-3 mt-2">
                                                      <span className="text-xs text-gray-500">
                                                        {moduleIndex + 1}.{lessonIndex + 1}
                                                      </span>
                                                      {lesson.duration && (
                                                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                                                          {lesson.duration}
                                                        </span>
                                                      )}
                                                      {lesson.lesson_type && (
                                                        <span className={`text-xs px-2 py-1 rounded capitalize ${lesson.lesson_type === 'video' ? 'bg-red-100 text-red-800' :
                                                          lesson.lesson_type === 'article' ? 'bg-blue-100 text-blue-800' :
                                                            'bg-green-100 text-green-800'
                                                          }`}>
                                                          {lesson.lesson_type}
                                                        </span>
                                                      )}
                                                    </div>
                                                  </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                  {lesson.is_free && (
                                                    <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">
                                                      Free
                                                    </span>
                                                  )}
                                                  {lesson.is_preview && (
                                                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                                                      Preview
                                                    </span>
                                                  )}
                                                </div>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}

                                    {/* Empty Lessons State */}
                                    {expandedModules[module.id] && (!module.lessons || module.lessons.length === 0) && (
                                      <div className="p-6 text-center bg-gray-50">
                                        <div className="text-gray-400 mb-2">
                                          <Book className="w-12 h-12 mx-auto" />
                                        </div>
                                        <p className="text-gray-500">No lessons added to this module yet</p>
                                        <button className="mt-3 inline-flex items-center gap-1 text-sm text-primary hover:text-primary-dark">
                                          <Plus size={14} />
                                          Add Lesson
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-8 bg-white rounded-lg border border-gray-200">
                                <div className="text-gray-400 mb-3">
                                  <Book className="w-16 h-16 mx-auto" />
                                </div>
                                <h4 className="text-lg font-medium text-gray-900 mb-2">No modules found</h4>
                                <p className="text-gray-600 mb-4">This course doesn't have any modules yet</p>
                                <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
                                  <Plus size={18} />
                                  Add Module
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
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
                    const startPage = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
                    pageNum = startPage + i;
                  }

                  if (pageNum > totalPages) return null;

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-1 border rounded-md text-sm ${currentPage === pageNum
                        ? 'bg-primary text-white border-primary'
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
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <div className="text-gray-400 mb-4">
              <svg
                className="mx-auto h-16 w-16"
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
              className="bg-primary hover:bg-primary-dark text-white"
            />
          </div>
        )}
      </div>
    </div>
  );
}
// src/components/courses/CoursesPage.jsx
import React, { useState, useEffect } from "react";
import AddCourseForm from "./AddCourseFrom";
import Button from "../../Component/UI/Button";
import { Edit2, Trash2 } from "lucide-react";


export default function CoursesPage() {
  const [courses, setCourses] = useState([
    {
      id: 1,
      title: "React for Beginners",
      category: "Web Development",
      level: "beginner",
      instructor: "John Doe",
      description: "Learn React step by step with hands-on projects",
      image: "https://via.placeholder.com/300",
      duration: "5h 30m",
      students: 120,
      lessons: 10,
      rating: 4.5,
      reviews: 20,
      price: 49,
      isWishlisted: false,
    },
    {
      id: 2,
      title: "Advanced JavaScript",
      category: "Programming",
      level: "advanced",
      instructor: "Jane Smith",
      description: "Master advanced JavaScript concepts and patterns",
      image: "https://via.placeholder.com/300",
      duration: "8h 15m",
      students: 85,
      lessons: 15,
      rating: 4.8,
      reviews: 35,
      price: 79,
      isWishlisted: false,
    },
    // Add more sample courses as needed
  ]);

  const [openForm, setOpenForm] = useState(false);
  const [loading, setLoading] = useState(false);

  // Simulate fetching courses from database
  useEffect(() => {
    // Here you would fetch courses from your API
    // const fetchCourses = async () => {
    //   setLoading(true);
    //   try {
    //     const response = await fetch('/api/courses');
    //     const data = await response.json();
    //     setCourses(data);
    //   } catch (error) {
    //     console.error('Error fetching courses:', error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchCourses();
  }, []);

  const handleAddCourse = (newCourse) => {
    // In real app, you would send this to your backend API
    const courseToAdd = {
      ...newCourse,
      id: courses.length + 1,
      students: 0,
      reviews: 0,
      isWishlisted: false,
    };

    setCourses((prev) => [...prev, courseToAdd]);
    setOpenForm(false);
  };

  const handleDeleteCourse = (courseId) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      setCourses((prev) => prev.filter((course) => course.id !== courseId));
      // Here you would also call your API to delete from database
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
        <Button
          variant="primary"
          text="+ Add New Course"
          onClick={() => setOpenForm(true)}
          className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
        />
      </div>

      {/* Add Course Form Modal */}
      {openForm && (
        <div className="fixed inset-0 bg-black/70  flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-scroll no-scrollbar">
            <AddCourseForm
              onClose={() => setOpenForm(false)}
              onSubmit={handleAddCourse}
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
                            {course.category}
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
                      {course.instructor}
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
                      {formatPrice(course.price)}
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
                        onClick={() => {
                          /* Edit functionality */
                        }}
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
              onClick={() => setOpenForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            />
          </div>
        )}
      </div>
    </div>
  );
}

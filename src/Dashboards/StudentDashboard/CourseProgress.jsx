// CourseProgress.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { selectMyCourses } from '../../../slices/courseSlice';
import { apiClient, API_ORIGIN } from '../../api/index.js';
import { useNavigate } from 'react-router-dom';

const CourseProgress = () => {
  const enrolledCourses = useSelector(selectMyCourses) || [];
  const navigate = useNavigate();

  const resolveImageUrl = (url) => {
    if (!url) return 'https://via.placeholder.com/100x60?text=Course';
    const stringUrl = String(url).trim();
    if (stringUrl.startsWith('http')) return stringUrl;
    let cleanPath = stringUrl.startsWith('/') ? stringUrl.substring(1) : stringUrl;
    return `${API_ORIGIN}/storage/${cleanPath}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">Current Courses</h2>
        <button
          onClick={() => navigate('/courses')}
          className="text-primary hover:text-primary-dark font-bold text-sm transition-colors"
        >
          View All Courses
        </button>
      </div>

      <div className="space-y-4">
        {enrolledCourses.length > 0 ? (
          enrolledCourses.map((course) => (
            <div key={course.id} className="flex items-center space-x-4 p-4 border border-gray-50 rounded-xl hover:border-primary/30 hover:bg-gray-50/50 transition-all duration-300">
              <img
                src={resolveImageUrl(course.image)}
                alt={course.title}
                className="w-16 h-12 object-cover rounded-lg shadow-sm"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 truncate tracking-tight">{course.title}</h3>
                <p className="text-xs text-gray-500 font-medium">{course.instructor?.name || 'Instructor'}</p>
                <div className="flex items-center space-x-4 mt-1">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{course.duration || 'N/A'}</span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="hidden sm:block w-24 bg-gray-100 rounded-full h-2 overflow-hidden border border-gray-50">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-700"
                    style={{ width: `${course.progress || 0}%` }}
                  ></div>
                </div>
                <span className="text-xs font-black text-primary w-8">{course.progress || 0}%</span>
                <button
                  onClick={async () => {
                    try {
                      // Find the first lesson to redirect to
                      const response = await apiClient.getCourseById(course.id);
                      const fetchedCourse = response.data?.data || response.data || response;

                      let firstLessonId = null;
                      if (fetchedCourse?.modules) {
                        for (const module of fetchedCourse.modules) {
                          const lessons = module.lessons || module.course_lessons || module.lessonsList || [];
                          if (lessons.length > 0) {
                            const lesson = lessons[0];
                            firstLessonId = lesson.id || lesson.lesson_id;
                            break;
                          }
                        }
                      }

                      if (firstLessonId) {
                        navigate(`/video/${firstLessonId}?courseId=${course.id}`);
                      } else {
                        navigate(`/course/${course.id}`);
                      }
                    } catch (error) {
                      console.error("Navigation error:", error);
                      navigate(`/course/${course.id}`);
                    }
                  }}
                  className="px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-lg text-xs font-bold transition-all cursor-pointer"
                >
                  Continue
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500 italic text-sm">
            No courses enrolled yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseProgress;

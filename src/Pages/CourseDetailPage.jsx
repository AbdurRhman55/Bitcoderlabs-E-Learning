import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CourseHero from '../Component/CourseDetailPage/HeroSection/Hero';
import CurriculumSection from '../Component/CourseDetailPage/CurriculumSection/CurriculumSection';
import CourseVideo from '../Component/CourseDetailPage/SampleVideoSection/CourseVideo';
import ReviewSection from '../Component/CourseDetailPage/ReviewSection/ReviewSection';
import CTASection from '../Component/Home/CTASection';
import { apiClient } from '../api/index'; // Adjust path if needed
import { useSelector } from 'react-redux';

export default function CourseDetailPage() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Also try to find in Redux store as initial data / optimistic UI
  const reduxCourse = useSelector((state) =>
    state.courses.courses.find((c) => c.id == id)
  );

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        // If we have redux data, use it first (optional, but good for UX)
        if (reduxCourse) {
          setCourse(reduxCourse);
        }

        console.log(`Fetching course with ID: ${id}`);
        const response = await apiClient.getCourseById(id);
        let fetchedCourse = response.data || response;
        // Handle potential double nesting or if the response itself was { data: ... } and response.data accessed it but it's still wrapped?
        // Actually, if fetchedCourse has a .data property that is an object, unwrap it.
        if (fetchedCourse && fetchedCourse.data && typeof fetchedCourse.data === 'object') {
          fetchedCourse = fetchedCourse.data;
        }
        console.log("Final Unwrapped Course:", fetchedCourse);
        setCourse(fetchedCourse);
      } catch (err) {
        console.error("Failed to fetch course:", err);
        // specific error handling
        if (!reduxCourse) {
          setError("Failed to load course details.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCourse();
    }
  }, [id, reduxCourse]);

  if (loading && !course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error && !course) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div>
      <CourseHero course={course} />
      <CurriculumSection course={course} />
      <CourseVideo course={course} />
      <ReviewSection courseId={id} courseData={course} />
      <CTASection />
    </div>
  );
}

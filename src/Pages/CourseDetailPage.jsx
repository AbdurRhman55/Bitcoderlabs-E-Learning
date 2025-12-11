import React from 'react'
import CourseHero from '../Component/CourseDetailPage/HeroSection/Hero'
// import Syllabus from '../Component/CourseDetailPage/Syllabus'
import CurriculumSection from '../Component/CourseDetailPage/CurriculumSection/CurriculumSection'
import CourseVideo from '../Component/CourseDetailPage/SampleVideoSection/CourseVideo'
import CTASection from '../Component/Home/CTASection'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function CourseDetailPage() {
  const { id } = useParams();
    const courses = useSelector((state) => state.courses.courses);

  const course = courses.find((c) => c.id == id); 
  console.log(course);
  
  return (
    <div>
      <CourseHero course={course} />
      <CurriculumSection/>
      <CourseVideo />
      <CTASection />
    </div>
  )
}

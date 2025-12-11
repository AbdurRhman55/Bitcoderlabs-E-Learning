import React from 'react'
import CourseHero from '../Component/CourcesPage/CourcesHero'
import CourseGrid from '../Component/CourcesPage/CourseContent/CourcesGrid'
import CTASection from '../Component/Home/CTASection'
// import Footer from '../Component/UI/Footer'
export default function Cources() {
  return (
    <div>
      <CourseHero />
      <CourseGrid />
      <CTASection />
      {/* <Footer /> */}

    </div>
  )
}

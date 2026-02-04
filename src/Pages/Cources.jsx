import React, { useState } from 'react'
import CourseHero from '../Component/CourcesPage/CourcesHero'
import CourseGrid from '../Component/CourcesPage/CourseContent/CourcesGrid'
import CTASection from '../Component/Home/CTASection'
// import Footer from '../Component/UI/Footer'
export default function Cources() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div>
      <CourseHero setSearchQuery={setSearchQuery} />
      <CourseGrid searchQuery={searchQuery} />
      <CTASection />
      {/* <Footer /> */}

    </div>
  )
}

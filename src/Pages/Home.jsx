import React from 'react'
import HomeHero from "../Component/Home/HomeHero"
import Categories from '../Component/Home/Categories/Categories'  
import WhyChooseUs from '../Component/Home/WhyChoseUs'
import FeaturedCourses from '../Component/Home/FeaturedCourses'
import HowItWorks from '../Component/Home/HowItWorks'
import TopInstructors from '../Component/Home/TopInstructor'
import CTASection from "../Component/Home/CTASection"
// import Footer from '../Component/UI/Footer'
import Blog from '../Component/Home/Blog'
import CompanyCollaboration from '../Component/Home/CompanyCollaboration'



export default function Home() {

  return (
    <div>
      < HomeHero
      title="<span class='text-white'>Learn</span><span class='text-white'>,</span> <span class='text-primary'>Anything</span><span class='text-white'>,</span> <span class='text-primary'>AnyTime</span><span class='text-white'>,</span> <span class='text-primary'>AnyWhere</span>"
      SubTitle="Join thousands of learners building their future with our expert-led courses."
      heroimage="../assets/hero.avif"
      />
      <FeaturedCourses/>

     <Categories/>

     <WhyChooseUs  />
     <HowItWorks />
     <TopInstructors />
     <Blog />
     <CompanyCollaboration />
     <CTASection/>
     {/* <Footer/> */}
    </div>
  )
}

import React from 'react';
import Heroright from './Heroright';
// import { courseData } from '../../../../Data/Courses.Array';
import HeroLeft from './HeroLeft';
import { stats } from "../../../../Data/Courses.Array"
import { benefits } from "../../../../Data/Courses.Array"
import SirAizaz from "../../../../images/sir aizaz.jpeg";
const CourseHero = ({ course }) => {
  console.log(course);
  
  return (
    <div className="min-h-screen bg-white">
      <div className="relative bg-gradient-to-br from-[#e8f7ff] via-white to-[#f0f9ff] py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#3baee9] opacity-5 rounded-full -translate-y-36 translate-x-36"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#3baee9] opacity-3 rounded-full -translate-x-48 translate-y-48"></div>

        <div className="max-w-7xl mx-auto relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <HeroLeft 
            course={course}
            />

            <Heroright />

          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Course Overview
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#3baee9] to-[#2a9fd8] mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Description */}
          <div className="space-y-8">
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-gray-700 leading-relaxed font-light">
                This comprehensive course takes you from fundamental concepts to advanced
                web development techniques. You'll learn to build modern, scalable
                applications using the latest technologies and industry best practices.
              </p>
            </div>

            {/* Key Benefits */}
            <div className="bg-gradient-to-br from-[#e8f7ff] to-white p-8 rounded-3xl border border-[#e8f7ff] shadow-lg">
              <h3 className="text-2xl font-bold text-[#3baee9] mb-6 flex items-center gap-3">
                <span className="w-2 h-8 bg-[#3baee9] rounded-full"></span>
                Key Benefits
              </h3>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-4 text-gray-700 font-medium">
                    <div className="w-6 h-6 bg-[#3baee9] rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Stats & Achievements */}
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
                  <div className="text-3xl font-bold text-[#3baee9]">{stat.value}</div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Testimonial */}
            <div className="bg-gradient-to-br from-[#3baee9] to-[#2a9fd8] p-8 rounded-3xl text-white">
              <div className="text-4xl mb-4">"</div>
              <p className="text-lg font-light mb-6">
                This course transformed my career. The projects were challenging and relevant,
                and the instructor support was exceptional.
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                  <img src={SirAizaz} alt="" className='rounded-full' />
                </div>
                <div>
                  <div className="font-bold">Mian Aizaz</div>
                  <div className="text-blue-100 text-sm">Front end Web developer</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseHero;
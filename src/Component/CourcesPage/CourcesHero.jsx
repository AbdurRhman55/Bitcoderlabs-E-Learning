// components/CourseHero.jsx
import React from "react";
import { FiUsers, FiAward, FiStar } from "react-icons/fi";
import Input from "../UI/Input";

export default function CourseHero({
  title = "Explore Our Courses",
  description = "Learn new skills from industry experts",
}) {
  return (
    <section className="bg-gradient-to-br from-primary-dark via-primary to-blue-600 text-white py-4 px-6 text-center relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10 pb-10">
        {/* Title & Description */}
        <div className="mb-2">
          <h1 className="text-3xl lg:text-5xl font-bold mb-3 leading-tight">
            {title}
          </h1>
          <p className="text-xl lg:text-xl text-primary-light mb-5 max-w-3xl mx-auto leading-relaxed">
            {description}
          </p>
        </div>

        <div className="max-w-sm mx-auto mb-7 relative z-10">
          <Input
            type="text"
            variant="small" 
            placeholder="Search courses here....."
            showButton={true}
            showIcon={true}
            // size="sm"
          />
        </div>

        {/* Stats Section */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-8 py-6  border border-white/20 max-w-xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                label: "Professional Courses",
                value: "100+",
                icon: <FiAward className="w-6 h-6" />,
              },
              {
                label: "Expert Instructors",
                value: "50+",
                icon: <FiUsers className="w-6 h-6" />,
              },
              {
                label: "Happy Students",
                value: "10K+",
                icon: <FiStar className="w-6 h-6" />,
              },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-3">
                <div className=" bg-primary/20 rounded-full text-primary-light">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-2xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-primary-light text-sm font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

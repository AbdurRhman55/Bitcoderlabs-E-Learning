import React from "react";
import { Right, recommendations } from "../../../Data/Array";
import {Link} from "react-router-dom"

export default function HeroRight({ Righttitle, secondtital, thirdtitle }) {
  return (
    <div  className="hidden lg:block lg:mr-0 mr-9 relative z-10 mt-10 bg-white/90 border border-gray-200 shadow-xl rounded-2xl p-4 max-w-[370px] w-full ml-8 backdrop-blur-sm">
      

      {/* Course Level */}
      <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg p-3 mb-4">
        <h2 className="text-lg font-bold text-gray-800 mb-3">{Righttitle}</h2>
        <div className="flex gap-2 mb-3">
          {Right.map(({ id, Level, color }) => (
            <div
              key={id}
              className={`w-8 h-8 ${color} rounded-full flex items-center justify-center text-white font-bold text-sm`}
            >
              {Level}
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 font-medium">{secondtital}</span>
          <span className="text-primary font-bold">→</span>
        </div>
      </div>
      
      {/* Progress Card */}
      <div className="bg-white border border-gray-100 rounded-lg p-3 mb-4 shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-semibold text-gray-700">{thirdtitle}</h3>
          <span className="text-md font-bold text-primary">73%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
          <div className="bg-primary h-2 rounded-full" style={{ width: "73%" }} />
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>7,300 learners</span>
          <span>10,000 goal</span>
        </div>
      </div>
      
      {/* Recommendation Card */}
      <div className="bg-gradient-to-br from-primary to-primary-dark text-white rounded-lg p-4 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-md">Weekly Recommendation</h3>
          <div className="w-8 h-8 bg-white/20 rounded flex items-center justify-center">
            <span className="font-bold text-sm">A+</span>
          </div>
        </div>
        
        <div className="space-y-2">
          {recommendations.map(({ id, icon, title }) => (
            <div key={id} className="flex items-center gap-2 bg-white/10 rounded-md p-2">
              <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
                <i className={`${icon} text-primary text-xs`}></i>
              </div>
              <span className="font-medium text-sm">{title}</span>
            </div>
          ))}
        </div>
        

        
        <Link to="/courses">
        <button className="w-full mt-3 cursor-pointer bg-white text-primary py-2 rounded-md font-semibold text-sm hover:bg-gray-100 transition">
          View All Courses
        </button>
        </Link>
      </div>
    </div>
  );
}

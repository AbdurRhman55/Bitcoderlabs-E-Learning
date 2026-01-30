import React from 'react';
import { FaChevronRight, FaBullseye, FaUsers, FaPlay, FaCheckCircle } from 'react-icons/fa';

// Create icon mapping for React Icons
const iconComponents = {
  FaBullseye: FaBullseye,
  FaUsers: FaUsers,
  FaPlay: FaPlay,
  FaCheckCircle: FaCheckCircle
};

export const HowWeWorkLeft = ({ processSteps, activeVideo, setActiveVideo }) => {
  return (
    <div className="space-y-6">
      {processSteps.map((step, index) => {
        const IconComponent = iconComponents[step.iconName];
        
        return (
          <div
            key={index}
            className="group cursor-pointer"
            onClick={() => setActiveVideo(index)}
          >
            <div className={`relative p-6 rounded-2xl border-2 transition-all duration-300 ${
              activeVideo === index 
                ? 'border-primary bg-primary/5 shadow-lg' 
                : 'border-primary/20 bg-white hover:border-primary/30 hover:shadow-md'
            }`}>
              
              {/* Step Header */}
              <div className="flex items-center gap-4 mb-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  activeVideo === index 
                    ? 'bg-primary text-white shadow-lg' 
                    : 'bg-gray-100 text-primary group-hover:bg-primary/10 group-hover:text-primary'
                }`}>
                  <IconComponent className="w-6 h-6" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className={`text-xl font-bold transition-colors duration-300 ${
                      activeVideo === index ? 'text-primary' : 'text-gray-900'
                    }`}>
                      {step.title}
                    </h3>
                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {step.duration}
                    </span>
                  </div>
                </div>

                {/* Step Number */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  activeVideo === index 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-200 text-gray-600 group-hover:bg-primary/20 group-hover:text-primary'
                }`}>
                  {index + 1}
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed mb-4">
                {step.description}
              </p>
              
              {/* Watch Video CTA */}
              <div className={`flex items-center gap-2 text-sm font-medium transition-all duration-300 ${
                activeVideo === index ? 'text-primary' : 'text-gray-500 group-hover:text-primary'
              }`}>
                <span>Watch process video</span>
                <FaChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>

              {/* Active Indicator */}
              {activeVideo === index && (
                <div className="absolute top-4 right-4">
                  <div className="w-2 h-2 bg-primary rounded-full animate-ping" />
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

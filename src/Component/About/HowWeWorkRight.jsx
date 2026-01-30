import React from 'react';
import { Play } from 'lucide-react';
import { quickStats } from '../../../Data/AboutArray';

export const HowWeWorkRight = ({ processSteps, activeVideo, setActiveVideo }) => {
  return (
    <div className="sticky top-8">
      {/* Main Video Player */}
      <div className="relative rounded-2xl overflow-hidden shadow-xl bg-white border border-gray-200">
        <div className="aspect-video bg-gray-900">
          <iframe
            src={`https://www.youtube.com/embed/${processSteps[activeVideo].videoId}?modestbranding=1&rel=0&showinfo=0`}
            className="w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={`Process: ${processSteps[activeVideo].title}`}
          />
        </div>

        {/* Video Info */}
        <div className="p-6 bg-white">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 bg-primary rounded-full" />
            <span className="text-primary font-semibold text-sm">
              Step {activeVideo + 1} of {processSteps.length}
            </span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {processSteps[activeVideo].title}
          </h3>
          <p className="text-gray-600 text-sm">
            {processSteps[activeVideo].description}
          </p>
        </div>
      </div>

      {/* Step Progress */}
      <div className="flex items-center gap-2 mt-6 p-4 bg-gray-50 rounded-xl">
        {processSteps.map((_, index) => (
          <div
            key={index}
            className={`flex-1 h-2 rounded-full transition-all duration-300 ${
              index === activeVideo
                ? 'bg-primary'
                : index < activeVideo
                ? 'bg-primary/50'
                : 'bg-gray-300'
            }`}
          />
        ))}
      </div>

      {/* Video Thumbnails */}
      <div className="grid grid-cols-4 gap-3 mt-6">
        {processSteps.map((step, index) => (
          <button
            key={index}
            onClick={() => setActiveVideo(index)}
            className={`relative aspect-video rounded-lg overflow-hidden transition-all duration-300 ${
              activeVideo === index 
                ? 'ring-2 ring-primary scale-105' 
                : 'hover:ring-1 hover:ring-primary/50 hover:scale-102'
            }`}
          >
            {/* Thumbnail Background */}
            <div className={`absolute inset-0 transition-all duration-300 ${
              activeVideo === index ? 'bg-primary/20' : 'bg-gray-200 group-hover:bg-primary/10'
            }`} />
            
            {/* Thumbnail Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                activeVideo === index 
                  ? 'bg-primary text-white' 
                  : 'bg-white/80 text-gray-600 group-hover:bg-primary group-hover:text-white'
              }`}>
                <Play className="w-3 h-3 fill-current" />
              </div>
              <span className="text-xs font-medium text-gray-700 mt-1 text-center leading-tight">
                Step {index + 1}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 mt-8 p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
        {quickStats.map((stat, index) => (
          <div key={index} className="text-center">
            <div className="text-2xl font-bold text-primary mb-1">
              {stat.value}
            </div>
            <div className="text-gray-600 text-sm font-medium">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

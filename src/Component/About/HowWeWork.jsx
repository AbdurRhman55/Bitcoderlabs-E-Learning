import { useState } from 'react';
// import { useEffect } from "react";
// import { useLocation } from "react-router-dom";
import { Clock } from 'lucide-react';
import { HowWeWorkLeft } from './HowWeWorkLeft';
import { HowWeWorkRight } from './HowWeWorkRight';
import { processSteps } from '../../../Data/AboutArray';
import AutoScroll from '../UI/AutoScroll';
export const HowWeWork = () => {
  const [activeVideo, setActiveVideo] = useState(0);

   

  return (
    <section  className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <AutoScroll/>
      <div id="FreeDemo" className="container mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            <Clock className="w-4 h-4" />
            Our Process
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            How We <span className="text-primary">Work</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A transparent, collaborative process that delivers exceptional results every time
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <HowWeWorkLeft 
            processSteps={processSteps}
            activeVideo={activeVideo}
            setActiveVideo={setActiveVideo}
          />

          <HowWeWorkRight 
            processSteps={processSteps}
            activeVideo={activeVideo}
            setActiveVideo={setActiveVideo}
          />
        </div>
      </div>
    </section>
  );
};

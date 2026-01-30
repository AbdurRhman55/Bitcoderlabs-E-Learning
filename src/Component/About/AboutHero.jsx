import React from "react";
import LeftContent from "./AboutHeroLeft";
import RightContent from "./AboutHeroRight";

export default function Hero() {
  return (
    <section className="w-full min-h-screen bg-gradient-to-br from-primary/15 to-blue-50 relative flex items-center justify-center overflow-hidden py-12">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary rounded-full"></div>
        <div className="absolute bottom-32 right-20 w-40 h-40 bg-primary-dark rounded-full"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-primary rounded-full"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <LeftContent />
          <RightContent />
        </div>
      </div>
    </section>
  );
}

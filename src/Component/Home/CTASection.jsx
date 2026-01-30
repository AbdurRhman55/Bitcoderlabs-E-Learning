// src/Component/Home/CTAModern.jsx
import React from "react";
import { FaCheck, FaArrowRight, FaPlay } from "react-icons/fa";
import Button from "../UI/Button";
import {CTA} from "../../../Data/Array"


export default function CTAModern() {
  return (
    <section className="py-24 bg-gradient-to-br from-[#0a192f] via-[#112d4e] to-[#3baee9]/10 relative overflow-hidden">
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-gradient-to-r from-primary to-primary-dark rounded-3xl p-8 md:p-12 shadow-2xl">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold mb-8">
              <FaCheck className="text-green-300" />
              Trusted by 50,000+ learners
            </div>

            {/* Heading */}
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Start Learning Today
              <span className="block text-indigo-100 text-xl md:text-2xl font-normal mt-4">
                Join thousands achieving their goals
              </span>
            </h2>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 max-w-2xl mx-auto">
              {CTA.map((feature, index) => (
                <div key={index} className="flex items-center gap-3 text-white/90">
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                    <FaCheck className="text-white text-xs" />
                  </div>
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button text="Get Started Free" />
              <Button text="Watch Demo" variant="outline"/>
            </div>

            {/* Bottom Text */}
            <p className="text-indigo-200 text-sm mt-8">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

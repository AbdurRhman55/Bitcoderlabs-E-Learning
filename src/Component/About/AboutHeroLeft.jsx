import React from "react";
/* eslint-disable-next-line no-unused-vars */
import { motion } from "framer-motion";
import { aboutArray } from "../../../Data/AboutArray";
import Button from "../UI/Button";

export default function LeftContent() {
  return (
    <motion.div
      className="text-center lg:text-left"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Top Badge */}
      <motion.div
        className="inline-flex items-center gap-2  text-white bg-primary px-4 py-2 rounded-full text-sm font-medium mb-6 backdrop-blur-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
        {aboutArray.topText}
      </motion.div>

      {/* Main Heading */}
      <motion.h1
        className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <span className="text-primary">Building Modern</span>
        <br />
        <span className="text-gray-800">& Innovative</span>
        <br />
        <span className="text-gray-800">Digital Solutions</span>
      </motion.h1>

      {/* Sub Heading */}
      <motion.p
        className="text-xl text-gray-600 leading-relaxed mb-8 max-w-2xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        {aboutArray.subHeading}
      </motion.p>

      {/* Buttons */}
      <motion.div
        className="flex flex-col sm:flex-row gap-4 mb-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Button 
          text={aboutArray.primaryBtn} 
          variant="primary" 
          size="sm"
          className="transform hover:scale-105 transition-all duration-300"
        />
        <Button 
          text={aboutArray.secondaryBtn} 
          variant="outline" 
          size="sm"
          className="border-gray-300 text-gray-700 hover:border-primary hover:text-primary transform hover:scale-105 transition-all duration-300"
        />
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        className="grid grid-cols-3 gap-6 max-w-md"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        {aboutArray.stats.map((stat, index) => (
          <div key={index} className="text-center lg:text-left">
            <div className="text-2xl font-bold text-primary">{stat.number}</div>
            <div className="text-gray-600 text-sm">{stat.label}</div>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}

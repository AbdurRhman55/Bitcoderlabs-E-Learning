import React from 'react';
import InstructorCard from './InstructorCard';
/* eslint-disable-next-line no-unused-vars */
import { motion } from 'framer-motion';
import { instructorsData } from '../../../Data/AboutArray';

export default function InstructorsSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="w-full bg-gradient-to-br from-primary-light via-white to-blue-50 py-20 px-4 md:px-8 relative overflow-hidden">

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-4 text-primary">
            Meet Our Instructors
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Learn from industry experts who are passionate about teaching and technology
          </p>
        </motion.div>

        {/* Instructor Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {instructorsData.map((instructor) => (
            <motion.div key={instructor.id} variants={itemVariants}>
              <InstructorCard instructor={instructor} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

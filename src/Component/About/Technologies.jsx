import React, { useState } from "react";
/* eslint-disable-next-line no-unused-vars */
import { motion, AnimatePresence } from "framer-motion";
import { technologies, techCategories } from "../../../Data/AboutArray";
import Button from "../UI/Button";
import CustomSlider from "../UI/Slider"; // Import your CustomSlider

export default function Technologies() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [hoveredTech, setHoveredTech] = useState(null);

  const filteredTechnologies =
    selectedCategory === "All"
      ? technologies
      : technologies.filter((tech) => tech.category === selectedCategory);

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="w-full bg-primary/15 py-20 px-6 relative overflow-hidden">
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-4 text-primary">
            Tech Stack & Learning Skills
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Technologies I work with to create amazing digital experiences
          </p>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {techCategories.map((category) => (
            <Button
              key={category}
              text={category}
              size="sm"
              rounded="full"
              onClick={() => setSelectedCategory(category)}
              className="md:!text-base"
              variant={selectedCategory === category ? "primary" : "outline"}
            />
          ))}
        </motion.div>

        {/* Technologies Slider - USING YOUR CUSTOMSLIDER */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <CustomSlider
              data={filteredTechnologies}
              slidesPerView={7}
              loop={true}
              autoplay={true}
              pagination={false}
              renderSlide={(tech) => {
                const IconComponent = tech.icon;
                return (
                  <motion.div
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    onHoverStart={() => setHoveredTech(tech.name)}
                    onHoverEnd={() => setHoveredTech(null)}
                    className="relative group cursor-pointer p-5  h-full"
                  >
                    {/* Tech Card - YOUR EXACT DESIGN */}
                    <div className={`flex flex-col items-center p-10 rounded-2xl bg-white border border-gray-300 shadow-lg transition-all duration-300 group-hover:border-primary/30 relative h-full ${
                      hoveredTech === tech.name ? 'backdrop-blur-sm' : ''
                    }`}>
                      
                      {/* Icon Container */}
                      <div className="relative p-4 rounded-2xl mb-3 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary-light">
                        <IconComponent
                          className="text-3xl transition-all duration-300 group-hover:scale-110"
                          style={{ color: tech.color }}
                        />

                        {/* Hover Effect Ring */}
                        <div className="absolute inset-0 rounded-2xl border-2 opacity-0 group-hover:opacity-100 transition-all duration-300 border-primary/50"></div>
                      </div>

                      {/* Tech Name */}
                      <span className="text-sm z-20 font-semibold text-gray-800 text-center group-hover:text-primary transition-colors duration-300">
                        {tech.name}
                      </span>

                      {/* Category Badge */}
                      <div className="absolute -top-2 -right-2 z-20">
                        <span className="text-xs px-2 py-1 rounded-full text-white font-medium bg-primary/90 backdrop-blur-sm">
                          {tech.category}
                        </span>
                      </div>

                      {/* Hover Overlay - Large Tech Name */}
                      <AnimatePresence>
                        {hoveredTech === tech.name && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{duration:1.2, ease: "easeOut"}}
                            className="absolute  inset-0 rounded-2xl flex items-center justify-center z-10"
                          >
                            <motion.span
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              transition={{duration:1, ease: "easeOut"}}
                              className="text-xl font-bold text-primary text-center bg-primary/20 backdrop-blur-sm px-4 py-2 rounded-lg border border-primary/50 shadow-lg"
                            >
                              {tech.name}
                            </motion.span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                );
              }}
            />
          </motion.div>
        </AnimatePresence>

        {/* Stats Section */}
        <motion.div
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <div className="text-center p-4 rounded-xl bg-white border border-gray-200 shadow-sm">
            <div className="text-2xl font-bold text-primary">
              {technologies.length}+
            </div>
            <div className="text-sm text-gray-600">Technologies</div>
          </div>
          <div className="text-center p-4 rounded-xl bg-white border border-gray-200 shadow-sm">
            <div className="text-2xl font-bold text-primary">
              {techCategories.length}
            </div>
            <div className="text-sm text-gray-600">Categories</div>
          </div>
          <div className="text-center p-4 rounded-xl bg-white border border-gray-200 shadow-sm">
            <div className="text-2xl font-bold text-primary">
              {
                technologies.filter((tech) => tech.category === "Frontend")
                  .length
              }
            </div>
            <div className="text-sm text-gray-600">Frontend</div>
          </div>
          <div className="text-center p-4 rounded-xl bg-white border border-gray-200 shadow-sm">
            <div className="text-2xl font-bold text-primary">
              {
                technologies.filter((tech) => tech.category === "Backend")
                  .length
              }
            </div>
            <div className="text-sm text-gray-600">Backend</div>
          </div>
        </motion.div>

        {/* Floating Elements */}
        <motion.div
          className="absolute -bottom-10 left-10 w-20 h-20 bg-primary rounded-full blur-xl opacity-10"
          animate={{
            y: [0, -20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -top-10 right-10 w-16 h-16 bg-primary-dark rounded-full blur-xl opacity-10"
          animate={{
            y: [0, 15, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </div>
    </section>
  );
}

import React from "react";
/* eslint-disable-next-line no-unused-vars */
import { motion } from "framer-motion";
import { aboutArray } from "../../../Data/AboutArray";

export default function RightContent() {
  return (
    <motion.div
      className="grid grid-cols-2 gap-6"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
    >
      {aboutArray.features.map((feature, index) => {
        const IconComponent = feature.icon;
        return (
          <motion.div
            key={index}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-300 hover:shadow-xl transition-all duration-300"
            whileHover={{ y: -5 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center mb-4">
              <IconComponent className="text-primary text-xl" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
            <p className="text-gray-600 text-sm">{feature.description}</p>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
import React, { useState } from "react";
import { Syllabus } from "../../../../Data/Courses.Array";
import HeaderSection from "./HeaderSection";
import ModuleCard from "./ModuleCard";
import DownloadSection from "./DownloadSection";

const CurriculumSection = ({ course }) => {
  const [expandedModule, setExpandedModule] = useState(null);
  const toggleModule = (id) =>
    setExpandedModule(expandedModule === id ? null : id);

  // Use dynamic modules if available, otherwise fall back to dummy data
  const modules = Array.isArray(course?.modules) ? course.modules : (Syllabus.modules || []);

  return (
    <div className="max-w-6xl mx-auto py-20 px-4">
      <HeaderSection Syllabus={course?.modules ? { modules: course.modules } : Syllabus} />
      <div className="space-y-6">
        {modules.map((module, index) => (
          <ModuleCard
            key={module.id || index}
            module={module}
            index={index}
            expandedModule={expandedModule}
            toggleModule={toggleModule}
          />
        ))}
      </div>
      <DownloadSection />
    </div>
  );
};

export default CurriculumSection;

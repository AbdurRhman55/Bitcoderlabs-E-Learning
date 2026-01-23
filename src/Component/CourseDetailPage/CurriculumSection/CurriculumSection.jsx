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
  // Normalize backend data to match component expectations
  const rawModules = Array.isArray(course?.modules) ? course.modules : (Syllabus.modules || []);

  const modules = rawModules.map(module => ({
    ...module,
    id: module.id,
    title: module.title,
    description: module.description,
    lessons: module.lessons_count || module.lessons?.length || 0,
    duration: module.duration,
    progress: module.progress_percentage || 0,
    lessonsList: Array.isArray(module.lessons)
      ? module.lessons.map(lesson => ({
        ...lesson,
        name: lesson.title, // Map 'title' to 'name' as expected by LessonItem
        duration: lesson.duration,
        type: lesson.type,
        completed: lesson.is_completed
      }))
      : (Array.isArray(module.lessonsList) ? module.lessonsList : [])
  }));

  const totalLessons = modules.reduce((acc, m) => acc + (m.lessons || 0), 0);
  const total = [
    { title: "modules", value: modules.length },
    { title: "lessons", value: totalLessons },
    { title: "duration", value: course.duration || "N/A" },
    { title: "projects", value: modules.filter(m => m.title.toLowerCase().includes('project')).length } // Simple heuristic for projects
  ];

  return (
    <div className="max-w-6xl mx-auto py-20 px-4">
      <HeaderSection Syllabus={{ total, modules }} />
      <div className="space-y-6">
        {modules.map((module, index) => (
          <ModuleCard
            key={module.id || index}
            module={module}
            index={index}
            courseId={course.id}
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

import React, { useState, useEffect } from "react";
import { Syllabus } from "../../../../Data/Courses.Array";
import HeaderSection from "./HeaderSection";
import ModuleCard from "./ModuleCard";
import DownloadSection from "./DownloadSection";
import { apiClient } from "../../../api/index";

const CurriculumSection = ({ course, isEnrolled }) => {
  const [expandedModule, setExpandedModule] = useState(null);
  const [completedLessonIds, setCompletedLessonIds] = useState(new Set());

  useEffect(() => {
    const fetchProgress = async () => {
      if (!isEnrolled) return;

      try {
        const response = await apiClient.getUserProgress();

        console.log("Progress:", response);

        const progressData = Array.isArray(response) ? response : [];

        const ids = new Set(
          progressData
            .filter((p) => p.is_completed == 1)
            .map((p) => String(p.course_lesson_id)),
        );

        setCompletedLessonIds(ids);
      } catch (err) {
        console.error("Progress Fetch Failed:", err);
      }
    };

    fetchProgress();
  }, [isEnrolled]);

  const toggleModule = (id) =>
    setExpandedModule(expandedModule === id ? null : id);

  // Use dynamic modules if available, otherwise fall back to dummy data
  // Normalize backend data to match component expectations
  const rawModules = Array.isArray(course?.modules)
    ? course.modules
    : Syllabus.modules || [];
  console.log(rawModules);

  const modules = rawModules.map((module) => {
    // Process lessons first to determine completion status
    const lessonsList = Array.isArray(module.lessons)
      ? module.lessons.map((lesson) => {
          const lId = String(lesson.id || lesson.lesson_id);
          const isCompleted =
            completedLessonIds.has(lId) || lesson.is_completed;
          return {
            ...lesson,
            name: lesson.title,
            duration: lesson.duration,
            type: lesson.type,
            completed: isCompleted,
            id: lesson.id,
          };
        })
      : Array.isArray(module.lessonsList)
        ? module.lessonsList
        : [];

    const totalLessonsCount = lessonsList.length;
    const completedCount = lessonsList.filter((l) => l.completed).length;
    // Calculate dynamic progress if lessons exist, else default to backend value or 0
    const dynamicProgress =
      totalLessonsCount > 0
        ? Math.round((completedCount / totalLessonsCount) * 100)
        : module.progress_percentage || 0;

    return {
      ...module,
      id: module.id,
      title: module.title,
      description: module.description,
      lessons: totalLessonsCount, // Use accurate count
      duration: module.duration,
      progress: dynamicProgress, // Use calculated progress
      // expose counts for UI (completed / total)
      completedLessons: completedCount,
      totalLessons: totalLessonsCount,
      lessonsList: lessonsList,
    };
  });

  const totalLessons = modules.reduce((acc, m) => acc + (m.lessons || 0), 0);
  const total = [
    { title: "modules", value: modules.length },
    { title: "lessons", value: totalLessons },
    { title: "duration", value: course.duration || "N/A" },
    {
      title: "projects",
      value: modules.filter((m) => m.title.toLowerCase().includes("project"))
        .length,
    }, // Simple heuristic for projects
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
            isEnrolled={isEnrolled}
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

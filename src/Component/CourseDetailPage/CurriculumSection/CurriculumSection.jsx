import React, { useState, useEffect } from "react";
import { Syllabus } from "../../../../Data/Courses.Array";
import HeaderSection from "./HeaderSection";
import ModuleCard from "./ModuleCard";
import DownloadSection from "./DownloadSection";
import { apiClient } from "../../../api/index";

const CurriculumSection = ({ course, isEnrolled }) => {
  const [expandedModule, setExpandedModule] = useState(null);
  const [completedLessonIds, setCompletedLessonIds] = useState(new Set());
  const [moduleProgressData, setModuleProgressData] = useState({});
  const [loading, setLoading] = useState(false);

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

  // Fetch module progress for each module when user is enrolled
  useEffect(() => {
    const fetchModuleProgressData = async () => {
      if (!isEnrolled || !course?.modules || course.modules.length === 0) return;

      setLoading(true);
      try {
        const progressPromises = course.modules.map((module) =>
          apiClient.getModuleProgress(module.id)
            .then((data) => ({
              moduleId: module.id,
              progress: data.data || data,
            }))
            .catch((err) => {
              console.error(`Failed to fetch progress for module ${module.id}:`, err);
              return {
                moduleId: module.id,
                progress: null,
              };
            })
        );

        const results = await Promise.all(progressPromises);
        const progressMap = {};
        results.forEach(({ moduleId, progress }) => {
          if (progress) {
            progressMap[moduleId] = progress;
          }
        });

        setModuleProgressData(progressMap);
      } catch (err) {
        console.error("Module Progress Fetch Failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchModuleProgressData();
  }, [isEnrolled, course?.modules]);

  const toggleModule = (id) =>
    setExpandedModule(expandedModule === id ? null : id);

  // Use dynamic modules if available, otherwise fall back to dummy data
  // Normalize backend data to match component expectations
  const rawModules = Array.isArray(course?.modules)
    ? course.modules
    : Syllabus.modules || [];
  console.log(rawModules);

  const modules = rawModules.map((module) => {
    // Get module progress from API if available
    const apiModuleProgress = moduleProgressData[module.id];

    // If we have API progress data, use it
    if (apiModuleProgress) {
      const lessonsList = (apiModuleProgress.lessons || []).map((lesson) => ({
        id: lesson.id,
        name: lesson.title,
        title: lesson.title,
        description: lesson.description,
        duration: lesson.duration,
        type: lesson.type,
        completed: lesson.is_completed,
      }));

      return {
        ...module,
        id: module.id,
        title: module.title,
        description: module.description,
        lessons: apiModuleProgress.total_lessons,
        duration: module.duration,
        progress: apiModuleProgress.progress_percentage,
        completedLessons: apiModuleProgress.completed_lessons,
        totalLessons: apiModuleProgress.total_lessons,
        lessonsList: lessonsList,
      };
    }

    // Fallback to calculated progress based on local completion tracking
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

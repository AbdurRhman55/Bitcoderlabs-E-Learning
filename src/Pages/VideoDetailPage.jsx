import React, { useState, useEffect } from "react";
import {
  useParams,
  useSearchParams,
  Link,
  useNavigate,
} from "react-router-dom";
import VideoDetail from "../Component/VideoDetail/VideoDetail";
import { apiClient, API_ORIGIN } from "../api/index";
import Swal from "sweetalert2";
import { useSelector, useDispatch } from "react-redux";
import { updateCourseProgress } from "../../slices/courseSlice";

const VideoDetailPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { id: lessonId } = useParams();
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get("courseId");
  const dispatch = useDispatch();
  const [enrollmentId, setEnrollmentId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [videoData, setVideoData] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [error, setError] = useState(null);

  const getYoutubeId = (url) => {
    if (!url) return null;
    const ytMatch = String(url).match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i,
    );
    return ytMatch ? ytMatch[1] : null;
  };

  const getLessonThumbnail = (lesson, courseImage = null) => {
    const videoUrl =
      lesson.video_url ||
      lesson.file_path ||
      lesson.video ||
      lesson.url ||
      lesson.resolvedUrl;
    const ytId = getYoutubeId(videoUrl);
    if (ytId) {
      return `https://img.youtube.com/vi/${ytId}/mqdefault.jpg`;
    }
    return resolveMediaUrl(
      lesson.image || lesson.thumbnail || courseImage,
      "image",
    );
  };

  const resolveMediaUrl = (url, type = "video") => {
    if (!url) {
      return type === "video"
        ? "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
        : "https://via.placeholder.com/640x360?text=No+Thumbnail";
    }

    const stringUrl = String(url).trim();

    // Handle external links including those without protocol
    if (
      stringUrl.startsWith("http") ||
      stringUrl.startsWith("data") ||
      stringUrl.includes("youtube.com") ||
      stringUrl.includes("youtu.be") ||
      stringUrl.includes("vimeo.com")
    ) {
      return stringUrl.startsWith("http")
        ? stringUrl
        : `https://${stringUrl.replace(/^https?:\/\//, "")}`;
    }

    const cleanPath = stringUrl.startsWith("/")
      ? stringUrl.slice(1)
      : stringUrl;
    if (cleanPath.startsWith("storage/")) {
      return `${API_ORIGIN}/${cleanPath}`;
    }
    return `${API_ORIGIN}/storage/${cleanPath}`;
  };

  useEffect(() => {
    const fetchLessonData = async () => {
      if (!courseId) {
        setError("Course ID missing");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // --- SECURITY CHECK ---
        if (!isAuthenticated) {
          Swal.fire({
            title: "Login Required",
            text: "Please login to access course videos.",
            icon: "info",
            confirmButtonText: "Go to Login",
            confirmButtonColor: "#3baee9",
          }).then(() => {
            navigate("/login");
          });
          return;
        }

        // Check enrollment status
        const enrollResponse = await apiClient.getMyEnrollments();
        const enrollments = Array.isArray(enrollResponse)
          ? enrollResponse
          : enrollResponse.data || [];
        const currentEnrollment = enrollments.find(
          (e) =>
            String(e.course_id) === String(courseId) &&
            (e.status === "approved" || e.status === "active"),
        );

        if (currentEnrollment) {
          setEnrollmentId(currentEnrollment.id);
        }

        if (!currentEnrollment) {
          Swal.fire({
            title: "Course Locked",
            text: "You haven't enrolled in this course yet, or your enrollment is pending approval.",
            icon: "warning",
            confirmButtonText: "Enroll Now",
            showCancelButton: true,
            confirmButtonColor: "#3baee9",
          }).then((result) => {
            if (result.isConfirmed) {
              navigate(`/Enroll/${courseId}`);
            } else {
              navigate(`/CourseDetail/${courseId}`);
            }
          });
          return;
        }
        // --- END SECURITY CHECK ---

        const response = await apiClient.getCourseById(courseId);
        // Handle different potential API response structures
        const course = response.data?.data || response.data || response;
        console.log("Course Data fetched:", course);

        if (course.modules.length === 0) {
          setError("No modules found for this course.");
          return;
        }

        // Flatten modules as lessons
        const allLessons = [];
        let currentLesson = null;

        // Better video URL extraction helper - updated for course_lessons table
        const getBestVideoUrl = (lesson) => {
          return (
            lesson.content_url || // Direct match for your table
            lesson.video_url ||
            lesson.file_path ||
            lesson.video ||
            lesson.url ||
            lesson.lesson_url ||
            null
          );
        };

        // Better duration formatter
        const formatDuration = (d) => {
          if (!d) return "00:00";
          if (typeof d === "string" && d.includes(":")) return d;
          const mins = Math.floor(d / 60);
          const secs = d % 60;
          return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
        };

        course.modules.forEach((module) => {
          // Access lessons specifically if the array exists, otherwise treat module as lesson
          const lessons = Array.isArray(module.lessons)
            ? module.lessons
            : Array.isArray(module.lessonsList)
              ? module.lessonsList
              : Array.isArray(module.course_lessons)
                ? module.course_lessons
                : [module];

          lessons.forEach((lesson) => {
            const lessonWithModule = {
              ...lesson,
              moduleTitle: module.title || "Course Module",
              resolvedUrl: getBestVideoUrl(lesson),
            };
            allLessons.push(lessonWithModule);

            // ID comparison: lesson.id or lesson.lesson_id or just id
            const lId = (
              lesson.id ||
              lesson.lesson_id ||
              lesson._id
            )?.toString();
            if (lId === lessonId) {
              currentLesson = lessonWithModule;
            }
          });
        });

        if (!currentLesson) {
          console.error("Lesson search failed among:", allLessons);
          setError("Lesson not found.");
          return;
        }

        console.log("Current Lesson Found:", currentLesson);

        setVideoData({
          id: currentLesson.id,
          title: currentLesson.title || currentLesson.name || course.title,
          views: currentLesson.views || "Dynamic",
          date: new Date(
            currentLesson.created_at || course.created_at || Date.now(),
          ).toLocaleDateString(),
          description:
            currentLesson.description || course.description || "No description",
          fullDescription:
            currentLesson.content ||
            currentLesson.description ||
            course.description ||
            "",
          videoUrl: resolveMediaUrl(
            currentLesson.resolvedUrl || course.video_url,
            "video",
          ),
          thumbnail: getLessonThumbnail(currentLesson, course.image),
          references: currentLesson.resources || [],
          moduleTitle: currentLesson.moduleTitle,
        });

        setRelatedVideos(
          allLessons
            .filter(
              (l) => (l.id || l.lesson_id || l._id)?.toString() !== lessonId,
            )
            .map((l) => ({
              id: l.id || l.lesson_id || l._id,
              title: l.title || l.name,
              author: course.instructor?.name || "Instructor",
              date: new Date(l.created_at || Date.now()).toLocaleDateString(),
              duration: formatDuration(l.duration || l.time),
              videoUrl: resolveMediaUrl(
                l.resolvedUrl || course.video_url,
                "video",
              ),
              thumbnail: getLessonThumbnail(l, course.image),
              courseId: course.id,
              moduleTitle: l.moduleTitle,
            })),
        );
      } catch (err) {
        console.error("Error fetching course data:", err);
        setError("Failed to load course data.");
      } finally {
        setLoading(false);
      }
    };

    fetchLessonData();
  }, [courseId, lessonId]);

  const comments = [
    {
      id: 1,
      name: "Student",
      time: "Recently",
      comment: "This was very helpful!",
      replies: [],
    },
  ];

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );

  if (error || !videoData)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-red-500">
        <p className="text-xl mb-4">{error || "Something went wrong"}</p>
        <Link
          to="/courses"
          className="px-6 py-2 bg-primary text-white rounded-full hover:bg-primary-dark transition"
        >
          Back to Courses
        </Link>
      </div>
    );

  const handleVideoEnded = async () => {
    if (!enrollmentId || !courseId) {
      console.error(
        "No enrollment ID or course ID found. Cannot update progress.",
      );
      Swal.fire({
        title: "Error",
        text: "Unable to track progress. Please refresh and try again.",
        icon: "error",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
      });
      return;
    }

    try {
      // --- IDENTITY CHECK: ensure we don't double-count the same lesson ---
      try {
        const userProgressResp = await apiClient.getUserProgress({
          course_lesson_id: lessonId,
        });
        const userProgress = Array.isArray(userProgressResp)
          ? userProgressResp
          : (userProgressResp && userProgressResp.data) || [];

        const alreadyCompleted = userProgress.some((p) => {
          const pid = String(
            p.course_lesson_id || p.lesson_id || p.id || p.course_lesson_id,
          );
          return (
            pid === String(lessonId) &&
            (p.is_completed == 1 || p.is_completed === true)
          );
        });

        if (alreadyCompleted) {
          console.log("Lesson already completed — not incrementing progress.");
          Swal.fire({
            title: "Lesson already marked complete",
            text: "You have already completed this lesson; progress unchanged.",
            icon: "info",
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 2500,
          });
          return;
        }
      } catch (checkErr) {
        console.warn(
          "Could not verify prior lesson completion, proceeding cautiously.",
          checkErr,
        );
      }
      // --- PERSIST PROGRESS ---
      // 1. Mark lesson as completed on server
      try {
        await apiClient.updateUserProgress(lessonId, true, 0);
        console.log("✅ Lesson marked as completed on server");
      } catch (markErr) {
        console.warn("Failed to mark lesson completed on server:", markErr);
      }

      // 2. Fetch latest enrollment to get the accurate server-calculated progress
      // This solves the 99% vs 100% rounding issues by using the server's source of truth.
      const latestEnrollResponse = await apiClient.getMyEnrollments();
      const latestEnrollments = Array.isArray(latestEnrollResponse)
        ? latestEnrollResponse
        : (latestEnrollResponse && latestEnrollResponse.data) || [];

      const updatedEnrollment = latestEnrollments.find(e => String(e.id) === String(enrollmentId));
      const newProgress = updatedEnrollment ? (updatedEnrollment.progress_percentage || 0) : 0;

      console.log(`📊 Progress updated by server: ${newProgress}%`);

      // Update local state/store
      dispatch(
        updateCourseProgress({
          enrollmentId,
          progress: newProgress,
        }),
      );

      // --- GENERATE CERTIFICATE ON COMPLETION ---
      if (newProgress >= 100) {
        try {
          console.log("🎓 Course completed (100%)! Certificate should be ready...");
          const certResponse = await apiClient.generateCertificate(courseId);
          console.log("✅ Certificate status:", certResponse);

          Swal.fire({
            title: '🎉 Congratulations!',
            html: `
              <div style="padding: 10px;">
                <p style="font-size: 1.1rem; color: #444;">You have successfully completed <b>${videoData?.title || 'this course'}</b>!</p>
                <div style="font-size: 3.5rem; margin: 25px 0;">🎓</div>
                <p style="color: #666;">Your hard work has paid off. Your official certificate is now available.</p>
              </div>
            `,
            icon: 'success',
            showCancelButton: true,
            confirmButtonText: '<i class="fas fa-certificate"></i> View Certificate',
            cancelButtonText: 'Continue Learning',
            confirmButtonColor: '#c9a227',
            cancelButtonColor: '#e0e0e0',
            buttonsStyling: true,
            customClass: {
              confirmButton: 'btn btn-primary',
              cancelButton: 'btn btn-secondary text-dark'
            },
            background: '#fff',
            backdrop: `
              rgba(0,0,123,0.4)
              url("https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHY1YmZ1NGRwZHA5Z3B3Z2p3ZWp3ZWp3ZWp3ZWp3ZWp3ZWp3ZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/3o7TKDkDbIDJieKbVm/giphy.gif")
              left top
              no-repeat
            `
          }).then((result) => {
            if (result.isConfirmed) {
              navigate("/student-dashboard/certificates");
            }
          });
          return;
        } catch (certErr) {
          console.error("⚠️ Certificate check/generation failed:", certErr);
          Swal.fire({
            title: "Certificate Pending",
            text: certErr.message || "We encountered an issue generating your certificate. Please contact support or try again later from your dashboard.",
            icon: "warning",
            confirmButtonColor: "#3baee9",
          });
        }
      }

      Swal.fire({
        title: "Lesson Completed!",
        text: `Progress updated: ${newProgress}%`,
        icon: "success",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
      });
    } catch (err) {
      console.error("Error updating progress:", err);
      Swal.fire({
        title: "Update Failed",
        text: "Could not update progress. Please try again.",
        icon: "error",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
      });
    }
  };

  return (
    <VideoDetail
      videoData={videoData}
      comments={comments}
      relatedVideos={relatedVideos}
      onVideoEnded={handleVideoEnded}
    />
  );
};

export default VideoDetailPage;

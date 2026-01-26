import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import VideoDetail from '../Component/VideoDetail/VideoDetail';
import { apiClient, API_ORIGIN } from '../api/index';

const VideoDetailPage = () => {
    const { id: lessonId } = useParams();
    const [searchParams] = useSearchParams();
    const courseId = searchParams.get('courseId');

    const [loading, setLoading] = useState(true);
    const [videoData, setVideoData] = useState(null);
    const [relatedVideos, setRelatedVideos] = useState([]);
    const [error, setError] = useState(null);

    const getYoutubeId = (url) => {
        if (!url) return null;
        const ytMatch = String(url).match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i);
        return ytMatch ? ytMatch[1] : null;
    };

    const getLessonThumbnail = (lesson, courseImage = null) => {
        const videoUrl = lesson.video_url || lesson.file_path || lesson.video || lesson.url || lesson.resolvedUrl;
        const ytId = getYoutubeId(videoUrl);
        if (ytId) {
            return `https://img.youtube.com/vi/${ytId}/mqdefault.jpg`;
        }
        return resolveMediaUrl(lesson.image || lesson.thumbnail || courseImage, 'image');
    };

    const resolveMediaUrl = (url, type = 'video') => {
        if (!url) {
            return type === 'video'
                ? 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
                : 'https://via.placeholder.com/640x360?text=No+Thumbnail';
        }

        const stringUrl = String(url).trim();

        // Handle external links including those without protocol
        if (
            stringUrl.startsWith('http') ||
            stringUrl.startsWith('data') ||
            stringUrl.includes('youtube.com') ||
            stringUrl.includes('youtu.be') ||
            stringUrl.includes('vimeo.com')
        ) {
            return stringUrl.startsWith('http') ? stringUrl : `https://${stringUrl.replace(/^https?:\/\//, '')}`;
        }

        const cleanPath = stringUrl.startsWith('/') ? stringUrl.slice(1) : stringUrl;
        if (cleanPath.startsWith('storage/')) {
            return `${API_ORIGIN}/${cleanPath}`;
        }
        return `${API_ORIGIN}/storage/${cleanPath}`;
    };

    useEffect(() => {
        const fetchLessonData = async () => {
            if (!courseId) {
                setError('Course ID missing');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const response = await apiClient.getCourseById(courseId);
                // Handle different potential API response structures
                const course = response.data?.data || response.data || response;
                console.log("Course Data fetched:", course);

                if (course.modules.length === 0) {
                    setError('No modules found for this course.');
                    return;
                }

                // Flatten modules as lessons
                const allLessons = [];
                let currentLesson = null;

                // Better video URL extraction helper - updated for course_lessons table
                const getBestVideoUrl = (lesson) => {
                    return lesson.content_url || // Direct match for your table
                        lesson.video_url ||
                        lesson.file_path ||
                        lesson.video ||
                        lesson.url ||
                        lesson.lesson_url ||
                        null;
                };

                // Better duration formatter
                const formatDuration = (d) => {
                    if (!d) return '00:00';
                    if (typeof d === 'string' && d.includes(':')) return d;
                    const mins = Math.floor(d / 60);
                    const secs = d % 60;
                    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
                };

                course.modules.forEach((module) => {
                    // Access lessons specifically if the array exists, otherwise treat module as lesson
                    const lessons = Array.isArray(module.lessons) ? module.lessons :
                        Array.isArray(module.lessonsList) ? module.lessonsList :
                            Array.isArray(module.course_lessons) ? module.course_lessons :
                                [module];

                    lessons.forEach((lesson) => {
                        const lessonWithModule = {
                            ...lesson,
                            moduleTitle: module.title || 'Course Module',
                            resolvedUrl: getBestVideoUrl(lesson)
                        };
                        allLessons.push(lessonWithModule);

                        // ID comparison: lesson.id or lesson.lesson_id or just id
                        const lId = (lesson.id || lesson.lesson_id || lesson._id)?.toString();
                        if (lId === lessonId) {
                            currentLesson = lessonWithModule;
                        }
                    });
                });

                if (!currentLesson) {
                    console.error("Lesson search failed among:", allLessons);
                    setError('Lesson not found.');
                    return;
                }

                console.log("Current Lesson Found:", currentLesson);

                setVideoData({
                    id: currentLesson.id,
                    title: currentLesson.title || currentLesson.name || course.title,
                    views: currentLesson.views || 'Dynamic',
                    date: new Date(currentLesson.created_at || course.created_at || Date.now()).toLocaleDateString(),
                    description: currentLesson.description || course.description || 'No description',
                    fullDescription: currentLesson.content || currentLesson.description || course.description || '',
                    videoUrl: resolveMediaUrl(currentLesson.resolvedUrl || course.video_url, 'video'),
                    thumbnail: getLessonThumbnail(currentLesson, course.image),
                    references: currentLesson.resources || [],
                    moduleTitle: currentLesson.moduleTitle,
                });

                setRelatedVideos(
                    allLessons
                        .filter((l) => (l.id || l.lesson_id || l._id)?.toString() !== lessonId)
                        .map((l) => ({
                            id: l.id || l.lesson_id || l._id,
                            title: l.title || l.name,
                            author: course.instructor?.name || 'Instructor',
                            date: new Date(l.created_at || Date.now()).toLocaleDateString(),
                            duration: formatDuration(l.duration || l.time),
                            videoUrl: resolveMediaUrl(l.resolvedUrl || course.video_url, 'video'),
                            thumbnail: getLessonThumbnail(l, course.image),
                            courseId: course.id,
                            moduleTitle: l.moduleTitle,
                        }))
                );
            } catch (err) {

                console.error('Error fetching course data:', err);
                setError('Failed to load course data.');
            } finally {
                setLoading(false);
            }
        };

        fetchLessonData();
    }, [courseId, lessonId]);

    const comments = [
        { id: 1, name: 'Student', time: 'Recently', comment: 'This was very helpful!', replies: [] },
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
                <p className="text-xl mb-4">{error || 'Something went wrong'}</p>
                <Link
                    to="/courses"
                    className="px-6 py-2 bg-primary text-white rounded-full hover:bg-primary-dark transition"
                >
                    Back to Courses
                </Link>
            </div>
        );

    return <VideoDetail videoData={videoData} comments={comments} relatedVideos={relatedVideos} />;
};

export default VideoDetailPage;

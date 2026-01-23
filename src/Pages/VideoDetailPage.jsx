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

    const resolveMediaUrl = (url, type = 'video') => {
        if (!url) {
            return type === 'video'
                ? 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
                : 'https://via.placeholder.com/640x360?text=No+Thumbnail';
        }
        if (url.startsWith('http') || url.startsWith('data')) return url;
        const cleanPath = url.startsWith('/') ? url.slice(1) : url;
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
                const course = response.data.data; // Always use data from API
                console.log(course.modules);

                if (course.modules.length === 0) {
                    setError('No modules found for this course.');
                    return;
                }

                // Flatten modules as lessons (if modules don't have lessons)
                const allLessons = [];
                let currentLesson = null;

                course.modules.forEach((module) => {
                    // If module has lessons array, use that, else treat module as lesson
                    const lessons = module.lessons && module.lessons.length > 0 ? module.lessons : [module];
                    lessons.forEach((lesson) => {
                        const lessonWithModule = { ...lesson, moduleTitle: module.title };
                        allLessons.push(lessonWithModule);
                        if (lesson.id.toString() === lessonId) currentLesson = lessonWithModule;
                    });
                });

                if (!currentLesson) {
                    setError('Lesson not found.');
                    return;
                }


                setVideoData({
                    id: currentLesson.id,
                    title: currentLesson.title || course.title,
                    views: currentLesson.views || 'Dynamic',
                    date: new Date(currentLesson.created_at || course.created_at || Date.now()).toLocaleDateString(),
                    description: currentLesson.description || course.description || 'No description',
                    fullDescription: currentLesson.content || currentLesson.description || course.description || '',
                    videoUrl: resolveMediaUrl(currentLesson.video_url || course.video_url, 'video'),
                    references: currentLesson.resources || [],
                    moduleTitle: currentLesson.moduleTitle,
                });

                setRelatedVideos(
                    allLessons
                        .filter((lesson) => lesson.id.toString() !== lessonId)
                        .map((lesson) => ({
                            id: lesson.id,
                            title: lesson.title,
                            author: course.instructor?.name || 'Instructor',
                            date: new Date(lesson.created_at || Date.now()).toLocaleDateString(),
                            duration: lesson.duration || '00:00',
                            videoUrl: resolveMediaUrl(lesson.video_url || course.video_url, 'video'),
                            thumbnail: resolveMediaUrl(course.image, 'image'),
                            courseId: course.id,
                            moduleTitle: lesson.moduleTitle,
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

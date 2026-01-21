import React, { useRef, useState, useMemo } from "react";
import { FaPlay, FaClock, FaUser, FaStar } from "react-icons/fa";
import { API_ORIGIN } from "../../../api/index";

export default function LeftVideo({ course }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const playPromiseRef = useRef(null);

  const togglePlay = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      try {
        // Track the play promise to handle interruptions
        playPromiseRef.current = videoRef.current.play();
        await playPromiseRef.current;
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Video play failed:", err);
        }
      }
    } else {
      // If we're playing or still trying to play, we pause
      // Note: We don't need to await pause()
      videoRef.current.pause();
    }
  };

  const handleVideoStateChange = () => {
    if (videoRef.current) {
      setIsPlaying(!videoRef.current.paused);
    }
  };

  const resolveMediaUrl = (url, type = 'video') => {
    if (!url) {
      console.log('this is test');

      return type === 'video'
        ? "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
        : "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=1000&q=80";
    }
    if (url.startsWith('http')) return url;
    if (url.startsWith('data')) return url;

    // Handle paths stored in database (e.g., 'courses/videos/filename.mp4')
    const cleanPath = url.startsWith('/') ? url.substring(1) : url;
    console.log('clean path:', cleanPath);
    return `${API_ORIGIN}/storage/${cleanPath}`;
  };

  const videoUrl = useMemo(() => resolveMediaUrl(course?.video_url, 'video'), [course?.video_url]);

  // Helper to detect and convert YouTube URLs
  const getVideoType = (url) => {
    if (!url) return 'mp4';
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
    if (url.includes('vimeo.com')) return 'vimeo';
    return 'mp4';
  };

  const convertToEmbedUrl = (url) => {
    if (!url) return null;

    // YouTube
    if (url.includes('youtube.com/watch')) {
      const videoId = new URL(url).searchParams.get('v');
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1].split('?')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }

    // Vimeo
    if (url.includes('vimeo.com/')) {
      const videoId = url.split('vimeo.com/')[1].split('?')[0];
      return `https://player.vimeo.com/video/${videoId}`;
    }

    return url;
  };

  const videoType = useMemo(() => getVideoType(videoUrl), [videoUrl]);
  const embedUrl = useMemo(() => convertToEmbedUrl(videoUrl), [videoUrl]);
  const posterUrl = useMemo(() => resolveMediaUrl(course?.image, 'image'), [course?.image]);

  return (
    <div className="space-y-6">
      {/*  Header */}
      <div className="text-center lg:text-left">
        <div className="inline-flex items-center gap-2 bg-primary-dark text-white px-4 py-2 rounded-full text-sm font-medium mb-3">
          <FaPlay className="text-xs" />
          Free Course Preview
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
          See The Course <span className="text-primary">In Action</span>
        </h2>
        <p className="text-gray-600 text-base sm:text-lg">
          Get a real taste of our teaching style and course quality.
        </p>
        {/* Debug info - remove after testing */}
        <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
          <strong>Debug:</strong> Video URL: {videoUrl}
        </div>
      </div>

      {/*  Video Player */}
      <div className="relative group">
        <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity"></div>
        <div className="relative rounded-2xl overflow-hidden shadow-2xl">
          {videoType === 'youtube' || videoType === 'vimeo' ? (
            // YouTube/Vimeo iframe
            <iframe
              src={embedUrl}
              className="w-full aspect-video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Course Preview Video"
            />
          ) : (
            // Regular MP4 video
            <video
              ref={videoRef}
              key={videoUrl}
              className="w-full aspect-video object-cover cursor-pointer"
              poster={posterUrl}
              onClick={togglePlay}
              onPlay={handleVideoStateChange}
              onPause={handleVideoStateChange}
              onEnded={() => setIsPlaying(false)}
              onError={(e) => {
                console.error('Video error:', e);
                console.error('Video src:', videoUrl);
                console.error('Error details:', e.target.error);
              }}
              onLoadedData={() => console.log('Video loaded successfully')}
              preload="metadata"
              controls={isPlaying}
              playsInline
            >
              <source
                src={videoUrl}
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
          )}

          {/* Play button overlay - only show for MP4 videos */}
          {videoType === 'mp4' && !isPlaying && (
            <button
              onClick={togglePlay}
              className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-all"
            >
              <div className="bg-white/20 backdrop-blur-sm p-6 rounded-full cursor-pointer border border-white/30 group-hover:scale-110 transition-transform duration-300">
                <div className="bg-gradient-to-r from-primary to-primary-dark p-4 rounded-full shadow-2xl">
                  <FaPlay className="text-white text-xl ml-1" />
                </div>
              </div>
            </button>
          )}
        </div>
      </div>

      {/*  Stats Section */}
      <div className="flex flex-wrap justify-center lg:justify-start gap-4 sm:gap-8 text-sm">
        {[
          {
            icon: <FaClock className="text-primary text-sm" />,
            color: "bg-primary-light",
            title: course?.duration || "15:30",
            label: "Duration",
          },
          {
            icon: <FaUser className="text-primary text-sm" />,
            color: "bg-primary-light",
            title: course?.students_count || "12.5K",
            label: "Students",
          },
          {
            icon: <FaStar className="text-primary text-sm" />,
            color: "bg-primary-light",
            title: `${Number(course?.rating || 4.8).toFixed(1)}/5`,
            label: "Rating",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-3 bg-white px-4 py-3 rounded-xl shadow-sm border border-gray-100 flex-1 sm:flex-none min-w-[120px]"
          >
            <div className={`p-2 rounded-lg ${item.color}`}>{item.icon}</div>
            <div>
              <div className="font-semibold text-gray-900">{item.title}</div>
              <div className="text-gray-500 text-xs">{item.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

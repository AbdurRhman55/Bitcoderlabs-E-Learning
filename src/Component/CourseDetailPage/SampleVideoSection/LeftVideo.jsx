import React, { useRef, useState, useMemo, useEffect } from "react";
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
        playPromiseRef.current = videoRef.current.play();
        await playPromiseRef.current;
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Video play failed:", err);
        }
      }
    } else {
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
      return type === 'video'
        ? "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
        : "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=1000&q=80";
    }

    if (url.startsWith('http') || url.startsWith('data')) return url;

    // Handle paths stored in database
    const cleanPath = url.startsWith('/') ? url.substring(1) : url;
    return `${API_ORIGIN}/storage/${cleanPath}`;
  };

  // Always use course preview video
  const videoUrl = useMemo(() => {
    return resolveMediaUrl(course?.video_url, 'video');
  }, [course?.video_url]);

  const getVideoType = (url) => {
    if (!url) return 'mp4';
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
    if (url.includes('vimeo.com')) return 'vimeo';
    return 'mp4';
  };

  const convertToEmbedUrl = (url) => {
    if (!url) return null;
    let stringUrl = String(url).trim();

    // YouTube
    const ytMatch = stringUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i);
    if (ytMatch && ytMatch[1]) {
      return `https://www.youtube.com/embed/${ytMatch[1]}?rel=0&showinfo=0&autoplay=0`;
    }

    // Vimeo
    const vimeoMatch = stringUrl.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)([0-9]+)/i);
    if (vimeoMatch && vimeoMatch[1]) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }

    return url;
  };

  const getYoutubeId = (url) => {
    const ytMatch = String(url).match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i);
    return ytMatch ? ytMatch[1] : null;
  };

  const videoType = useMemo(() => getVideoType(videoUrl), [videoUrl]);
  const embedUrl = useMemo(() => convertToEmbedUrl(videoUrl), [videoUrl]);

  // Prioritize YouTube thumbnails for YT videos, else use provided thumbnail
  const finalThumbnail = useMemo(() => {
    if (videoType === 'youtube') {
      const id = getYoutubeId(videoUrl);
      if (id) return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
    }
    return resolveMediaUrl(course?.image, 'image');
  }, [course?.image, videoUrl, videoType]);

  const [isLoaded, setIsLoaded] = useState(false);

  // Reset load state when URL changes
  useEffect(() => {
    setIsLoaded(false);
  }, [videoUrl]);

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
      </div>

      {/*  Video Player Facade */}
      <div className="relative group">
        <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity"></div>
        <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-black aspect-video">
          {!isLoaded ? (
            <div
              className="w-full h-full cursor-pointer relative"
              onClick={() => setIsLoaded(true)}
            >
              <img
                src={finalThumbnail}
                alt="Video Thumbnail"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                onError={(e) => {
                  if (e.target.src.includes('maxresdefault')) {
                    e.target.src = e.target.src.replace('maxresdefault', 'hqdefault');
                  }
                }}
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center shadow-xl transform transition-transform group-hover:scale-110">
                  <FaPlay className="text-xl ml-1" />
                </div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-primary/40 rounded-full animate-ping" />
              </div>
            </div>
          ) : (
            <>
              {videoType === 'youtube' || videoType === 'vimeo' ? (
                <iframe
                  src={embedUrl + (embedUrl.includes('?') ? '&' : '?') + 'autoplay=1'}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="Course Preview Video"
                />
              ) : (
                <video
                  ref={videoRef}
                  src={videoUrl}
                  className="w-full h-full object-cover"
                  controls
                  autoPlay
                  playsInline
                />
              )}
            </>
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

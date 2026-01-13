import React, { useRef, useState } from "react";
import { FaPlay, FaClock, FaUser, FaStar } from "react-icons/fa";

export default function LeftVideo({ course }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (videoRef.current) {
      isPlaying ? videoRef.current.pause() : videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

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

      {/*  Video Player */}
      <div className="relative group">
        <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity"></div>
        <div className="relative rounded-2xl overflow-hidden shadow-2xl">
          <video
            ref={videoRef}
            className="w-full aspect-video object-cover cursor-pointer"
            poster="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=1000&q=80"
            onClick={togglePlay}
          >
            <source
              src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
              type="video/mp4"
            />
          </video>

          {!isPlaying && (
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

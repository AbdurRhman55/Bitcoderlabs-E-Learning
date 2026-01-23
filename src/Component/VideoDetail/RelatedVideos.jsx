import React from 'react';
import { Link } from 'react-router-dom';

const RelatedVideoCard = ({ video }) => {
    return (
        <Link
            to={`/video/${video.id}?courseId=${video.courseId}`}
            className="flex flex-col lg:flex-row group overflow-hidden bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
        >
            <div className="lg:w-2/5 relative overflow-hidden">
                <video
                    src={video.videoUrl}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute bottom-1 right-1 bg-black bg-opacity-70 text-white text-xs px-1 rounded">
                    {video.duration}
                </div>
            </div>
            <div className="lg:w-3/5 p-3">
                <h4 className="font-semibold text-gray-800 text-sm line-clamp-2 group-hover:text-primary">
                    {video.title}
                </h4>
                <p className="text-xs text-gray-600 mt-1">{video.author}</p>
                <p className="text-xs text-gray-500">{video.date}</p>
            </div>
        </Link>
    );
};

const RelatedVideos = ({ videos }) => {
    return (
        <div className="lg:space-y-4 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-1 gap-6 lg:gap-0 overflow-y-auto mx-auto lg:mx-0">
            {videos.map((video) => (
                <RelatedVideoCard key={video.id} video={video} />
            ))}
        </div>
    );
};

export default RelatedVideos;
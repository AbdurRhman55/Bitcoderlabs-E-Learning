import React from 'react';

const VideoMetadata = ({ views, date, title }) => {
    return (
        <>
            <div className="flex items-center text-sm text-gray-500 gap-2 mb-2">
                <span>{views} views</span>
                <span>{date}</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2 line-clamp-2">
                {title}
            </h2>
        </>
    );
};

export default VideoMetadata;
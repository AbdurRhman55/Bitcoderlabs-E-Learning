import React from 'react';

const VideoPlayer = ({ videoUrl }) => {
    return (
        <div className="aspect-w-16 aspect-h-9 mx-auto bg-black rounded-lg overflow-hidden mb-6">
            <video
                src={videoUrl}
                className="w-full md:h-96 object-cover"
                controls
            >
                Your browser does not support the video tag.
            </video>
        </div>
    );
};

export default VideoPlayer;
import React, { useState } from 'react';
import Breadcrumb from './Breadcrumb';
import VideoPlayer from './VideoPlayer';
import VideoMetadata from './VideoMetadata';
import VideoDescription from './VideoDescription';
import CommentsSection from './CommentsSection';
import RelatedVideos from './RelatedVideos';

const VideoDetail = ({ videoData, comments, relatedVideos }) => {
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

    const breadcrumbItems = [
        { label: "Home", href: "/" },
        { label: "Courses", href: "/courses" },
        { label: videoData.title || "Video", href: null }
    ];

    const toggleDescription = () => {
        setIsDescriptionExpanded(!isDescriptionExpanded);
    };

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8">
            {/* Hero Section */}
            <section className="mb-8">
                <Breadcrumb items={breadcrumbItems} />
            </section>

            {/* Main Content - Two Column Layout */}
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Left Column (70%) */}
                <div className="w-full mx-auto lg:w-8/12">
                    {/* Video Player */}
                    <VideoPlayer videoUrl={videoData.videoUrl} />

                    {/* Video Title and Metadata */}
                    <VideoMetadata
                        views={videoData.views}
                        date={videoData.date}
                        title={videoData.title}
                    />

                    {/* Video Description */}
                    <VideoDescription
                        description={videoData.description}
                        fullDescription={videoData.fullDescription}
                        references={videoData.references}
                        isExpanded={isDescriptionExpanded}
                        onToggle={toggleDescription}
                    />

                    {/* Comments Section */}
                    <CommentsSection comments={comments} />
                </div>

                {/* Right Column (30%) */}
                <div className="w-full lg:w-4/12">
                    <RelatedVideos videos={relatedVideos} />
                </div>
            </div>
        </main>
    );
};

export default VideoDetail;
import React, { useMemo, useState, useEffect, useRef } from 'react';
import { FaPlay } from 'react-icons/fa';

const VideoPlayer = ({ videoUrl, thumbnail, onEnded }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const playerRef = useRef(null);
    const iframeRef = useRef(null);

    const getVideoType = (url) => {
        if (!url) return 'mp4';
        const stringUrl = String(url).toLowerCase();
        if (stringUrl.includes('youtube.com') || stringUrl.includes('youtu.be')) return 'youtube';
        if (stringUrl.includes('vimeo.com')) return 'vimeo';
        return 'mp4';
    };

    const getYoutubeId = (url) => {
        const ytMatch = String(url).match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i);
        return ytMatch ? ytMatch[1] : null;
    };

    const convertToEmbedUrl = (url) => {
        if (!url) return null;
        let stringUrl = String(url).trim();
        const videoType = getVideoType(stringUrl);

        if (videoType === 'youtube') {
            const ytId = getYoutubeId(stringUrl);
            if (ytId) return `https://www.youtube.com/embed/${ytId}?enablejsapi=1&rel=0&showinfo=0&modestbranding=1&iv_load_policy=3`;
        }

        if (videoType === 'vimeo') {
            const vimeoMatch = stringUrl.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)([0-9]+)/i);
            if (vimeoMatch && vimeoMatch[1]) return `https://player.vimeo.com/video/${vimeoMatch[1]}?api=1`;
        }

        return url;
    };

    const videoType = useMemo(() => getVideoType(videoUrl), [videoUrl]);
    const embedUrl = useMemo(() => convertToEmbedUrl(videoUrl), [videoUrl]);

    // Prioritize YouTube thumbnails for YT videos, else use provided thumbnail
    const finalThumbnail = useMemo(() => {
        if (videoType === 'youtube') {
            const id = getYoutubeId(videoUrl);
            if (id) return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
        }
        if (thumbnail) return thumbnail;
        return "https://via.placeholder.com/1280x720?text=Course+Video";
    }, [thumbnail, videoUrl, videoType]);

    // Reset load state when URL changes
    useEffect(() => {
        setIsLoaded(false);
    }, [videoUrl]);

    // YouTube IFrame API integration
    useEffect(() => {
        if (!isLoaded || videoType !== 'youtube' || !onEnded) return;

        // Load YouTube IFrame API
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        }

        const onYouTubeIframeAPIReady = () => {
            if (iframeRef.current && window.YT && window.YT.Player) {
                playerRef.current = new window.YT.Player(iframeRef.current, {
                    events: {
                        onStateChange: (event) => {
                            // YT.PlayerState.ENDED = 0
                            if (event.data === 0) {
                                console.log('🎬 YouTube video ended!');
                                onEnded();
                            }
                        }
                    }
                });
            }
        };

        if (window.YT && window.YT.Player) {
            onYouTubeIframeAPIReady();
        } else {
            window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
        }

        return () => {
            if (playerRef.current && playerRef.current.destroy) {
                playerRef.current.destroy();
            }
        };
    }, [isLoaded, videoType, onEnded]);

    return (
        <div className="aspect-video mx-auto bg-black rounded-2xl overflow-hidden mb-8 shadow-2xl relative group">
            {!isLoaded ? (
                <div
                    className="w-full h-full cursor-pointer relative"
                    onClick={() => setIsLoaded(true)}
                >
                    {/* Thumbnail Image */}
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

                    {/* Dark Overlay */}
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-300" />

                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 bg-primary/90 text-white rounded-full flex items-center justify-center shadow-2xl transform transition-all duration-300 group-hover:scale-110 group-hover:bg-primary">
                            <FaPlay className="text-2xl ml-1" />
                        </div>
                    </div>

                    {/* Pulse Effect */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 bg-primary/50 rounded-full animate-ping opacity-75" />
                    </div>
                </div>
            ) : (
                <>
                    {videoType === 'youtube' ? (
                        <iframe
                            ref={iframeRef}
                            src={embedUrl}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            title="Course Video"
                        />
                    ) : videoType === 'vimeo' ? (
                        <iframe
                            src={embedUrl}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            title="Course Video"
                        />
                    ) : (
                        <video
                            src={videoUrl}
                            className="w-full h-full object-cover"
                            controls
                            autoPlay
                            playsInline
                            onEnded={onEnded}
                        >
                            Your browser does not support the video tag.
                        </video>
                    )}
                </>
            )}
        </div>
    );
};

export default VideoPlayer;

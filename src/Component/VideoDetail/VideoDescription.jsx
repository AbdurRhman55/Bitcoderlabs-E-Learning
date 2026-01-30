import React from 'react';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';

const VideoDescription = ({
    description,
    fullDescription,
    references,
    isExpanded,
    onToggle
}) => {
    return (
        <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Description</h3>
            <div className="text-gray-700">
                <p className="mb-4">{description}</p>
                <div id="more-content" className={isExpanded ? '' : 'hidden'}>
                    <div className="mb-4">
                        <p className="mb-4">{fullDescription}</p>
                    </div>

                    {/* References */}
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">
                            References & Resources
                        </h3>
                        <ul className="list-disc list-inside text-gray-700 pl-4">
                            {references.map((ref) => (
                                <li key={ref.id} className="mb-2">
                                    <a
                                        href={ref.url}
                                        className="text-primary hover:text-primary"
                                    >
                                        {ref.title}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <button
                    onClick={onToggle}
                    id="read-more-btn"
                    className="text-primary hover:text-primary font-medium flex items-center"
                >
                    {isExpanded ? 'Read less' : 'Read more'}
                    {isExpanded ? (
                        <FaChevronUp className="ml-1 text-xs" />
                    ) : (
                        <FaChevronDown className="ml-1 text-xs" />
                    )}
                </button>
            </div>
        </div>
    );
};

export default VideoDescription;

import React from 'react';
import { FaGithub, FaLinkedin, FaExternalLinkAlt } from 'react-icons/fa';

const PLACEHOLDER_IMAGE = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmVmZWZlIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZpbGw9IiM5OTkiIGZvbnQtc2l6ZT0iMTQiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZHk9Ii4zZW0iIHRleHQtYW5jaG9yPSJtaWRkbGUiPkJpdGNvZGVyIExhYnM8L3RleHQ+PC9zdmc+";

export default function InstructorCard({ instructor }) {
  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 cursor-pointer border border-gray-300 h-[480px] flex flex-col">

      {/* Image Container - Fixed Height */}
      <div className="h-56 bg-gray-100 overflow-hidden flex-shrink-0">
        <img
          src={instructor.image || PLACEHOLDER_IMAGE}
          alt={instructor.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          style={{ objectPosition: 'top center' }}
          onError={(e) => {
            if (e.target.src !== PLACEHOLDER_IMAGE) {
              e.target.onerror = null;
              e.target.src = PLACEHOLDER_IMAGE;
            }
          }}
        />
      </div>

      {/* Content Section - Flexible */}
      <div className="flex-1 p-5 flex flex-col min-h-0">
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
          {instructor.name}
        </h3>
        <p className="text-primary font-semibold text-sm mb-3 line-clamp-1">
          {instructor.role}
        </p>
        <p className="text-gray-600 text-sm mb-4 flex-1 overflow-hidden">
          <span className="line-clamp-3">{instructor.bio}</span>
        </p>

        {/* Skills Tags - Limited to 3 with show more */}
        <div className="flex flex-wrap gap-2 mt-auto">
          {Array.isArray(instructor.skills) && instructor.skills.slice(0, 3).map((skill, index) => (
            <span
              key={index}
              className="bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-medium"
            >
              {skill}
            </span>
          ))}
          {Array.isArray(instructor.skills) && instructor.skills.length > 3 && (
            <span className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
              +{instructor.skills.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/95 to-primary-dark/95 flex flex-col items-center justify-center p-6 opacity-0 group-hover:opacity-100 transition-all duration-500 z-10">
        <div className="text-center text-white w-full">

          {/* Avatar */}
          <div className="w-20 h-20 mx-auto mb-4 rounded-full border-3 border-white/30 overflow-hidden flex-shrink-0">
            <img
              src={instructor.image || PLACEHOLDER_IMAGE}
              alt={instructor.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                if (e.target.src !== PLACEHOLDER_IMAGE) {
                  e.target.onerror = null;
                  e.target.src = PLACEHOLDER_IMAGE;
                }
              }}
            />
          </div>

          {/* Name & Role */}
          <h3 className="text-xl font-bold mb-1 line-clamp-1">{instructor.name}</h3>
          <p className="text-primary-light font-semibold text-md mb-3 line-clamp-1">{instructor.role}</p>

          {/* Bio */}
          <p className="text-white/90 text-sm mb-4 leading-relaxed line-clamp-4">
            {instructor.bio}
          </p>

          {/* Skills */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {Array.isArray(instructor.skills) && instructor.skills.map((skill, index) => (
              <span
                key={index}
                className="bg-white/20 text-white px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm"
              >
                {skill}
              </span>
            ))}
          </div>

          {/* Social Links */}
          <div className="flex justify-center space-x-3">
            <a
              href={instructor.social.github}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-all duration-300 backdrop-blur-sm hover:scale-110"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaGithub size={18} className="text-white" />
            </a>
            <a
              href={instructor.social.linkedin}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-all duration-300 backdrop-blur-sm hover:scale-110"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedin size={18} className="text-white" />
            </a>
            <a
              href={instructor.portfolio}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-all duration-300 backdrop-blur-sm hover:scale-110"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaExternalLinkAlt size={18} className="text-white" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

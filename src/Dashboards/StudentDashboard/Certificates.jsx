import React from 'react';
import { FaFileAlt, FaRibbon, FaAward } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { selectCourses } from '../../../slices/courseSlice';

const Certificates = () => {
  const enrolledCourses = useSelector(selectCourses);

  // Show all enrolled courses, but lock certificates for incomplete ones
  const certificates = enrolledCourses.map(course => {
    const isCompleted = course.status === 'completed' || course.progress === 100;

    return {
      id: course.id,
      course: course.title,
      issueDate: isCompleted ? new Date().toLocaleDateString() : null,
      instructor: course.instructor?.name || 'Instructor',
      duration: course.duration || 'N/A',
      score: isCompleted ? (course.score || 'A') : 'N/A',
      certificateId: isCompleted ? `CERT-${course.id}-${Math.floor(Math.random() * 1000)}` : 'LOCKED',
      isLocked: !isCompleted,
      progress: course.progress || 0,
      icon: isCompleted ? (
        <FaAward className="mx-auto text-4xl text-primary" />
      ) : (
        <div className="relative inline-block">
          <FaAward className="mx-auto text-4xl text-gray-300" />
          <div className="absolute -top-1 -right-1 bg-white rounded-full p-1 shadow-sm">
            <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      )
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Certificates</h1>
        <p className="text-gray-600 mt-1">Your earned course certificates</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates.map((cert) => (
          <div key={cert.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
            <div className="p-6">
              <div className="text-4xl mb-4 text-center">{cert.icon}</div>
              <h3 className="font-semibold text-gray-900 text-center mb-2">{cert.course}</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Instructor:</span>
                  <span className="font-medium">{cert.instructor}</span>
                </div>
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span className="font-medium">{cert.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span>Score:</span>
                  <span className={`font-medium ${cert.isLocked ? 'text-gray-400' : 'text-green-600'}`}>{cert.score}</span>
                </div>
                <div className="flex justify-between">
                  <span>Issued:</span>
                  <span className="font-medium">{cert.issueDate || 'Pending'}</span>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex space-x-3">
                <button
                  disabled={cert.isLocked}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200 ${cert.isLocked
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-primary hover:bg-primary-dark text-white'
                    }`}
                >
                  {cert.isLocked ? 'Locked' : 'View Certificate'}
                </button>
                <button
                  disabled={cert.isLocked}
                  className={`flex-1 border py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200 ${cert.isLocked
                      ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  Download
                </button>
              </div>
              {cert.isLocked ? (
                <div className="mt-3">
                  <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                    <span>Course Progress</span>
                    <span>{cert.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-primary h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${cert.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-[10px] text-center text-gray-500 mt-2 italic">
                    Complete course to unlock certificate
                  </p>
                </div>
              ) : (
                <div className="text-xs text-gray-500 text-center mt-2">
                  ID: {cert.certificateId}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {certificates.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4"><FaFileAlt className="mx-auto text-6xl text-gray-400" /></div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No certificates yet</h3>
          <p className="text-gray-600 mb-6">Complete courses to earn certificates.</p>
          <button className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200">
            Browse Courses
          </button>
        </div>
      )}
    </div>
  );
};

export default Certificates;

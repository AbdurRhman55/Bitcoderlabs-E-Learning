// components/Certificates.jsx
import React from 'react';
import { FaFileAlt, FaReact, FaRocket } from 'react-icons/fa';

const Certificates = () => {
  const certificates = [
    {
      id: 1,
      course: 'JavaScript Fundamentals',
      issueDate: '2024-01-15',
      instructor: 'David Kim',
      duration: '10 hours',
      score: '98%',
      certificateId: 'JSF-2024-001',
      icon: <FaFileAlt className="mx-auto text-4xl text-yellow-500" />
    },
    {
      id: 2,
      course: 'React Development',
      issueDate: '2024-01-28',
      instructor: 'Sarah Johnson',
      duration: '15 hours',
      score: '95%',
      certificateId: 'REACT-2024-002',
      icon: <FaReact className="mx-auto text-4xl text-blue-500" />
    },
    {
      id: 3,
      course: 'Node.js Backend',
      issueDate: '2024-02-10',
      instructor: 'Mike Chen',
      duration: '20 hours',
      score: '92%',
      certificateId: 'NODE-2024-003',
      icon: <FaRocket className="mx-auto text-4xl text-green-500" />
    }
  ];

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
                  <span className="font-medium text-green-600">{cert.score}</span>
                </div>
                <div className="flex justify-between">
                  <span>Issued:</span>
                  <span className="font-medium">{new Date(cert.issueDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex space-x-3">
                <button className="flex-1 bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200">
                  View Certificate
                </button>
                <button className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors duration-200">
                  Download
                </button>
              </div>
              <div className="text-xs text-gray-500 text-center mt-2">
                ID: {cert.certificateId}
              </div>
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

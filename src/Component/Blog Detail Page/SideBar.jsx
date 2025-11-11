import React from 'react'
import { 
  FaStar, 
  FaRocket,
  FaGraduationCap,
  FaChevronRight,
  FaDownload,
  FaBullseye,
  FaComment,
  FaCogs
} from 'react-icons/fa';

  const quickActions = [
    { icon: FaDownload, label: 'Download Resources' },
    { icon: FaBullseye, label: 'Take Quiz' },
    { icon: FaComment, label: 'Ask Instructor' }
  ];

export default function SideBar() {
  return (
    <div>
      
            {/* Progress Widget */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-5">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <FaRocket className="text-blue-500" />
                Your Learning Journey
              </h3>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-semibold text-gray-700">React Mastery Course</span>
                    <span className="font-bold text-blue-500">65%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full"
                      style={{ width: '65%' }}
                    ></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 bg-blue-50 rounded-2xl border border-blue-200">
                    <div className="text-lg font-bold text-blue-600">12</div>
                    <div className="text-xs text-gray-600">Lessons</div>
                  </div>
                  <div className="p-3 bg-green-50 rounded-2xl border border-green-200">
                    <div className="text-lg font-bold text-green-600">8</div>
                    <div className="text-xs text-gray-600">Completed</div>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200">
                    <div className="text-lg font-bold text-purple-600">3</div>
                    <div className="text-xs text-gray-600">Projects</div>
                  </div>
                </div>
                
                <button className="w-full py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl font-semibold flex items-center justify-center gap-2">
                  <FaChevronRight />
                  Continue Learning
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-blue-50 rounded-3xl border border-blue-200 p-6 mb-5">
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FaCogs className="text-blue-500" />
                Quick Actions
              </h4>
              <div className="space-y-3">
                {quickActions.map((action, index) => (
                  <button key={index} className="w-full flex items-center gap-3 p-3 bg-white rounded-2xl border border-gray-200">
                    <action.icon className="text-blue-500" />
                    <span className="font-medium">{action.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Course Info */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FaGraduationCap className="text-blue-500" />
                Course Details
              </h4>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Instructor:</span>
                  <span className="font-medium text-gray-900">Alex Thompson</span>
                </div>
                <div className="flex justify-between">
                  <span>Level:</span>
                  <span className="font-medium text-blue-500">Intermediate</span>
                </div>
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span className="font-medium text-gray-900">12 hours</span>
                </div>
                <div className="flex justify-between">
                  <span>Students:</span>
                  <span className="font-medium text-gray-900">15,420</span>
                </div>
                <div className="flex justify-between">
                  <span>Rating:</span>
                  <span className="font-medium text-amber-600 flex items-center gap-1">
                    <FaStar />
                    4.8/5.0
                  </span>
                </div>
              </div>
            </div>
          </div>
    
  )
}

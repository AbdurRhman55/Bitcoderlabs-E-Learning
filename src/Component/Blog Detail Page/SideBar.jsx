import React from "react";
import {
  FaStar,
  FaRocket,
  FaGraduationCap,
  FaChevronRight,
  FaDownload,
  FaBullseye,
  FaComment,
  FaCogs,
} from "react-icons/fa";

const quickActions = [
  { icon: FaDownload, label: "Download Resources" },
  { icon: FaBullseye, label: "Take Quiz" },
  { icon: FaComment, label: "Ask Instructor" },
];

export default function SideBar() {
  return (
    <div>
      {/* Quick Actions */}
      <div className="bg-blue-50 rounded-3xl w-[320px] w-full border border-primary p-6 mb-5 ">
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FaCogs className="text-primary-dark" />
          Quick Actions
        </h4>
        <div className="space-y-3">
          {quickActions.map((action, index) => (
            <button
              key={index}
              className="w-full flex cursor-pointer hover:bg-gray-50 items-center gap-3 p-3 bg-white rounded-2xl border border-gray-200"
            >
              <action.icon className="text-primary-dark" />
              <span className="font-medium">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Course Info */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FaGraduationCap className="text-primary-dark" />
          Course Details
        </h4>
        <div className="space-y-3 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Instructor:</span>
            <span className="font-medium text-gray-900">Alex Thompson</span>
          </div>
          <div className="flex justify-between">
            <span>Level:</span>
            <span className="font-medium text-primary">Intermediate</span>
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
  );
}

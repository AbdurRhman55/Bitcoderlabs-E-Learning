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
  { icon: FaDownload, label: "Download Resources", color: "text-blue-500", bg: "bg-blue-50" },
  { icon: FaBullseye, label: "Take Quiz", color: "text-amber-500", bg: "bg-amber-50" },
  { icon: FaComment, label: "Ask Instructor", color: "text-emerald-500", bg: "bg-emerald-50" },
];

export default function SideBar() {
  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200/60 p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
        <h4 className="font-bold text-slate-900 mb-5 flex items-center gap-3 relative z-10">
          <div className="p-2 bg-slate-100 rounded-lg">
            <FaCogs className="text-slate-600" />
          </div>
          Quick Actions
        </h4>
        <div className="space-y-3 relative z-10">
          {quickActions.map((action, index) => (
            <button
              key={index}
              className="w-full flex items-center justify-between p-3.5 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 transition-all group shadow-sm hover:shadow active:scale-[0.98]"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${action.bg}`}>
                  <action.icon className={action.color} />
                </div>
                <span className="font-semibold text-slate-700 group-hover:text-slate-900">
                  {action.label}
                </span>
              </div>
              <FaChevronRight className="text-slate-300 group-hover:text-slate-400 group-hover:translate-x-1 transition-all text-xs" />
            </button>
          ))}
        </div>
      </div>

      {/* Course Info */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2rem] shadow-xl p-8 text-white relative overflow-hidden border border-slate-700">
        <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl"></div>
        
        <h4 className="font-bold mb-6 flex items-center gap-3 relative z-10 text-lg">
          <div className="p-2 bg-white/10 rounded-lg">
            <FaGraduationCap className="text-blue-400" />
          </div>
          Course Details
        </h4>
        
        <div className="space-y-4 text-sm text-slate-300 relative z-10">
          <div className="flex justify-between items-center pb-4 border-b border-white/10">
            <span className="font-medium">Instructor:</span>
            <span className="font-bold text-white bg-white/10 px-3 py-1 rounded-full">Alex Thompson</span>
          </div>
          <div className="flex justify-between items-center pb-4 border-b border-white/10">
            <span className="font-medium">Level:</span>
            <span className="font-bold text-emerald-400">Intermediate</span>
          </div>
          <div className="flex justify-between items-center pb-4 border-b border-white/10">
            <span className="font-medium">Duration:</span>
            <span className="font-bold text-white">12 hours</span>
          </div>
          <div className="flex justify-between items-center pb-4 border-b border-white/10">
            <span className="font-medium">Students:</span>
            <span className="font-bold text-white">15,420</span>
          </div>
          <div className="flex justify-between items-center pt-2">
            <span className="font-medium">Rating:</span>
            <span className="font-bold text-amber-400 flex items-center gap-1.5 bg-amber-400/10 px-3 py-1 rounded-full">
              <FaStar />
              4.8/5.0
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

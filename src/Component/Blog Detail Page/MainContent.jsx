import React, { useState } from "react";
import SideBar from "./SideBar";
import {comments,codeExamples,learningObjectives,tabs} from "../../../Data/BlogDetailAarray"
import {
  FaBook,
  FaCheck,
  FaBullseye,
  FaCode,
  FaLightbulb,
  FaBookmark,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaHandsHelping,
  FaCalendar,
  FaClock,
  FaCircle,
} from "react-icons/fa";

const BlogDetailPage = () => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [activeTab, setActiveTab] = useState("content");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="lg:w-2/3 space-y-8">
            {/* Header Section */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl text-sm font-semibold">
                  React Mastery
                </span>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <FaCircle className="w-2 h-2 text-green-500" />
                    Published
                  </span>
                  <span className="flex items-center gap-1">
                    <FaCalendar className="text-blue-500" />
                    March 15, 2024
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <FaClock className="text-blue-500" />8 min read
                  </span>
                </div>
              </div>

              <h1 className="text-4xl font-bold text-gray-900 mb-6">
                Advanced React Patterns for Scalable Applications
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed mb-8">
                Master professional React patterns used by top tech companies.
                Learn to build maintainable, performant applications.
              </p>

              <div className="flex flex-wrap gap-4">
                <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl font-semibold flex items-center gap-3">
                  <FaBook />
                  Save to Learning Path
                </button>
                <button
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className={`px-8 py-4 rounded-2xl font-semibold flex items-center gap-3 ${
                    isBookmarked
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 border border-gray-200"
                  }`}
                >
                  <FaBookmark
                    className={
                      isBookmarked ? "text-amber-500" : "text-gray-400"
                    }
                  />
                  {isBookmarked ? "Bookmarked" : "Bookmark Lesson"}
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-2">
              <div className="flex space-x-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-4 px-6 rounded-2xl font-semibold flex items-center justify-center gap-2 ${
                      activeTab === tab.id
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <tab.icon />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Learning Objectives */}
            <div className="bg-blue-50 rounded-3xl border border-blue-200 p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <FaBullseye className="text-blue-500" />
                What You'll Learn
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {learningObjectives.map((objective, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 bg-white rounded-2xl border border-gray-200"
                  >
                    <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <FaCheck className="text-white text-xs" />
                    </div>
                    <span className="text-gray-700 font-medium">
                      {objective}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Main Content */}
            <div className="space-y-8">
              {/* Introduction */}
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Why Advanced Patterns Matter
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  As React applications grow in complexity, basic patterns often
                  fall short. Advanced composition patterns enable flexible,
                  maintainable components.
                </p>

                <div className="bg-amber-50 rounded-2xl p-6 border-l-4 border-amber-500">
                  <div className="flex items-start gap-4">
                    <FaLightbulb className="text-2xl text-amber-600 mt-1" />
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2">Pro Tip</h4>
                      <p className="text-gray-700">
                        Start with simple patterns and gradually introduce
                        complexity.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Code Examples */}
              <div className="space-y-6">
                {codeExamples.map((example, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
                  >
                    <div className="bg-gray-900 p-4">
                      <h3 className="text-xl font-semibold text-white flex items-center gap-3">
                        <FaCode className="text-blue-500" />
                        {example.title}
                      </h3>
                      <p className="text-gray-300 text-sm mt-1">
                        {example.description}
                      </p>
                    </div>
                    <div className="p-6 bg-gray-900">
                      <pre className="text-sm text-gray-100 leading-relaxed overflow-x-auto">
                        {example.code}
                      </pre>
                    </div>
                  </div>
                ))}
              </div>

              {/* Practical Exercise */}
              <div className="bg-green-50 rounded-3xl border border-green-200 p-8">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-2xl text-white flex-shrink-0">
                    <FaHandsHelping />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      Hands-On Challenge
                    </h3>
                    <p className="text-gray-700 text-lg mb-4">
                      Build a custom data table component using compound
                      components pattern.
                    </p>
                    <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold">
                      Start Challenge
                    </button>
                  </div>
                </div>
              </div>

              {/* Comments Section */}
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      Community Discussion
                    </h3>
                    <p className="text-gray-600 mt-1">
                      Join the conversation with other learners
                    </p>
                  </div>
                  <div className="px-4 py-2 bg-blue-100 text-blue-600 rounded-2xl font-semibold">
                    {comments.length} Comments
                  </div>
                </div>

                {/* Comments List */}
                <div className="space-y-6">
                  {comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="p-6 bg-gray-50 rounded-2xl border border-gray-200"
                    >
                      <div className="flex gap-4">
                        <div className="relative">
                          <div
                            className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white ${
                              comment.isInstructor
                                ? "bg-gradient-to-br from-green-500 to-emerald-600"
                                : "bg-gradient-to-br from-blue-500 to-blue-600"
                            }`}
                          >
                            {comment.avatar}
                          </div>
                          {comment.isInstructor && (
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                              <FaCheck className="text-white text-xs" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <h5 className="font-semibold text-gray-900">
                                {comment.name}
                              </h5>
                              {comment.isInstructor ? (
                                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full flex items-center gap-1">
                                  <FaChalkboardTeacher />
                                  Instructor
                                </span>
                              ) : (
                                <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs font-medium rounded-full flex items-center gap-1">
                                  <FaUserGraduate />
                                  Student
                                </span>
                              )}
                            </div>
                            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                              {comment.date}
                            </span>
                          </div>
                          <p className="text-gray-700 leading-relaxed">
                            {comment.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <SideBar />
        </div>
      </div>
    </div>
  );
};

export default BlogDetailPage;

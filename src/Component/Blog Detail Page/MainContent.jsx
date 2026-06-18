import React, { useState } from "react";
import SideBar from "./SideBar";
import {
  FaCheck,
  FaBullseye,
  FaLightbulb,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaCalendar,
  FaClock,
  FaCircle,
  FaTags,
  FaShareAlt,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaPaperPlane,
} from "react-icons/fa";

const BlogDetailPage = ({ blog }) => {
  const [commentList, setCommentList] = useState([]);
  const [newCommentName, setNewCommentName] = useState("");
  const [newCommentText, setNewCommentText] = useState("");

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newCommentName.trim() || !newCommentText.trim()) return;

    const newComment = {
      id: Date.now(),
      name: newCommentName,
      avatar: newCommentName.charAt(0).toUpperCase(),
      isInstructor: false,
      date: "Just now",
      content: newCommentText,
    };

    setCommentList([newComment, ...commentList]);
    setNewCommentName("");
    setNewCommentText("");
  };

  const tags = blog?.tags
    ? typeof blog.tags === "string"
      ? blog.tags.split(",").map((t) => t.trim()).filter(Boolean)
      : Array.isArray(blog.tags)
        ? blog.tags
        : []
    : [];

  return (
    <div className="min-h-screen bg-slate-50 py-8 relative">
      {/* Decorative Background Blob */}
      <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-blue-50/50 to-transparent pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Main Layout Area */}
          <div className="lg:w-2/3 space-y-6">

            {/* --- SINGLE CONTENT BOX --- */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 sm:p-8">

              {/* Header Section */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex flex-wrap items-center gap-4">
                  {blog?.category && (
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-md text-xs font-bold tracking-wide uppercase border border-blue-100">
                      {blog.category}
                    </span>
                  )}
                  <div className="flex items-center gap-3 text-sm text-slate-500 font-medium">
                    <span className="flex items-center gap-1.5">
                      <FaCircle className="w-2 h-2 text-emerald-500" />
                      Published
                    </span>
                    <span className="flex items-center gap-1.5">
                      <FaCalendar className="text-blue-500" />
                      {blog?.date || blog?.created_at ? new Date(blog.date || blog.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : "Recently"}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="flex items-center gap-1.5">
                      <FaClock className="text-blue-500" />
                      {blog?.readTime || "5 min read"}
                    </span>
                  </div>
                </div>
                {/* Share Icons */}
                <div className="flex items-center gap-3 text-slate-400">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 mr-1 flex items-center gap-1">
                    <FaShareAlt /> Share
                  </span>
                  <button className="hover:text-blue-600 transition-colors cursor-pointer"><FaFacebook /></button>
                  <button className="hover:text-sky-500 transition-colors cursor-pointer"><FaTwitter /></button>
                  <button className="hover:text-blue-700 transition-colors cursor-pointer"><FaLinkedin /></button>
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4 leading-tight tracking-tight">
                {blog?.title || "Blog Title"}
              </h1>

              <p className="text-lg text-slate-600 leading-relaxed font-light mb-8">
                {blog?.description || ""}
              </p>

              {/* Blog Content */}
              {blog?.content && (
                <div className="mb-8">
                  <div className="prose prose-slate max-w-none text-base text-slate-700 leading-relaxed font-light whitespace-pre-wrap">
                    {blog.content}
                  </div>
                </div>
              )}

              {/* Tags Section */}
              {tags.length > 0 && (
                <div className="flex items-center gap-3 pt-6 border-t border-slate-200">
                  <FaTags className="text-slate-400" />
                  <span className="font-semibold text-sm text-slate-700">Tags:</span>
                  <div className="flex gap-2 flex-wrap">
                    {tags.map((tag, i) => (
                      <span key={i} className="px-3 py-1 bg-slate-100 hover:bg-slate-200 cursor-pointer text-slate-600 rounded-md text-xs font-medium transition-colors">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {/* --- END SINGLE CONTENT BOX --- */}

            {/* --- COMMENTS BOX --- */}
            <div id="discussion" className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Community Discussion
                  </h3>
                </div>
                <div className="px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full font-bold text-xs border border-blue-100">
                  {commentList.length} Comments
                </div>
              </div>

              {/* Add Comment Form */}
              <form onSubmit={handleAddComment} className="mb-8 bg-slate-50 p-5 rounded-xl border border-slate-200">
                <h4 className="text-sm font-bold text-slate-800 mb-3">Leave a Reply</h4>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={newCommentName}
                    onChange={(e) => setNewCommentName(e.target.value)}
                    className="w-full px-4 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <textarea
                    placeholder="Write your comment here..."
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    rows="3"
                    className="w-full px-4 py-3 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    required
                  ></textarea>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg flex items-center gap-2 transition-colors shadow-sm cursor-pointer"
                    >
                      <FaPaperPlane className="text-xs" />
                      Post Comment
                    </button>
                  </div>
                </div>
              </form>

              {/* Comments List */}
              <div className="space-y-4">
                {commentList.length > 0 ? (
                  commentList.map((comment) => (
                    <div
                      key={comment.id}
                      className="group p-5 bg-slate-50/50 hover:bg-slate-50 rounded-xl border border-slate-100 transition-colors"
                    >
                      <div className="flex gap-4">
                        <div className="relative flex-shrink-0">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-sm text-sm ${
                              comment.isInstructor
                                ? "bg-gradient-to-br from-emerald-500 to-teal-600"
                                : "bg-gradient-to-br from-blue-500 to-indigo-600"
                            }`}
                          >
                            {comment.avatar}
                          </div>
                          {comment.isInstructor && (
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-lg border-[3px] border-white flex items-center justify-center shadow-sm">
                              <FaCheck className="text-white text-[8px]" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h5 className="font-bold text-slate-900 text-sm">
                                {comment.name}
                              </h5>
                              {comment.isInstructor ? (
                                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wider rounded border border-emerald-100 flex items-center gap-1">
                                  <FaChalkboardTeacher />
                                  Instructor
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider rounded border border-slate-200 flex items-center gap-1">
                                  <FaUserGraduate />
                                  Student
                                </span>
                              )}
                            </div>
                            <span className="text-xs font-medium text-slate-400 whitespace-nowrap">
                              {comment.date}
                            </span>
                          </div>
                          <p className="text-slate-600 text-sm leading-relaxed">
                            {comment.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-400 text-sm">
                    No comments yet. Be the first to share your thoughts!
                  </div>
                )}
              </div>
            </div>
            {/* --- END COMMENTS BOX --- */}

          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3">
            <div className="sticky top-6">
              <SideBar blog={blog} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetailPage;

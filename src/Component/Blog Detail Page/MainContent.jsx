import React, { useState } from 'react';
import { 
  FaBook, 
  FaStar, 
  FaCheck, 
  FaDownload, 
  FaBullseye, 
  FaComment, 
  FaCode, 
  FaLightbulb,
  FaBookmark,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaRocket,
  FaHandsHelping,
  FaPuzzlePiece,
  FaCogs,
  FaShieldAlt,
  FaGraduationCap,
  FaCalendar,
  FaClock,
  FaCircle,
  FaChevronRight,
  FaShare,
  FaQuestionCircle,
  FaFileDownload
} from 'react-icons/fa';

const BlogDetailPage = () => {
  const [comments, setComments] = useState([
    {
      id: 1,
      name: 'Sarah Johnson',
      date: '2 days ago',
      content: 'This tutorial helped me understand React hooks much better! The practical examples were exactly what I needed for my course project.',
      avatar: 'SJ',
      isStudent: true,
      replies: [
        {
          id: 2,
          name: 'Alex Thompson',
          date: '1 day ago',
          content: 'Glad to hear it helped, Sarah! The project examples are designed to bridge theory with real-world applications.',
          avatar: 'AT',
          isInstructor: true
        }
      ]
    },
    {
      id: 3,
      name: 'Mike Chen',
      date: '3 days ago',
      content: 'Could you create a follow-up tutorial about advanced state management? This would be perfect for the intermediate React course.',
      avatar: 'MC',
      isStudent: true
    }
  ]);

  const [newComment, setNewComment] = useState({ name: '', email: '', comment: '' });
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [progress, _setProgress] = useState(65);
  const [activeTab, setActiveTab] = useState('content');

  const learningObjectives = [
    'Master React composition patterns for scalable applications',
    'Implement custom hooks for reusable logic',
    'Optimize performance with advanced techniques',
    'Build maintainable component architectures',
    'Apply best practices from industry experts'
  ];

  const codeExamples = [
    {
      title: 'Custom Hook Pattern',
      code: `// Advanced data fetching hook
import { useState, useEffect } from 'react';

function useApiData(url) {
  const [state, setState] = useState({
    data: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        const data = await response.json();
        setState({ data, loading: false, error: null });
      } catch (error) {
        setState({ data: null, loading: false, error });
      }
    };

    fetchData();
  }, [url]);

  return state;
}`,
      description: 'A robust custom hook for handling API requests with error states'
    },
    {
      title: 'Compound Components',
      code: `// Flexible compound component pattern
const Form = ({ children, onSubmit }) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {children}
    </form>
  );
};

Form.Input = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <input
      {...props}
      className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-[#3baee9] focus:ring-1 focus:ring-[#3baee9]"
    />
  </div>
);`,
      description: 'Compound components provide flexible and intuitive APIs'
    }
  ];

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newComment.name && newComment.email && newComment.comment) {
      const comment = {
        id: comments.length + 1,
        name: newComment.name,
        date: 'Just now',
        content: newComment.comment,
        avatar: newComment.name.split(' ').map(n => n[0]).join(''),
        isStudent: true
      };
      setComments([...comments, comment]);
      setNewComment({ name: '', email: '', comment: '' });
    }
  };

  const handleInputChange = (e) => {
    setNewComment({ 
      ...newComment, 
      [e.target.name]: e.target.value 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-[#e8f7ff] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main Content */}
          <div className="lg:w-2/3 space-y-8">
            
            {/* Header Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-soft border border-white/60 p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#3baee9]/10 to-[#2a9fd8]/10 rounded-full -translate-y-16 translate-x-16"></div>
              
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="px-4 py-2 bg-gradient-to-r from-[#3baee9] to-[#2a9fd8] text-white rounded-2xl text-sm font-semibold shadow-sm">
                  React Mastery
                </span>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <FaCircle className="w-2 h-2 text-green-500" />
                    Published
                  </span>
                  <span className="flex items-center gap-1">
                    <FaCalendar className="text-[#3baee9]" />
                    March 15, 2024
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <FaClock className="text-[#3baee9]" />
                    8 min read
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-[#3baee9]">
                    <FaStar className="text-amber-500" />
                    Intermediate
                  </span>
                </div>
              </div>

              <h1 className="text-5xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Advanced React Patterns for Scalable Applications
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed mb-8">
                Master professional React patterns used by top tech companies. Learn how to build maintainable, 
                performant applications with composition patterns, custom hooks, and advanced state management.
              </p>

              <div className="flex flex-wrap gap-4">
                <button className="px-8 py-4 bg-gradient-to-r from-[#3baee9] to-[#2a9fd8] text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-3">
                  <FaBook />
                  Save to Learning Path
                </button>
                <button 
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className={`px-8 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-3 ${
                    isBookmarked 
                      ? 'bg-[#2a9fd8] text-white hover:bg-[#3baee9]' 
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <FaBookmark className={isBookmarked ? "text-amber-500" : "text-gray-400"} />
                  {isBookmarked ? 'Bookmarked' : 'Bookmark Lesson'}
                </button>
                <button className="px-8 py-4 bg-white text-gray-700 rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-3 border border-gray-200 hover:bg-gray-50">
                  <FaCheck />
                  Mark as Complete
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-soft border border-white/60 p-2">
              <div className="flex space-x-2">
                {[
                  { id: 'content', icon: FaBook, label: 'Lesson Content' },
                  { id: 'exercises', icon: FaCode, label: 'Exercises' },
                  { id: 'resources', icon: FaFileDownload, label: 'Resources' },
                  { id: 'qa', icon: FaQuestionCircle, label: 'Q&A' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-4 px-6 rounded-2xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-[#3baee9] to-[#2a9fd8] text-white shadow-md'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                    }`}
                  >
                    <tab.icon />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Learning Objectives */}
            <div className="bg-gradient-to-br from-[#3baee9]/5 to-[#2a9fd8]/5 rounded-3xl border border-[#3baee9]/20 p-8 backdrop-blur-sm">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <FaBullseye className="text-[#3baee9]" />
                What You'll Learn
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {learningObjectives.map((objective, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-white/50 rounded-2xl border border-white/60">
                    <div className="w-6 h-6 bg-gradient-to-r from-[#3baee9] to-[#2a9fd8] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <FaCheck className="text-white text-xs" />
                    </div>
                    <span className="text-gray-700 font-medium">{objective}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Main Content */}
            <div className="space-y-8">
              
              {/* Introduction */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-soft border border-white/60 p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Advanced Patterns Matter</h2>
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  As React applications grow in complexity, basic patterns often fall short. Advanced composition 
                  patterns enable you to build flexible, maintainable components that scale with your application's needs.
                </p>
                
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border-l-4 border-amber-500">
                  <div className="flex items-start gap-4">
                    <FaLightbulb className="text-2xl text-amber-600 mt-1" />
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2">Pro Tip</h4>
                      <p className="text-gray-700">
                        Start with simple patterns and gradually introduce complexity. Master each pattern 
                        before moving to the next to build a solid foundation.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Code Examples */}
              <div className="space-y-6">
                {codeExamples.map((example, index) => (
                  <div key={index} className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-soft border border-white/60 overflow-hidden">
                    <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-4">
                      <h3 className="text-xl font-semibold text-white flex items-center gap-3">
                        <FaCode className="text-[#3baee9]" />
                        {example.title}
                      </h3>
                      <p className="text-gray-300 text-sm mt-1">{example.description}</p>
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
              <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-3xl border border-green-200/50 p-8 backdrop-blur-sm">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#3baee9] to-[#2a9fd8] rounded-2xl flex items-center justify-center text-2xl text-white flex-shrink-0">
                    <FaHandsHelping />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Hands-On Challenge</h3>
                    <p className="text-gray-700 text-lg mb-4">
                      Build a custom data table component using compound components pattern. 
                      Your table should support sorting, filtering, and pagination.
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <button className="px-6 py-3 bg-gradient-to-r from-[#3baee9] to-[#2a9fd8] text-white rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200">
                        Start Challenge
                      </button>
                      <button className="px-6 py-3 bg-white text-gray-700 rounded-xl font-semibold border border-gray-300 hover:bg-gray-50 transform hover:-translate-y-0.5 transition-all duration-200">
                        View Solution
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comments Section */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-soft border border-white/60 p-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Community Discussion</h3>
                    <p className="text-gray-600 mt-1">Join the conversation with other learners</p>
                  </div>
                  <div className="px-4 py-2 bg-[#3baee9]/10 text-[#3baee9] rounded-2xl font-semibold">
                    {comments.length} Comments
                  </div>
                </div>

                {/* Comment Form */}
                <form onSubmit={handleCommentSubmit} className="mb-8 p-6 bg-gradient-to-r from-[#e8f7ff] to-blue-50 rounded-2xl border border-[#3baee9]/20">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FaComment className="text-[#3baee9]" />
                    Share your thoughts
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <input
                      type="text"
                      name="name"
                      placeholder="Your Name"
                      value={newComment.name}
                      onChange={handleInputChange}
                      className="px-4 py-3 bg-white/80 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#3baee9] focus:border-transparent transition-all duration-200"
                      required
                    />
                    <input
                      type="email"
                      name="email"
                      placeholder="Your Email"
                      value={newComment.email}
                      onChange={handleInputChange}
                      className="px-4 py-3 bg-white/80 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#3baee9] focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                  <textarea
                    name="comment"
                    rows="4"
                    placeholder="What did you find helpful? Any questions about the lesson?"
                    value={newComment.comment}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/80 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#3baee9] focus:border-transparent mb-4 transition-all duration-200"
                    required
                  />
                  <button
                    type="submit"
                    className="px-8 py-3 bg-gradient-to-r from-[#3baee9] to-[#2a9fd8] text-white rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2"
                  >
                    <FaComment />
                    Post Comment
                  </button>
                </form>

                {/* Comments List */}
                <div className="space-y-6">
                  {comments.map((comment) => (
                    <div key={comment.id} className="p-6 bg-white/50 rounded-2xl border border-gray-200/50 hover:border-[#3baee9]/20 transition-all duration-200">
                      <div className="flex gap-4">
                        <div className="relative">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white shadow-sm ${
                            comment.isInstructor 
                              ? 'bg-gradient-to-br from-green-500 to-emerald-600' 
                              : 'bg-gradient-to-br from-[#3baee9] to-[#2a9fd8]'
                          }`}>
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
                              <h5 className="font-semibold text-gray-900">{comment.name}</h5>
                              {comment.isInstructor ? (
                                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full flex items-center gap-1">
                                  <FaChalkboardTeacher />
                                  Instructor
                                </span>
                              ) : (
                                <span className="px-2 py-1 bg-[#e8f7ff] text-[#3baee9] text-xs font-medium rounded-full flex items-center gap-1">
                                  <FaUserGraduate />
                                  Student
                                </span>
                              )}
                            </div>
                            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{comment.date}</span>
                          </div>
                          <p className="text-gray-700 leading-relaxed">{comment.content}</p>
                          
                          {/* Replies */}
                          {comment.replies && comment.replies.map((reply) => (
                            <div key={reply.id} className="mt-4 ml-4 pl-6 border-l-2 border-[#3baee9]/20">
                              <div className="flex gap-3">
                                <div className="relative">
                                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-2xl flex items-center justify-center font-bold text-sm shadow-sm">
                                    {reply.avatar}
                                  </div>
                                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                                    <FaCheck className="text-white text-xs" />
                                  </div>
                                </div>
                                <div className="flex-1">
                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                      <h6 className="font-semibold text-gray-900">{reply.name}</h6>
                                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full flex items-center gap-1">
                                        <FaChalkboardTeacher />
                                        Instructor
                                      </span>
                                    </div>
                                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{reply.date}</span>
                                  </div>
                                  <p className="text-gray-700">{reply.content}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3 space-y-6">
            {/* Progress Widget */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-soft border border-white/60 p-6 sticky top-20">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <FaRocket className="text-[#3baee9]" />
                Your Learning Journey
              </h3>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-semibold text-gray-700">React Mastery Course</span>
                    <span className="font-bold text-[#3baee9]">{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-[#3baee9] to-[#2a9fd8] h-3 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 bg-[#e8f7ff] rounded-2xl border border-[#3baee9]/20">
                    <div className="text-lg font-bold text-[#3baee9]">12</div>
                    <div className="text-xs text-gray-600">Lessons</div>
                  </div>
                  <div className="p-3 bg-green-50 rounded-2xl border border-green-100">
                    <div className="text-lg font-bold text-green-600">8</div>
                    <div className="text-xs text-gray-600">Completed</div>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-2xl border border-purple-100">
                    <div className="text-lg font-bold text-purple-600">3</div>
                    <div className="text-xs text-gray-600">Projects</div>
                  </div>
                </div>
                
                <button className="w-full py-4 bg-gradient-to-r from-[#3baee9] to-[#2a9fd8] text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2">
                  <FaChevronRight />
                  Continue Learning
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-[#3baee9]/5 to-[#2a9fd8]/5 rounded-3xl border border-[#3baee9]/20 p-6 backdrop-blur-sm">
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FaCogs className="text-[#3baee9]" />
                Quick Actions
              </h4>
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 p-3 bg-white/50 rounded-2xl border border-gray-200/50 hover:border-[#3baee9]/20 transition-all duration-200">
                  <FaDownload className="text-[#3baee9]" />
                  <span className="font-medium">Download Resources</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 bg-white/50 rounded-2xl border border-gray-200/50 hover:border-[#3baee9]/20 transition-all duration-200">
                  <FaBullseye className="text-[#3baee9]" />
                  <span className="font-medium">Take Quiz</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 bg-white/50 rounded-2xl border border-gray-200/50 hover:border-[#3baee9]/20 transition-all duration-200">
                  <FaComment className="text-[#3baee9]" />
                  <span className="font-medium">Ask Instructor</span>
                </button>
              </div>
            </div>

            {/* Course Info */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-soft border border-white/60 p-6">
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FaGraduationCap className="text-[#3baee9]" />
                Course Details
              </h4>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Instructor:</span>
                  <span className="font-medium text-gray-900">Alex Thompson</span>
                </div>
                <div className="flex justify-between">
                  <span>Level:</span>
                  <span className="font-medium text-[#3baee9]">Intermediate</span>
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
        </div>
      </div>
    </div>
  );
};

export default BlogDetailPage;
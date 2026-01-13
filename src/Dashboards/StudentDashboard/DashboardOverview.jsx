import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyCourses, selectCourses } from "../../../slices/courseSlice";
import { API_ORIGIN } from "../../api/index.js";
import { useNavigate } from "react-router-dom";
import {
  AiFillStar,
  AiOutlineCheckCircle,
  AiOutlineBook,
  AiOutlineLineChart,
  AiFillThunderbolt,
  AiOutlineDashboard,
  AiOutlineRocket,
  AiOutlineFlag,
  AiOutlineTeam,
} from "react-icons/ai";

const DashboardOverview = ({ userData, setActiveSection }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const enrolledCourses = useSelector(selectCourses);
  const { loading } = useSelector((state) => state.courses);

  useEffect(() => {
    dispatch(fetchMyCourses());
  }, [dispatch]);

  const resolveImageUrl = (image) => {
    if (!image) return null;
    if (typeof image !== "string") return null;
    if (image.startsWith("http://") || image.startsWith("https://")) return image;
    if (image.startsWith("/")) return `${API_ORIGIN}${image}`;
    return `${API_ORIGIN}/storage/${image}`;
  };

  const PLACEHOLDER_IMAGE = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmVmZWZlIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZpbGw9IiM5OTkiIGZvbnQtc2l6ZT0iMTQiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZHk9Ii4zZW0iIHRleHQtYW5jaG9yPSJtaWRkbGUiPkJpdGNvZGVyIExhYnM8L3RleHQ+PC9zdmc+";

  const stats = [
    {
      label: "Learning Points",
      value: userData.points,
      change: "+124",
      trend: "up",
      icon: <AiFillStar className="text-yellow-500" size={26} />,
    },
    {
      label: "Courses Completed",
      value: userData.completedCourses,
      change: "+2",
      trend: "up",
      icon: <AiOutlineCheckCircle className="text-green-600" size={26} />,
    },
    {
      label: "Active Courses",
      value: enrolledCourses.length,
      change: "0",
      trend: "stable",
      icon: <AiOutlineBook className="text-blue-500" size={26} />,
    },
    {
      label: "Completion Rate",
      value: `${userData.completionRate}%`,
      change: "+5%",
      trend: "up",
      icon: <AiOutlineLineChart className="text-purple-600" size={26} />,
    },
  ];

  const recentCourses = enrolledCourses.slice(0, 3).map(course => ({
    id: course.id,
    title: course.title,
    progress: course.progress || 0,
    nextLesson: course.status === 'pending' ? 'Pending Approval' : 'Continue Learning',
    timeLeft: course.duration || "N/A",
    thumbnail: resolveImageUrl(course.image) || PLACEHOLDER_IMAGE,
  }));

  if (loading && enrolledCourses.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-dark"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {userData.name}! 👋
        </h1>
        <p className="text-primary-light">
          Continue your learning journey where you left off.
        </p>
        <div className="flex items-center space-x-4 mt-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-sm">Level {userData.level}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
            <span className="text-sm">{userData.streak} day streak</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-2xl">{stat.icon}</div>
              <span
                className={`text-sm font-medium ${stat.trend === "up"
                  ? "text-green-600"
                  : stat.trend === "down"
                    ? "text-red-600"
                    : "text-gray-600"
                  }`}
              >
                {stat.change}
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {stat.value}
            </div>
            <div className="text-sm text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Courses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Continue Learning
            </h2>
            <button className="text-primary hover:text-primary-dark text-sm font-medium">
              View All
            </button>
          </div>

          <div className="space-y-4">
            {recentCourses.map((course) => (
              <div
                key={course.id}
                className="flex items-center space-x-4 p-4 rounded-lg border border-gray-200 hover:border-primary/30 transition-colors duration-200"
              >
                <div className="w-12 h-12 bg-primary-light rounded-lg flex items-center justify-center text-xl overflow-hidden">
                  {typeof course.thumbnail === 'string' ? (
                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                  ) : (
                    course.thumbnail
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{course.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {course.nextLesson}
                  </p>

                  <div className="flex items-center justify-between mt-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500">
                      {course.timeLeft}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Quick Actions
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setActiveSection('courses')}
              className="p-4 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary-light transition-all duration-200 text-center"
            >
              <AiOutlineRocket className="text-primary mx-auto mb-2" size={26} />
              <div className="font-medium text-gray-900 text-sm">
                Resume Learning
              </div>
            </button>

            <button
              onClick={() => navigate('/prices')}
              className="p-4 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary-light transition-all duration-200 text-center"
            >
              <AiFillThunderbolt className="text-primary mx-auto mb-2" size={26} />
              <div className="font-medium text-gray-900 text-sm">Pricing Plans</div>
            </button>

            <button
              onClick={() => navigate('/courses')}
              className="p-4 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary-light transition-all duration-200 text-center"
            >
              <AiOutlineBook className="text-primary mx-auto mb-2" size={26} />
              <div className="font-medium text-gray-900 text-sm">
                Browse Courses
              </div>
            </button>

            <button
              onClick={() => setActiveSection('settings')}
              className="p-4 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary-light transition-all duration-200 text-center"
            >
              <AiOutlineTeam className="text-primary mx-auto mb-2" size={26} />
              <div className="font-medium text-gray-900 text-sm">
                Account Settings
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;

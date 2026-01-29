// src/Dashboards/StudentDashboard/DashboardOverview.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyCourses, selectMyCourses, fetchUserActivity, selectUserActivity } from "../../../slices/courseSlice";
import { API_ORIGIN } from "../../api/index.js";
import { useNavigate } from "react-router-dom";
import LinearProgress from "../../Component/UI/LinearProgress";
import {
  FiBookOpen,
  FiCheckCircle,
  FiTrendingUp,
  FiAward,
  FiClock,
  FiZap,
  FiTarget,
  FiChevronRight,
  FiPlay,
  FiLayout,
  FiExternalLink,
  FiActivity,
  FiBarChart2,
} from "react-icons/fi";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const DashboardOverview = ({ userData, setActiveSection }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const enrolledCourses = useSelector(selectMyCourses);
  const userActivity = useSelector(selectUserActivity) || [];
  const loading = useSelector((state) => state.courses.myCoursesLoading);
  const [timeRange, setTimeRange] = useState('this_week');

  useEffect(() => {
    if (userData?.id) {
      dispatch(fetchMyCourses());
      dispatch(fetchUserActivity());
    }
  }, [dispatch, userData?.id]);

  const resolveImageUrl = (url) => {
    if (!url) return PLACEHOLDER_IMAGE;
    const stringUrl = String(url).trim();
    if (stringUrl.startsWith("http") || stringUrl.startsWith("data"))
      return stringUrl;
    let cleanPath = stringUrl.startsWith("/")
      ? stringUrl.substring(1)
      : stringUrl;
    if (cleanPath.startsWith("storage/")) {
      return `${API_ORIGIN}/${cleanPath}`;
    }
    return `${API_ORIGIN}/storage/${cleanPath}`;
  };

  const PLACEHOLDER_IMAGE =
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=400&h=300&auto=format&fit=crop";

  // Calculate Chart Data based on userActivity
  const chartData = useMemo(() => {
    // Initialize days
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const hours = [0, 0, 0, 0, 0, 0, 0];

    // Helper to get day index (0=Mon, 6=Sun) to match our label array
    const getDayIndex = (date) => {
      let day = date.getDay(); // 0=Sun, 1=Mon...
      return day === 0 ? 6 : day - 1;
    };

    // Filter activity for this week
    const now = new Date();
    const startOfWeek = new Date(now);
    const day = startOfWeek.getDay() || 7; // Make Sunday 7
    if (day !== 1) {
      startOfWeek.setHours(-24 * (day - 1));
    } else {
      startOfWeek.setHours(0, 0, 0, 0); // It is monday
    }
    // Correction: ensure we go back to the previous Monday correctly
    // The logic: "Get current date, subtract (day of week - 1) days"
    const currentDay = now.getDay();
    const diff = now.getDate() - currentDay + (currentDay === 0 ? -6 : 1); // adjust when day is sunday
    const monday = new Date(now.setDate(diff));
    monday.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(monday);
    endOfWeek.setDate(monday.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    // Process activity data
    // Assuming userActivity has { updated_at: timestamp, time_spent: seconds } or similar
    // Note: The API returns user_progress records. We typically check updated_at for when it happened.
    userActivity.forEach(activity => {
      if (!activity.updated_at) return;
      const actDate = new Date(activity.updated_at);

      // Check if within current week window
      if (actDate >= monday && actDate <= endOfWeek) {
        const dayIdx = getDayIndex(actDate);
        // Assuming we track 'time_spent' in seconds, converting to hours
        // If time_spent is not available, we can estimate e.g. 0.5h per completed lesson
        // Adjust this logic based on actual data structure availability
        const durationHours = activity.time_spent ? (activity.time_spent / 3600) : 0.5;
        hours[dayIdx] += durationHours;
      }
    });

    // Round to 1 decimal
    const roundedHours = hours.map(h => Math.round(h * 10) / 10);

    const totalHours = roundedHours.reduce((a, b) => a + b, 0);
    const dailyAvg = totalHours / (new Date().getDay() || 7); // Avg over days passed so far or 7

    return {
      labels: days,
      data: roundedHours,
      total: totalHours.toFixed(1),
      avg: dailyAvg.toFixed(1)
    };
  }, [userActivity]);

  const stats = [
    {
      label: "Certificates",
      value: userData.completedCourses,
      icon: <FiAward />,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Enrolled",
      value: enrolledCourses.length,
      icon: <FiBookOpen />,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Avg. Progress",
      value: `${userData.completionRate}%`,
      icon: <FiTrendingUp />,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Learning Hours",
      value: `${chartData.total}h`, // Dynamic now
      icon: <FiClock />,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  const recentCourses = enrolledCourses.slice(0, 3).map((course) => ({
    id: course.id,
    title: course.title,
    progress: course.progress || 0,
    nextLesson: "Current Module: Fundamentals",
    timeLeft: "Approx. 4h remaining",
    thumbnail: resolveImageUrl(course.image),
    category: course.category?.name || "Academic",
  }));

  if (loading && enrolledCourses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
        <div className="w-10 h-10 border-4 border-gray-100 border-t-primary rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-500 font-medium">
          Loading your activity...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-full mx-auto space-y-8 pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-gray-500 mt-1 font-medium italic">
            Welcome back, {userData.name}. You're doing great!
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/courses")}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg font-semibold text-sm hover:bg-primary-dark cursor-pointer transition-all shadow-sm"
          >
            <FiZap className="text-amber-400" />
            Find New Courses
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-5 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-3">
                  {stat.label}
                </p>
                <h3 className="text-3xl font-bold text-gray-900 tracking-tight">
                  {stat.value}
                </h3>
              </div>
              <div
                className={`w-11 h-11 ${stat.bg} ${stat.color} rounded-lg flex items-center justify-center text-lg flex-shrink-0`}
              >
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Learning Progress */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
              <div className="w-1 h-6 bg-primary rounded-full"></div>
              Learning Progress
            </h2>
            <button
              onClick={() => setActiveSection("courses")}
              className="text-sm font-bold text-gray-400 hover:text-primary transition-colors flex items-center gap-1"
            >
              Manage Courses
              <FiChevronRight />
            </button>
          </div>

          <div className="space-y-4">
            {recentCourses.length > 0 ? (
              recentCourses.map((course) => (
                <div
                  key={course.id}
                  className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-5 group"
                >
                  <div className="md:w-48 h-32 rounded-xl overflow-hidden shrink-0 relative">
                    <img
                      src={course.thumbnail}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      alt={course.title}
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                    <div className="absolute top-2 left-2 px-2 py-1 bg-white/90 backdrop-blur-sm rounded text-[9px] font-black uppercase tracking-tight text-gray-900 border border-gray-100 shadow-sm">
                      {course.category}
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors cursor-pointer">
                        {course.title}
                      </h3>
                      <p className="text-sm text-gray-500 font-medium mt-1">
                        {course.nextLesson}
                      </p>
                    </div>
                    <div className="space-y-3 mt-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          Progress
                        </span>
                        <span className="text-xs font-black text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                          {course.progress}%
                        </span>
                      </div>
                      <div className="relative w-full h-2.5 bg-gray-100 rounded-full overflow-hidden border border-gray-50 p-[1px]">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-primary-dark rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(59,174,233,0.3)]"
                          style={{ width: `${course.progress}%` }}
                        >
                          <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[length:20px_20px] animate-[progress-bar-stripes_1s_linear_infinite]"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="md:w-32 flex flex-row md:flex-col justify-between items-center md:items-end border-t md:border-t-0 md:border-l border-gray-50 pt-4 md:pt-0 md:pl-4">
                    <div className="hidden md:block text-right mb-4">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Est. Time
                      </p>
                      <p className="text-sm font-bold text-gray-700">
                        {course.id % 2 === 0 ? "8.5" : "12.2"}h
                      </p>
                    </div>
                    <button
                      onClick={() => navigate(`/video/1?courseId=${course.id}`)}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-all shadow-lg active:scale-95 group/btn"
                    >
                      <FiPlay className="group-hover/btn:scale-110 transition-transform" />
                      Resume
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-gray-50/50 border-2 border-dashed border-gray-200 rounded-2xl p-20 text-center">
                <FiLayout className="mx-auto text-gray-300 text-4xl mb-4" />
                <h4 className="text-gray-900 font-bold text-lg">
                  No active learning paths
                </h4>
                <p className="text-gray-500 text-sm max-w-xs mx-auto mt-2">
                  Start your first course to begin tracking your progress here.
                </p>
                <button
                  onClick={() => navigate("/courses")}
                  className="mt-6 px-8 py-3 bg-primary text-white rounded-xl font-bold shadow-sm hover:translate-y-[-2px] transition-all"
                >
                  Browse Academy
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Interactive Widgets */}
        <div className="lg:col-span-4 space-y-8">
          {/* Course Progress Chart - Weekly Analytics */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-gray-900 text-lg mb-1 flex items-center gap-2">
                  <FiBarChart2 className="text-primary" />
                  Weekly Measurement
                </h3>
                <p className="text-xs text-gray-500 font-medium">
                  Your activity ({timeRange === 'this_week' ? 'This Week' : 'Last Week'})
                </p>
              </div>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="text-xs font-bold text-gray-600 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 outline-none focus:border-primary transition-colors cursor-pointer"
              >
                <option value="this_week">This Week</option>
                <option value="last_week" disabled>Last Week</option>
              </select>
            </div>

            {/* Chart Area */}
            <div className="h-[220px] w-full mb-6">
              <Bar
                data={{
                  labels: chartData.labels,
                  datasets: [
                    {
                      label: "Hours Learned",
                      data: chartData.data,
                      backgroundColor: (context) => {
                        const ctx = context.chart.ctx;
                        const gradient = ctx.createLinearGradient(0, 0, 0, 220);
                        gradient.addColorStop(0, "#3baee9");
                        gradient.addColorStop(1, "#3baee9aa");
                        return gradient;
                      },
                      borderRadius: 6,
                      barPercentage: 0.6,
                      categoryPercentage: 0.7,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false,
                    },
                    tooltip: {
                      backgroundColor: "#1f2937",
                      titleFont: { size: 13, family: "Inter" },
                      bodyFont: { size: 12, family: "Inter" },
                      padding: 10,
                      cornerRadius: 8,
                      displayColors: false,
                      callbacks: {
                        label: (context) => `${context.raw} hrs learned`,
                      },
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: {
                        color: "#f3f4f6",
                        borderDash: [5, 5],
                        drawBorder: false,
                      },
                      ticks: {
                        font: { size: 10, family: "Inter" },
                        color: "#9ca3af",
                        padding: 10,
                      },
                      suggestedMax: 5,
                    },
                    x: {
                      grid: {
                        display: false,
                      },
                      ticks: {
                        font: { size: 11, family: "Inter", weight: "500" },
                        color: "#6b7280",
                      },
                    },
                  },
                }}
              />
            </div>

            {/* Weekly Summary Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Total Hours
                  </span>
                </div>
                <div className="flex items-end justify-between">
                  <span className="text-xl font-bold text-gray-900">{chartData.total}h</span>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100/50 px-1.5 py-0.5 rounded">
                    +12%
                  </span>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Daily Avg
                  </span>
                </div>
                <div className="flex items-end justify-between">
                  <span className="text-xl font-bold text-gray-900">{chartData.avg}h</span>
                </div>
              </div>
            </div>

            {/* Minimal Active Courses List */}
            <div className="mt-6 pt-5 border-t border-gray-100 space-y-3">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                Active Priority
              </h4>
              {(enrolledCourses || [])
                .filter(c => c.progress > 0 && c.progress < 100)
                .slice(0, 3)
                .map((course, idx) => (
                  <div
                    key={course.id}
                    className="flex items-center justify-between group cursor-pointer hover:bg-gray-50 p-2 rounded-lg -mx-2 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${idx === 0
                            ? "bg-primary/10 text-primary"
                            : "bg-gray-100 text-gray-500"
                          }`}
                      >
                        {idx + 1}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-800 line-clamp-1 group-hover:text-primary transition-colors">
                          {course.title}
                        </p>
                        <p className="text-[10px] text-gray-400 font-medium">
                          {course.progress || 0}% Completed
                        </p>
                      </div>
                    </div>
                    <div className="w-16 h-1 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${course.progress || 0}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              {(!enrolledCourses || enrolledCourses.filter(c => c.progress > 0 && c.progress < 100).length === 0) && (
                <div className="text-center py-4 text-xs text-gray-400 italic">No active courses this week</div>
              )}
            </div>
          </div>

          {/* Premium Call to Action */}
          <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-2xl text-white shadow-xl relative overflow-hidden group">
            <div className="relative z-10">
              <h4 className="font-bold text-lg mb-2 text-black leading-tight">
                Elite Mentorship
              </h4>
              <p className="text-[11px] text-gray-400 font-medium mb-5 leading-relaxed">
                Join 1-on-1 sessions with industry leads and accelerate your
                career path.
              </p>
              <button
                onClick={() => navigate("/prices")}
                className="w-full py-2.5 bg-primary text-white rounded-lg text-xs font-black uppercase tracking-widest hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 translate-y-0 hover:-translate-y-1"
              >
                Unlock Access
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;

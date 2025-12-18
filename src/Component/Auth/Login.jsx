import React, { useState, useEffect } from "react";
import image from "../../assets/login image.jpg";
import { Link, useNavigate } from "react-router-dom";
import { login, clearError } from "../../../slices/AuthSlice";
import { useSelector, useDispatch } from 'react-redux';

const LoginPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, error, loading } = useSelector(state => state.auth);
  const dispatch = useDispatch();


  const [formData, setFormData] = useState({ email: "", password: "" })

   useEffect(() => {
     if (isAuthenticated && user) {
       let redirectPath = '/';
       if (user.role === 'admin') {
         redirectPath = '/admindashboard';
       } else if (user.role === 'instructor') {
         // If instructor is approved, go to main dashboard, else to profile creation
         redirectPath = user.instructor_approved ? '/teachermaindashboard' : '/teacherprofile';
       } else if (user.role === 'moderator') {
         redirectPath = '/admindashboard'; // Moderators use admin dashboard for now
       } else if (user.role === 'student') {
         redirectPath = '/studentdashboard';
       }
       navigate(redirectPath);
     }
   }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    // Clear errors when component mounts
    dispatch(clearError());
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(formData));
  };

  // Redirect based on role
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "admin") {
        navigate("/admindashboard"); // Admin
      } else if (user.is_active && user.role === "instructor") {
        navigate("/teacherprofile"); // Instructor
      } else {
        navigate("/");
      }
    }
  }, [isAuthenticated, user, navigate]);


  return (
    <div className="min-h-screen flex">
      {/* Left side image */}
      <div
        className="hidden lg:flex lg:flex-1 relative items-center justify-center bg-gradient-to-br from-[#3baee9] to-[#2a9fd8] overflow-hidden"
        style={{
          backgroundImage: `url(${image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="relative z-10 text-white text-center max-w-md space-y-6 px-6">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center shadow-xl transform hover:scale-105 transition-transform duration-300 border border-white/30">
              <span className="text-white font-bold text-3xl">BL</span>
            </div>
            <div className="text-left">
              <h1 className="text-4xl font-bold">BitCoderLabs</h1>
              <p className="text-white/80 mt-1 text-lg">Learn. Code. Succeed.</p>
            </div>
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">Accelerate Your Learning</h2>
            <p className="text-white/80 text-sm">
              Join thousands of developers and boost your coding skills today.
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center bg-gray-50 p-6">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-white p-6 text-center">
            <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
            <p className="text-gray-500 mt-1">
              Sign in to continue your coding journey
            </p>
          </div>

          <div className="p-8 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#3baee9] focus:border-transparent transition-all duration-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#3baee9] focus:border-transparent transition-all duration-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  required
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#3baee9] hover:bg-[#2a9fd8] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl shadow-md transition-all duration-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#3baee9] focus:ring-opacity-50"
              >
                {loading ? 'Signing In...' : 'Log In'}
              </button>
            </form>

            {/* Links */}
            <div className="mt-6 flex items-center justify-between text-sm">
              <Link to="/ForgotPassword" className="text-[#3baee9] hover:text-[#2a9fd8] font-medium">
                Forgot Password?
              </Link>
              <span className="text-gray-400">or</span>
              <Link to="/Register" className="text-[#3baee9] hover:text-[#2a9fd8] font-medium">
                Register Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

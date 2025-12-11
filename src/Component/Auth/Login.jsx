import React, { useState } from "react";
import image from "../../assets/login image.jpg";
import { Link, useNavigate } from "react-router-dom";
import {login} from "../../../slices/AuthSlice"
import { useSelector, useDispatch} from 'react-redux'

const LoginPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, error } = useSelector(state => state.auth);  
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    dispatch(login(formData))
  };

  return (
    <div className="min-h-screen flex">
      <div
        className="hidden lg:flex lg:flex-1 relative items-center justify-center bg-gradient-to-br from-[#3baee9] to-[#2a9fd8] overflow-hidden"
        style={{
          backgroundImage: `url(${image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {" "}
        <div className="absolute inset-0 bg-black/70"></div>{" "}
        <div className="relative z-10 text-white text-center max-w-md space-y-6 px-6">
          {" "}
          <div className="flex items-center justify-center gap-4 mb-4">
            {" "}
            <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center shadow-xl transform hover:scale-105 transition-transform duration-300 border border-white/30">
              {" "}
              <span className="text-white  font-bold text-3xl">BL</span>{" "}
            </div>{" "}
            <div className="text-left">
              {" "}
              <h1 className="text-4xl font-bold">BitCoderLabs</h1>{" "}
              <p className="text-white/80 mt-1 text-lg">
                Learn. Code. Succeed.
              </p>{" "}
            </div>{" "}
          </div>{" "}
          <div className="space-y-4">
            {" "}
            <h2 className="text-3xl font-bold">
              Accelerate Your Learning
            </h2>{" "}
            <p className="text-white/80 text-sm">
              Join thousands of developers and boost your coding skills today.{" "}
            </p>{" "}
          </div>{" "}
        </div>{" "}
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#3baee9] focus:border-transparent transition-all duration-200 hover:bg-gray-50"
                  required
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#3baee9] focus:border-transparent transition-all duration-200 hover:bg-gray-50"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#3baee9] hover:bg-[#2a9fd8] text-white font-semibold py-3 rounded-xl shadow-md transition-all duration-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#3baee9] focus:ring-opacity-50"
              >
                Log In
              </button>
            </form>

            <div className="mt-6 flex items-center justify-between text-sm">
              <Link to="/ForgotPassword">
                <a
                  href="#"
                  className="text-[#3baee9] hover:text-[#2a9fd8] font-medium transition-colors"
                >
                  Forgot Password?
                </a>
              </Link>
              <span className="text-gray-400">or</span>
              <Link to="/Register">
                <a
                  href="#"
                  className="text-[#3baee9] hover:text-[#2a9fd8] font-medium transition-colors"
                >
                  Register Now
                </a>
              </Link>
            </div>


            <div className="grid grid-cols-2 gap-3 mt-4">
              <button className="flex items-center justify-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </button>
              <button className="flex items-center justify-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md">
                <svg
                  className="w-5 h-5 text-blue-500"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

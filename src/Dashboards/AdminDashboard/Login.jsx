import React, { useState } from "react";
import { Eye, EyeOff, Lock, Mail, Shield, Check, CheckCircle, AlertCircle, LogIn } from "lucide-react";

const AnimatedBackground = () => (
  <div className="fixed inset-0 overflow-hidden">
    {/* Gradient background */}
    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50"></div>

    <div className="absolute top-1/4 -left-32 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
    <div className="absolute top-1/2 -right-32 w-64 h-64 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
    <div className="absolute -bottom-32 left-1/2 transform -translate-x-1/2 w-64 h-64 bg-cyan-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>

    {/* Grid pattern */}
    <div className="absolute inset-0 opacity-5">
      <div className="absolute inset-0" style={{
        backgroundImage: `linear-gradient(to right, #3baee9 1px, transparent 1px),
                         linear-gradient(to bottom, #3baee9 1px, transparent 1px)`,
        backgroundSize: '50px 50px'
      }}></div>
    </div>
  </div>
);

// Security tips component
const SecurityTips = () => (
  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-6">
    <div className="flex items-center gap-3 mb-2">
      <div className="p-2 bg-white rounded-lg shadow-sm">
        <Shield className="text-primary" size={20} />
      </div>
      <h3 className="font-semibold text-gray-900">Security Tips</h3>
    </div>
    <ul className="space-y-3">
      {[
        "Ensure you're logging in from a secure network",
        "Never share your credentials with anyone",
        "Enable two-factor authentication",
        "Regularly update your password"
      ].map((tip, index) => (
        <li key={index} className="flex items-start gap-2">
          <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
          <span className="text-sm text-gray-600">{tip}</span>
        </li>
      ))}
    </ul>
  </div>
);

// Input field component
const InputField = ({ icon, type, placeholder, value, onChange, error, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-1">
      <div className="relative">
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
          {icon}
        </div>
        <input
          type={type === "password" && showPassword ? "text" : type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full pl-4 pr-4 py-4 bg-white/80 backdrop-blur-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${error ? "border-red-300" : "border-gray-300 hover:border-blue-400"
            }`}
          {...props}
        />
        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
      {error && (
        <div className="flex items-center gap-1 text-red-500 text-sm">
          <AlertCircle size={14} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

// Login page component
export default function Login() {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!credentials.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!credentials.password) {
      newErrors.password = "Password is required";
    } else if (credentials.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    setTimeout(() => {
      setLoginSuccess(true);
      setIsLoading(false);

      setTimeout(() => {
        setLoginSuccess(false);
        // In real app, redirect to dashboard
        console.log("Login successful, redirecting...");
      }, 3000);
    }, 1500);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <AnimatedBackground />

      <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

        {/* Left side - Brand & Info */}
        <div className="hidden lg:block ">
          <div className="bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-white/20">
            {/* Logo */}
            <div className="mb-3">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative">
                  <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary-dark rounded-full flex items-center justify-center shadow-lg">
                    <Check className="w-4 h-4 text-white" />

                  </div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-primary bg-clip-text text-transparent">
                    Bitcoderlabs
                  </h1>
                  <p className="text-gray-600 text-md font-medium">Admin Dashboard</p>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-gray-900 mb-3 leading-tight">
                Secure Access to Your <span className="text-primary">Digital Workspace</span>
              </h2>

              <p className="text-gray-600 text-sm  leading-relaxed">
                Welcome back! Please enter your credentials to access the admin dashboard and manage your platform efficiently.
              </p>
            </div>

            <SecurityTips />

          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-1 sm:p-6 mx-10 border border-white/20">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Bitcoderlabs
                </h1>
                <p className="text-gray-600 text-sm">Admin Dashboard</p>
              </div>
            </div>
          </div>

          {/* Form Header */}
          <div className="mb-5">
            <h2 className="text-2xl font-bold text-primary-dark mb-2">Welcome Back</h2>
            <p className="text-gray-600">Sign in to your admin account</p>
          </div>

          {/* Success Message */}
          {loginSuccess && (
            <div className="mb-6 px-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
              <div className="flex items-center gap-3">
                <CheckCircle className="text-green-500" size={24} />
                <div>
                  <p className="font-medium text-green-800">Login Successful!</p>
                  <p className="text-sm text-green-600">Redirecting to dashboard...</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <InputField
              icon={<Mail size={20} />}
              type="email"
              name="email"
              placeholder="admin@bitcoderlabs.com"
              value={credentials.email}
              onChange={handleChange}
              error={errors.email}
              autoComplete="email"
            />

            {/* Password Field */}
            <InputField
              icon={<Lock size={20} />}
              type="password"
              name="password"
              placeholder="Enter your password"
              value={credentials.password}
              onChange={handleChange}
              error={errors.password}
              autoComplete="current-password"
            />

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={credentials.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <span className="text-gray-700 text-sm">Remember me</span>
              </label>
              <a
                href="#"
                className="text-primary hover:text-primary-dark text-sm font-medium transition-colors"
              >
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 px-6 bg-primary cursor-pointer text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-3 ${isLoading ? "opacity-80 cursor-not-allowed" : "hover:from-blue-700 hover:to-cyan-600"
                }`}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <LogIn size={20} />
                  <span>Sign In to Dashboard</span>
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 bg-white text-gray-500 text-sm">Or continue with</span>
              </div>
            </div>



            {/* Footer */}
            <div className="text-center pt-6 border-t border-gray-200">
              <p className="text-gray-600 text-sm">
                Need help?{" "}
                <a href="mailto:support@bitcoderlabs.com" className="text-blue-600 hover:text-blue-700 font-medium">
                  Contact support
                </a>
              </p>
              <p className="text-gray-500 text-xs mt-2">
                © {new Date().getFullYear()} Bitcoderlabs. All rights reserved.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Add custom animations to global CSS
const GlobalStyles = () => (
  <style jsx global>{`
    @keyframes blob {
      0% {
        transform: translate(0px, 0px) scale(1);
      }
      33% {
        transform: translate(30px, -50px) scale(1.1);
      }
      66% {
        transform: translate(-20px, 20px) scale(0.9);
      }
      100% {
        transform: translate(0px, 0px) scale(1);
      }
    }
    
    .animate-blob {
      animation: blob 7s infinite;
    }
    
    .animation-delay-2000 {
      animation-delay: 2s;
    }
    
    .animation-delay-4000 {
      animation-delay: 4s;
    }
  `}</style>
);

// Usage: Wrap your app with GlobalStyles component
export { GlobalStyles };
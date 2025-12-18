import React, { useState, useEffect } from "react";
import AuthLayout from "./AuthLayout";
import { useNavigate, Link } from "react-router-dom";
import Button from "../UI/Button";
import { FaGraduationCap, FaChalkboardTeacher, FaShieldAlt } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { register, clearError } from "../../../slices/AuthSlice";

export default function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, loading, error, user } = useSelector(state => state.auth);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "",
  });

  useEffect(() => {
    if (isAuthenticated && user) {
      // Redirect based on role
      const roleRoutes = {
        admin: '/admindashboard',
        instructor: '/teacherprofile',
        moderator: '/admindashboard', // Moderators use admin dashboard for now
        student: '/studentdashboard'
      };
      const redirectPath = roleRoutes[user.role] || '/';
      navigate(redirectPath);
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    // Clear errors when component mounts
    dispatch(clearError());
  }, [dispatch]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  console.log(form)
  async function registerUser() {
    const response = await fetch("http://127.0.0.1:8000/api/v1/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });
    const data = await response.json();
    console.log(data);
    return data.success;
  }


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.password_confirmation) {
      alert("Passwords don't match!");
      return;
    }

    dispatch(register(form));
  };

  const roles = [
    {
      value: "student",
      label: "Student",
      description: "Learn and enroll in courses",
      icon: <FaGraduationCap size={18} className="text-blue-600" />,
    },
    {
      value: "instructor",
      label: "Instructor",
      description: "Create and teach courses",
      icon: <FaChalkboardTeacher size={18} className="text-purple-600" />,
    },
  ];



  return (
    <AuthLayout
      title="Create account"
      subtitle="Sign up to get access to the platform"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          type="text"
          placeholder="Full name"
          className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-colors duration-200"
          required
          disabled={loading}
        />
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          type="email"
          placeholder="Email address"
          className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-colors duration-200"
          required
          disabled={loading}
        />

        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Select Your Role *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {roles.map((role) => (
              <div
                key={role.value}
                className={`relative border-2 rounded-lg px-2 py-1 cursor-pointer transition-all duration-200 ${form.role === role.value
                  ? "border-primary bg-primary/5"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                onClick={() => setForm({ ...form, role: role.value })}
              >
                <input
                  type="radio"
                  name="role"
                  value={role.value}
                  checked={form.role === role.value}
                  onChange={handleChange}
                  className="sr-only"
                  disabled={loading}
                />
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">{role.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 text-sm">
                      {role.label}
                    </div>
                    <div className="text-[9px] text-gray-500 mt-1">
                      {role.description}
                    </div>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${form.role === role.value
                      ? "border-primary bg-primary"
                      : "border-gray-300"
                      }`}
                  >
                    {form.role === role.value && (
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <input
          name="password"
          value={form.password}
          onChange={handleChange}
          type="password"
          placeholder="Password (min 8 chars)"
          className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-colors duration-200"
          required
          disabled={loading}
          minLength={8}
        />
        <input
          name="password_confirmation"
          value={form.password_confirmation}
          onChange={handleChange}
          type="password"
          placeholder="Confirm password"
          className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-colors duration-200"
          required
          disabled={loading}
        />

        <Button
          type="submit"
          text={loading ? "Creating Account..." : "Create Account"}
          className="w-full bg-primary text-white hover:bg-primary-dark transition-colors duration-200"
          disabled={loading}
        />

        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-primary-dark font-medium hover:underline transition-colors duration-200"
          >
            Login
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
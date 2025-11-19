import React, { useState } from "react";
import AuthLayout from "./AuthLayout";
// import { useAuth } from "./AuthLogic";
import { useNavigate, Link } from "react-router-dom";
import Button from "../UI/Button";
import { FaGraduationCap, FaChalkboardTeacher, FaCog, FaShieldAlt } from "react-icons/fa";


export default function Register() {
  const register = (data) => {
    console.log("Mock register called", data);
    // Basic client-side validation example
    if (!data.email || !data.password) return false;
    return true;
  };
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student", // Default role
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const success = register({
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      confirmPassword: form.confirmPassword,
      role: form.role,
    });

    setLoading(false);
    if (success) {
      alert("Account created successfully!");
      navigate("/login");
    }
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
  {
    value: "moderator",
    label: "Moderator",
    description: "Moderate content and users",
    icon: <FaShieldAlt size={18} className="text-orange-600" />,
  },
];


  return (
    <AuthLayout
      title="Create account"
      subtitle="Sign up to get access to the platform"
    >
      <form onSubmit={handleSubmit} className="space-y-4 ">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          type="text"
          placeholder="Full name"
          className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-colors duration-200"
          required
        />
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          type="email"
          placeholder="Email address"
          className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-colors duration-200"
          required
        />

        {/* Role Selection */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Select Your Role *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {roles.map((role) => (
              <div
                key={role.value}
                className={`relative border-2 rounded-lg px-2 py-1 cursor-pointer transition-all duration-200 ${
                  form.role === role.value
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
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      form.role === role.value
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
          placeholder="Password (min 6 chars)"
          className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-colors duration-200"
          required
        />
        <input
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
          type="password"
          placeholder="Confirm password"
          className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-colors duration-200"
          required
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
import React, { useState } from "react";
import AuthLayout from "./AuthLayout";
// import { useAuth } from "./AuthLogic";
import { useNavigate, Link } from "react-router-dom";
import Button from "../UI/Button";

export default function Register() {
  // If AuthLogic/provider isn't wired yet, provide a safe mock so UI works and lint passes
  // Replace with: const { register } = useAuth(); when AuthLogic is available
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
    });

    setLoading(false);
    if (success) {
      alert("Account created successfully!");
      navigate("/login");
    }
  };

  return (
    <AuthLayout
      title="Create account"
      subtitle="Sign up to get access to the platform"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          type="text"
          placeholder="Full name"
          className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none"
          required
        />
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          type="email"
          placeholder="Email address"
          className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none"
          required
        />
        <input
          name="password"
          value={form.password}
          onChange={handleChange}
          type="password"
          placeholder="Password (min 6 chars)"
          className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none"
          required
        />
        <input
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
          type="password"
          placeholder="Confirm password"
          className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none"
          required
        />

        <Button
          type="submit"
          text={loading ? "Creating..." : "Create account"}
          className="w-full bg-primary text-white"
        />

        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-primary-dark font-medium hover:underline"
          >
            Login
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

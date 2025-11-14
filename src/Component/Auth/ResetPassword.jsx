// src/Component/Auth/ResetPassword.jsx
import React, { useState } from "react";
import AuthLayout from "./AuthLayout";
// import { useAuth } from "./AuthLogic";
import { useNavigate } from "react-router-dom";
import Button from "../UI/Button";
import { Link } from "react-router-dom";

export default function ResetPassword() {
  // If no auth implementation is wired, provide a lightweight mock to avoid runtime errors
  // Replace with: const { resetPassword } = useAuth(); when AuthLogic is available
  const resetPassword = ({ token, newPassword, confirmPassword }) => {
    console.log("Mock resetPassword", { token, newPassword, confirmPassword });
    if (!newPassword || newPassword !== confirmPassword) return false;
    return true;
  };
  const navigate = useNavigate();

  const [form, setForm] = useState({ token: "", newPassword: "", confirmPassword: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const ok = resetPassword({
      token: form.token.trim(),
      newPassword: form.newPassword,
      confirmPassword: form.confirmPassword,
    });
    if (ok) navigate("/login");
  };

  return (
    <AuthLayout title="Reset password" subtitle="Enter the reset token and your new password">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="newpassword" value={form.newPassword} onChange={handleChange} type="password" placeholder="New password" className="w-full border p-3 rounded-lg" required />
        <input name="confirmpassword" value={form.confirmPassword} onChange={handleChange} type="password" placeholder="Confirm new password" className="w-full border p-3 rounded-lg" required />
        <Link to="/login" ><Button type="submit" text="Reset password" className="w-full bg-primary text-white" /></Link>
      </form>
    </AuthLayout>
  );
}

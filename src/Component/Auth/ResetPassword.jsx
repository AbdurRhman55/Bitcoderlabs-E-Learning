import React, { useState, useEffect } from "react";
import AuthLayout from "./AuthLayout";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Button from "../UI/Button";
import { apiClient } from "../../api/index.js";

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const [tempToken, setTempToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const state = location.state || {};
    if (state.tempToken) {
      setTempToken(state.tempToken);
    } else {
      setError("Invalid reset session. Please start the password reset process again.");
    }
  }, [location.state]);

  const handleChange = (e) => {
    setError("");
    if (e.target.name === "newPassword") {
      setNewPassword(e.target.value);
    } else if (e.target.name === "confirmPassword") {
      setConfirmPassword(e.target.value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!tempToken) {
      setError("Invalid reset session. Please start the password reset process again.");
      return;
    }

    if (!newPassword) {
      setError("Please enter a new password");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const data = await apiClient.resetPassword(tempToken, newPassword, confirmPassword);
      setSuccess(data.message || "Password reset successfully! Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Enter your new password"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}

        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
            New Password
          </label>
          <input
            type="password"
            name="newPassword"
            id="newPassword"
            value={newPassword}
            onChange={handleChange}
            placeholder="Enter new password (min 8 chars)"
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-colors duration-200"
            required
            disabled={loading || !tempToken}
            minLength={8}
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Confirm New Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            value={confirmPassword}
            onChange={handleChange}
            placeholder="Confirm new password"
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-colors duration-200"
            required
            disabled={loading || !tempToken}
          />
        </div>

        <Button
          type="submit"
          text={loading ? "Resetting..." : "Reset Password"}
          className="w-full bg-primary text-white hover:bg-primary-dark"
          disabled={loading || !tempToken}
        />

        <p className="text-sm text-gray-500 text-center">
          Remembered your password?{" "}
          <Link to="/login" className="text-primary-dark hover:underline">
            Login
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

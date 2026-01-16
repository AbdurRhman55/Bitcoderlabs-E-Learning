import React, { useState } from "react";
import AuthLayout from "./AuthLayout";
import { Link, useNavigate } from "react-router-dom";
import Button from "../UI/Button";
import { apiClient } from "../../api/index.js";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  const handleSendCode = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }

    setLoading(true);

    try {
      const data = await apiClient.requestPasswordReset(email);
      setSuccess(data.message || "OTP sent to your email!");
      setStep("otp");
      setResendTimer(60);

      const timer = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      setError(err.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!otp.trim()) {
      setError("Please enter the OTP");
      return;
    }

    if (otp.length !== 6) {
      setError("OTP must be 6 digits");
      return;
    }

    setLoading(true);

    try {
      const data = await apiClient.verifyPasswordResetOtp(otp);

      if (data.temp_token) {
        setSuccess("OTP verified! Redirecting...");
        setTimeout(() => {
          navigate("/reset-password", { state: { tempToken: data.temp_token, email } });
        }, 1500);
      } else {
        setError("Invalid response from server");
      }
    } catch (err) {
      setError(err.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;

    setError("");
    setOtp("");

    setLoading(true);

    try {
      const data = await apiClient.requestPasswordReset(email);
      setSuccess(data.message || "OTP resent to your email!");
      setResendTimer(60);

      const timer = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      setError(err.message || "Failed to resend OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <AuthLayout
      title={step === "email" ? "Forgot Password" : "Enter OTP"}
      subtitle={step === "email"
        ? "Enter your email to receive a verification code"
        : `Enter the 6-digit code sent to ${email}`
      }
    >
      {step === "email" ? (
        <form onSubmit={handleSendCode} className="space-y-4">
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

          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            placeholder="Your email address"
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-colors duration-200"
            required
            disabled={loading}
          />

          <Button
            type="submit"
            text={loading ? "Sending..." : "Send Verification Code"}
            className="w-full bg-primary text-white hover:bg-primary-dark"
            disabled={loading}
          />

          <p className="text-sm text-gray-500 text-center">
            Remembered your password?{" "}
            <Link to="/login" className="text-primary-dark hover:underline">
              Login
            </Link>
          </p>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
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

          <input
            type="text"
            value={otp}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "").slice(0, 6);
              setOtp(value);
              setError("");
            }}
            placeholder="Enter 6-digit OTP"
            className="w-full border p-3 rounded-lg text-center text-2xl tracking-widest focus:ring-2 focus:ring-primary outline-none transition-colors duration-200"
            required
            disabled={loading}
            maxLength={6}
          />

          <Button
            type="submit"
            text={loading ? "Verifying..." : "Verify OTP"}
            className="w-full bg-primary text-white hover:bg-primary-dark"
            disabled={loading || otp.length !== 6}
          />

          <div className="flex items-center justify-between text-sm">
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={resendTimer > 0 || loading}
              className={`${resendTimer > 0 ? "text-gray-400" : "text-primary-dark hover:underline"}`}
            >
              {resendTimer > 0 ? `Resend in ${formatTime(resendTimer)}` : "Resend OTP"}
            </button>

            <button
              type="button"
              onClick={() => setStep("email")}
              className="text-gray-500 hover:text-gray-700"
            >
              Change Email
            </button>
          </div>

          <p className="text-sm text-gray-500 text-center">
            Remembered your password?{" "}
            <Link to="/login" className="text-primary-dark hover:underline">
              Login
            </Link>
          </p>
        </form>
      )}
    </AuthLayout>
  );
}

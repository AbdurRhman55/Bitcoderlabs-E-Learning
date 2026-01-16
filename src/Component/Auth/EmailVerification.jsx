import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, Link, useLocation } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import Button from "../UI/Button";
import { apiClient } from "../../api/index.js";

export default function EmailVerification() {
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("");
  const [registrationMessage, setRegistrationMessage] = useState(location.state?.message || "");
  const [resendEmail, setResendEmail] = useState(searchParams.get("email") || location.state?.email || "");
  const [resendStatus, setResendStatus] = useState("idle");
  const [resendMessage, setResendMessage] = useState("");
  const [showResendForm, setShowResendForm] = useState(searchParams.get("showResend") === "true" || location.state?.showResend || false);

  const id = searchParams.get("id");
  const hash = searchParams.get("hash");

  const verifyEmail = useCallback(async () => {
    if (!id || !hash) {
      return;
    }

    setStatus("verifying");
    setMessage("");

    try {
      const data = await apiClient.verifyEmail(id, hash);
      setStatus("success");
      setMessage(data.message || "Email verified successfully! You can now login.");
    } catch (error) {
      setStatus("error");
      setMessage(error.message || "Failed to verify email. The link may be expired or invalid.");
    }
  }, [id, hash]);

  useEffect(() => {
    if (id && hash) {
      verifyEmail();
    } else if (showResendForm) {
      setStatus("ready");
    } else {
      setStatus("ready");
    }
  }, [id, hash, showResendForm, verifyEmail]);

  const handleResend = async (e) => {
    e.preventDefault();

    if (!resendEmail.trim()) {
      setResendMessage("Please enter your email address");
      return;
    }

    setResendStatus("sending");
    setResendMessage("");

    try {
      const data = await apiClient.resendVerificationEmail(resendEmail);
      setResendStatus("success");
      setResendMessage(data.message || "Verification email sent! Please check your inbox.");
    } catch (error) {
      setResendStatus("error");
      setResendMessage(error.message || "Failed to send verification email. Please try again.");
    }
  };

  const getContent = () => {
    if (status === "verifying") {
      return (
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying your email...</p>
        </div>
      );
    }

    if (status === "success") {
      return (
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Email Verified!</h3>
          <p className="text-gray-600 mb-6">{message}</p>
          <Link to="/login">
            <Button
              text="Go to Login"
              className="w-full bg-primary text-white hover:bg-primary-dark"
            />
          </Link>
        </div>
      );
    }

    if (status === "error") {
      return (
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Verification Failed</h3>
          <p className="text-gray-600 mb-2">{message}</p>
          <p className="text-sm text-gray-500 mb-6">The verification link may have expired. Please request a new one below.</p>

          <form onSubmit={handleResend} className="space-y-4 text-left">
            <div>
              <label htmlFor="resendEmail" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="resendEmail"
                value={resendEmail}
                onChange={(e) => setResendEmail(e.target.value)}
                placeholder="Enter your registered email"
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-colors duration-200"
                required
                disabled={resendStatus === "sending"}
              />
            </div>

            {resendMessage && (
              <div className={`px-4 py-3 rounded-lg ${
                resendStatus === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
              }`}>
                {resendMessage}
              </div>
            )}

            <Button
              type="submit"
              text={resendStatus === "sending" ? "Sending..." : "Resend Verification Email"}
              className="w-full bg-primary text-white hover:bg-primary-dark"
              disabled={resendStatus === "sending"}
            />
          </form>

          <div className="mt-4">
            <Link to="/login" className="text-gray-500 hover:text-gray-700 text-sm">
              Back to Login
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Email Verification</h3>

        {registrationMessage && (
          <p className="text-gray-600 mb-4">{registrationMessage}</p>
        )}

        <p className="text-gray-600 mb-6">
          {showResendForm
            ? "Enter your email to receive a new verification link."
            : "Please verify your email to access your account."}
        </p>

        {showResendForm && (
          <form onSubmit={handleResend} className="space-y-4 text-left">
            <div>
              <label htmlFor="resendEmail" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="resendEmail"
                value={resendEmail}
                onChange={(e) => setResendEmail(e.target.value)}
                placeholder="Enter your registered email"
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-colors duration-200"
                required
                disabled={resendStatus === "sending"}
              />
            </div>

            {resendMessage && (
              <div className={`px-4 py-3 rounded-lg ${
                resendStatus === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
              }`}>
                {resendMessage}
              </div>
            )}

            <Button
              type="submit"
              text={resendStatus === "sending" ? "Sending..." : "Send Verification Email"}
              className="w-full bg-primary text-white hover:bg-primary-dark"
              disabled={resendStatus === "sending"}
            />
          </form>
        )}

        <div className="mt-4">
          <Link to="/login" className="text-gray-500 hover:text-gray-700 text-sm">
            Back to Login
          </Link>
        </div>
      </div>
    );
  };

  return (
    <AuthLayout
      title="Email Verification"
      subtitle=""
    >
      {getContent()}
    </AuthLayout>
  );
}

// src/Component/Auth/ForgotPassword.jsx
import React, { useState } from "react";
import AuthLayout from "./AuthLayout";
// import { useAuth } from "./AuthLogic";
import { Link, useNavigate } from "react-router-dom";
import Button from "../UI/Button";
import OtpModal from "./OtpModel";

export default function ForgotPassword() {
  // const { forgotPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    forgotPassword(email.trim());
  };
  
  const handleSendCode = (e) => {
    e.preventDefault();

    if (!email.trim()) {
      alert("Please enter your email address");
      return;
    }

    // Simulate sending OTP via email
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);
    console.log("Mock OTP sent to email:", otp);
    setOtpModalOpen(true);
  };

  const handleVerifyOtp = (enteredOtp) => {
    if (enteredOtp === generatedOtp) {
      alert("OTP verified successfully!");
      setOtpModalOpen(false);
      navigate("/reset-password");
    } else {
      alert("Invalid OTP. Please try again.");
    }
  };

  return (
    <AuthLayout title="Forgot password" subtitle="Enter the email associated with your account">
      <form onSubmit={handleSendCode} className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          className="w-full border p-3 rounded-lg"
          required
        />
        <Link to="/resetpassword" className="text-sm text-primary-dark hover:underline">
          Proceed to reset password
        </Link>
        <Button type="submit" text="Send reset link" className="w-full bg-primary text-white" />  


      <OtpModal
        isOpen={otpModalOpen}
        onClose={() => setOtpModalOpen(false)}
        onVerify={handleVerifyOtp}
      />

        <p className="text-sm text-gray-500">
          Remembered your password?{" "}
          <Link to="/login" className="text-primary-dark hover:underline">
            Login
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

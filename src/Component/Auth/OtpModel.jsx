// src/Component/Auth/OtpModal.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function OtpModal({ isOpen, onClose, onVerify }) {
  const [otp, setOtp] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (otp.trim().length === 0) {
      alert("Please enter the OTP code");
      return;
    }
    onVerify(otp);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm">
        <h2 className="text-xl font-semibold mb-2 text-center">
          Enter OTP Code
        </h2>
        <p className="text-gray-600 mb-4 text-center">
          We’ve sent a verification code to your email.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="number"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter 6-digit code"
            className="w-full border p-3 rounded-lg text-center tracking-widest text-lg"
          />

          <Link to="/resetpassword" >
          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded-lg font-medium"
          >
            Verify
          </button>
          </Link>
        </form>

        <button
          onClick={onClose}
          className="mt-4 text-gray-500 text-sm w-full text-center hover:text-gray-700"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

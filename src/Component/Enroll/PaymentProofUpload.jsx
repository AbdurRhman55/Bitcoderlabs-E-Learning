import React, { useState } from "react";
import { FaUpload, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

export default function PaymentProofUpload({ formData, updateFormData }) {
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please upload an image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }

      updateFormData({ ...formData, payment_proof: file });

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFile = () => {
    updateFormData({ ...formData, payment_proof: null });
    setPreview(null);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <FaUpload className="text-primary" />
        Upload Payment Proof
      </h3>

      <div className="space-y-4">
        {/* Payment Account Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h4 className="font-semibold text-blue-900 mb-3">
            Payment Account Details
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-700">Account Title:</span>
              <span className="font-semibold text-gray-900">Bitcoder Labs</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">EasyPaisa Number:</span>
              <span className="font-semibold text-gray-900">0345-1234567</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">JazzCash Number:</span>
              <span className="font-semibold text-gray-900">0300-1234567</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-blue-200">
            <p className="text-xs text-blue-800">
              <strong>Note:</strong> Pay the course fee to one of the numbers
              above (EasyPaisa or JazzCash). After payment, upload the
              screenshot below — this will send an enrollment request to admin
              for approval.
            </p>
          </div>
        </div>

        {/* File Upload Area */}
        {!preview ? (
          <label className="block">
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-primary hover:bg-blue-50 transition-all">
              <FaUpload className="mx-auto text-4xl text-gray-400 mb-3" />
              <p className="text-gray-700 font-medium mb-1">
                Click to upload payment screenshot
              </p>
              <p className="text-sm text-gray-500">PNG, JPG, JPEG up to 5MB</p>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              required
            />
          </label>
        ) : (
          <div className="relative">
            <img
              src={preview}
              alt="Payment proof"
              className="w-full h-64 object-contain bg-gray-100 rounded-xl border-2 border-green-300"
            />
            <button
              type="button"
              onClick={removeFile}
              className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
            >
              <FaTimesCircle />
            </button>
            <div className="absolute bottom-2 left-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
              <FaCheckCircle />
              Payment proof uploaded
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

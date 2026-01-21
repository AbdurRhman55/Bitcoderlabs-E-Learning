import React from "react";
import { FaMobileAlt, FaWallet } from "react-icons/fa";

export default function PaymentMethod({ formData, updateFormData }) {
  const selectedPayment = formData.payment_method || "card";

  const setSelectedPayment = (method) => {
    updateFormData((prev) => ({ ...prev, payment_method: method }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateFormData((prev) => ({ ...prev, [name]: value }));
  };

  const JAZZ_NUMBER = "0300-1234567";
  const EASY_NUMBER = "0345-1234567";

  const renderPaymentForm = () => {
    if (selectedPayment === "jazzcash") {
      return (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h4 className="font-semibold text-blue-900 mb-2">
              Pay via JazzCash
            </h4>
            <div className="text-sm text-gray-800 space-y-1">
              <div className="flex justify-between">
                <span>Account Title:</span>
                <span className="font-semibold">Bitcoder Labs</span>
              </div>
              <div className="flex justify-between">
                <span>JazzCash Number:</span>
                <span className="font-semibold">{JAZZ_NUMBER}</span>
              </div>
            </div>
            <p className="mt-3 text-xs text-gray-700">
              Send the course fee to the JazzCash number above, then upload the
              payment screenshot below to submit your enrollment request to
              admin.
            </p>
          </div>
        </div>
      );
    }

    if (selectedPayment === "easypaisa") {
      return (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h4 className="font-semibold text-blue-900 mb-2">
              Pay via EasyPaisa
            </h4>
            <div className="text-sm text-gray-800 space-y-1">
              <div className="flex justify-between">
                <span>Account Title:</span>
                <span className="font-semibold">Bitcoder Labs</span>
              </div>
              <div className="flex justify-between">
                <span>EasyPaisa Number:</span>
                <span className="font-semibold">{EASY_NUMBER}</span>
              </div>
            </div>
            <p className="mt-3 text-xs text-gray-700">
              Send the course fee to the EasyPaisa number above, then upload the
              payment screenshot below to submit your enrollment request to
              admin.
            </p>
          </div>
        </div>
      );
    }

    return null;
  };

  // Payment method configuration
  const paymentMethods = [
    { id: "jazzcash", name: "JazzCash", icon: FaMobileAlt },
    { id: "easypaisa", name: "EasyPaisa", icon: FaWallet },
  ];

  return (
    <div>
      <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
          <div className="w-2 h-6 bg-[#3baee9] rounded-full mr-3"></div>
          Payment Method
        </h2>

        {/* Payment Method Selection */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {paymentMethods.map((method) => {
            const IconComponent = method.icon;
            const isSelected = selectedPayment === method.id;

            return (
              <button
                key={method.id}
                type="button"
                onClick={() => setSelectedPayment(method.id)}
                className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl font-medium transition-all ${
                  isSelected
                    ? "border-[#3baee9] bg-[#e8f7ff] text-[#2a9fd8]"
                    : "border-gray-200 text-gray-600 hover:border-[#3baee9] hover:bg-[#e8f7ff]"
                }`}
              >
                <IconComponent className="text-xl mb-2" />
                <span className="text-sm">{method.name}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Payment Form */}
        {renderPaymentForm()}
      </div>
    </div>
  );
}

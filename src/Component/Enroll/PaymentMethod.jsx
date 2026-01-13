import React from "react";
import { useState } from "react";
import {
  FaCreditCard,
  FaMobileAlt,
  FaWallet,
  FaUniversity,
} from "react-icons/fa";

export default function PaymentMethod({ formData, updateFormData }) {
  const selectedPayment = formData.payment_method || "card";

  const setSelectedPayment = (method) => {
    updateFormData((prev) => ({ ...prev, payment_method: method }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateFormData((prev) => ({ ...prev, [name]: value }));
  };

  const renderPaymentForm = () => {
    switch (selectedPayment) {
      case "card":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card Number
              </label>
              <div className="relative">
                <FaCreditCard className="absolute left-4 top-3.5 text-gray-400" />
                <input
                  type="text"
                  name="card_number"
                  value={formData.card_number || ""}
                  onChange={handleChange}
                  placeholder="1234 5678 9012 3456"
                  className="w-full pl-12 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#3baee9] focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date
                </label>
                <input
                  type="text"
                  name="card_expiry"
                  value={formData.card_expiry || ""}
                  onChange={handleChange}
                  placeholder="MM/YY"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#3baee9] focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CVV
                </label>
                <input
                  type="password"
                  name="card_cvv"
                  value={formData.card_cvv || ""}
                  onChange={handleChange}
                  placeholder="123"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#3baee9] focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cardholder Name
              </label>
              <input
                type="text"
                name="card_holder_name"
                value={formData.card_holder_name || ""}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#3baee9] focus:border-transparent transition-all"
              />
            </div>
          </div>
        );

      case "jazzcash":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                JazzCash Mobile Number
              </label>
              <div className="relative">
                <FaMobileAlt className="absolute left-4 top-3.5 text-gray-400" />
                <input
                  type="tel"
                  name="jazzcash_number"
                  value={formData.jazzcash_number || ""}
                  onChange={handleChange}
                  placeholder="0300 1234567"
                  className="w-full pl-12 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#3baee9] focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                JazzCash Account Name
              </label>
              <input
                type="text"
                name="jazzcash_account_name"
                value={formData.jazzcash_account_name || ""}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#3baee9] focus:border-transparent transition-all"
              />
            </div>

            <div className="bg-primary border border-primary rounded-xl p-4">
              <p className="text-sm text-white">
                <strong>How to pay with JazzCash:</strong><br />
                1. Enter your JazzCash registered number<br />
                2. You'll receive a payment request on your phone<br />
                3. Confirm the payment to complete enrollment
              </p>
            </div>
          </div>
        );

      case "easypaisa":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                EasyPaisa Mobile Number
              </label>
              <div className="relative">
                <FaWallet className="absolute left-4 top-3.5 text-gray-400" />
                <input
                  type="tel"
                  name="easypaisa_number"
                  value={formData.easypaisa_number || ""}
                  onChange={handleChange}
                  placeholder="0345 1234567"
                  className="w-full pl-12 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#3baee9] focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                EasyPaisa Account Name
              </label>
              <input
                type="text"
                name="easypaisa_account_name"
                value={formData.easypaisa_account_name || ""}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#3baee9] focus:border-transparent transition-all"
              />
            </div>

            <div className="bg-primary border border-blue-200 rounded-xl p-4">
              <p className="text-sm text-white">
                <strong>How to pay with EasyPaisa:</strong><br />
                1. Enter your EasyPaisa registered number<br />
                2. Check your phone for payment confirmation<br />
                3. Enter your PIN to complete the transaction
              </p>
            </div>
          </div>
        );

      case "bank":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bank Name
              </label>
              <select
                name="bank_name"
                value={formData.bank_name || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#3baee9] focus:border-transparent transition-all"
              >
                <option value="">Select your bank</option>
                <option value="hbl">HBL</option>
                <option value="ubl">UBL</option>
                <option value="mcb">MCB</option>
                <option value="alfalah">Bank Al-Falah</option>
                <option value="meezan">Meezan Bank</option>
                <option value="allied">Allied Bank</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Number
              </label>
              <input
                type="text"
                name="bank_account_number"
                value={formData.bank_account_number || ""}
                onChange={handleChange}
                placeholder="12345678901"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#3baee9] focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Holder Name
              </label>
              <input
                type="text"
                name="bank_account_holder_name"
                value={formData.bank_account_holder_name || ""}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#3baee9] focus:border-transparent transition-all"
              />
            </div>

            <div className="bg-primary border border-primary rounded-xl p-4">
              <p className="text-sm text-white">
                <strong>Bank Transfer Details:</strong><br />
                Account: BitcoderLabs PVT LTD<br />
                Bank: HBL Main Branch<br />
                Account #: 1234-5678901-2<br />
                IBAN: PK36HABB0012345678901234
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };


  // Payment method configuration
  const paymentMethods = [
    { id: "card", name: "Card", icon: FaCreditCard },
    { id: "jazzcash", name: "JazzCash", icon: FaMobileAlt },
    { id: "easypaisa", name: "EasyPaisa", icon: FaWallet },
    { id: "bank", name: "Bank Transfer", icon: FaUniversity },
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
                className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl font-medium transition-all ${isSelected
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

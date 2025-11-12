import React from "react";
import Button from "./Button";

export default function Input({
  type = "text",
  placeholder = "Search here...",
  value,
  onChange,
  onClick,
  showButton = true,
  variant = "default", // default | small | xs | filter
  className = "",
}) {
  const variants = {
   default:
  "px-2 sm:px-1 py-1 sm:py-1 text-sm sm:text-lg rounded-full border border-gray-300 shadow-lg focus:ring-4",

    small:
      "px-1 py-2 text-sm rounded-full border border-gray-300 shadow-md focus:ring-2",
    xs:
      "px-2 py-2 text-xs rounded-full border border-gray-300 shadow-sm focus:ring-1 w-full", // 🆕 added extra small
    filter:
      "px-3 py-1.5 text-sm rounded-lg border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-blue-200 shadow-sm w-full",
  };

  return (
    <div className={`w-full mb-4 ${className}`}>
      <div
        className={`px-2 flex items-center gap-2 bg-white overflow-hidden ${variants[variant]}`}
      >
        {/* Icon */}
        <i
          className={`fas fa-search ml-2 ${
            variant === "xs"
              ? "text-xs"
              : variant === "small"
              ? "text-sm"
              : "text-base"
          } text-gray-400`}
        ></i>

        {/* Input Field */}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="flex-1 text-gray-800 placeholder-gray-400 bg-transparent focus:outline-none"
        />

        {/* Optional Button */}
        {showButton && (
          <Button
            text="Search"
            size={
              variant === "xs"
                ? "xs"
                : variant === "small" || variant === "filter"
                ? "sm"
                : "md"
            }
            onClick={onClick}
            className="mr-1 whitespace-nowrap"
          />
        )}
      </div>
    </div>
  );
}

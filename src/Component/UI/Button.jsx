import React from "react";
import { FaFilter, FaThLarge, FaList } from "react-icons/fa";


export default function Button({
  text,
  icon,
  variant = "primary",
  size = "md",
  rounded = "full",
  onClick,
  className = "",
  type = "buttonType", //  optional custom type for filter/list/grid
}) {
  const base =
    "flex items-center justify-center gap-2 font-semibold transition-all duration-300";

  const variants = {
    primary: "cursor-pointer bg-primary text-white hover:bg-primary-dark shadow-lg",
    outline:
      "cursor-pointer bg-white text-primary border border-primary hover:bg-gray-50 shadow-md",
    link: "cursor-pointer text-[#3baee9] hover:text-primary-dark bg-transparent shadow-none",
    square:
      "cursor-pointer bg-primary text-white rounded-md hover:bg-primary-dark shadow-md",

    squarefull: "cursor-pointer bg-primary text-white rounded-xl hover:bg-primary-dark shadow-md w-full",

    squareOutline:
      "cursor-pointer bg-white text-primary border-2 border-primary rounded-md hover:bg-gray-50 shadow-md",
    wishlist:
      "cursor-pointer bg-white rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all duration-300 cursor-pointer",
    share:
      "cursor-pointer bg-white rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all duration-300 cursor-pointer",

    // 👇 new button styles
    filter:
      " p-1 bg-white rounded-full shadow-lg hover:bg-gray-100 hover:scale-110 transition-all duration-300 cursor-pointer",
    list:
      "p-1 bg-white rounded-full shadow-lg hover:bg-gray-100 hover:scale-110 transition-all duration-300 cursor-pointer",
    grid:
      "p-1 bg-white rounded-full shadow-lg hover:bg-gray-100 hover:scale-110 transition-all duration-300 cursor-pointer",
  };


  const sizes = {
    xxs: "text-[10px] px-1 py-0.5",
    xs: "text-xs px-2 py-1",
    sm: "text-sm px-4 py-2",
    smheader: "text-sm px-3 py-1",
    md: "text-base px-6 py-3",
    lg: "text-lg px-8 py-4",
  };

  const round = {
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    full: "rounded-full",
  };

  // 👇 automatically show icon for special types
  const getIcon = () => {
    switch (type) {
      case "filter":
        return <FaFilter className="w-3 h-3 text-gray-600" />;
      case "list":
        return <FaList className="w-3 h-3 text-gray-600" />;
      case "grid":
        return <FaThLarge className="w-3 h-3 text-gray-600" />;
      default:
        return icon;
    }
  };

  return (
    <button
      onClick={onClick}
      className={`${base} ${variants[variant] || variants[type]} ${sizes[size] || ""
        } ${round[rounded] || ""} ${className}`}
    >
      {getIcon()}
      {text && <span>{text}</span>}
    </button>
  );
}

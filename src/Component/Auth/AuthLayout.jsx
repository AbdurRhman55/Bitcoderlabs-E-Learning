import React from "react";
import image from "../../assets/login image.jpg"; 

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-light">
      <div className="w-full max-w-5xl flex flex-col md:flex-row shadow-xl rounded-2xl overflow-hidden bg-white">

        <div
          className="hidden md:flex md:w-1/2 relative items-center justify-center overflow-hidden"
          style={{
            backgroundImage: `url(${image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black/70"></div>

          <div className="relative z-10 text-white text-center max-w-md space-y-6 px-6">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-20 h-20 bg-[#3baee9] rounded-3xl flex items-center justify-center shadow-xl transform hover:scale-105 transition-transform duration-300 border border-white/30">
                <span className="text-white font-bold text-3xl">BL</span>
              </div>
              <div className="text-left">
                <h1 className="text-4xl font-bold">BitCoderLabs</h1>
                <p className="text-white/80 mt-1 text-lg">Learn. Code. Succeed.</p>
              </div>
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">Accelerate Your Learning</h2>
              <p className="text-white/80 text-sm">
                Join thousands of developers and boost your coding skills today.
              </p>
            </div>
          </div>
        </div>

        <div className="md:w-1/2 p-8 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-primary-dark mb-2">{title}</h2>
          <p className="text-gray-500 mb-6">{subtitle}</p>
          {children}
        </div>

      </div>
    </div>
  );
}

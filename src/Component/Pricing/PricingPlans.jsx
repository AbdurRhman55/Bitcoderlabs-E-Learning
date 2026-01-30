import React, { useState } from "react";
import PricingCard from "./PricingCard";

const PricingPlans = () => {
  const [isYearly, setIsYearly] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

  const plans = [
    {
      name: "Free",
      monthly: 0,
      yearly: 0,
      description: "Perfect for getting started with core features.",
      features: [
        "Access to basic courses", 
        "Community support", 
        "Limited quizzes",
        "Basic progress tracking",
        "Email support"
      ],
      buttonText: "Get Started Free",
      highlighted: false,
      popular: false,
      savings: 0,
    },
    {
      name: "Pro",
      monthly: 15,
      yearly: 120,
      description: "Best for individuals who want full access and certificates.",
      features: [
        "All free features",
        "Unlimited courses access",
        "Downloadable certificates",
        "Offline access to courses",
        "Advanced projects",
        "Code review sessions"
      ],
      buttonText: "Start Pro Trial",
      highlighted: true,
      popular: true,
      savings: 60, // $180 - $120 = $60 savings
    },
    {
      name: "Team",
      monthly: 30,
      yearly: 240,
      description: "For teams and organizations that need advanced analytics.",
      features: [
        "All Pro features",
        "Team management dashboard",
        "Advanced progress analytics",
        "Custom learning paths",
        "API access",
        "24/7 phone support"
      ],
      buttonText: "Contact Sales",
      highlighted: false,
      popular: false,
      savings: 120, // $360 - $240 = $120 savings
    },
  ];

  const calculateMonthlyEquivalent = (yearlyPrice) => {
    return Math.round(yearlyPrice / 12);
  };

  return (
    <section className="w-full py-8 px-4 md:px-10  bg-gradient-to-b from-[#f9fafb] to-[#eef3f7] relative overflow-hidden">
      {/* Background Elements */}
      {/* <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-[#4481b8]/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-[#4481b8]/5 rounded-full blur-3xl"></div>
      </div> */}

      {/* Header Section */}
      <div className="text-center mb-6 relative z-10">
        {/* <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-lg border border-[#4481b8]/10 mb-6">
          <div className="w-2 h-2 bg-[#4481b8] rounded-full animate-pulse"></div>
          <span className="text-sm font-semibold text-[#4481b8] uppercase tracking-wide">Simple Pricing</span>
        </div> */}
        
        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
          Choose Your <span className="text-[#4481b8]">Learning Path</span>
        </h2>
        
        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Start for free, upgrade as you grow. All plans include our core features with no hidden costs.
        </p>
      </div>

      {/* Toggle Section */}
      <div className="flex flex-col items-center mb-6 relative z-10">
        <div className="flex items-center gap-6 mb-4">
          <span className={`text-lg font-semibold transition-colors duration-300 ${
            !isYearly ? "text-[#4481b8]" : "text-gray-500"
          }`}>
            Monthly
          </span>
          
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={isYearly}
              onChange={() => setIsYearly(!isYearly)}
            />
            <div className="w-16 h-8 bg-gray-300 rounded-full peer peer-checked:bg-[#4481b8] transition-all duration-300 shadow-inner"></div>
            <div className="absolute left-1 top-1 bg-white w-6 h-6 rounded-full shadow-lg transform peer-checked:translate-x-8 transition-all duration-300 flex items-center justify-center">
              {isYearly ? (
                <span className="text-[10px] text-[#4481b8] font-bold">✓</span>
              ) : (
                <span className="text-[10px] text-gray-400 font-bold">$</span>
              )}
            </div>
          </label>
          
          <span className={`text-lg font-semibold transition-colors duration-300 ${
            isYearly ? "text-[#4481b8]" : "text-gray-500"
          }`}>
            Yearly
          </span>
        </div>

        {/* Savings Badge */}
        {isYearly && (
          <div className="bg-green-100 border border-green-200 text-green-700 px-4 py-2 rounded-full text-sm font-semibold animate-pulse">
            🎉 Save up to ${Math.max(...plans.map(p => p.savings))} with yearly billing
          </div>
        )}
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10 max-w-7xl mx-auto">
        {plans.map((plan, index) => (
          <div 
            key={index}
            className="relative"
            onMouseEnter={() => setHoveredCard(index)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <PricingCard 
              plan={plan} 
              isYearly={isYearly} 
              isHovered={hoveredCard === index}
              calculateMonthlyEquivalent={calculateMonthlyEquivalent}
            />
          </div>
        ))}
      </div>

      {/* Trust Section */}
      {/* Trust Section - Minimal */}
<div className="text-center mt-16 relative z-10">
  <div className="rounded-2xl p-8 bg-[#4481b8]/10">
    <p className="text-gray-600 mb-8 font-semibold text-lg">Join 10,000+ developers already learning</p>
    <div className="grid  grid-cols-1 gap-3 sm:grid-cols-3 md:grid-cols-4 place-items-center mx-auto text-sm">
      
      {/* Free Trial */}
      <div className="flex flex-col items-center  bg-white/80 shadow-lg w-36 h-36 p-4  gap-3  rounded-full border-2 border-[#4481b8]">
        <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center border border-green-200">
          <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <div className="font-semibold text-gray-800">Free Trial</div>
          <div className="text-gray-500 text-xs mt-1">7 days, no risk</div>
        </div>
      </div>

      {/* Flexible */}
      <div className="flex flex-col items-center bg-white/80 shadow-lg w-36 h-36 rounded-full p-4 gap-3 border-2 border-[#4481b8]">
        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center border border-blue-200">
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <div className="font-semibold text-gray-800">Flexible</div>
          <div className="text-gray-500 text-xs mt-1">Cancel anytime</div>
        </div>
      </div>

      {/* No Card */}
      <div className="flex flex-col items-center bg-white/80 shadow-lg  gap-3 w-36 h-36 rounded-full p-4 border-2 border-[#4481b8]">
        <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center border border-purple-200">
          <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        </div>
        <div>
          <div className="font-semibold text-gray-800">No Card</div>
          <div className="text-gray-500 text-xs mt-1">Required</div>
        </div>
      </div>

      {/* Secure */}
      <div className="flex flex-col items-center bg-white/80 shadow-lg gap-3 w-36 h-36 rounded-full p-4 border-2 border-[#4481b8]">
        <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center border border-orange-200">
          <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <div>
          <div className="font-semibold text-gray-800">Secure</div>
          <div className="text-gray-500 text-xs mt-1">Payment</div>
        </div>
      </div>

    </div>
  </div>
</div>
    </section>
  );
};

export default PricingPlans;

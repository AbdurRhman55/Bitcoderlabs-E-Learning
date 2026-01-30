import React from "react";

const PricingCard = ({ plan, isYearly, isHovered, calculateMonthlyEquivalent }) => {
  const price = isYearly ? plan.yearly : plan.monthly;
  const period = isYearly ? "year" : "month";
  
  const getMonthlyEquivalent = () => {
    if (isYearly && plan.yearly > 0) {
      return calculateMonthlyEquivalent(plan.yearly);
    }
    return null;
  };

  const monthlyEquivalent = getMonthlyEquivalent();

  return (
    <div
      className={`relative h-full transform transition-all duration-500 ${
        isHovered ? "-translate-y-2.5" : "translate-y-0"
      } ${
        plan.popular 
          ? "shadow-2xl ring-4 ring-[#4481b8]/20" 
          : "shadow-lg hover:shadow-xl"
      } rounded-3xl overflow-hidden ${
        plan.popular
          ? "bg-gradient-to-br from-[#4481b8]/10 to-white border-2 border-[#4481b8]"
          : "bg-white border border-gray-200"
      }`}
    >
      {/* Popular Badge */}
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-20">
          <div className="bg-gradient-to-r from-[#4481b8] to-[#5a9bd4] text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
            Most Popular
          </div>
        </div>
      )}

      {/* Savings Badge for Yearly */}
      {isYearly && plan.savings > 0 && (
        <div className="absolute top-1 -right-6 rotate-28 bg-[#4481b8]/30 text-[#4481b8] px-6 py-1 rounded-full text-xs font-bold transform  shadow-lg z-10">
          Save ${plan.savings}
        </div>
      )}

      <div className="px-8 py-6">
        {/* Plan Header */}
        <div className="text-center mb-3">
          <h3 className={`text-2xl font-bold mb-2 ${
            plan.popular ? "text-[#4481b8]" : "text-gray-900"
          }`}>
            {plan.name}
          </h3>
          
          {/* Price */}
          <div className="flex items-baseline justify-center gap-1 mb-2">
            <span className="text-5xl font-bold text-[#4481b8]">${price}</span>
            {price > 0 && (
              <span className="text-gray-500 text-lg">/{period}</span>
            )}
          </div>

          {/* Monthly Equivalent */}
          {monthlyEquivalent && (
            <p className="text-green-600 text-sm font-semibold mb-2">
              ≈ ${monthlyEquivalent}/mo
            </p>
          )}

          <p className="text-gray-600 leading-relaxed">{plan.description}</p>
        </div>

        {/* Features List */}
        <ul className="space-y-3 mb-8">
          {plan.features.map((feature, i) => (
            <li key={i} className="flex items-start gap-3 group">
              <div className={`flex-shrink-0 w-5 h-5 mt-0.5 rounded-full flex items-center justify-center ${
                plan.popular ? "bg-[#4481b8] text-white" : "bg-green-100 text-green-600"
              } group-hover:scale-110 transition-transform duration-200`}>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-gray-700 group-hover:text-gray-900 transition-colors duration-200">
                {feature}
              </span>
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        <button className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 ${
          plan.popular
            ? "bg-[#4481b8] text-white hover:bg-[#366d9a] hover:shadow-lg transform hover:scale-105"
            : "bg-white text-[#4481b8] border-2 border-[#4481b8] hover:bg-[#4481b8] hover:text-white"
        } shadow-md`}>
          {plan.buttonText}
        </button>

        {/* Free Trial Note */}
        {plan.name !== "Free" && (
          <p className="text-center text-gray-500 text-sm mt-3">
            Start with 7-day free trial
          </p>
        )}
      </div>
    </div>
  );
};

export default PricingCard;

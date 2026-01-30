import React, { useState } from "react";

const ComparisonTable = () => {
  const [showTable, setShowTable] = useState(false);
  const [hoveredPlan, setHoveredPlan] = useState(null);

  const plans = [
    { 
      name: "Free", 
      price: "$0", 
      description: "Perfect for getting started",
      popular: false
    },
    { 
      name: "Pro", 
      price: "$29", 
      period: "/month",
      description: "Most popular for professionals",
      popular: true
    },
    { 
      name: "Team", 
      price: "$99", 
      period: "/month",
      description: "Best for teams & organizations",
      popular: false
    }
  ];

  const features = [
    { 
      name: "Access to all courses", 
      free: true, 
      pro: true, 
      team: true,
      description: "Unlimited access to 100+ courses"
    },
    { 
      name: "Certificates of completion", 
      free: false, 
      pro: true, 
      team: true,
      description: "Shareable certificates for completed courses"
    },
    { 
      name: "Offline access", 
      free: false, 
      pro: true, 
      team: true,
      description: "Download courses for offline learning"
    },
    { 
      name: "Advanced projects", 
      free: false, 
      pro: true, 
      team: true,
      description: "Access to real-world projects with code review"
    },
    { 
      name: "Team analytics dashboard", 
      free: false, 
      pro: false, 
      team: true,
      description: "Track team progress and learning metrics"
    },
    { 
      name: "Priority support", 
      free: false, 
      pro: true, 
      team: true,
      description: "24/7 priority email and chat support"
    },
    { 
      name: "Custom learning paths", 
      free: false, 
      pro: false, 
      team: true,
      description: "Create tailored learning paths for your team"
    },
    { 
      name: "API access", 
      free: false, 
      pro: false, 
      team: true,
      description: "Integrate with your existing systems"
    }
  ];

  const FeatureIcon = ({ available }) => (
    available ? (
      <i className="fas fa-check text-green-600 text-lg"></i>
    ) : (
      <i className="fas fa-times text-gray-400 text-lg"></i>
    )
  );

  return (
    <section className={`relative w-full -mt-8 ${
      showTable ? "pb-20" : "pb-0"
    } px-4 md:px-10 lg:px-20 bg-gradient-to-b from-[#eef3f7] via-[#f9fafb] to-[#eef3f7] transition-all duration-700`}>
      
      {/* Background Glow - Same as original */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#4481b8]/20 to-transparent blur-3xl opacity-40 pointer-events-none"></div>

      {/* Toggle Button - Enhanced but same style */}
      <div className="text-center mb-10 pt-10 relative z-10">
        <button
          onClick={() => setShowTable(!showTable)}
          className="bg-[#4481b8] text-white px-8 py-3 rounded-full font-semibold text-base 
                     transition-all duration-300 hover:bg-[#366d9a] shadow-md flex items-center gap-2 mx-auto
                     hover:scale-105 transform"
        >
          {showTable ? (
            <>
              Hide Comparison <i className="fas fa-chevron-up text-sm"></i>
            </>
          ) : (
            <>
              Show Full Comparison <i className="fas fa-chevron-down text-sm"></i>
            </>
          )}
        </button>
      </div>

      {/* Smooth Transition Container */}
      <div className={`transition-all duration-700 ease-in-out overflow-hidden ${
        showTable ? "max-h-[5000px] opacity-100 translate-y-0" : "max-h-0 opacity-0 -translate-y-5"
      }`}>
        
        {/* Title - Same style */}
        <div className="text-center mb-12 relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-[#4481b8] mb-4">
            Compare Our Plans
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Choose the plan that fits your learning goals and unlock your potential.
          </p>
        </div>

        {/* Enhanced Desktop Table - Same structure, better styling */}
        <div className="hidden md:block relative z-10">
          <div className="overflow-hidden rounded-2xl shadow-[0_10px_25px_rgba(68,129,184,0.1)] backdrop-blur-xl bg-white/60 border border-[#4481b8]/10">
            <table className="w-full border-collapse">
              <thead className="bg-[#4481b8] text-white">
                <tr>
                  <th className="py-2 px-8 text-left text-xl font-semibold tracking-wide">
                    Features
                  </th>
                  {plans.map((plan) => (
                    <th 
                      key={plan.name}
                      className={`py-2 px-8 text-center font-semibold text-lg transition-all duration-300 ${
                        plan.popular ? 'bg-white/20 backdrop-blur-sm scale-105' : ''
                      } ${hoveredPlan === plan.name ? 'bg-white/30' : ''}`}
                      onMouseEnter={() => setHoveredPlan(plan.name)}
                      onMouseLeave={() => setHoveredPlan(null)}
                    >
                      <div className="flex flex-col items-center">
                        <span>{plan.name}</span>
                        {plan.popular && (
                          <span className="text-sm font-normal mt-1 opacity-90">(Most Popular)</span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {features.map((feature, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-200 hover:bg-[#4481b8]/5 transition-all duration-200 group"
                  >
                    <td className="py-2 px-8 font-medium text-gray-700 group-hover:bg-white/50">
                      <div>
                        <div className="font-semibold">{feature.name}</div>
                        <div className="text-sm text-gray-500 mt-1">{feature.description}</div>
                      </div>
                    </td>
                    {plans.map((plan) => (
                      <td 
                        key={plan.name}
                        className={`py-5 px-8 text-center transition-all duration-200 ${
                          plan.popular ? 'bg-[#4481b8]/5' : ''
                        } ${hoveredPlan === plan.name ? 'bg-[#4481b8]/10' : ''}`}
                        onMouseEnter={() => setHoveredPlan(plan.name)}
                        onMouseLeave={() => setHoveredPlan(null)}
                      >
                        <FeatureIcon available={feature[plan.name.toLowerCase()]} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td className="px-8"></td>
                  {plans.map((plan) => (
                    <td 
                      key={plan.name}
                      className={`py-2 px-8 text-center ${
                        plan.popular ? 'bg-[#4481b8]/5' : ''
                      }`}
                    >
                      <button className={`w-full py-2 px-6 rounded-lg font-semibold transition-all duration-300 ${
                        plan.popular 
                          ? 'bg-[#4481b8] text-white hover:bg-[#366d9a] hover:shadow-lg' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}>
                        {plan.name === 'Free' ? 'Get Started' : `Choose ${plan.name}`}
                      </button>
                      <div className="mt-2 text-sm text-gray-600">
                        {plan.price}{plan.period}
                      </div>
                    </td>
                  ))}
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Enhanced Mobile Cards - Same structure, better styling */}
        <div className="grid grid-cols-1 md:hidden gap-8 relative z-10 mt-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-6 shadow-lg backdrop-blur-lg border-2 transition-all duration-300 hover:scale-[1.02] ${
                plan.popular
                  ? "bg-[#4481b8]/10 border-[#4481b8] shadow-[0_10px_30px_rgba(68,129,184,0.2)]"
                  : "bg-white/80 border-gray-200"
              }`}
            >
              {/* Plan Header */}
              <div className="text-center mb-6">
                <h3 className={`text-2xl font-bold mb-2 ${
                  plan.popular ? "text-[#4481b8]" : "text-gray-800"
                }`}>
                  {plan.name}
                  {plan.popular && (
                    <i className="fas fa-star text-[#4481b8] ml-2"></i>
                  )}
                </h3>
                <div className="flex items-baseline justify-center gap-1 mb-2">
                  <span className="text-3xl font-bold text-[#4481b8]">{plan.price}</span>
                  {plan.period && <span className="text-gray-600">{plan.period}</span>}
                </div>
                <p className="text-gray-600 text-sm">{plan.description}</p>
              </div>

              {/* Features List */}
              <ul className="space-y-4 mb-6">
                {features.map((feature, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-start p-3 rounded-lg bg-white/50"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-gray-800 text-sm">{feature.name}</div>
                      <div className="text-gray-500 text-xs mt-1">{feature.description}</div>
                    </div>
                    <FeatureIcon available={feature[plan.name.toLowerCase()]} />
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                plan.popular 
                  ? 'bg-[#4481b8] text-white hover:bg-[#366d9a]' 
                  : 'bg-white text-[#4481b8] border-2 border-[#4481b8] hover:bg-[#366d9a]'
              }`}>
                {plan.name === 'Free' ? 'Start Learning Free' : `Get ${plan.name}`}
              </button>
            </div>
          ))}
        </div>

        {/* Trust Section - New addition but same theme */}
        {/* <div className="text-center mt-12 relative z-10">
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-[#4481b8]/10">
            <p className="text-gray-600 mb-4 font-semibold">Trusted by thousands of learners worldwide</p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <i className="fas fa-shield-alt text-[#4481b8]"></i>
                <span>Secure & reliable</span>
              </div>
              <div className="flex items-center gap-2">
                <i className="fas fa-sync-alt text-[#4481b8]"></i>
                <span>Cancel anytime</span>
              </div>
              <div className="flex items-center gap-2">
                <i className="fas fa-headset text-[#4481b8]"></i>
                <span>24/7 support</span>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default ComparisonTable;

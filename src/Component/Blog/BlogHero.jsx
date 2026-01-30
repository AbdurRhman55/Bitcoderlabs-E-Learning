import { FaSearch, FaArrowRight, FaBookOpen, FaUsers, FaRocket } from "react-icons/fa";
import Input from "../UI/Input";

export default function BlogHero() {
  return (
    <section className="relative bg-gradient-to-br from-white via-blue-50/30 to-slate-50 py-5 lg:py-8 overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 right-10 w-72 h-72 bg-[#e8f7ff] rounded-full opacity-60 blur-3xl animate-float"></div>
        <div className="absolute bottom-20 left-10 w-64 h-64 bg-[#e8f7ff] rounded-full opacity-40 blur-3xl animate-float-slow"></div>
        <div className="absolute top-1/3 left-1/4 w-48 h-48 bg-[#3baee9] rounded-full opacity-10 blur-2xl animate-pulse-slow"></div>
        
        {/* Geometric Shapes */}
        <div className="absolute top-20 right-1/4 w-8 h-8 border-2 border-[#3baee9]/20 rounded-lg rotate-45 animate-spin-slow"></div>
       
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Enhanced Badge */}
          <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm border border-[#3baee9]/10 text-[#2a9fd8] px-6 py-3 rounded-2xl shadow-sm  hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[#3baee9] rounded-full animate-pulse"></span>
              <span className="font-semibold text-sm">For Ambitious Students</span>
            </div>
            <FaRocket className="text-[#3baee9] text-sm" />
          </div>

          {/* Enhanced Main Heading */}
          <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-2 leading-tight">
            Learn, Grow &{" "}
            <span className="bg-gradient-to-r from-[#3baee9] via-[#2a9fd8] to-[#3baee9] bg-clip-text text-transparent animate-gradient">
              Succeed
            </span>
          </h1>

          {/* More Student-Focused Subheading */}
          <p className="text-xl lg:text-2xl text-gray-600 mb-6 max-w-2xl mx-auto leading-relaxed font-light">
            Unlock your potential with expert guides, career tips, and cutting-edge insights tailored for student success.
          </p>

          {/* Enhanced Search Bar */}
        
          <div className="max-w-xl mx-auto mb-6">
            <Input
            type="text"
            placeholder="Search programming, career advice, study tips..."
            showButton={true}
            variant="small"
            onClick={() => {}}
          />
          </div>

          {/* Enhanced Stats with Icons */}
          <div className="grid  grid-cols-3 gap-8 max-w-4xl mx-auto py-2">
            <div className="text-center group hover:transform hover:scale-105 transition duration-300">
              <div className="inline-flex items-center justify-center lg:w-16 w-12 lg:h-16 h-12 bg-[#e8f7ff] rounded-2xl mb-4 group-hover:bg-[#3baee9] group-hover:text-white transition-colors duration-300">
                <FaBookOpen className="lg:text-2xl text-lg text-[#3baee9] group-hover:text-white" />
              </div>
              <div className="text-2xl lg:text-4xl font-bold text-[#2a9fd8] mb-2 group-hover:text-gray-800">500+</div>
              <div className="text-xs lg:text-lg text-gray-600 font-medium group-hover:text-gray-700">Expert Guides</div>
            </div>
            
            <div className="text-center group hover:transform hover:scale-105 transition duration-300">
              <div className="inline-flex items-center justify-center lg:w-16 w-12 lg:h-16 h-12 bg-[#e8f7ff] rounded-2xl mb-4 group-hover:bg-[#3baee9] group-hover:text-white transition-colors duration-300">
                <FaUsers className="lg:text-2xl text-lg text-[#3baee9] group-hover:text-white" />
              </div>
              <div className="text-2xl lg:text-4xl font-bold text-[#2a9fd8] mb-2 group-hover:text-gray-800">50K+</div>
              <div className="text-xs lg:text-lg text-gray-600 font-medium group-hover:text-gray-700">Student Community</div>
            </div>
            
            <div className="text-center group hover:transform hover:scale-105 transition duration-300">
              <div className="inline-flex items-center justify-center lg:w-16 w-12 lg:h-16 h-12 bg-[#e8f7ff] rounded-2xl mb-4 group-hover:bg-[#3baee9] group-hover:text-white transition-colors duration-300">
                <FaRocket className="lg:text-2xl text-lg text-[#3baee9] group-hover:text-white" />
              </div>
              <div className="text-2xl lg:text-4xl font-bold text-[#2a9fd8] mb-2 group-hover:text-gray-800">95%</div>
              <div className="text-xs lg:text-lg text-gray-600 font-medium group-hover:text-gray-700">Career Success Rate</div>
            </div>
          </div>
        </div>
      </div>

      
    </section>
  );
}

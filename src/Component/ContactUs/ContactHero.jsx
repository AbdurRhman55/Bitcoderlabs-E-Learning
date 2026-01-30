import { FaPlay, FaMagic, FaRocket,  } from "react-icons/fa";
import Button from "../UI/Button";
import { contactArray } from "../../../Data/Contact.Array";

export default function UltimateHero() {
  return (
    <section className=" bg-gradient-to-br from-gray-800 to-primary-dark relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-500"></div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-10">
        <div className="text-center">
          {/* Premium Badge */}
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20 ">
            <span className="text-white font-semibold text-sm flex items-center gap-2"><FaMagic className="text-yellow-500"/> Trusted by 10,000+ Students Worldwide</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white my-4">
            Transform Your
            <span className="block  bg-clip-text">
              Career Today
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
            Join the world's most effective learning platform and master in-demand skills 
            with industry experts. Start your journey to success in just 30 days.
          </p>

          {/* Stats */}
          <div className="flex justify-center items-center gap-8 mb-8 flex-wrap">
            {contactArray.map((stat, index) => (
              <div key={index} className="flex items-center gap-3 text-white">
                <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm">
                  <stat.icon className="text-cyan-400 text-lg" />
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10">
            <Button text="Start Learning Free" icon={<FaRocket />} />

            <Button text="Watch Demo" icon={<FaPlay />} variant="outline" />
          </div>

          {/* Trust Indicators */}
          <div className="space-y-6">
            <p className="text-gray-400 text-sm">Trusted by teams at</p>
            <div className="flex justify-center items-center gap-8 flex-wrap opacity-60">
              {["NAVTIC", "PSEB", "KPIT Board", "SRSP",].map((company, index) => (
                <div key={index} className="text-white font-semibold text-lg hover:opacity-100 transition-opacity cursor-pointer">
                  {company}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}

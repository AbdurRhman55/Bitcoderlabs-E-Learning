import React from "react";
import { Link } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaArrowRight,
  FaHeadset,
  FaCode,
  FaShieldAlt,
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";
import { FooterLink, Features } from "../../../Data/Array"; // ✅ sirf ye 2 import
import Input from "./Input";
import FooterLinks from "./FooterLinks"; // ✅ correct import name
import Swal from 'sweetalert2';

const iconComponents = {
  FaCode,
  FaShieldAlt,
  FaHeadset,
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
  FaYoutube,
};

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { socialLinks } = FooterLink; // ✅ get from object

  return (
    <footer className="bg-white border-t border-gray-100 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#e8f7ff] to-white opacity-50"></div>

      <div className="relative z-10">
        {/* Features Strip */}
        <div className="bg-gradient-to-r from-[#3baee9] to-[#2a9fd8] py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {Features.map((feature, index) => {
                const IconComponent = iconComponents[feature.icon];
                return (
                  <div key={index} className="flex items-center gap-4 text-white">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                      <IconComponent className="text-white text-lg" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">{feature.title}</h4>
                      <p className="text-white/80 text-xs">{feature.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Footer */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col md:flex-row gap-10  px-5">
            {/* Company Info */}
            <div className="lg:col-span-4 max-w-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-[#3baee9] to-[#2a9fd8] rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">BL</span>
                </div>
                <div>
                  <span className="text-2xl font-bold text-gray-900">
                    BitCoderLabs
                  </span>
                  <p className="text-gray-500 text-sm">Learn. Code. Succeed.</p>
                </div>
              </div>

              <p className="text-gray-600 mb-8 leading-relaxed text-sm">
                Empowering developers and tech enthusiasts with cutting-edge
                courses, hands-on projects, and industry expertise.
              </p>

              <div className="mb-8">
                <h4 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wide">
                  Stay Updated
                </h4>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  variant="small"
                  showButton={true}
                  onClick={() => Swal.fire({
                    title: 'Subscribed!',
                    text: 'Thank you for subscribing to our newsletter.',
                    icon: 'success',
                    confirmButtonColor: '#3baee9'
                  })}
                />
              </div>

              {/* Social Links */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wide">
                  Follow Us
                </h4>
                <div className="flex gap-3">
                  {socialLinks.map((social, index) => {
                    const SocialIcon = iconComponents[social.icon];
                    return (
                      <a
                        key={index}
                        href={social.href}
                        className={`w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600 ${social.color} hover:text-white transition-all duration-300 transform hover:scale-110 border border-gray-200 hover:border-transparent`}
                      >
                        <SocialIcon className="text-sm" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer Links Section */}
            <div className="">
              <FooterLinks />
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-100 bg-gray-50/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-500 text-sm">
                © {currentYear}{" "}
                <span className="text-[#3baee9] font-semibold">
                  BitCoderLabs
                </span>
                . All rights reserved.
              </p>

              <div className="flex items-center gap-6 text-gray-500 text-sm">
                <Link to="/verify" className="hover:text-primary transition-colors font-medium">Verify Certificate</Link>
                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                <span>Empowering developers worldwide</span>
                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                <span>Code • Learn • Grow</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

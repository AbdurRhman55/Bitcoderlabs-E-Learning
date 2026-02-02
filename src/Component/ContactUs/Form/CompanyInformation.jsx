import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaBuilding, FaClock, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { FooterLink } from "../../../../Data/Array";

const iconComponents = {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaBuilding,
  FaClock,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
};

const socialLinks = FooterLink.socialLinks;

export default function ContactInfo() {
  return (
    <div className="lg:w-80 space-y-6 w-full flex-shrink-0">
      {/* Contact Card */}
      <div className="bg-white rounded-2xl p-6 shadow-xl border border-blue-200">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center lg:ml-4 gap-2">
          Contact Info
        </h3>

        <div className="space-y-4">
          {[
            { icon: FaPhone, label: "Phone", value: "+92 333 9277021" },
            { icon: FaEnvelope, label: "Email", value: "info@bitcoderlabs.com" },
            { icon: FaMapMarkerAlt, label: "Address", value: "SBBWU Peshawar IT Park Bitcoderlabs Pvt Ltd" },
            { icon: FaBuilding, label: "Location", value: "Peshawar" },
          ].map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-3 hover:bg-blue-50 rounded-xl transition-colors"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-lg flex items-center justify-center text-white flex-shrink-0">
                <item.icon className="text-sm" />
              </div>
              <div>
                <div className="font-semibold text-gray-900 text-sm">{item.label}</div>
                <div className="text-primary text-sm">{item.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hours & Social */}
      <div className="bg-gradient-to-br from-primary to-primary-dark rounded-2xl p-6 text-white">
        <div className="flex items-center gap-2 mb-4">
          <FaClock className="text-white" />
          <h3 className="font-bold">Business Hours</h3>
        </div>
        <div className="space-y-2 text-sm text-white">
          <div className="flex justify-between">
            <span>Mon - Fri</span>
            <span className="font-semibold">9AM - 6PM</span>
          </div>
          <div className="flex justify-between">
            <span>Saturday</span>
            <span className="font-semibold">10AM - 4PM</span>
          </div>
          <div className="flex justify-between">
            <span>Sunday</span>
            <span className="font-semibold">Closed</span>
          </div>
        </div>

        <div className="mt-6">
          <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wide">
            Follow Us
          </h4>
          <div className="flex gap-3">
            {socialLinks.map((social, index) => {
              const SocialIcon = iconComponents[social.icon];
              if (!SocialIcon) return null;
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
    </div>
  );
}

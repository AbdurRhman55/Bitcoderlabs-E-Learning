import { useState } from 'react';
import { 
  FaPaperPlane, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, 
  FaCity, FaBuilding, FaIdCard 
} from 'react-icons/fa';
import Button from '../../UI/Button';

export default function ContactForm({ onFormSubmit }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    onFormSubmit();
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="flex-1 max-w-2xl">
      <div className="bg-white rounded-3xl p-8 shadow-2xl border border-blue-200">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-gray-700 font-semibold text-sm">
                <FaUser className="text-primary" />
                First Name *
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 focus:bg-white outline-none"
                placeholder="John"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-gray-700 font-semibold text-sm">
                <FaIdCard className="text-primary" />
                Last Name *
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 focus:bg-white outline-none"
                placeholder="Doe"
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-gray-700 font-semibold text-sm">
                <FaEnvelope className="text-primary" />
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 focus:bg-white outline-none"
                placeholder="john@example.com"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-gray-700 font-semibold text-sm">
                <FaPhone className="text-primary" />
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 focus:bg-white outline-none"
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>

          {/* Company & Address */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-gray-700 font-semibold text-sm">
              <FaBuilding className="text-primary" />
              Company Name
            </label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 focus:bg-white outline-none"
              placeholder="Your company name"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-gray-700 font-semibold text-sm">
                <FaMapMarkerAlt className="text-primary" />
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 focus:bg-white outline-none"
                placeholder="City"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-gray-700 font-semibold text-sm">State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 focus:bg-white outline-none"
                  placeholder="State"
                />
              </div>
              <div className="space-y-2">
                <label className="text-gray-700 font-semibold text-sm">ZIP</label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 focus:bg-white outline-none"
                  placeholder="ZIP"
                />
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-gray-700 font-semibold text-sm">
              <FaEnvelope className="text-primary" />
              Your Message *
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 focus:bg-white resize-none outline-none"
              placeholder="How can we help you today?"
            />
          </div>
          <Button
            text="Send Message"
            type="submit"
            variant="squarefull"
            disabled={isSubmitting}
            >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Sending Message...
              </>
            ) : (
              <>
                <FaPaperPlane />
                Send Message
              </>
            )}
          </Button>
          <p className="text-center text-gray-500 text-sm">
            We respect your privacy and will never share your information.
          </p>
        </form>
      </div>
    </div>
  );
}

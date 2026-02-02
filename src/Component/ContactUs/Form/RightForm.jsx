import { useState } from 'react';
import {
  FaPaperPlane, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt,
  FaCity, FaBuilding, FaIdCard, FaCheckCircle, FaTimes
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { apiClient } from '../../../api/index';

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
  const [error, setError] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Map frontend fields to backend expected fields
      const payload = {
        ...formData,
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        subject: 'Contact Us Inquiry'
      };

      await apiClient.submitContactMessage(payload);

      // Show success modal
      setShowSuccessModal(true);

      // Reset form on success
      setFormData({
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

      if (onFormSubmit) {
        onFormSubmit();
      }
    } catch (err) {
      console.error("Failed to submit contact form:", err);
      setError(err.message || "Something went wrong. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="flex-1 max-w-2xl relative">
      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSuccessModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="bg-white rounded-[2.5rem] p-8 md:p-12 max-w-md w-full shadow-[0_20px_50px_rgba(0,0,0,0.15)] text-center relative border border-white/20 z-10"
            >
              <button
                onClick={() => setShowSuccessModal(false)}
                className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 transition-all p-2 hover:bg-gray-100 rounded-full cursor-pointer"
              >
                <FaTimes size={18} />
              </button>

              <motion.div
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 relative"
              >
                <div className="absolute inset-0 bg-green-200 rounded-full animate-ping opacity-25" />
                <FaCheckCircle className="text-green-500 text-6xl relative z-10" />
              </motion.div>

              <h3 className="text-3xl font-extrabold text-gray-900 mb-4 tracking-tight">Success!</h3>
              <p className="text-gray-600 mb-10 text-lg leading-relaxed">
                Thank you for reaching out. Your message has been sent successfully. Our team will get back to you shortly.
              </p>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowSuccessModal(false)}
                className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-lg hover:bg-primary-dark transition-all cursor-pointer shadow-xl shadow-primary/25"
              >
                Close
              </motion.button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-3xl p-8 shadow-2xl border border-blue-200">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100 animate-pulse">
              {error}
            </div>
          )}
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
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={isSubmitting}
            className="w-full h-14 bg-primary text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden group relative"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full"
                />
                <span className="animate-pulse">Sending Message...</span>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <FaPaperPlane className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                <span>Send Message</span>
              </div>
            )}

            {/* Glossy overlay effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </motion.button>
          <p className="text-center text-gray-500 text-sm">
            We respect your privacy and will never share your information.
          </p>
        </form>
      </div>
    </div>
  );
}

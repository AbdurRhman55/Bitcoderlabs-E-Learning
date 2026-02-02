import { useState } from 'react';
import { FaEnvelope, FaCheckCircle } from 'react-icons/fa';
import ContactInformation from './CompanyInformation';
import RightForm from './RightForm';
import Button from '../../UI/Button';


export default function ProfessionalContact() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full text-sm font-medium mb-6">
            <FaEnvelope className="text-sm" />
            Get In Touch
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Let's Start a <span className="text-primary">Conversation</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Have questions? We're here to help. Send us a message and we'll respond promptly.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
          {/* Left Side - Company Information */}
          <ContactInformation />

          {/* Right Side - Contact Form */}
          <RightForm onFormSubmit={() => { }} />
        </div>
      </div>
    </section>
  );
}

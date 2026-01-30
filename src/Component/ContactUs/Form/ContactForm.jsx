import { useState } from 'react';
import { FaEnvelope, FaCheckCircle } from 'react-icons/fa';
import ContactInformation from './CompanyInformation';
import RightForm from './RightForm';
import Button from '../../UI/Button';


export default function ProfessionalContact() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (isSubmitted) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-3xl p-12 shadow-2xl border border-blue-200">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <FaCheckCircle className="text-white text-3xl" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Message Sent!</h3>
            <p className="text-gray-600 mb-8 text-lg">
              We've received your message and will get back to you within 24 hours.
            </p>c
            <Button
              onClick={() => setIsSubmitted(false)}
              text="Send Another Message"
              variant="squarefull"
              size="md"
              className="mt-4"
            />
          </div>
        </div>
      </section>
    );
  }

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
          <RightForm onFormSubmit={() => setIsSubmitted(true)} />
        </div>
      </div>
    </section>
  );
}

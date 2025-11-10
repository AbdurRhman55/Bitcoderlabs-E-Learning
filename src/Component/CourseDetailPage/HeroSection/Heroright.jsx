import React from "react";
import { courseData } from "../../../../Data/Courses.Array";
import Button from "../../UI/Button";
import { FaShieldAlt, FaBolt, FaLock, FaCreditCard } from "react-icons/fa";
// import { useAuth } from "../../Auth/AuthLogic";
import { Link, useNavigate } from "react-router-dom";

export default function Heroright() {
  // const { user } = useAuth();
  // Temporary mock user while auth is not wired. Replace when integrating auth provider.
  const user = null;
  const navigate = useNavigate();

  const handleEnroll = () => {
    if (!user) {
      alert("Plloginease login to enroll in the course.");
      navigate("/");    
      return;
    }

    if (courseData.price === 0) {
      alert("Successfully enrolled in free course!");
      navigate(`/course/${courseData.id || 1}/content`); //  redirect to course content
    } else {
      alert("Redirecting to payment...");
      navigate(`/Enroll/${courseData.id || 1}`); //  redirect to payment page
    }
  };

  return (
    <div>
      {/* Right Content - Enhanced Course Card */}
      <div className="sticky top-8">
        <div className="bg-white rounded-3xl shadow-2xl py-8 px-15 border border-gray-100 hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2">
          {/* Price Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-4 mb-2">
              <span className="text-4xl font-bold text-gray-900">
                {courseData.price}
              </span>
              <span className="text-lg text-gray-400 line-through">
                {courseData.originalPrice}
              </span>
              <span className="px-2 bg-red-100 text-red-600 text-sm font-bold rounded-full">
                40% OFF
              </span>
            </div>
            <p className="text-green-600 font-semibold">Limited time offer</p>
          </div>

          {/* Course Summary Grid */}
          <div className="space-y-6 mb-8">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center py-2 bg-gradient-to-br from-[#e8f7ff] to-white rounded-2xl border border-[#e8f7ff] hover:border-[#3baee9] transition-colors duration-300">
                <div className="text-xl font-bold text-[#3baee9] ">
                  {courseData.duration}
                </div>
                <div className="text-gray-600 text-sm font-medium">Duration</div>
              </div>
              <div className="text-center py-2 bg-gradient-to-br from-[#e8f7ff] to-white rounded-2xl border border-[#e8f7ff] hover:border-[#3baee9] transition-colors duration-300">
                <div className="text-xl font-bold text-[#3baee9] ">
                  {courseData.level}
                </div>
                <div className="text-gray-600 text-sm font-medium">Level</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center py-2 bg-gradient-to-br from-[#e8f7ff] to-white rounded-2xl border border-[#e8f7ff] hover:border-[#3baee9] transition-colors duration-300">
                <div className="text-xl font-bold text-[#3baee9] ">
                  {courseData.students}
                </div>
                <div className="text-gray-600 text-sm font-medium">Students</div>
              </div>
              <div className="text-center py-2 bg-gradient-to-br from-[#e8f7ff] to-white rounded-2xl border border-[#e8f7ff] hover:border-[#3baee9] transition-colors duration-300">
                <div className="text-xl font-bold text-[#3baee9] ">12</div>
                <div className="text-gray-600 text-sm font-medium">Projects</div>
              </div>
            </div>
          </div>

          {/* Enrollment CTA */}
          <div className="space-y-4">
            <Link to="/enroll/:id">
            <Button
              onClick={handleEnroll}
              text={
                courseData.price === 0
                  ? "Enroll Free"
                  : `Enroll Now – Rs ${courseData.price}`
              }
              variant="squarefull"
              size="lg"
            />
            </Link>

            <div className="text-center space-y-3">
              <p className="text-gray-500 text-sm font-medium">
                <FaShieldAlt className="inline-block mr-1 text-red-500" />
                30-day money-back guarantee
              </p>
              <p className="text-gray-500 text-sm font-medium">
                <FaBolt className="inline-block mr-1 text-yellow-500" />
                Instant lifetime access
              </p>
            </div>

            <div className="flex justify-center gap-4 pt-2">
              <div className="flex items-center gap-2 text-gray-600 text-sm">
                <FaLock className="inline-block mr-1 " />
                <span>Secure payment</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 text-sm">
                <FaCreditCard className="inline-block mr-1 text-yellow-500" />
                <span>Flexible payments</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

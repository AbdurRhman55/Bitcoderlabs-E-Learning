import React from "react";
import Button from "../../UI/Button";
import { FaCheck, FaRocket } from "react-icons/fa";
import { feature } from "../../../../Data/Courses.Array";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function VideoRight({ course }) {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleEnroll = () => {
    if (!isAuthenticated) {
      alert("Please log in to your account to enroll in this course. Redirection to login page...");
      navigate("/login");
      return;
    }

    if (course?.price === 0 || course?.price === "0") {
      alert("Successfully enrolled in free course!");
      navigate(`/course/${course?.id}/content`);
    } else {
      alert("Redirecting to payment...");
      navigate(`/Enroll/${course?.id}`);
    }
  };

  const features = Array.isArray(course?.features) ? course.features : feature;
  return (
    <div className="space-y-8 text-center lg:text-left">
      {/*  Info Section */}
      <div className="space-y-6">
        <div>
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 leading-tight">
            {course?.title || "Master Modern Web Development"}
          </h3>
          <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
            Join <span className="text-primary font-semibold">{course?.students_count || '12,500'}+ students</span> who've transformed their careers.
            {course?.short_description || "Learn HTML, CSS, JavaScript, and build real-world projects from day one."}
          </p>
        </div>

        {/*  Features Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {features.map((f, index) => (
            <div
              key={index}
              className="flex items-center gap-2 sm:gap-3 text-gray-700 justify-center lg:justify-start"
            >
              <div className="w-6 h-6 bg-primary-dark rounded-full flex items-center justify-center flex-shrink-0">
                <FaCheck className="text-white text-xs" />
              </div>
              <span className="text-sm font-medium">{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/*  Topics */}
      <div className="space-y-4">
        <h4 className="font-bold text-gray-900 text-lg">You'll Learn:</h4>
        <div className="flex flex-wrap justify-center lg:justify-start gap-3">
          {[
            "HTML5 & Semantics",
            "CSS3 & Flexbox",
            "JavaScript ES6+",
            "Responsive Design",
            "Git & GitHub",
            "Deployment",
          ].map((topic, i) => (
            <span
              key={i}
              className="px-3 py-2 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl text-sm font-medium hover:shadow-md hover:scale-105 transition-all duration-200 cursor-pointer"
            >
              {topic}
            </span>
          ))}
        </div>
      </div>

      {/*  CTA Section */}
      <div className="space-y-4">
        <Button
          onClick={handleEnroll}
          text={
            <>
              <FaRocket className="inline mr-2" />
              Enroll Now & Start Today
            </>
          }
          variant="squarefull"
        />
        <div className="space-y-1 place-items-center">
          <p className="text-gray-500 text-sm flex items-center justify-center lg:justify-start gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            30-day money-back guarantee
          </p>
          <p className="text-gray-400 text-xs">
            Join 12,500+ satisfied students
          </p>
        </div>
      </div>
    </div>
  );
}

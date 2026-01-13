import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  FaClock,
  FaUser,
  FaStar,
  FaArrowLeft,
  FaLock,
  FaCreditCard,
  FaMobileAlt,
  FaUniversity,
  FaWallet,
} from "react-icons/fa";
import InformationForm from "./InformationForm";
import PaymentMethod from "./PaymentMethod";
import { apiClient, API_ORIGIN } from "../../api/index";

const PLACEHOLDER_IMAGE = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmVmZWZlIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZpbGw9IiM5OTkiIGZvbnQtc2l6ZT0iMTQiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZHk9Ii4zZW0iIHRleHQtYW5jaG9yPSJtaWRkbGUiPkJpdGNvZGVyIExhYnM8L3RleHQ+PC9zdmc+";

export default function EnrollPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Consolidated form state
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: user?.email || "",
    phone: "",
    payment_method: "card",
    // card fields
    card_number: "",
    card_expiry: "",
    card_cvv: "",
    card_holder_name: "",
    // jazzcash fields
    jazzcash_number: "",
    jazzcash_account_name: "",
    // easypaisa fields
    easypaisa_number: "",
    easypaisa_account_name: "",
    // bank fields
    bank_name: "",
    bank_account_number: "",
    bank_account_holder_name: "",
  });

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const data = await apiClient.getCourseById(id);
        // Unwrap nested data if necessary (consistent with CourseDetailPage)
        const courseData = data.data && data.data.data ? data.data.data : (data.data || data);
        setCourse(courseData);
      } catch (err) {
        console.error("Failed to fetch course for enrollment:", err);
        setError("Unable to load course details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCourse();
    }
  }, [id]);

  const handleCompleteEnrollment = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("Please login to complete enrollment.");
      navigate("/login");
      return;
    }

    try {
      setSubmitting(true);
      const enrollmentPayload = {
        course_id: id,
        user_id: user.id,
        ...formData,
        amount: course.price,
        status: 'pending' // Admin will approve later
      };

      await apiClient.enrollCourse(enrollmentPayload);

      alert("Enrollment submitted successfully! Please wait for admin approval.");
      navigate("/courses"); // Or a success page
    } catch (err) {
      console.error("Enrollment submission failed:", err);
      alert(err.message || "Failed to submit enrollment. Please check your information and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#3baee9] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Loading course information...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center space-y-6">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto text-2xl">
            ⚠️
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Oops! Something went wrong</h2>
          <p className="text-gray-600">{error || "Course not found."}</p>
          <button
            onClick={() => navigate("/courses")}
            className="w-full py-3 bg-[#3baee9] text-white font-semibold rounded-xl hover:bg-[#2a9fd8] transition-colors"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  const courseImage = course.thumbnail
    ? (course.thumbnail.startsWith('http') ? course.thumbnail : `${API_ORIGIN}/storage/${course.thumbnail.startsWith('/') ? course.thumbnail.substring(1) : course.thumbnail}`)
    : PLACEHOLDER_IMAGE;

  const discount = course.original_price && course.price
    ? Math.round(((course.original_price - course.price) / course.original_price) * 100)
    : 40;




  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Enroll in Your Course
          </h1>
          <p className="text-gray-600">
            Complete your enrollment in just a few simple steps
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* --- Left: Enrollment Form --- */}
          <form onSubmit={handleCompleteEnrollment} className="lg:col-span-2 space-y-6">
            {/* Personal Information Card */}
            <InformationForm formData={formData} updateFormData={setFormData} />

            {/* Payment Method Card */}
            <PaymentMethod formData={formData} updateFormData={setFormData} />

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 flex items-center justify-center gap-2 border-2 border-gray-300 text-gray-700 font-semibold py-3 rounded-xl hover:border-gray-400 transition-all"
                disabled={submitting}
              >
                <FaArrowLeft /> Back to Course
              </button>
              <button
                type="submit"
                disabled={submitting}
                className={`flex-1 bg-gradient-to-r from-[#3baee9] to-[#2a9fd8] hover:from-[#2a9fd8] hover:to-[#3baee9] text-white font-semibold py-3 rounded-xl shadow-lg transition-transform hover:scale-105 flex items-center justify-center gap-2 ${submitting ? "opacity-70 cursor-not-allowed" : ""}`}
              >
                {submitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <FaLock />
                )}
                {submitting ? "Processing..." : "Complete Enrollment"}
              </button>
            </div>
          </form>

          {/* --- Right: Course Summary --- */}
          <div className="space-y-6">
            {/* Course Card */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-blue-100">
              <div className="relative">
                <img
                  src={courseImage}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    if (e.target.src !== PLACEHOLDER_IMAGE) {
                      e.target.onerror = null;
                      e.target.src = PLACEHOLDER_IMAGE;
                    }
                  }}
                />
                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {discount}% off
                </div>
              </div>

              <div className="p-6 space-y-4">
                <h3 className="text-xl font-bold text-gray-900 leading-tight">
                  {course.title}
                </h3>
                <p className="text-sm text-gray-600">by {course.instructor?.name || "Instructor"}</p>

                <p className="text-sm text-gray-700 leading-relaxed">
                  {course.tagline || course.short_description || "Start your learning journey today."}
                </p>

                <div className="flex flex-wrap gap-3 text-sm text-gray-700">
                  <div className="flex items-center gap-2 bg-[#e8f7ff] px-3 py-1 rounded-full">
                    <FaClock className="text-[#3baee9]" /> {course.duration || "Self-paced"}
                  </div>
                  <div className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full">
                    <FaUser className="text-green-500" /> {course.students_count || 0}
                  </div>
                  <div className="flex items-center gap-2 bg-yellow-50 px-3 py-1 rounded-full">
                    <FaStar className="text-yellow-500" /> {Number(course.rating || 4.8).toFixed(1)}
                  </div>
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Original Price:</span>
                    <span className="text-gray-500 line-through">
                      Rs {course.original_price || (Number(course.price || 0) * 1.5).toFixed(0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-semibold">
                      Discounted Price:
                    </span>
                    <span className="text-2xl font-bold text-[#3baee9]">
                      Rs {course.price}
                    </span>
                  </div>
                </div>

                <div className="bg-[#e8f7ff] rounded-xl p-4 mt-4">
                  <h4 className="font-semibold text-[#2a9fd8] mb-2">
                    What's Included:
                  </h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Lifetime access to course content</li>
                    <li>• Certificate of completion</li>
                    <li>• 24/7 support</li>
                    <li>• Downloadable resources</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Security Badge */}
            <div className="bg-white rounded-2xl shadow-lg border border-green-200 p-4 text-center">
              <div className="flex items-center justify-center gap-2 text-green-600 mb-2">
                <FaLock className="text-sm" />
                <span className="font-semibold">Secure Payment</span>
              </div>
              <p className="text-xs text-gray-600">
                Your payment information is encrypted and secure. We never share your details with third parties.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
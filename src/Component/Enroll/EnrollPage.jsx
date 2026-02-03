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
import { FiAlertCircle, FiBookOpen } from "react-icons/fi";
import PaymentMethod from "./PaymentMethod";
import PaymentProofUpload from "./PaymentProofUpload";
import { apiClient, API_ORIGIN } from "../../api/index";
import Swal from 'sweetalert2';

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmVmZWZlIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZpbGw9IiM5OTkiIGZvbnQtc2l6ZT0iMTQiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZHk9Ii4zZW0iIHRleHQtYW5jaG9yPSJtaWRkbGUiPkJpdGNvZGVyIExhYnM8L3RleHQ+PC9zdmc+";

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
    first_name: user?.name?.split(" ")[0] || "",
    last_name: user?.name?.split(" ").slice(1).join(" ") || "Student",
    email: user?.email || "",
    phone: user?.phone || "00000000000",
    payment_method: "easypaisa",
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
    bank_account_holder_name: "",
  });

  const [existingEnrollment, setExistingEnrollment] = useState(null);

  useEffect(() => {
    const checkExistingEnrollment = async () => {
      if (!user || !id) return;
      try {
        const response = await apiClient.getMyEnrollments();
        const enrollments = Array.isArray(response) ? response : response.data || [];
        const match = enrollments.find(e => String(e.course_id) === String(id));
        if (match) {
          setExistingEnrollment(match);
        }
      } catch (err) {
        console.error("Failed to check existing enrollment:", err);
      }
    };

    if (user && id) {
      checkExistingEnrollment();
    }
  }, [user, id]);

  // Keep email and names updated if user loads late
  useEffect(() => {
    if (user) {
      const names = user.name ? user.name.split(" ") : ["", ""];
      setFormData(prev => ({
        ...prev,
        first_name: prev.first_name || names[0],
        last_name: prev.last_name || names.slice(1).join(" ") || "Student",
        email: prev.email || user.email || "",
        phone: prev.phone === "00000000000" ? (user.phone || "00000000000") : prev.phone
      }));
    }
  }, [user]);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const data = await apiClient.getCourseById(id);
        // Unwrap nested data if necessary (consistent with CourseDetailPage)
        const courseData =
          data.data && data.data.data ? data.data.data : data.data || data;
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
      Swal.fire({
        title: 'Authentication Required',
        text: 'Please login to complete your enrollment.',
        icon: 'info',
        confirmButtonText: 'Go to Login',
        confirmButtonColor: '#3baee9'
      }).then(() => {
        navigate("/login");
      });
      return;
    }

    if (!formData.payment_proof) {
      Swal.fire({
        title: 'Payment Proof Missing',
        text: 'Please upload a screenshot of your payment to proceed.',
        icon: 'warning',
        confirmButtonText: 'Okay',
        confirmButtonColor: '#3baee9'
      });
      return;
    }

    try {
      setSubmitting(true);

      // Create FormData for file upload
      const enrollmentData = new FormData();
      enrollmentData.append("course_id", id);
      enrollmentData.append("user_id", user.id);
      enrollmentData.append("first_name", formData.first_name);
      enrollmentData.append("last_name", formData.last_name);
      enrollmentData.append("email", formData.email);
      enrollmentData.append("phone", formData.phone);
      enrollmentData.append("payment_method", formData.payment_method);
      enrollmentData.append("amount", course.price);
      enrollmentData.append("status", "pending");

      // Add payment proof file
      if (formData.payment_proof instanceof File) {
        enrollmentData.append("payment_proof", formData.payment_proof);
      }

      // Add payment details based on method
      const paymentDetails = {};
      if (formData.payment_method === "card") {
        paymentDetails.card_number = formData.card_number;
        paymentDetails.card_holder_name = formData.card_holder_name;
      } else if (formData.payment_method === "jazzcash") {
        paymentDetails.jazzcash_number = formData.jazzcash_number;
        paymentDetails.jazzcash_account_name = formData.jazzcash_account_name;
      } else if (formData.payment_method === "easypaisa") {
        paymentDetails.easypaisa_number = formData.easypaisa_number;
        paymentDetails.easypaisa_account_name = formData.easypaisa_account_name;
      } else if (formData.payment_method === "bank") {
        paymentDetails.bank_name = formData.bank_name;
        paymentDetails.bank_account_number = formData.bank_account_number;
        paymentDetails.bank_account_holder_name =
          formData.bank_account_holder_name;
      }

      // Record which payment method was used so admin table can display it
      paymentDetails.method = formData.payment_method;

      enrollmentData.append("payment_details", JSON.stringify(paymentDetails));

      const res = await apiClient.enrollCourse(enrollmentData);

      // inspect response for status (some backends may auto-approve)
      const created = (res && res.data) || res;
      const createdStatus =
        (created && created.status) ||
        (created && created[0] && created[0].status);

      if (createdStatus && createdStatus.toLowerCase() !== "pending") {
        // If backend auto-approved, warn user and do not assume pending
        await Swal.fire({
          title: 'Enrollment Submitted',
          text: `Server returned status: ${createdStatus}. Admin will review if required.`,
          icon: 'success',
          confirmButtonText: 'Go to Dashboard',
          confirmButtonColor: '#3baee9'
        });
      } else {
        await Swal.fire({
          title: 'Enrollment Successful!',
          text: 'Your request has been submitted. Please wait for admin approval.',
          icon: 'success',
          confirmButtonText: 'Go to Dashboard',
          confirmButtonColor: '#3baee9'
        });
      }

      navigate("/student-dashboard");
    } catch (err) {
      console.error("Enrollment submission failed:", err);

      const isDuplicate = err.message?.includes("already enrolled") ||
        err.message?.includes("Duplicate entry") ||
        err.message?.includes("1062");

      if (isDuplicate) {
        try {
          // Sync state to trigger UI block
          const response = await apiClient.getMyEnrollments();
          const enrollments = Array.isArray(response) ? response : response.data || [];
          const match = enrollments.find(e => String(e.course_id) === String(id));

          if (match) {
            setExistingEnrollment(match);
            Swal.fire({
              title: 'Already Enrolled',
              text: `You already have a ${match.status} record for this course. ${match.status === 'rejected' ? 'Admins must clear your rejected status before you can try again.' : 'Please follow the instructions on screen.'}`,
              icon: 'warning',
              confirmButtonColor: '#3baee9'
            });
            return;
          }
        } catch (checkErr) {
          console.error("Failed to sync enrollment on error:", checkErr);
        }
      }

      Swal.fire({
        title: 'Submission Failed',
        text: err.message || "Failed to submit enrollment. Please check your information and try again.",
        icon: 'error',
        confirmButtonColor: '#d33'
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#3baee9] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">
            Loading course information...
          </p>
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
          <h2 className="text-2xl font-bold text-gray-900">
            Oops! Something went wrong
          </h2>
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
    ? course.thumbnail.startsWith("http")
      ? course.thumbnail
      : `${API_ORIGIN}/storage/${course.thumbnail.startsWith("/") ? course.thumbnail.substring(1) : course.thumbnail}`
    : PLACEHOLDER_IMAGE;

  const discount =
    course.original_price && course.price
      ? Math.round(
        ((course.original_price - course.price) / course.original_price) *
        100,
      )
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
          <form
            onSubmit={handleCompleteEnrollment}
            className="lg:col-span-2 space-y-6"
          >
            {/* Payment Method Card */}
            <PaymentMethod formData={formData} updateFormData={setFormData} />

            {/* Payment Proof Upload */}
            <PaymentProofUpload
              formData={formData}
              updateFormData={setFormData}
            />

            {/* Action Buttons */}
            <div className="flex flex-col gap-4">
              {existingEnrollment && (
                <div className={`p-4 rounded-xl border flex items-start gap-3 ${existingEnrollment.status === 'rejected' ? 'bg-red-50 border-red-200 text-red-700' :
                  existingEnrollment.status === 'pending' ? 'bg-amber-50 border-amber-200 text-amber-700' :
                    'bg-green-50 border-green-200 text-green-700'
                  }`}>
                  <FiAlertCircle className="mt-0.5 shrink-0" size={18} />
                  <div>
                    <p className="text-sm font-bold">
                      Enrollment Activity Found: {existingEnrollment.status?.toUpperCase()}
                    </p>
                    <p className="text-xs mt-1 leading-relaxed text-gray-600">
                      {existingEnrollment.status === 'rejected' ?
                        "Your previous application was rejected. Due to security protocols, you cannot re-submit while a rejected record exists. Please contact the administrator to have your previous record cleared before trying again." :
                        existingEnrollment.status === 'pending' ?
                          "You already have a pending request for this course. Please wait for admin review." :
                          "You are already active in this course. You can access it from your student dashboard."}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="flex-1 flex items-center justify-center gap-2 border-2 border-gray-300 text-gray-700 font-semibold py-3 rounded-xl hover:border-gray-400 transition-all font-mono"
                  disabled={submitting}
                >
                  <FaArrowLeft /> Back
                </button>
                <button
                  type="submit"
                  disabled={submitting || !!existingEnrollment}
                  className={`flex-1 bg-gradient-to-r from-[#3baee9] to-[#2a9fd8] hover:from-[#2a9fd8] hover:to-[#3baee9] text-white font-semibold py-3 rounded-xl shadow-lg transition-transform hover:scale-105 flex items-center justify-center gap-2 ${submitting || !!existingEnrollment ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                >
                  {submitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <FaLock />
                  )}
                  {submitting ? "Processing..." :
                    existingEnrollment ? (existingEnrollment.status === 'rejected' ? "Submission Blocked" : "Already Enrolled") : "Complete Enrollment"}
                </button>
              </div>

              {existingEnrollment?.status === 'rejected' && (
                <p className="text-[10px] text-center text-red-500 font-bold uppercase tracking-tight">
                  System Alert: A record already exists. Admin intervention required to reset your status.
                </p>
              )}
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
                <p className="text-sm text-gray-600">
                  by {course.instructor?.name || "Instructor"}
                </p>

                <p className="text-sm text-gray-700 leading-relaxed">
                  {course.tagline ||
                    course.short_description ||
                    "Start your learning journey today."}
                </p>

                <div className="flex flex-wrap gap-3 text-sm text-gray-700">
                  <div className="flex items-center gap-2 bg-[#e8f7ff] px-3 py-1 rounded-full">
                    <FaClock className="text-[#3baee9]" />{" "}
                    {course.duration || "Self-paced"}
                  </div>
                  <div className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full">
                    <FaUser className="text-green-500" />{" "}
                    {course.students_count || 0}
                  </div>
                  <div className="flex items-center gap-2 bg-yellow-50 px-3 py-1 rounded-full">
                    <FaStar className="text-yellow-500" />{" "}
                    {Number(course.rating || 4.8).toFixed(1)}
                  </div>
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Original Price:</span>
                    <span className="text-gray-500 line-through">
                      Rs{" "}
                      {course.original_price ||
                        (Number(course.price || 0) * 1.5).toFixed(0)}
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
                Your payment information is encrypted and secure. We never share
                your details with third parties.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

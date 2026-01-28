import React, { useEffect, useState } from "react";
import {
  FaEye,
  FaCheck,
  FaTimes,
  FaSpinner,
  FaDownload,
  FaUser,
  FaBook,
  FaClock,
  FaTrash,
} from "react-icons/fa";
import { apiClient, API_ORIGIN } from "../../api/index.js";

export default function EnrolledStudentsTable() {
  const [enrollments, setEnrollments] = useState([]);
  console.log(enrollments);

  const [allEnrollments, setAllEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [filter, setFilter] = useState("pending");
  const [coursesCache, setCoursesCache] = useState({});

  // Helper function to normalize API response
  const normalizeData = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (data.data) {
      if (Array.isArray(data.data)) return data.data;
      if (data.data.data && Array.isArray(data.data.data))
        return data.data.data;
      if (typeof data.data === "object") return [data.data];
      return [];
    }
    return [data];
  };

  // Fetch enrollments with all related data
  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getEnrollments();
      let enrollmentsData = normalizeData(response);

      // Enrich each enrollment with user and course data
      const enrichedEnrollments = await Promise.all(
        enrollmentsData.map(async (enrollment) => {
          const enriched = { ...enrollment };

          // Fetch user data if not present
          if (!enriched.user && enriched.user_id) {
            try {
              const userRes = await apiClient.getUserById(enriched.user_id);
              enriched.user = normalizeData(userRes)[0] || {};
            } catch (error) {
              console.error("Error fetching user:", error);
              enriched.user = {};
            }
          }

          // Fetch course data if not present
          if (!enriched.course && enriched.course_id) {
            try {
              const courseRes = await apiClient.getCourseById(
                enriched.course_id,
              );
              enriched.course = normalizeData(courseRes)[0] || {};
            } catch (error) {
              console.error("Error fetching course:", error);
              enriched.course = {};
            }
          }

          // Ensure payment_proof is properly handled
          if (enriched.payment_details) {
            try {
              const paymentDetails =
                typeof enriched.payment_details === "string"
                  ? JSON.parse(enriched.payment_details)
                  : enriched.payment_details;

              if (paymentDetails.payment_proof) {
                enriched.payment_proof = paymentDetails.payment_proof;
              }

              // Copy other payment details for easy access
              enriched.paymentMethod = paymentDetails.method;
              enriched.transactionId = paymentDetails.transaction_id;
              enriched.paymentNumber =
                paymentDetails.easypaisa_number ||
                paymentDetails.jazzcash_number ||
                paymentDetails.bank_account_number;
            } catch (error) {
              console.error("Error parsing payment details:", error);
            }
          }

          return enriched;
        }),
      );

      setAllEnrollments(enrichedEnrollments);

      // Apply filter
      if (filter === "all") {
        setEnrollments(enrichedEnrollments);
      } else {
        const filtered = enrichedEnrollments.filter((e) => e.status === filter);
        setEnrollments(filtered);
      }
    } catch (err) {
      console.error("Failed to fetch enrollments:", err);
      alert("Failed to load enrollments. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, [filter]);

  // Ensure we have course data for enrollments: fetch missing courses by id and cache them
  useEffect(() => {
    const missing = new Set();
    allEnrollments.forEach((e) => {
      const cid = e?.course_id || e?.courseId || e?.course?._id || null;
      if (cid && !e.course && !coursesCache[String(cid)]) missing.add(cid);
    });

    if (missing.size === 0) return;

    (async () => {
      for (const cid of Array.from(missing)) {
        try {
          const res = await apiClient.getCourseById(cid);
          const course = normalizeData(res)[0] || {};
          setCoursesCache((prev) => ({ ...prev, [String(cid)]: course }));
        } catch (err) {
          console.error("Failed to fetch course:", cid, err);
          setCoursesCache((prev) => ({ ...prev, [String(cid)]: {} }));
        }
      }
    })();
  }, [allEnrollments]);

  // Get enrollment ID from various possible fields
  const getEnrollmentId = (enrollment) => {
    return (
      enrollment?.id || enrollment?.enrollment_id || enrollment?._id || null
    );
  };

  // Handle approve enrollment
  const handleApprove = async (enrollment) => {
    if (!window.confirm("Are you sure you want to approve this enrollment?"))
      return;

    const id = getEnrollmentId(enrollment);
    if (!id) {
      alert("Cannot determine enrollment ID to approve.");
      return;
    }

    try {
      setActionLoading(true);
      await apiClient.approveEnrollment(id, "Approved by admin");
      alert("Enrollment approved successfully!");
      await fetchEnrollments();
      setShowModal(false);
    } catch (err) {
      console.error("Failed to approve enrollment:", err);
      alert(err.message || "Failed to approve enrollment");
    } finally {
      setActionLoading(false);
    }
  };

  // Handle reject enrollment
  const handleReject = async (enrollmentId) => {
    if (!rejectReason.trim()) {
      alert("Please provide a reason for rejection");
      return;
    }

    if (!window.confirm("Are you sure you want to reject this enrollment?"))
      return;

    const id = enrollmentId || getEnrollmentId(selectedEnrollment);
    if (!id) {
      alert("Cannot determine enrollment ID to reject.");
      return;
    }

    try {
      setActionLoading(true);
      await apiClient.rejectEnrollment(id, rejectReason);
      alert("Enrollment rejected successfully!");
      await fetchEnrollments();
      setShowModal(false);
      setRejectReason("");
    } catch (err) {
      console.error("Failed to reject enrollment:", err);
      alert(err.message || "Failed to reject enrollment");
    } finally {
      setActionLoading(false);
    }
  };

  // Handle delete enrollment
  const handleDelete = async (enrollment) => {
    if (!window.confirm("Are you sure you want to permanently delete this enrollment? This will allow the student to re-enroll."))
      return;

    const id = getEnrollmentId(enrollment);
    if (!id) return;

    try {
      setActionLoading(true);
      await apiClient.deleteEnrollment(id);
      alert("Enrollment deleted successfully!");
      await fetchEnrollments();
      setShowModal(false);
    } catch (err) {
      console.error("Failed to delete enrollment:", err);
      alert(err.message || "Failed to delete enrollment. Make sure the backend supports DELETE /enrollments/{id}");
    } finally {
      setActionLoading(false);
    }
  };

  // Inline reject from table
  const handleRejectInline = async (enrollment) => {
    const reason = window.prompt("Enter rejection reason:");
    if (!reason || !reason.trim()) {
      alert("Rejection reason is required.");
      return;
    }

    if (!window.confirm("Are you sure you want to reject this enrollment?"))
      return;

    const id = getEnrollmentId(enrollment);
    if (!id) return alert("Cannot determine enrollment ID to reject.");

    try {
      setActionLoading(true);
      await apiClient.rejectEnrollment(id, reason);
      alert("Enrollment rejected successfully!");
      await fetchEnrollments();
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to reject enrollment");
    } finally {
      setActionLoading(false);
    }
  };

  // View enrollment details
  const viewDetails = async (enrollment) => {
    setLoading(true);

    try {
      // Fetch complete data for the selected enrollment
      const id = getEnrollmentId(enrollment);
      if (id) {
        const res = await apiClient.getEnrollmentById(id);
        let enrollmentData = normalizeData(res)[0] || {};

        // Resolve user: by user_id first, otherwise try phone lookup
        let resolvedUser = null;
        if (enrollmentData.user_id) {
          try {
            const userRes = await apiClient.getUserById(enrollmentData.user_id);
            resolvedUser = normalizeData(userRes)[0] || null;
          } catch (e) {
            console.error("Error fetching user by id:", e);
          }
        }

        // If still no user, attempt to look up by phone inside enrollment or payment details
        if (!resolvedUser) {
          let phone = enrollmentData.phone || null;
          if (!phone && enrollmentData.payment_details) {
            try {
              const pd =
                typeof enrollmentData.payment_details === "string"
                  ? JSON.parse(enrollmentData.payment_details)
                  : enrollmentData.payment_details;
              phone =
                pd.phone || pd.easypaisa_number || pd.jazzcash_number || null;
            } catch (e) {
              phone = null;
            }
          }

          if (phone) {
            try {
              const usersRes = await apiClient.getUsers({ phone });
              const users = normalizeData(usersRes);
              if (users.length) resolvedUser = users[0];
            } catch (e) {
              console.error("Error fetching user by phone:", e);
            }
          }
        }

        if (resolvedUser) enrollmentData.user = resolvedUser;

        // Fetch course data if present
        if (enrollmentData.course_id) {
          try {
            const courseRes = await apiClient.getCourseById(
              enrollmentData.course_id,
            );
            enrollmentData.course = normalizeData(courseRes)[0] || {};
          } catch (error) {
            console.error("Error fetching course:", error);
            enrollmentData.course = {};
          }
        }

        setSelectedEnrollment(enrollmentData);
      } else {
        setSelectedEnrollment(enrollment);
      }

      setShowModal(true);
      setRejectReason("");
    } catch (error) {
      console.error("Error fetching enrollment details:", error);
      setSelectedEnrollment(enrollment);
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  // Open lightbox for image viewing
  const openLightbox = (url) => {
    if (!url) return;
    setLightboxImage(resolveImageUrl(url));
  };

  const closeLightbox = () => setLightboxImage(null);

  // Get status badge styling
  const getStatusBadge = (status) => {
    const badges = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
      approved: "bg-green-100 text-green-800 border-green-300",
      rejected: "bg-red-100 text-red-800 border-red-300",
    };
    return badges[status] || "bg-gray-100 text-gray-800 border-gray-300";
  };

  // Resolve image URL
  const resolveImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith("http")) return url;
    if (url.startsWith("/")) return `${API_ORIGIN}${url}`;
    return `${API_ORIGIN}/storage/${url}`;
  };

  // Get student name
  const getStudentName = (enrollment) => {
    if (enrollment.user) {
      return (
        `${enrollment.user.first_name || ""} ${enrollment.user.last_name || ""}`.trim() ||
        enrollment.user.name ||
        "Unknown Student"
      );
    }
    return (
      `${enrollment.first_name || ""} ${enrollment.last_name || ""}`.trim() ||
      enrollment.name ||
      "Unknown Student"
    );
  };

  // Get payment proof URL
  const getPaymentProofUrl = (enrollment) => {
    // Check multiple possible locations for payment proof
    const proof =
      enrollment.payment_proof ||
      enrollment.payment_details?.payment_proof ||
      (enrollment.payment_details &&
        typeof enrollment.payment_details === "string" &&
        JSON.parse(enrollment.payment_details)?.payment_proof);

    return proof ? resolveImageUrl(proof) : null;
  };

  // Get student phone
  const getStudentPhone = (enrollment) => {
    if (enrollment.user?.phone) return enrollment.user.phone;
    if (enrollment.phone) return enrollment.phone;
    if (enrollment.payment_details) {
      try {
        const pd =
          typeof enrollment.payment_details === "string"
            ? JSON.parse(enrollment.payment_details)
            : enrollment.payment_details;
        return pd.easypaisa_number || pd.jazzcash_number || pd.phone || "-";
      } catch (e) {
        return "-";
      }
    }
    return "-";
  };

  // Get student id (resolved from user object or left as phone if no user found)
  const getStudentId = (enrollment) => {
    if (!enrollment) return "-";
    if (enrollment.user)
      return (
        enrollment.user.id ||
        enrollment.user.user_id ||
        enrollment.user._id ||
        "-"
      );
    if (enrollment.user_id) return enrollment.user_id;
    // fallback to phone-based identifier
    const phone = getStudentPhone(enrollment);
    return phone && phone !== "-" ? `phone:${phone}` : "-";
  };

  // Get course title
  const getCourseTitle = (enrollment) => {
    const courseId =
      enrollment?.course_id ||
      enrollment?.courseId ||
      enrollment?.course?._id ||
      null;

    return (
      enrollment.course?.title ||
      (courseId && coursesCache[String(courseId)]?.title) ||
      enrollment.course.data.title ||
      "Course Not Found"
    );
  };

  // Get payment method
  const getPaymentMethod = (enrollment) => {
    if (enrollment.payment_method) return enrollment.payment_method;
    if (enrollment.payment_details) {
      try {
        const pd =
          typeof enrollment.payment_details === "string"
            ? JSON.parse(enrollment.payment_details)
            : enrollment.payment_details;
        return pd.method || "N/A";
      } catch (e) {
        return "N/A";
      }
    }
    return "N/A";
  };

  // Get payment number
  const getPaymentNumber = (enrollment) => {
    if (enrollment.paymentNumber) return enrollment.paymentNumber;
    if (enrollment.payment_details) {
      try {
        const pd =
          typeof enrollment.payment_details === "string"
            ? JSON.parse(enrollment.payment_details)
            : enrollment.payment_details;
        return (
          pd.easypaisa_number ||
          pd.jazzcash_number ||
          pd.bank_account_number ||
          ""
        );
      } catch (e) {
        return "";
      }
    }
    return "";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <FaSpinner className="animate-spin text-4xl text-primary" />
        <span className="ml-3 text-lg">Loading enrollments...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Enrollment Requests
            </h2>
            <p className="text-gray-600 mt-1">
              Manage student enrollment applications
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
            {[
              {
                value: "pending",
                label: "Pending",
                count: allEnrollments.filter((e) => e.status === "pending")
                  .length,
              },
              {
                value: "approved",
                label: "Approved",
                count: allEnrollments.filter((e) => e.status === "approved")
                  .length,
              },
              {
                value: "rejected",
                label: "Rejected",
                count: allEnrollments.filter((e) => e.status === "rejected")
                  .length,
              },
              {
                value: "all",
                label: "All",
                count: allEnrollments.length,
              },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setFilter(tab.value)}
                className={`px-4 py-2 rounded-md font-medium transition-all ${filter === tab.value
                  ? "bg-white text-primary shadow-md"
                  : "text-gray-600 hover:text-gray-900"
                  }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Enrollments Table */}
      {enrollments.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <div className="text-gray-400 text-6xl mb-4">📋</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No Enrollments Found
          </h3>
          <p className="text-gray-500">
            There are no {filter} enrollment requests at the moment.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-primary to-primary-dark text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Student
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Course
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Payment Proof
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Status
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {enrollments.map((enrollment) => (
                  <tr
                    key={getEnrollmentId(enrollment)}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center text-primary font-semibold">
                          {getStudentName(enrollment).charAt(0) || "U"}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">
                            {getStudentName(enrollment)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {enrollment.user?.email || enrollment.email || "-"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {getCourseTitle(enrollment)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getPaymentProofUrl(enrollment) ? (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              openLightbox(getPaymentProofUrl(enrollment))
                            }
                            className="inline-block"
                            title="View proof"
                          >
                            <img
                              src={getPaymentProofUrl(enrollment)}
                              alt="Payment proof"
                              className="w-16 h-12 object-cover rounded-md border"
                              onError={(e) => {
                                e.target.src =
                                  "https://via.placeholder.com/64x48?text=No+Image";
                              }}
                            />
                          </button>
                          <a
                            href={getPaymentProofUrl(enrollment)}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Download proof"
                            className="p-2 bg-white rounded-md border text-primary hover:bg-gray-50"
                          >
                            <FaDownload />
                          </a>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(
                          enrollment.status,
                        )}`}
                      >
                        {enrollment.status?.toUpperCase() || "UNKNOWN"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => viewDetails(enrollment)}
                          className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                          title="View Details"
                        >
                          <FaEye />
                        </button>
                        {enrollment.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleApprove(enrollment)}
                              className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                              title="Approve"
                              disabled={actionLoading}
                            >
                              <FaCheck />
                            </button>
                            <button
                              onClick={() => handleRejectInline(enrollment)}
                              className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                              title="Reject"
                              disabled={actionLoading}
                            >
                              <FaTimes />
                            </button>
                          </>
                        )}
                        {enrollment.status === "rejected" && (
                          <button
                            onClick={() => handleDelete(enrollment)}
                            className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-red-500 hover:text-white transition-all font-mono"
                            title="Delete Record"
                            disabled={actionLoading}
                          >
                            <FaTrash size={12} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Lightbox Overlay */}
      {
        lightboxImage && (
          <div className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center p-4">
            <div className="relative max-w-4xl w-full">
              <button
                onClick={closeLightbox}
                className="absolute top-2 right-2 bg-white rounded-full p-2 z-10"
                title="Close"
              >
                <FaTimes />
              </button>
              <img
                src={lightboxImage}
                alt="Payment proof large"
                className="w-full max-h-[80vh] object-contain rounded-md"
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/800x600?text=Image+Not+Found";
                }}
              />
              <div className="mt-2 text-right">
                <a
                  href={lightboxImage}
                  download
                  className="px-4 py-2 bg-white rounded-md shadow"
                >
                  Download
                </a>
              </div>
            </div>
          </div>
        )}

      {/* Enrollment Details Modal */}
      {
        showModal && selectedEnrollment && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-primary to-primary-dark text-white p-6 sticky top-0 z-10">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold">Enrollment Request Details</h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
                  >
                    <FaTimes size={20} />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Student Info */}
                <div className="bg-blue-50 rounded-xl p-6">
                  <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FaUser className="text-primary" /> Student Information
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div><span className="text-sm text-gray-600">Full Name:</span><p className="font-semibold text-gray-900">{getStudentName(selectedEnrollment)}</p></div>
                    <div><span className="text-sm text-gray-600">Email:</span><p className="font-semibold text-gray-900">{selectedEnrollment.user?.email || selectedEnrollment.email || "-"}</p></div>
                    <div><span className="text-sm text-gray-600">Student ID:</span><p className="font-semibold text-gray-900">{getStudentId(selectedEnrollment)}</p></div>
                  </div>
                </div>

                {/* Course Info */}
                <div className="bg-green-50 rounded-xl p-6">
                  <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FaBook className="text-green-600" /> Course Information
                  </h4>
                  <p className="font-semibold text-gray-900">{getCourseTitle(selectedEnrollment)}</p>
                  <div className="text-sm text-gray-600 mt-1">Course ID: {selectedEnrollment.course_id}</div>
                </div>

                {/* Payment Info */}
                <div className="bg-yellow-50 rounded-xl p-6">
                  <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FaClock className="text-yellow-600" /> Payment Details
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div><span className="text-sm text-gray-600">Method:</span><p className="font-semibold capitalize">{getPaymentMethod(selectedEnrollment)}</p></div>
                    <div><span className="text-sm text-gray-600">Amount:</span><p className="font-semibold text-green-600">Rs {selectedEnrollment.amount}</p></div>
                  </div>
                  {getPaymentProofUrl(selectedEnrollment) && (
                    <div className="mt-4">
                      <img src={getPaymentProofUrl(selectedEnrollment)} className="w-full max-h-64 object-contain border rounded-lg" alt="Proof" />
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
                {selectedEnrollment.status === 'rejected' && (
                  <button
                    onClick={() => handleDelete(selectedEnrollment)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-bold"
                    disabled={actionLoading}
                  >
                    Delete Entire Record
                  </button>
                )}
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}

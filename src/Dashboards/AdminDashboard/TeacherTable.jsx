import React, { useEffect, useState } from "react";
import {
  Eye,
  Mail,
  Phone,
  Globe,
  User,
  GraduationCap,
  Briefcase,
  Folder,
  Award,
  Calendar,
  Clock,
  ArrowRight,
  Trophy,
  Edit,
  Trash2,
  CheckCircle,
  X
} from "lucide-react";
import { apiClient } from "../../../src/api/index.js";

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmVmZWZlIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZpbGw9IiM5OTkiIGZvbnQtc2l6ZT0iMTQiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZHk9Ii4zZW0iIHRleHQtYW5jaG9yPSJtaWRkbGUiPkJpdGNvZGVyIExhYnM8L3RleHQ+PC9zdmc+";

export default function TeachersTable() {
  const [teachers, setTeachers] = useState([]);
  const [courses, setCourses] = useState([]); // Store all courses
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: ''
  });
  const [statusFilter, setStatusFilter] = useState('All');

  const getImageUrl = (image) => {
    if (!image || typeof image !== "string") return "";
    if (
      image.includes("C:") ||
      image.includes("Users") ||
      image.includes("tmp")
    )
      return "";
    if (image.startsWith("http://") || image.startsWith("https://"))
      return image;
    // If image already has 'storage/' prefix, don't duplicate it if the base url also has it
    // But here we assume standard Laravel storage link
    const cleanImage = image.startsWith("/") ? image.substring(1) : image;
    return `http://127.0.0.1:8000/storage/${cleanImage}`;
  };

  // Helper to find courses for a teacher
  const getTeacherCourses = (teacherId) => {
    if (!courses || courses.length === 0) return [];
    return courses.filter(
      (course) =>
        course.instructor_id === teacherId ||
        (course.instructor && course.instructor.id === teacherId),
    );
  };

  // ================= FETCH =================
  const fetchTeachers = async () => {
    try {
      const [instructorsRes, coursesRes] = await Promise.all([
        apiClient.getInstructors(),
        apiClient.getCourses(),
      ]);

      // Set Teachers
      setTeachers(
        instructorsRes.data
          ? Array.isArray(instructorsRes.data)
            ? instructorsRes.data
            : [instructorsRes.data]
          : [],
      );

      // Set Courses - Handle pagination wrapper if present
      const coursesData =
        coursesRes.data && Array.isArray(coursesRes.data)
          ? coursesRes.data
          : coursesRes.data?.data && Array.isArray(coursesRes.data.data)
            ? coursesRes.data.data
            : [];
      setCourses(coursesData);
      console.log("All Courses:", coursesData);
    } catch (err) {
      console.error("Failed to fetch data:", err);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  // ================= ACTIONS =================
  const handleApprove = async (id) => {
    const teacher = teachers.find(t => t.id === id);
    if (!teacher) return;

    if (!window.confirm(`Approve ${teacher.name}?`)) return;

    try {
      // If the profile is still in 'pending' (draft) status, 
      // we auto-submit it for approval first so the backend can process the approval.
      if (teacher.approval_status === "pending" || !teacher.approval_status) {
        await apiClient.submitInstructorForApproval(id);
      }

      await apiClient.approveInstructor(id);
      setSelectedTeacher(null);
      fetchTeachers();
      alert("Instructor approved successfully!");
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || err.message || "Failed to approve instructor";
      alert(msg);
    }
  };

  const handleReject = async (id) => {
    const reason = window.prompt("Please provide a reason for rejection (Required):");

    if (reason === null) return; // User cancelled

    if (!reason.trim()) {
      alert("A reason is required to reject an instructor.");
      return;
    }

    try {
      await apiClient.rejectInstructor(id, reason.trim());
      setSelectedTeacher(null);
      fetchTeachers();
      alert("Instructor rejected successfully!");
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || err.message || "Failed to reject instructor";
      alert(msg);
    }
  };

  // ================= EDIT =================
  const handleEdit = (teacher) => {
    setEditingTeacher(teacher);
    setEditFormData({
      name: teacher.name || '',
      email: teacher.email || '',
      phone: teacher.phone || '',
      bio: teacher.bio || ''
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingTeacher) return;

    setIsUpdating(true);
    try {
      // Step 1: Construct a delta of only changed fields to avoid unnecessary validation triggers
      const payload = {};

      if (editFormData.name !== editingTeacher.name) payload.name = editFormData.name;
      if (editFormData.email !== editingTeacher.email) payload.email = editFormData.email;
      if (editFormData.phone !== (editingTeacher.phone || '')) payload.phone = editFormData.phone;
      if (editFormData.bio !== (editingTeacher.bio || '')) payload.bio = editFormData.bio;

      // If nothing changed, just close the modal
      if (Object.keys(payload).length === 0) {
        setEditingTeacher(null);
        return;
      }

      await apiClient.updateInstructor(editingTeacher.id, payload);
      alert("Teacher updated successfully!");
      setEditingTeacher(null);
      fetchTeachers();
    } catch (err) {
      console.error("Failed to update teacher:", err);

      // Extract specific error messages if available (especially for 422 errors)
      let errorMessage = "Failed to update teacher. Please try again.";
      if (err.response?.data?.errors) {
        const errors = err.response.data.errors;
        errorMessage = Object.values(errors).flat().join("\n");
      } else if (err.message) {
        errorMessage = err.message;
      }

      alert(errorMessage);
    } finally {
      setIsUpdating(false);
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`)) return;

    try {
      await apiClient.deleteInstructor(id);
      alert("Teacher deleted successfully!");
      fetchTeachers();
    } catch (err) {
      console.error("Failed to delete teacher:", err);
      alert("Failed to delete teacher. Please try again.");
    }
  };

  // ================= VIEW CV =================
  const handleViewCV = async (id) => {
    try {
      const res = await apiClient.getInstructor(id);
      setSelectedTeacher(res.data || {});
    } catch (err) {
      console.error("Failed to fetch CV:", err);
      alert("Failed to fetch teacher CV");
    }
  };

  const pendingTeachers = teachers.filter(
    (t) => t.approval_status === "submitted" || t.approval_status === "pending",
  );

  const filteredTeachers = teachers.filter((t) => {
    if (statusFilter === 'All') return true;
    if (statusFilter === 'Pending') return t.approval_status === 'submitted' || t.approval_status === 'pending';
    if (statusFilter === 'Active') return t.is_active;
    if (statusFilter === 'Rejected') return t.approval_status === 'rejected';
    return true;
  });

  return (
    <div className="space-y-10">
      {/*  PENDING REQUESTS  */}
      {pendingTeachers.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-[#2a9fd8] mb-4">
            Pending Instructor Requests
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {pendingTeachers.map((t) => (
              <div
                key={t.id}
                className="bg-white border border-[#3baee9]/30 rounded-xl p-4 shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={getImageUrl(t.image) || PLACEHOLDER_IMAGE}
                    className="w-6 h-6 rounded-full border border-[#3baee9]"
                    onError={(e) => {
                      if (e.target.src !== PLACEHOLDER_IMAGE) {
                        e.target.onerror = null;
                        e.target.src = PLACEHOLDER_IMAGE;
                      }
                    }}
                  />
                  <div>
                    <p className="text-lg font-semibold">{t.name}</p>
                    <p className="text-xs text-gray-500 line-clamp-3">
                      {t.bio || t.email}
                    </p>
                  </div>
                </div>

                <div className="mt-3 bg-[#e8f7ff] rounded-lg p-2 text-xs text-gray-700 space-y-0.5">
                  <p>
                    <b>Country:</b> {t.country || "—"}
                  </p>
                </div>

                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => handleViewCV(t.id)}
                    className="flex-1 text-xs py-2 border rounded-lg text-[#3baee9] flex items-center justify-center gap-1"
                  >
                    <Eye size={14} /> View CV
                  </button>

                  <button
                    onClick={() => handleApprove(t.id)}
                    className="flex-1 text-xs py-2 rounded-lg bg-[#3baee9] text-white hover:bg-[#2a9fd8] transition-colors"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => handleReject(t.id)}
                    className="flex-1 text-xs py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ================= INSTRUCTOR LIST ================= */}
      <section className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="px-6 py-6 border-b border-gray-200 bg-primary rounded-t-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-white">Instructors Management</h2>
              <p className="text-sm text-white/80">
                {teachers.length} total registered instructors
              </p>
            </div>

            <div className="flex bg-white/10 p-1 rounded-lg backdrop-blur-sm border border-white/20">
              {['All', 'Active', 'Pending', 'Rejected'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setStatusFilter(filter)}
                  className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${statusFilter === filter
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-white hover:bg-white/10'
                    }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>

        <table className="w-full text-sm">
          <thead className="bg-gray-50  ">
            <tr className="border-gray-200 border-b">
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase ">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                Specialization
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredTeachers.map((t) => (
              <tr
                key={t.id}
                className="hover:bg-gray-50 border-gray-200 border-b"
              >
                <td className="px-6 py-4 font-medium">{t.name}</td>
                <td className="px-6 py-4">
                  {/* Display assigned courses or fallback to specialization */}
                  {getTeacherCourses(t.id).length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {getTeacherCourses(t.id).map((c) => (
                        <span
                          key={c.id}
                          className="inline-block bg-primary text-white text-xs px-2 py-1 rounded-md border border-blue-100"
                        >
                          {c.title}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-400 italic">
                      {t.specialization && Array.isArray(t.specialization)
                        ? t.specialization.join(", ")
                        : t.specialization || "No courses assigned"}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full font-bold ${t.is_active
                    ? "bg-green-100 text-green-700"
                    : t.approval_status === 'rejected'
                      ? "bg-red-100 text-red-700"
                      : "bg-amber-100 text-amber-700"
                    }`}>
                    {t.is_active ? "Active" : t.approval_status === 'rejected' ? 'Rejected' : 'Pending'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleViewCV(t.id)}
                      className="text-[#3baee9] hover:text-[#2a9fd8] cursor-pointer flex items-center gap-1 transition-colors"
                      title="View CV"
                    >
                      <Eye size={16} />
                    </button>
                    {/* Status Toggle Actions */}
                    {!t.is_active && (
                      <button
                        onClick={() => handleApprove(t.id)}
                        className="text-primary hover:text-blue-700 cursor-pointer flex items-center gap-1 transition-colors"
                        title="Approve"
                      >
                        <CheckCircle size={16} />
                      </button>
                    )}
                    {t.approval_status !== 'rejected' && (
                      <button
                        onClick={() => handleReject(t.id)}
                        className="text-orange-600 hover:text-orange-700 cursor-pointer flex items-center gap-1 transition-colors"
                        title="Reject"
                      >
                        <X size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => handleEdit(t)}
                      className="text-green-600 hover:text-green-700 cursor-pointer flex items-center gap-1 transition-colors"
                      title="Edit Teacher"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(t.id, t.name)}
                      className="text-red-600 hover:text-red-700 cursor-pointer flex items-center gap-1 transition-colors"
                      title="Delete Teacher"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* ================= CV MODAL ================= */}
      {selectedTeacher && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-lg overflow-y-auto max-h-[90vh] p-6 relative">
            <button
              onClick={() => setSelectedTeacher(null)}
              className="absolute top-4 right-4 cursor-pointer text-gray-400 hover:text-black text-lg"
            >
              ✕
            </button>

            {/* Header */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6">
              <div className="relative">
                <img
                  src={getImageUrl(selectedTeacher.image) || PLACEHOLDER_IMAGE}
                  className="w-32 h-32 rounded-2xl object-cover border-4 border-gray-50 shadow-sm"
                  onError={(e) => {
                    if (e.target.src !== PLACEHOLDER_IMAGE) {
                      e.target.onerror = null;
                      e.target.src = PLACEHOLDER_IMAGE;
                    }
                  }}
                />
              </div>

              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                  <h3 className="text-3xl font-extrabold text-gray-900">
                    {selectedTeacher.name}
                  </h3>
                  {/* {selectedTeacher.title && (
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full uppercase tracking-wider">
                      {selectedTeacher.title}
                    </span>
                  )} */}
                </div>

                <p className="text-gray-600 mb-4 max-w-xl">
                  {selectedTeacher.bio || "Professional Educator"}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-sm">
                  {selectedTeacher.email && (
                    <div className="flex items-center gap-3 text-gray-500 bg-gray-50 p-2 rounded-lg border border-gray-100">
                      <div className="p-1.5 bg-white rounded-md shadow-sm text-primary">
                        <Mail size={14} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-bold text-gray-400 leading-none mb-1">
                          Email
                        </span>
                        <a
                          href={`mailto:${selectedTeacher.email}`}
                          className="text-primary  hover:underline leading-none text-[14px]"
                        >
                          {selectedTeacher.email}
                        </a>
                      </div>
                    </div>
                  )}
                  {selectedTeacher.phone && (
                    <div className="flex items-center gap-3 text-gray-500 bg-gray-50 p-2 rounded-lg border border-gray-100">
                      <div className="p-1.5 bg-white rounded-md shadow-sm text-green-500">
                        <Phone size={14} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-bold text-gray-400 leading-none mb-1">
                          Phone
                        </span>
                        <span className="text-gray-700 font-medium leading-none">
                          {selectedTeacher.phone}
                        </span>
                      </div>
                    </div>
                  )}
                  {selectedTeacher.portfolio_url && (
                    <div className="flex items-center gap-3 text-gray-500 bg-gray-50 p-2 rounded-lg border border-gray-100 sm:col-span-2">
                      <div className="p-1.5 bg-white rounded-md shadow-sm text-purple-500">
                        <Globe size={14} />
                      </div>
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-[10px] uppercase font-bold text-gray-400 leading-none mb-1">
                          Portfolio
                        </span>
                        <a
                          href={selectedTeacher.portfolio_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 font-medium hover:underline leading-none truncate"
                        >
                          {selectedTeacher.portfolio_url}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* CV Details */}
            <div className="mt-4 space-y-6 text-sm text-gray-700">
              {/* Helper function for safe parsing */}
              {(() => {
                const safeParse = (data, label) => {
                  if (Array.isArray(data)) return data;
                  if (typeof data === "string") {
                    try {
                      const parsed = JSON.parse(data);
                      // Ensure the result is an array
                      return Array.isArray(parsed) ? parsed : [];
                    } catch (e) {
                      console.warn(`Failed to parse ${label}:`, data);
                      return [];
                    }
                  }
                  return [];
                };

                const education = safeParse(
                  selectedTeacher.education,
                  "education",
                );
                const workExperience = safeParse(
                  selectedTeacher.work_experience,
                  "experience",
                ); // Changed variable name to avoid confusion with string field
                const projects = safeParse(
                  selectedTeacher.projects,
                  "projects",
                );
                const certifications = safeParse(
                  selectedTeacher.certifications,
                  "certifications",
                );

                return (
                  <>
                    {/* Professional Summary/Bio */}
                    <div>
                      <h4 className="flex items-center gap-2 font-bold text-gray-900 border-b pb-2 mb-3">
                        <div className="p-1.5 bg-gray-100 rounded-lg text-gray-500">
                          <User size={18} />
                        </div>
                        Professional Summary
                      </h4>
                      <p className="text-sm text-gray-700 italic leading-relaxed pl-2 border-l-2 border-gray-100">
                        {selectedTeacher.bio ||
                          "No professional summary provided."}
                      </p>
                    </div>

                    {/* Education */}
                    {education.length > 0 ? (
                      <div className="space-y-4">
                        <h4 className="flex items-center gap-2 font-bold text-gray-900 border-b pb-2">
                          <div className="p-1.5 bg-primary rounded-lg text-white">
                            <GraduationCap size={18} />
                          </div>
                          Education
                        </h4>
                        <ul className="space-y-3">
                          {education.map((edu, i) => (
                            <li
                              key={i}
                              className="pl-4 border-l-2 border-primary relative"
                            >
                              <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-primary"></div>
                              <p className="font-bold text-gray-900 text-base leading-tight">
                                {edu.degree || "Degree"}
                              </p>
                              <div className="flex items-center gap-2 text-primary font-bold mt-1">
                                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-primary/10 rounded text-[10px]">
                                  <Calendar size={12} strokeWidth={2.5} />
                                  {edu.year || "N/A"}
                                </div>
                                <span className="text-gray-300">•</span>
                                <span className="text-xs">
                                  {edu.institution || "Institution"}
                                </span>
                              </div>
                              {edu.description && (
                                <p className="text-gray-600 text-[11px] mt-2 line-clamp-2">
                                  {edu.description}
                                </p>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}

                    {/* Work Experience Section */}
                    <div className="space-y-4">
                      <h4 className="flex items-center gap-2 font-bold text-gray-900 border-b pb-2">
                        <div className="p-1.5 bg-primary rounded-lg text-white">
                          <Briefcase size={18} />
                        </div>
                        Work Experience
                      </h4>
                      {workExperience.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4">
                          {workExperience.map((work, i) => (
                            <div
                              key={i}
                              className="pl-4 border-l-2 border-primary relative"
                            >
                              <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-primary"></div>
                              <div className="flex items-center gap-2 text-primary font-bold mt-1">
                                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-primary/10 rounded text-[10px]">
                                  <Clock size={12} strokeWidth={2.5} />
                                  {work.duration || "N/A"}
                                </div>
                                <span className="text-gray-300">•</span>
                                <span className="text-xs">
                                  {work.institution || "Organization"}
                                </span>
                              </div>
                              {work.description && (
                                <p className="text-gray-600 text-xs mt-2">
                                  {work.description}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="bg-gray-50 py-3 px-4 rounded-lg border border-dashed">
                          {selectedTeacher.experience ? (
                            <p className="text-sm text-gray-700 font-medium">
                              {selectedTeacher.experience}
                            </p>
                          ) : (
                            <p className="text-sm text-gray-400 italic font-medium">
                              No work experience listed yet.
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Projects Section */}
                    <div className="space-y-4">
                      <h4 className="flex items-center gap-2 font-bold text-gray-900 border-b pb-2">
                        <div className="p-1.5 bg-primary rounded-lg text-white">
                          <Folder size={18} />
                        </div>
                        Projects
                      </h4>
                      {projects.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4">
                          {projects.map((p, i) => (
                            <div
                              key={i}
                              className="bg-gray-50/80 p-4 rounded-xl border border-gray-100"
                            >
                              <div className="flex justify-between items-start mb-1">
                                <p className="font-bold text-gray-900 uppercase text-xs tracking-wider">
                                  {p.title || "Project Title"}
                                </p>
                                {p.link && (
                                  <a
                                    href={p.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 text-[10px] font-bold uppercase underline"
                                  >
                                    Preview
                                  </a>
                                )}
                              </div>
                              <div className="flex items-center gap-2 mb-2">
                                <p className="text-xs text-primary font-bold">
                                  {p.organization} {p.role && `• ${p.role}`}
                                </p>
                                {p.duration && (
                                  <>
                                    <span className="text-gray-300 text-[10px]">
                                      •
                                    </span>
                                    <div className="flex items-center gap-1 px-1.5 py-0.5 bg-gray-100 rounded text-[9px] font-bold text-gray-500">
                                      <Clock size={10} strokeWidth={2.5} />
                                      {p.duration}
                                    </div>
                                  </>
                                )}
                              </div>
                              {p.technologies && (
                                <p className="text-[10px] text-gray-500 mb-2">
                                  <strong>Tech Stack:</strong> {p.technologies}
                                </p>
                              )}
                              {p.description && (
                                <p className="text-gray-600 text-[11px] leading-relaxed italic border-t pt-2 mt-2">
                                  "{p.description}"
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-400 italic bg-gray-50 py-3 px-4 rounded-lg border border-dashed font-medium">
                          No projects showcased yet.
                        </p>
                      )}
                    </div>

                    {/* Certifications Section */}
                    <div className="space-y-4">
                      <h4 className="flex items-center gap-2 font-bold text-gray-900 border-b pb-2">
                        <div className="p-1.5 bg-amber-500 rounded-lg text-white">
                          <Trophy size={18} />
                        </div>
                        Certifications
                      </h4>
                      {certifications.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {certifications.map((c, i) => (
                            <div
                              key={i}
                              className="flex items-start gap-3 p-3 bg-amber-50/30 border border-amber-100 rounded-xl"
                            >
                              <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-full bg-white flex items-center justify-center border border-amber-200 shadow-sm text-amber-600">
                                <Award size={16} />
                              </div>
                              <div>
                                <p className="font-bold text-gray-900 text-sm leading-tight">
                                  {c.name}
                                </p>
                                <p className="text-primary text-[11px] font-semibold">
                                  {c.issuer}
                                </p>
                                <div className="flex items-center gap-1 mt-1.5">
                                  <div className="flex items-center gap-1 px-1.5 py-0.5 bg-white border border-primary/20 rounded text-[9px] font-bold text-primary">
                                    <Calendar size={10} strokeWidth={2.5} />
                                    {c.issue_date || "N/A"}
                                  </div>
                                  {c.expiry_date && (
                                    <>
                                      <ArrowRight
                                        size={10}
                                        className="text-gray-300"
                                        strokeWidth={3}
                                      />
                                      <div className="flex items-center gap-1 px-1.5 py-0.5 bg-gray-50 border border-gray-200 rounded text-[9px] font-bold text-gray-500">
                                        {c.expiry_date}
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-400 italic bg-gray-50 py-3 px-4 rounded-lg border border-dashed font-medium">
                          No certifications listed yet.
                        </p>
                      )}
                    </div>

                    {/* If everything is empty */}
                    {education.length === 0 &&
                      workExperience.length === 0 &&
                      !selectedTeacher.experience &&
                      projects.length === 0 &&
                      certifications.length === 0 && (
                        <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed text-gray-400">
                          <p>
                            No detailed CV information has been added by this
                            teacher yet.
                          </p>
                        </div>
                      )}
                  </>
                );
              })()}

              <div className="pt-4 border-t mt-4 flex justify-between items-center">
                <p className="text-sm">
                  <b>System Status:</b>{" "}
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs ${selectedTeacher.is_active ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
                  >
                    {selectedTeacher.is_active ? "Active" : "Pending"}
                  </span>
                </p>
              </div>
            </div>

            {/* Actions */}
            {(selectedTeacher.approval_status === "submitted" || selectedTeacher.approval_status === "pending") && (
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => handleApprove(selectedTeacher.id)}
                  className="flex-1 py-2 rounded-lg bg-[#3baee9] text-white"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReject(selectedTeacher.id)}
                  className="flex-1 py-2 rounded-lg border text-red-600"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= EDIT MODAL ================= */}
      {editingTeacher && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-lg overflow-y-auto max-h-[90vh] p-6 relative">
            <button
              onClick={() => setEditingTeacher(null)}
              className="absolute top-4 right-4 cursor-pointer text-gray-400 hover:text-black text-lg"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Teacher Information</h2>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={editFormData.phone}
                  onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Bio / Professional Summary
                </label>
                <textarea
                  value={editFormData.bio}
                  onChange={(e) => setEditFormData({ ...editFormData, bio: e.target.value })}
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingTeacher(null)}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className={`flex-1 py-2 px-4 bg-primary text-white rounded-lg transition font-medium flex items-center justify-center gap-2 ${isUpdating ? 'opacity-70 cursor-not-allowed' : 'hover:bg-primary-dark'}`}
                >
                  {isUpdating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Updating...
                    </>
                  ) : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

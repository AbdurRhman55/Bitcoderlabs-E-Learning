import React, { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import { apiClient } from "../../../src/api/index.js";

export default function TeachersTable() {
    const [teachers, setTeachers] = useState([]);
    const [selectedTeacher, setSelectedTeacher] = useState(null);

    // ================= FETCH =================
    const fetchTeachers = async () => {
        try {
            const res = await apiClient.getInstructors();
            // Ensure res.data is an array
            setTeachers(res.data ? (Array.isArray(res.data) ? res.data : [res.data]) : []);
        } catch (err) {
            console.error("Failed to fetch teachers:", err);
        }
    };

    useEffect(() => {
        fetchTeachers();
    }, []);

    // ================= ACTIONS =================
    const handleApprove = async (id) => {
        if (!window.confirm("Approve this instructor?")) return;
        try {
            await apiClient.approveInstructor(id);
            setSelectedTeacher(null);
            fetchTeachers();
        } catch (err) {
            console.error(err);
            alert("Failed to approve instructor");
        }
    };

    const handleReject = async (id) => {
        if (!window.confirm("Reject this instructor?")) return;
        try {
            await apiClient.rejectInstructor(id);
            setSelectedTeacher(null);
            fetchTeachers();
        } catch (err) {
            console.error(err);
            alert("Failed to reject instructor");
        }
    };

    // ================= VIEW CV =================
    const handleViewCV = async (id) => {
        try {
            const res = await apiClient.getInstructor(id);
            // Make sure we get an object
            setSelectedTeacher(res.data || {});
        } catch (err) {
            console.error("Failed to fetch CV:", err);
            alert("Failed to fetch teacher CV");
        }
    };

    const pendingTeachers = teachers.filter((t) => !t.is_active);
    const activeTeachers = teachers.filter((t) => t.is_active);

    return (
        <div className="space-y-10">
            {/* ================= PENDING REQUESTS ================= */}
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
                                        src={t.image || "/avatar.png"}
                                        className="w-12 h-12 rounded-full border border-[#3baee9]"
                                    />
                                    <div>
                                        <p className="text-sm font-semibold">{t.name}</p>
                                        <p className="text-xs text-gray-500 line-clamp-3">{t.bio || t.email}</p>
                                    </div>
                                </div>

                                <div className="mt-3 bg-[#e8f7ff] rounded-lg p-2 text-xs text-gray-700 space-y-0.5">
                                    <p><b>Country:</b> {t.country || "—"}</p>
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
                                        className="flex-1 text-xs py-2 rounded-lg bg-[#3baee9] text-white"
                                    >
                                        Approve
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* ================= ACTIVE TEACHERS ================= */}
            <section className="bg-white rounded-xl border shadow-sm">
                <div className="px-6 py-4 border-b bg-gray-50">
                    <h2 className="text-2xl font-bold">Active Teachers</h2>
                    <p className="text-sm text-gray-500">
                        {activeTeachers.length} approved instructors
                    </p>
                </div>

                <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-3 text-left">Name</th>
                            <th className="px-6 py-3 text-left">Specialization</th>
                            <th className="px-6 py-3 text-left">Status</th>
                            <th className="px-6 py-3 text-left">View</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {activeTeachers.map((t) => (
                            <tr key={t.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium">{t.name}</td>
                                <td className="px-6 py-4">{t.specialization || "—"}</td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 text-xs rounded-full bg-[#e8f7ff] text-[#2a9fd8]">
                                        Active
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => handleViewCV(t.id)}
                                        className="text-[#3baee9] flex items-center gap-1"
                                    >
                                        <Eye size={16} /> View CV
                                    </button>
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
                            className="absolute top-4 right-4 text-gray-400 hover:text-black text-lg"
                        >
                            ✕
                        </button>

                        {/* Header */}
                        <div className="flex items-center gap-4 border-b pb-4">
                            <img
                                src={selectedTeacher.image || "/avatar.png"}
                                className="w-24 h-24 rounded-full border"
                            />
                            <div>
                                <h3 className="text-2xl font-bold">{selectedTeacher.name}</h3>
                                <p className="text-sm text-gray-500">{selectedTeacher.bio || "No bio provided"}</p>
                                {selectedTeacher.portfolio_url && (
                                    <p>
                                        <a href={selectedTeacher.portfolio_url} target="_blank" className="text-blue-500 underline">
                                            Portfolio
                                        </a>
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* CV Details */}
                        <div className="mt-4 space-y-4 text-sm text-gray-700">

                            {/* Education */}
                            {(selectedTeacher.education || []).length > 0 && (
                                <div>
                                    <h4 className="font-semibold text-gray-800 mb-1">Education</h4>
                                    <ul className="list-disc list-inside ml-4">
                                        {selectedTeacher.education.map((edu, i) => (
                                            <li key={i}>
                                                <p>
                                                    <b>{edu.degree || "Degree"}:</b> {edu.institute || "Institute"} ({edu.year || "-"})
                                                </p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Work Experience */}
                            {(selectedTeacher.work_experience || []).length > 0 && (
                                <div>
                                    <h4 className="font-semibold text-gray-800 mb-1">Work Experience</h4>
                                    <ul className="list-disc list-inside ml-4">
                                        {selectedTeacher.work_experience.map((work, i) => (
                                            <li key={i}>
                                                <p>
                                                    <b>{work.title || "Title"}:</b> {work.company || "Company"} ({work.start_date || "-"} - {work.end_date || "Present"})
                                                </p>
                                                {work.description && <p className="text-gray-600 text-xs">{work.description}</p>}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Projects */}
                            {(selectedTeacher.projects || []).length > 0 && (
                                <div>
                                    <h4 className="font-semibold text-gray-800 mb-1">Projects</h4>
                                    <ul className="list-disc list-inside ml-4">
                                        {selectedTeacher.projects.map((p, i) => <li key={i}>{p.description || p.title || "Project"}</li>)}
                                    </ul>
                                </div>
                            )}

                            {/* Certifications */}
                            {(selectedTeacher.certifications || []).length > 0 && (
                                <div>
                                    <h4 className="font-semibold text-gray-800 mb-1">Certifications</h4>
                                    <ul className="list-disc list-inside ml-4">
                                        {selectedTeacher.certifications.map((c, i) => <li key={i}>{c.name || "Certification"}</li>)}
                                    </ul>
                                </div>
                            )}

                            {/* Social Links */}
                            {selectedTeacher.social_links && Object.keys(selectedTeacher.social_links).length > 0 && (
                                <div className="flex gap-3 flex-wrap mt-2">
                                    {Object.entries(selectedTeacher.social_links).map(([key, link], i) => (
                                        <a key={i} href={link} target="_blank" className="text-blue-500 underline">{key}</a>
                                    ))}
                                </div>
                            )}

                            <p><b>Status:</b> {selectedTeacher.is_active ? "Active" : "Pending"}</p>
                        </div>

                        {/* Actions */}
                        {!selectedTeacher.is_active && (
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
        </div>
    );
}

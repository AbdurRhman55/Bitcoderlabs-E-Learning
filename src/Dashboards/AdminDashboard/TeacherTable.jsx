// components/TeachersTable.jsx
import React, { useEffect, useState } from "react";
import { Eye, X, Star, Users, BookOpen, Link2 } from "lucide-react";
import { apiClient } from "../../../src/api/index.js";

export default function TeachersTable() {
    const [teachers, setTeachers] = useState([]);
    const [selectedTeacher, setSelectedTeacher] = useState(null);

    // ================= FETCH TEACHERS =================
    const fetchTeachers = async () => {
        try {
            const res = await apiClient.getUsers();
            const allUsers = res.data || [];

            const onlyTeachers = allUsers.filter(
                (u) => u.role === "instructor" && u.is_active === true
            );

            setTeachers(onlyTeachers);
        } catch (err) {
            console.error("Error fetching teachers:", err);
        }
    };

    useEffect(() => {
        fetchTeachers();
    }, []);

    const formatDate = (date) =>
        date
            ? new Date(date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
            })
            : "—";

    return (
        <>
            {/* ================= TABLE ================= */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-5 border-b bg-gray-50">
                    <h2 className="text-3xl font-bold text-gray-900">
                        Teachers Management
                    </h2>
                    <p className="text-sm text-gray-500">
                        {teachers.length} teachers found
                    </p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 border-b">
                                {["Teacher", "Email", "Specialization", "Joined", "Status", "View"].map(
                                    (h) => (
                                        <th
                                            key={h}
                                            className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase"
                                        >
                                            {h}
                                        </th>
                                    )
                                )}
                            </tr>
                        </thead>

                        <tbody className="divide-y">
                            {teachers.map((t) => (
                                <tr key={t.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        <p className="font-medium text-gray-900">{t.name}</p>
                                        <p className="text-xs text-gray-500">{t.country}</p>
                                    </td>

                                    <td className="px-4 py-3 text-gray-700">{t.email}</td>

                                    <td className="px-4 py-3 text-gray-700">
                                        {t.specialization || "—"}
                                    </td>

                                    <td className="px-4 py-3 text-gray-600">
                                        {formatDate(t.created_at)}
                                    </td>

                                    <td className="px-4 py-3">
                                        <span className="px-2 py-1 text-xs rounded-full bg-emerald-100 text-emerald-600">
                                            Active
                                        </span>
                                    </td>

                                    {/* VIEW */}
                                    <td className="px-4 py-3">
                                        <button
                                            onClick={() => setSelectedTeacher(t)}
                                            className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                                        >
                                            <Eye size={16} />
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ================= PROFILE MODAL ================= */}
            {selectedTeacher && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl w-full max-w-3xl p-6 relative shadow-xl">
                        {/* Header */}
                        <div className="flex justify-between items-start border-b pb-4">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900">
                                    {selectedTeacher.name}
                                </h3>
                                <p className="text-sm text-gray-500">
                                    {selectedTeacher.title || "Instructor"}
                                </p>
                            </div>

                            <button
                                onClick={() => setSelectedTeacher(null)}
                                className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 text-sm">
                            {/* Left */}
                            <div className="space-y-3">
                                <p><b>Name:</b> {selectedTeacher.name}</p>
                                <p><b>Email:</b> {selectedTeacher.email}</p>
                                <p><b>Experience:</b> {selectedTeacher.experience || "—"}</p>
                                <p><b>Education:</b> {selectedTeacher.education || "—"}</p>
                                <p><b>Specialization:</b> {selectedTeacher.specialization || "—"}</p>

                                <div className="flex items-center gap-4 pt-2">
                                    <div className="flex items-center gap-1 text-yellow-500">
                                        <Star size={16} />
                                        <span>{selectedTeacher.rating || 0}</span>
                                    </div>

                                    <div className="flex items-center gap-1 text-gray-600">
                                        <Users size={16} />
                                        <span>{selectedTeacher.students_count} Students</span>
                                    </div>

                                    <div className="flex items-center gap-1 text-gray-600">
                                        <BookOpen size={16} />
                                        <span>{selectedTeacher.courses_count} Courses</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right */}
                            <div className="space-y-3">
                                <p className="font-medium text-gray-900">Bio</p>
                                <p className="text-gray-600">
                                    {selectedTeacher.bio || "No bio provided."}
                                </p>

                                {selectedTeacher.portfolio_url && (
                                    <a
                                        href={selectedTeacher.portfolio_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-2 text-blue-600 hover:underline mt-2"
                                    >
                                        <Link2 size={16} />
                                        View Portfolio
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={() => setSelectedTeacher(null)}
                                className="px-5 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

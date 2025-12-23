import React, { useEffect, useState } from "react";
import { Edit2, Trash2, CheckCircle2, XCircle } from "lucide-react";
import { apiClient } from "../../../src/api/index.js";

export default function StudentsTable() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // ================= FETCH STUDENTS =================
  const fetchUsers = async () => {
    try {
      const res = await apiClient.getUsers();
      const allUsers = res.data || [];

      // STUDENTS ONLY (ACTIVE + PENDING)
      const students = allUsers.filter(
        (u) => u.role === "student"
      );

      setUsers(students);
    } catch (err) {
      console.error("Error fetching students:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ================= APPROVE =================
  const handleApprove = async (userId) => {
    if (!window.confirm("Approve this student?")) return;

    try {
      await apiClient.approveUser(userId);
      fetchUsers();
    } catch (err) {
      alert("Approval failed");
    }
  };

  // ================= REJECT =================
  const handleReject = async (userId) => {
    if (!window.confirm("Reject this student? This will delete account.")) return;

    try {
      await apiClient.deleteUser(userId);
      fetchUsers();
    } catch (err) {
      alert("Rejection failed");
    }
  };

  // ================= DELETE =================
  const handleDelete = async (userId) => {
    if (!window.confirm("Delete this student?")) return;

    try {
      await apiClient.deleteUser(userId);
      fetchUsers();
    } catch (err) {
      alert("Delete failed");
    }
  };

  // ================= FILTER =================
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className=" rounded-xl shadow-sm border-gray-200 overflow-hidden">
      {/* HEADER */}
      <div className="px-6 flex justify-between items-center py-5 border-b border-gray-200 bg-primary">
        <h2 className="text-3xl text-white font-bold">Students Management</h2>

        {/* Search */}
        <div className="mt-4 relative w-72">
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm 
                 bg-white/95 text-gray-800 
                 placeholder-gray-400
                 focus:outline-none focus:ring-2 focus:ring-white/70
                 transition"
            placeholder="Search students by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* Search Icon */}
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
      </div>


      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 ">
              {["Student", "Email", "Status", "Approval", "Actions"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y ">
            {filteredUsers.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50 border-gray-200">
                <td className="px-4 py-3">
                  <p className="font-medium">{u.name}</p>
                </td>

                <td className="px-4 py-3">{u.email}</td>

                <td className="px-4 py-3">
                  {u.is_active ? (
                    <span className="px-2 py-1 text-xs bg-primary text-white rounded-full">
                      Active
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-full">
                      Pending
                    </span>
                  )}
                </td>

                {/* APPROVAL */}
                <td className="px-4 py-3">
                  {!u.is_active ? (
                    <div className="flex gap-3">
                      <button onClick={() => handleApprove(u.id)} className="text-green-600">
                        <CheckCircle2 size={18} />
                      </button>
                      <button onClick={() => handleReject(u.id)} className="text-red-600">
                        <XCircle size={18} />
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-primary font-medium">Approved</span>
                  )}
                </td>

                {/* ACTIONS */}
                <td className="px-4 py-3 flex gap-3">
                  <button className="text-primary-dark">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => handleDelete(u.id)} className="text-red-600">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <p className="text-center py-10 text-gray-500">No students found</p>
        )}
      </div>
    </div>
  );
}

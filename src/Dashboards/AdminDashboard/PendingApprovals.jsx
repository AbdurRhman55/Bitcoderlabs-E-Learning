import React, { useEffect, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { apiClient } from "../../../src/api/index.js";

export default function PendingApprovals() {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [selectedInstructor, setSelectedInstructor] = useState(null);

  // ================= FETCH USERS =================
  const fetchUsers = async () => {
    try {
      const response = await apiClient.getUsers();
      const usersArray = response.data || [];
      const pending = usersArray.filter((u) => u.is_active === false);
      setPendingUsers(pending);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ================= APPROVE USER =================
  const handleApprove = async (userId) => {
    if (window.confirm("Are you sure you want to approve this user?")) {
      try {
        await apiClient.approveUser(userId);
        fetchUsers();
      } catch (error) {
        console.error("Error approving user:", error);
        alert("Failed to approve user.");
      }
    }
  };

  // ================= REJECT USER =================
  const handleReject = async (userId) => {
    if (
      window.confirm(
        "Are you sure you want to reject this user? This will delete the account."
      )
    ) {
      try {
        await apiClient.deleteUser(userId);
        fetchUsers();
      } catch (error) {
        console.error("Error rejecting user:", error);
        alert("Failed to reject user.");
      }
    }
  };

  // ================= ROLE BADGE =================
  const getRoleBadge = (role) => {
    const roleStyles = {
      student: "bg-blue-100 text-blue-800",
      instructor: "bg-purple-100 text-purple-800",
      admin: "bg-red-100 text-red-800",
      moderator: "bg-orange-100 text-orange-800",
    };
    return roleStyles[role] || "bg-gray-100 text-gray-800";
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Pending Approvals
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          {pendingUsers.length} pending requests
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Requested Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Actions
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Profile
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {pendingUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {/* NAME */}
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">
                      {user.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {user.country}
                    </div>
                  </td>

                  {/* EMAIL */}
                  <td className="px-6 py-4 text-gray-700">
                    {user.email}
                  </td>

                  {/* ROLE */}
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadge(
                        user.role
                      )}`}
                    >
                      {user.role}
                    </span>
                  </td>

                  {/* ACTIONS */}
                  <td className="px-6 py-4">
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleApprove(user.id)}
                        className="text-green-600 hover:text-green-800"
                        title="Approve"
                      >
                        <CheckCircle2 size={20} />
                      </button>

                      <button
                        onClick={() => handleReject(user.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Reject"
                      >
                        <XCircle size={20} />
                      </button>
                    </div>
                  </td>

                  {/* INSTRUCTOR PROFILE */}
                  <td className="px-6 py-4">
                    {user.role === "instructor" ? (
                      <button
                        onClick={() => setSelectedInstructor(user)}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        View Profile
                      </button>
                    ) : (
                      <span className="text-gray-400 text-xs">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {pendingUsers.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No pending requests
          </div>
        )}
      </div>

      {/* ================= INSTRUCTOR PROFILE MODAL ================= */}
      {selectedInstructor && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl p-6 relative">
            <h3 className="text-xl font-bold mb-4">
              Instructor Profile
            </h3>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <p><b>Name:</b> {selectedInstructor.name}</p>
              <p><b>Email:</b> {selectedInstructor.email}</p>
              <p><b>Country:</b> {selectedInstructor.country}</p>
              <p><b>Role:</b> {selectedInstructor.role}</p>

              <p><b>Qualification:</b> {selectedInstructor.qualification}</p>
              <p><b>Experience:</b> {selectedInstructor.experience} years</p>

              <p className="col-span-2">
                <b>Bio:</b> {selectedInstructor.bio}
              </p>

              {selectedInstructor.cv_url && (
                <a
                  href={selectedInstructor.cv_url}
                  target="_blank"
                  rel="noreferrer"
                  className="col-span-2 text-blue-600 underline"
                >
                  View CV
                </a>
              )}
            </div>

            <div className="mt-6 text-right">
              <button
                onClick={() => setSelectedInstructor(null)}
                className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 text-sm"
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

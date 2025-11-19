// src/components/users/PendingRequests.jsx
import React, { useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

export default function PendingApprovals() {
  // Sample pending users
  const [pendingUsers, setPendingUsers] = useState([
    {
      id: 1,
      firstName: "Alice",
      lastName: "Brown",
      email: "alice.brown@example.com",
      requestedRole: "instructor",
      country: "USA",
      avatar: "https://via.placeholder.com/40",
    },
    {
      id: 2,
      firstName: "Bob",
      lastName: "Smith",
      email: "bob.smith@example.com",
      requestedRole: "moderator",
      country: "UK",
      avatar: "https://via.placeholder.com/40",
    },
  ]);

  // Approve user
  const handleApprove = (userId) => {
    if (window.confirm("Are you sure you want to approve this user?")) {
      setPendingUsers((prev) => prev.filter((user) => user.id !== userId));
      // TODO: send approval request to backend to activate the user
    }
  };

  // Reject user
  const handleReject = (userId) => {
    if (window.confirm("Are you sure you want to reject this user?")) {
      setPendingUsers((prev) => prev.filter((user) => user.id !== userId));
      // TODO: send rejection request to backend to delete/deny the user
    }
  };

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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Pending Approvals
      </h2>
      <p className="text-sm text-gray-600 mb-6">
        {pendingUsers.length} pending requests
      </p>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Requested Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {pendingUsers.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-gray-50 transition-colors duration-150"
              >
                {/* User Info */}
                <td className="px-6 py-4 flex items-center gap-3">
                  <img
                    src={user.avatar}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">
                      {user.firstName} {user.lastName}
                    </div>
                    <div className="text-xs text-gray-500">{user.country}</div>
                  </div>
                </td>

                {/* Contact */}
                <td className="px-6 py-4 text-sm text-gray-700">
                  {user.email}
                </td>

                {/* Requested Role */}
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadge(
                      user.requestedRole
                    )}`}
                  >
                    {user.requestedRole}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-6 py-4 text-sm">
                  <div className="flex items-center space-x-3">
                    {/* Approve Icon */}
                    <button
                      className="text-green-600 hover:text-green-800 transition"
                      onClick={() => handleApprove(user.id)}
                      title="Approve"
                    >
                      <CheckCircle2 size={20} />
                    </button>

                    {/* Reject Icon */}
                    <button
                      className="text-red-600 hover:text-red-800 transition"
                      onClick={() => handleReject(user.id)}
                      title="Reject"
                    >
                      <XCircle size={20} />
                    </button>
                  </div>
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
  );
}

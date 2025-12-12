import React, { useEffect, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

export default function PendingApprovals() {
  const [pendingUsers, setPendingUsers] = useState([]);

  // Fetch users from API
  const fetchUsers = async () => {
    const resp = await fetch("http://127.0.0.1:8000/api/v1/users");
    const result = await resp.json();

    console.log("API RESPONSE:", result);

    const usersArray = result.data || [];

    const pending = usersArray.filter((u) => u.is_active === false);

    setPendingUsers(pending);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Approve User
  const handleApprove = (userId) => {
    if (window.confirm("Are you sure you want to approve this user?")) {
      setPendingUsers((prev) => prev.filter((u) => u.id !== userId));
    }
  };

  // Reject User
  const handleReject = (userId) => {
    if (window.confirm("Are you sure you want to reject this user?")) {
      setPendingUsers((prev) => prev.filter((u) => u.id !== userId));
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
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Email
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

                  <div>
                    <div className="font-semibold text-gray-900">
                      {user.name}
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
                    {/* Approve */}
                    <button
                      className="text-green-600 hover:text-green-800 transition"
                      onClick={() => handleApprove(user.id)}
                      title="Approve"
                    >
                      <CheckCircle2 size={20} />
                    </button>

                    {/* Reject */}
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

import React, { useEffect, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { apiClient } from '../../../src/api/index.js';

export default function PendingApprovals() {
  const [pendingUsers, setPendingUsers] = useState([]);

  // Fetch pending approvals
  const fetchPendingApprovals = async () => {
    try {
      // Fetch pending users
      const usersResponse = await apiClient.getUsers();
      const usersArray = usersResponse.data || [];
      const pendingUsers = usersArray.filter((u) => u.is_active === false).map(u => ({ ...u, type: 'user' }));

      // Fetch pending instructors
      const instructorsResponse = await apiClient.getInstructors({ approval_status: 'submitted' });
      const instructorsArray = instructorsResponse.data || [];
      const pendingInstructors = instructorsArray.map(i => ({ ...i, type: 'instructor' }));

      // Combine and sort by created_at or id desc
      const allPending = [...pendingUsers, ...pendingInstructors].sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
      setPendingUsers(allPending);
    } catch (error) {
      console.error('Error fetching pending approvals:', error);
    }
  };

  useEffect(() => {
    fetchPendingApprovals();
  }, []);

  // Handle Approve
  const handleApprove = async (item) => {
    const confirmMessage = item.type === 'user'
      ? "Are you sure you want to approve this user?"
      : "Are you sure you want to approve this instructor?";

    if (window.confirm(confirmMessage)) {
      try {
        if (item.type === 'user') {
          await apiClient.approveUser(item.id);
        } else {
          await apiClient.approveInstructor(item.id);
        }
        // Refresh the list after approval
        fetchPendingApprovals();
      } catch (error) {
        console.error('Error approving:', error);
        alert('Failed to approve. Please try again.');
      }
    }
  };

  // Handle Reject
  const handleReject = async (item) => {
    const confirmMessage = item.type === 'user'
      ? "Are you sure you want to reject this user? This will delete the user account."
      : "Are you sure you want to reject this instructor? This will deactivate the instructor profile.";

    if (window.confirm(confirmMessage)) {
      try {
        if (item.type === 'user') {
          await apiClient.deleteUser(item.id);
        } else {
          await apiClient.rejectInstructor(item.id);
        }
        // Refresh the list after rejection
        fetchPendingApprovals();
      } catch (error) {
        console.error('Error rejecting:', error);
        alert('Failed to reject. Please try again.');
      }
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
                 Type
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
                     <div className="text-xs text-gray-500">{user.country || user.bio}</div>
                   </div>
                 </td>

                 {/* Contact */}
                 <td className="px-6 py-4 text-sm text-gray-700">
                   {user.email}
                 </td>

                 {/* Type */}
                 <td className="px-6 py-4">
                   <span
                     className={`px-2 py-1 rounded-full text-xs font-medium ${user.type === 'user' ? getRoleBadge(user.role) : 'bg-purple-100 text-purple-800'}`}
                   >
                     {user.type === 'user' ? user.role : 'Instructor'}
                   </span>
                 </td>

                 {/* Actions */}
                 <td className="px-6 py-4 text-sm">
                   <div className="flex items-center space-x-3">
                     {/* Approve */}
                     <button
                       className="text-green-600 hover:text-green-800 transition"
                       onClick={() => handleApprove(user)}
                       title="Approve"
                     >
                       <CheckCircle2 size={20} />
                     </button>

                     {/* Reject */}
                     <button
                       className="text-red-600 hover:text-red-800 transition"
                       onClick={() => handleReject(user)}
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

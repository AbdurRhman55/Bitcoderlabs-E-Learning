import React, { useState } from "react";
import { Edit2, Trash2 } from "lucide-react";

export default function UsersTable() {
  const [users, setUsers] = useState([
    {
      id: 1,
      firstName: "Mia",
      lastName: "Dawood",
      email: "MiaDawood@123gmail.com",
      role: "student",
      status: "active",
      joinDate: "2024-01-15",
      lastLogin: "2024-03-20",
      coursesEnrolled: 5,
      country: "United States",
      avatar: "https://via.placeholder.com/40",
    },
    {
      id: 2,
      firstName: "Mia",
      lastName: "Aizaz",
      email: "MiaAizaz@example.com",
      role: "instructor",
      status: "active",
      joinDate: "2023-11-08",
      lastLogin: "2024-03-19",
      coursesEnrolled: 12,
      country: "Canada",
      avatar: "https://via.placeholder.com/40",
    },
    {
      id: 3,
      firstName: "Abdur",
      lastName: "Rahman",
      email: "Abdur@example.com",
      role: "student",
      status: "inactive",
      joinDate: "2024-02-22",
      lastLogin: "2024-03-10",
      coursesEnrolled: 2,
      country: "United Kingdom",
      avatar: "https://via.placeholder.com/40",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;
    const matchesRole = roleFilter === "all" || user.role === roleFilter;

    return matchesSearch && matchesStatus && matchesRole;
  });

  const handleDeleteUser = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers((prev) => prev.filter((user) => user.id !== userId));
    }
  };

  const handleStatusChange = (userId, newStatus) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, status: newStatus } : user
      )
    );
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      active: "bg-primary text-white",
      inactive: "bg-primary text-white",
      pending: "bg-primary text-white",
      suspended: "bg-red-500 text-white",
    };
    return statusStyles[status] || "bg-gray-100 text-gray-700";
  };

  const getRoleBadge = (role) => {
    const roleStyles = {
      student: "bg-primary text-white",
      instructor: "bg-red-500 text-white",
      admin: "bg-Red-500 text-white",
      moderator: "bg-primary text-white",
    };
    return roleStyles[role] || "bg-gray-100 text-gray-700";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-200 bg-gray-50 flex flex-col gap-1">
        <h2 className="text-3xl font-bold text-gray-900">
          Users Management
        </h2>
        <p className="text-sm text-gray-500">
          {filteredUsers.length} of {users.length} users found
        </p>

        <div className="mt-3 flex gap-3 items-center">
          <input
            type="text"
            placeholder="Search users..."
            className="border border-gray-300 px-3 py-2 rounded-md w-60 text-sm focus:ring-1 focus:ring-primary-dark outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            className="border border-gray-300 focus:ring-1 focus:ring-primary-dark outline-none px-3 py-2 rounded-md text-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all" className="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
            <option value="suspended">Suspended</option>
          </select>

          <select
            className="border border-gray-300 focus:ring-1 focus:ring-primary-dark outline-none px-3 py-2 rounded-md text-sm"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="student" >Student</option>
            <option value="instructor">Instructor</option>
            <option value="admin">Admin</option>
            <option value="moderator">Moderator</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {[
                "User",
                "Contact",
                "Role",
                "Status",
                "Join Date",
                "Last Login",
                "Actions",
              ].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-[12px] font-semibold text-gray-600 uppercase tracking-wide whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-3 py-4 whitespace-nowrap flex items-center gap-3">
                  <img
                    src={user.avatar}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-medium text-gray-900 text-sm">
                      {user.firstName} {user.lastName}
                    </div>
                    <div className="text-xs text-gray-500">{user.country}</div>
                  </div>
                </td>

                <td className="px-3 py-4 whitespace-nowrap text-gray-700 text-sm">
                  {user.email}
                </td>

                <td className="px-3 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadge(
                      user.role
                    )}`}
                  >
                    {user.role}
                  </span>
                </td>

                <td className="px-3 py-4 whitespace-nowrap">
                  <select
                    value={user.status}
                    onChange={(e) =>
                      handleStatusChange(user.id, e.target.value)
                    }
                    className={`text-xs rounded-full px-2 py-1 ${getStatusBadge(
                      user.status
                    )}`}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="pending">Pending</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </td>

                <td className="px-3 py-4 whitespace-nowrap text-gray-600 text-sm">
                  {formatDate(user.joinDate)}
                </td>

                <td className="px-3 py-4 whitespace-nowrap text-gray-600 text-sm">
                  {formatDate(user.lastLogin)}
                </td>

                

                <td className="px-3 py-4 whitespace-nowrap text-sm">
                  <div className="flex items-center space-x-4">
                    {/* Edit Icon */}
                    <button
                      className="text-blue-600 hover:text-blue-800 transition"
                      title="Edit User"
                    >
                      <Edit2 size={18} />
                    </button>

                    {/* Delete Icon */}
                    <button
                      className="text-red-600 hover:text-red-800 transition"
                      onClick={() => handleDeleteUser(user.id)}
                      title="Delete User"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No users found
          </h3>
          <p className="text-gray-500 text-sm">
            Try changing filters or search.
          </p>
        </div>
      )}
    </div>
  );
}

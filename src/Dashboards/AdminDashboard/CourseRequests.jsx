import React, { useEffect, useMemo, useState } from "react";
import { apiClient } from "../../../src/api/index.js";

export default function CourseRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");

  const unwrap = (res) => res?.data?.data ?? res?.data ?? res;

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await apiClient.getCourseRequests(filter ? { status: filter } : {});
      const data = unwrap(res);
      setRequests(Array.isArray(data) ? data : (data?.data || []));
    } catch (e) {
      console.error("Failed to fetch course requests:", e);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const pendingCount = useMemo(
    () => requests.filter((r) => r.status === "pending").length,
    [requests]
  );

  const handleApprove = async (id) => {
    if (!window.confirm("Approve this course request?")) return;
    try {
      await apiClient.approveCourseRequest(id);
      await fetchRequests();
    } catch (e) {
      console.error(e);
      alert(e?.message || "Failed to approve course request");
    }
  };

  const handleReject = async (id) => {
    const reason = window.prompt("Enter rejection reason:");
    if (!reason) return;
    try {
      await apiClient.rejectCourseRequest(id, reason);
      await fetchRequests();
    } catch (e) {
      console.error(e);
      alert(e?.message || "Failed to reject course request");
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="px-6 py-4  bg-primary rounded-xl rounded-b text-white  flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="">
          <h2 className="text-3xl font-bold">Course Requests</h2>
          <p className="text-sm text-white">
            Review instructor requests to teach courses{filter === "pending" ? ` (${pendingCount} pending)` : ""}
          </p>
        </div>

        <div className="flex gap-2 items-center">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border bg-primary text-white rounded-lg text-sm"
          >
            <option value="pending" className="bg-primary hover:bg-primary-dark">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="">All</option>
          </select>

          <button
            onClick={fetchRequests}
            className="px-3 py-2 text-white border rounded-lg text-sm hover:bg-primary-dark "
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200  text-left text-xs font-semibold text-gray-600 uppercase">
            <tr>
              <th className="px-6 py-3 text-left">Course</th>
              <th className="px-6 py-3 text-left">Instructor</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Reason</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? (
              <tr>
                <td className="px-6 py-6 text-gray-600" colSpan={5}>
                  Loading...
                </td>
              </tr>
            ) : requests.length === 0 ? (
              <tr>
                <td className="px-6 py-6 text-gray-600" colSpan={5}>
                  No requests.
                </td>
              </tr>
            ) : (
              requests.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{r.course?.title || "—"}</div>
                    <div className="text-xs text-gray-500">{r.course?.slug || ""}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{r.instructor?.name || "—"}</div>
                    <div className="text-xs text-gray-500">Instructor ID: {r.instructor?.id || "—"}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${r.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : r.status === "rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                        }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {r.status === "rejected" ? r.reason || "—" : "—"}
                  </td>
                  <td className="px-6 py-4">
                    {r.status === "pending" ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(r.id)}
                          className="px-3 py-2 text-xs rounded-lg bg-blue-600 text-white"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(r.id)}
                          className="px-3 py-2 text-xs rounded-lg border text-red-600"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-500">—</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

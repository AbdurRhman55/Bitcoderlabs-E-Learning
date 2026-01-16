import React, { useEffect, useMemo, useState } from "react";
import { apiClient } from "../../../src/api/index.js";
import { CheckCircle, XCircle, AlertCircle, Search, RefreshCw, X, ChevronDown, ChevronUp } from "lucide-react";

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, type = "info", loading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className={`p-6 ${type === 'danger' ? 'bg-red-50' : type === 'success' ? 'bg-green-50' : 'bg-blue-50'}`}>
          <h3 className={`text-lg font-bold ${type === 'danger' ? 'text-red-800' : type === 'success' ? 'text-green-800' : 'text-blue-800'}`}>
            {title}
          </h3>
          <p className={`mt-2 text-sm ${type === 'danger' ? 'text-red-600' : type === 'success' ? 'text-green-600' : 'text-blue-600'}`}>
            {message}
          </p>
        </div>
        <div className="p-6 bg-white border-t border-gray-100 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium text-sm"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2 text-white rounded-lg shadow-sm transition-all text-sm font-medium
              ${type === 'danger'
                ? 'bg-red-600 hover:bg-red-700'
                : type === 'success'
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-blue-600 hover:bg-blue-700'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {loading ? "Processing..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};

const RejectionModal = ({ isOpen, onClose, onConfirm, loading }) => {
  const [reason, setReason] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">Reject Request</h3>
          <p className="text-sm text-gray-500 mt-1">Please provide a reason for rejecting this request.</p>
        </div>
        <div className="p-6">
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none text-sm min-h-[100px]"
            placeholder="e.g. Instructor does not meet the qualifications..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>
        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-gray-700 hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-200 rounded-lg transition-all font-medium text-sm"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(reason)}
            disabled={!reason.trim() || loading}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Rejecting..." : "Reject Request"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function CourseRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");
  const [actionLoading, setActionLoading] = useState(false);

  // Modal States
  const [approveId, setApproveId] = useState(null);
  const [rejectId, setRejectId] = useState(null);

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

  const handleApproveConfirm = async () => {
    if (!approveId) return;
    try {
      setActionLoading(true);
      await apiClient.approveCourseRequest(approveId);
      await fetchRequests();
      setApproveId(null);
    } catch (e) {
      console.error(e);
      alert(e?.message || "Failed to approve course request");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectConfirm = async (reason) => {
    if (!rejectId) return;
    try {
      setActionLoading(true);
      await apiClient.rejectCourseRequest(rejectId, reason);
      await fetchRequests();
      setRejectId(null);
    } catch (e) {
      console.error(e);
      alert(e?.message || "Failed to reject course request");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Modals */}
      <ConfirmationModal
        isOpen={!!approveId}
        onClose={() => setApproveId(null)}
        onConfirm={handleApproveConfirm}
        title="Approve Course Assignment"
        message="Are you sure you want to approve this instructor for this course? They will be granted full access to manage this course."
        type="success"
        loading={actionLoading}
      />

      <RejectionModal
        isOpen={!!rejectId}
        onClose={() => setRejectId(null)}
        onConfirm={handleRejectConfirm}
        loading={actionLoading}
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Course Requests</h1>
          <p className="text-gray-500">Manage instructor requests to teach courses.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white border border-gray-200 rounded-lg p-1 flex items-center">
            {['pending', 'approved', 'rejected', ''].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${filter === f
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50'
                  }`}
              >
                {f ? f.charAt(0).toUpperCase() + f.slice(1) : 'All'}
              </button>
            ))}
          </div>
          <button
            onClick={fetchRequests}
            className="p-2 text-gray-600 hover:text-primary bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            title="Refresh Data"
          >
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Stats/Info Banner */}
      {pendingCount > 0 && filter === 'pending' && (
        <div className="bg-gray-50 border border-primary rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="text-primary mt-0.5" size={20} />
          <div>
            <h4 className="font-semibold text-primary-dark">Pending Actions Required</h4>
            <p className="text-sm text-primary">You have {pendingCount} pending request{pendingCount !== 1 ? 's' : ''} waiting for your approval.</p>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left font-semibold text-gray-600">Course Details</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-600">Instructor</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-600">Status</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-600">Submission Date</th>
                <th className="px-6 py-4 text-right font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                // Skeleton Loader
                [...Array(3)].map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4"><div className="h-4 w-32 bg-gray-100 rounded animate-pulse"></div></td>
                    <td className="px-6 py-4"><div className="h-4 w-24 bg-gray-100 rounded animate-pulse"></div></td>
                    <td className="px-6 py-4"><div className="h-6 w-16 bg-gray-100 rounded-full animate-pulse"></div></td>
                    <td className="px-6 py-4"><div className="h-4 w-20 bg-gray-100 rounded animate-pulse"></div></td>
                    <td className="px-6 py-4"><div className="h-8 w-16 bg-gray-100 rounded ml-auto animate-pulse"></div></td>
                  </tr>
                ))
              ) : requests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <Search size={48} className="text-gray-200 mb-4" />
                      <p className="text-lg font-medium text-gray-900">No requests found</p>
                      <p className="text-sm text-gray-500">Try adjusting your filters or check back later.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                requests.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900 text-base">{r.course?.title || "Unknown Course"}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{r.course?.category?.name || "Uncategorized"}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                          {r.instructor?.name?.[0] || 'I'}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{r.instructor?.name || "Deleted User"}</div>
                          <div className="text-xs text-gray-500">{r.instructor?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border
                        ${r.status === 'approved' ? 'bg-green-50 text-green-700 border-green-100' :
                          r.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-100' :
                            'bg-yellow-50 text-yellow-700 border-yellow-100'}`}>
                        {r.status === 'approved' && <CheckCircle size={12} />}
                        {r.status === 'rejected' && <XCircle size={12} />}
                        {r.status === 'pending' && <AlertCircle size={12} />}
                        {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                      </span>
                      {r.status === 'rejected' && r.reason && (
                        <div className="mt-1 text-xs text-red-600 max-w-[150px] truncate" title={r.reason}>
                          Note: {r.reason}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {r.created_at ? new Date(r.created_at).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {r.status !== 'approved' && (
                          <button
                            onClick={() => setApproveId(r.id)}
                            className="px-3 py-1.5 text-xs font-medium bg-primary text-white rounded-lg shadow-sm hover:bg-primary-dark hover:shadow transition-all"
                          >
                            {r.status === 'rejected' ? 'Re-Approve' : 'Approve'}
                          </button>
                        )}
                        {r.status !== 'rejected' && (
                          <button
                            onClick={() => setRejectId(r.id)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-lg shadow-sm transition-all border ${r.status === 'approved'
                                ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                                : 'bg-white text-red-600 border-red-200 hover:bg-red-50'
                              }`}
                          >
                            {r.status === 'approved' ? 'Revoke' : 'Reject'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Footer / Pagination could go here */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center text-xs text-gray-500">
          <span>Showing {requests.length} records</span>
        </div>
      </div>
    </div>
  );
}

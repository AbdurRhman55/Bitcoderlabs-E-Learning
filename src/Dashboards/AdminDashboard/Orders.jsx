import React, { useEffect, useState } from "react";
import { ShoppingBag, Eye } from "lucide-react";
import { apiClient } from "../../../src/api/index.js";

export default function Orders() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchEnrollments = async () => {
    setLoading(true);
    try {
      const res = await apiClient.getEnrollments();
      setEnrollments(res.data || []);
    } catch (err) {
      console.error("Error fetching enrollments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const filtered = enrollments.filter(
    (e) =>
      (e.user?.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.course?.title || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="rounded-xl shadow-sm border-gray-200 overflow-hidden">
      {/* HEADER */}
      <div className="px-6 flex flex-col md:flex-row justify-between items-start md:items-center py-5 border-b border-gray-200 bg-primary">
        <h2 className="text-3xl text-white font-bold mb-3 md:mb-0">
          Orders & Enrollments
        </h2>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm bg-white/95 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/70 transition"
            placeholder="Search student or course..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <ShoppingBag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {["Order ID", "Student", "Course", "Price", "Date", "Status"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y">
            {loading ? (
               <tr><td colSpan="6" className="text-center py-10">Loading...</td></tr>
            ) : filtered.length === 0 ? (
               <tr><td colSpan="6" className="text-center py-10 text-gray-500">No enrollments found</td></tr>
            ) : (
                filtered.map((e) => (
                  <tr key={e.id} className="hover:bg-gray-50 border-gray-200">
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">#{e.id}</td>
                    <td className="px-4 py-3 font-medium">{e.user?.name || "Unknown User"}</td>
                    <td className="px-4 py-3 text-gray-700">{e.course?.title || "Unknown Course"}</td>
                    <td className="px-4 py-3 font-medium text-green-600">
                        {e.course?.price > 0 ? `$${e.course.price}` : "Free"}
                    </td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                      {new Date(e.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                          Completed
                        </span>
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

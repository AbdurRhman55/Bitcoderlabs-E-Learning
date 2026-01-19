import React, { useEffect, useState } from "react";
import { Trash2, Mail } from "lucide-react";
import { apiClient } from "../../../src/api/index.js";

export default function Contacts() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await apiClient.getContactMessages();
      // Adjust structure based on API response (paginated vs array)
      setMessages(res.data || []);
    } catch (err) {
      console.error("Error fetching messages:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this message?")) return;
    try {
      // Assuming delete endpoint exists and is generated/standard
      // const res = await apiClient.request(`/contact-messages/${id}`, { method: 'DELETE' });
      // Or use a dedicated method if added to apiClient
       await apiClient.request(`/contact-messages/${id}`, { method: 'DELETE' });

      setMessages((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete message");
    }
  };

  const filteredMessages = messages.filter(
    (m) =>
      (m.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.subject || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="rounded-xl shadow-sm border-gray-200 overflow-hidden">
      {/* HEADER */}
      <div className="px-6 flex flex-col md:flex-row justify-between items-start md:items-center py-5 border-b border-gray-200 bg-primary">
        <h2 className="text-3xl text-white font-bold mb-3 md:mb-0">
          Contact Messages
        </h2>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm bg-white/95 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/70 transition"
            placeholder="Search messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {["Sender", "Subject", "Message", "Date", "Actions"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y">
            {loading ? (
               <tr><td colSpan="5" className="text-center py-10">Loading...</td></tr>
            ) : filteredMessages.length === 0 ? (
               <tr><td colSpan="5" className="text-center py-10 text-gray-500">No messages found</td></tr>
            ) : (
                filteredMessages.map((m) => (
                  <tr key={m.id} className="hover:bg-gray-50 border-gray-200">
                    <td className="px-4 py-3">
                      <div className="font-medium">{m.name}</div>
                      <div className="text-xs text-gray-500">{m.email}</div>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-700">{m.subject}</td>
                    <td className="px-4 py-3 text-gray-600 max-w-xs truncate" title={m.message}>
                      {m.message}
                    </td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                      {new Date(m.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 flex gap-2">
                      <a
                        href={`mailto:${m.email}?subject=Re: ${m.subject}`}
                        className="text-primary hover:text-primary/80 p-1"
                        title="Reply"
                      >
                        <Mail size={18} />
                      </a>
                      <button
                        onClick={() => handleDelete(m.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
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

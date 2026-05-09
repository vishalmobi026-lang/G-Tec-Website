import React, { useState, useEffect } from 'react';
import { Search, Trash2, Mail, Phone, User, Calendar, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

export default function EnquiryTab() {
  const [inquiries, setInquiries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch inquiries from the database
  const fetchInquiries = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/inquiries');
      const data = await response.json();
      setInquiries(data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch inquiries:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  // Delete an inquiry
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this inquiry?")) {
      try {
        const response = await fetch(`http://localhost:5000/api/inquiries/${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          // Remove the deleted inquiry from the UI immediately
          setInquiries(inquiries.filter(inquiry => inquiry._id !== id));
        }
      } catch (error) {
        console.error("Failed to delete inquiry:", error);
      }
    }
  };

  // Filter inquiries based on search term
  const filteredInquiries = inquiries.filter(inq => 
    inq.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inq.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inq.phone?.includes(searchTerm)
  );

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading inquiries...</div>;
  }

  return (
    <div className="px-50 pt-50 pb-80">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <MessageSquare className="text-blue-600" /> 
          Chatbot Inquiries
          <span className="bg-blue-100 text-blue-600 text-sm py-1 px-3 rounded-full ml-2">
            {inquiries.length} Total
          </span>
        </h2>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-200">
                <th className="p-4 font-semibold">Name</th>
                <th className="p-4 font-semibold">Contact Info</th>
                <th className="p-4 font-semibold">Date Received</th>
                <th className="p-4 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredInquiries.length > 0 ? (
                filteredInquiries.map((inquiry, index) => (
                  <motion.tr 
                    key={inquiry._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    {/* Name */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                          {inquiry.name ? inquiry.name.charAt(0).toUpperCase() : '?'}
                        </div>
                        <span className="font-medium text-gray-800">{inquiry.name}</span>
                      </div>
                    </td>

                    {/* Contact Info (Email & Phone stacked) */}
                    <td className="p-4">
                      <div className="flex flex-col gap-1 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail size={14} className="text-gray-400" />
                          <a href={`mailto:${inquiry.email}`} className="hover:text-blue-600">
                            {inquiry.email}
                          </a>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone size={14} className="text-gray-400" />
                          <a href={`tel:${inquiry.phone}`} className="hover:text-blue-600">
                            {inquiry.phone}
                          </a>
                        </div>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="p-4 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-gray-400" />
                        {new Date(inquiry.date).toLocaleDateString('en-GB', {
                          day: '2-digit', month: 'short', year: 'numeric'
                        })}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleDelete(inquiry._id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Inquiry"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-gray-500">
                    No inquiries found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, Phone, Calendar, ArrowUpRight, 
  MessageSquare, Inbox, ShieldCheck, RefreshCw
} from 'lucide-react';

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchInquiries = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch("http://localhost:5000/api/contact-inquiries");
      const result = await res.json();
      if (result.success) setInquiries(result.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 200, damping: 20 } }
  };

  const unreadCount = inquiries.filter(inq => inq.status === 'New' || inq.status === 'Unread').length;

  return (
    <div className="min-h-screen bg-[#F7F7F9] text-gray-900 p-6 md:p-12 font-sans selection:bg-blue-200">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6 pb-6 border-b border-gray-200"
        >
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-gray-200 rounded-full shadow-sm mb-2">
              <span className={`w-2 h-2 rounded-full ${unreadCount > 0 ? 'bg-blue-500 animate-pulse' : 'bg-gray-400'}`} />
              <span className="text-xs font-semibold tracking-wide text-gray-600 uppercase">
                {unreadCount > 0 ? `${unreadCount} Unread Messages` : 'All Caught Up'}
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-clash font-medium tracking-tight text-gray-900">
              Student Inquiries
            </h1>
          </div>
          
          <div className="flex gap-4">
            <button onClick={fetchInquiries} className="bg-white border border-gray-200 px-4 py-3 rounded-full shadow-sm flex items-center gap-2 hover:bg-gray-50 transition-colors">
               <RefreshCw size={18} className={`text-gray-500 ${isRefreshing ? 'animate-spin' : ''}`} />
               <span className="text-sm font-medium text-gray-700">Refresh</span>
            </button>
            <div className="bg-white border border-gray-200 px-6 py-3 rounded-full shadow-sm flex items-center gap-3">
              <Inbox size={20} className="text-gray-400" />
              <span className="text-sm font-medium text-gray-700">
                <strong className="font-clash text-lg mr-1">{inquiries.length}</strong> Total
              </span>
            </div>
          </div>
        </motion.div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
             <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
             <p className="text-gray-500">Syncing database...</p>
          </div>
        ) : (
          <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {inquiries.map((inquiry) => {
                const isUnread = inquiry.status === 'New' || inquiry.status === 'Unread';

                return (
                  <motion.div 
                    key={inquiry._id} layout variants={cardVariants} whileHover={{ y: -8, scale: 1.01 }}
                    className={`group relative bg-white rounded-[2.5rem] p-8 border transition-all duration-500 flex flex-col h-full
                      ${isUnread ? 'border-blue-200 shadow-[0_8px_30px_rgba(59,130,246,0.1)]' : 'border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]'}
                      hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)]
                    `}
                  >
                    <div className="flex justify-between items-start mb-8 relative">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          {isUnread && <motion.div layoutId={`dot-${inquiry._id}`} className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />}
                          <h3 className={`text-2xl font-clash font-medium transition-colors line-clamp-1 ${isUnread ? 'text-gray-900' : 'text-gray-500'}`}>
                            {inquiry.firstName} {inquiry.lastName}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Calendar size={14} />
                          <span>{new Date(inquiry.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-blue-50 transition-all duration-300">
                        <ArrowUpRight size={20} className="text-gray-400 group-hover:text-blue-600" />
                      </div>
                    </div>

                    <div className="space-y-4 mb-8">
                      <a href={`mailto:${inquiry.email}`} className="flex items-center gap-4 p-3 -mx-3 rounded-2xl hover:bg-gray-50 transition-colors group/link">
                        <div className="p-2.5 bg-gray-100 rounded-xl text-gray-500 group-hover/link:bg-white group-hover/link:shadow-sm"><Mail size={16} /></div>
                        <span className="text-gray-700 font-medium truncate">{inquiry.email}</span>
                      </a>
                      <a href={`tel:${inquiry.countryCode}${inquiry.phone}`} className="flex items-center gap-4 p-3 -mx-3 rounded-2xl hover:bg-gray-50 transition-colors group/link">
                        <div className="p-2.5 bg-gray-100 rounded-xl text-gray-500 group-hover/link:bg-white group-hover/link:shadow-sm"><Phone size={16} /></div>
                        <span className="text-gray-700 font-medium">{inquiry.countryCode} {inquiry.phone}</span>
                      </a>
                    </div>

                    <div className={`flex-grow rounded-3xl p-6 border transition-colors duration-300 ${isUnread ? 'bg-blue-50/50 border-blue-100' : 'bg-[#F9FAFB] border-gray-100/50'}`}>
                      <p className={`leading-relaxed text-sm ${isUnread ? 'text-gray-800' : 'text-gray-500'}`}>"{inquiry.message}"</p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
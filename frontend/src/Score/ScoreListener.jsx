import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Search, Users, Loader2, Hash, ArrowUpRight } from 'lucide-react';

export default function ScoreListener() {
  const [contestants, setContestants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchContestants();
  }, []);

  const fetchContestants = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/gamescores/all');
      const data = await response.json();
      setContestants(data);
    } catch (error) {
      console.error("Error fetching contestants:", error);
    }
    setIsLoading(false);
  };

  const filteredContestants = contestants.filter((c) => {
    const search = searchTerm.toLowerCase();
    return (
      c.name.toLowerCase().includes(search) ||
      c.phone.includes(search) ||
      c.couponCode.toLowerCase().includes(search) ||
      c.course.toLowerCase().includes(search)
    );
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600 w-6 h-6" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans py-10">
      {/* HEADER - Tighter Padding */}
      <div className="bg-white border-b border-slate-200 pt-24 pb-6 px-6 shadow-sm">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Trophy size={20} className="text-blue-600" />
              Game <span className="text-blue-600">Outcomes</span>
            </h1>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input
              type="text"
              placeholder="Search records..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-100 border border-transparent text-xs pl-9 pr-4 py-2 rounded-lg outline-none focus:bg-white focus:border-blue-500 transition-all"
            />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 mt-6">
        {/* TABLE CONTAINER WITH LIMITED HEIGHT */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          
          {/* Internal Scroll Area - Set max-height here (e.g., 500px) */}
          <div className="max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 z-10 bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-5 text-[14px] font-bold text-slate-500 uppercase tracking-wider">Player Info</th>
                  <th className="py-3 px-5 text-[14px] font-bold text-slate-500 uppercase tracking-wider">Performance</th>
                  <th className="py-3 px-5 text-[14px] font-bold text-slate-500 uppercase tracking-wider">Coupon</th>
                  <th className="py-3 px-5 text-right text-[14px] font-bold text-slate-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <AnimatePresence>
                  {filteredContestants.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="py-10 text-center text-slate-400 text-xs italic">No data found.</td>
                    </tr>
                  ) : (
                    filteredContestants.map((contestant) => (
                      <tr key={contestant._id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-5">
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 bg-blue-50 text-blue-600 rounded flex items-center justify-center font-bold text-[10px]">
                              {contestant.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900">{contestant.name}</div>
                              <div className="text-red-400 text-[12px]">{contestant.phone}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-5">
                          <div className="flex flex-col">
                            <span className="font-black text-slate-900 text-sm">{contestant.score}</span>
                            <span className="text-[9px] text-purple-500 font-bold uppercase">{contestant.course}</span>
                          </div>
                        </td>
                        <td className="py-3 px-5">
                          <span className="font-mono text-[14px] bg-orange-100 px-2 py-1 rounded border border-slate-200 text-orange-500 font-bold">
                            {contestant.couponCode}
                          </span>
                        </td>
                        <td className="py-3 px-5 text-right">
                          <div className="text-slate-900 font-bold text-[12px]">
                            {new Date(contestant.createdAt).toLocaleDateString('en-GB')}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>

        {/* COMPACT FOOTER STATS */}
        <div className="mt-4 flex items-center justify-between px-2 text-[10px] font-bold uppercase text-slate-400">
           <span className="flex items-center gap-1.5 text-blue-600">
             <Users size={12} /> {filteredContestants.length} Records
           </span>
           <button onClick={fetchContestants} className="hover:text-blue-600 flex items-center gap-1">
             Refresh List <ArrowUpRight size={10} />
           </button>
        </div>
      </div>
    </div>
  );
}

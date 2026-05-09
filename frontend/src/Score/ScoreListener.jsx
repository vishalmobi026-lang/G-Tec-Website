import React, { useState, useEffect } from 'react';
import { Trophy, Search, Users, Calendar, Gamepad2, Loader2, Award, Percent } from 'lucide-react';

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

  // Live search filtering
  const filteredContestants = contestants.filter((c) => {
    const search = searchTerm.toLowerCase();
    return (
      c.name.toLowerCase().includes(search) ||
      c.phone.includes(search) ||
      c.couponCode.toLowerCase().includes(search) ||
      c.course.toLowerCase().includes(search)
    );
  });

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: 'numeric', minute: '2-digit', hour12: true
    }).format(date);
  };

  // Helper function to determine Tier Badge based on Score
  const getTierBadge = (score) => {
    if (score > 10000) {
      return <span className="bg-yellow-100 text-yellow-800 border border-yellow-300 px-3 py-1 rounded-full text-xs font-black flex items-center gap-1 w-max"><Award size={14}/> Top Tier (20%)</span>;
    } else if (score > 5000) {
      return <span className="bg-blue-100 text-blue-800 border border-blue-300 px-3 py-1 rounded-full text-xs font-black flex items-center gap-1 w-max"><Trophy size={14}/> Mid Tier (10%)</span>;
    } else {
      return <span className="bg-gray-100 text-gray-800 border border-gray-300 px-3 py-1 rounded-full text-xs font-black flex items-center gap-1 w-max"><Percent size={14}/> Base Tier (5%)</span>;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 lg:p-12 pt-32 lg:pt-36">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl shadow-sm">
                <Gamepad2 size={28} />
              </div>
              <h1 className="text-3xl lg:text-4xl font-black text-gray-900 tracking-tight">Game Contestants</h1>
            </div>
            <p className="text-gray-500 font-medium ml-1">Live database of all students who played Trivia Racer</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="flex flex-col items-center px-4 border-r border-gray-200">
              <span className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Total Players</span>
              <span className="text-2xl font-black text-indigo-600 flex items-center gap-2"><Users size={20}/> {contestants.length}</span>
            </div>
            <div className="px-4 w-64 relative">
              <Search className="absolute left-7 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search name, phone, code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl py-2 pl-10 pr-4 focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition-all"
              />
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-500 text-sm uppercase tracking-wider font-bold">
                  <th className="py-5 px-6">Student Details</th>
                  <th className="py-5 px-6">Target Course</th>
                  <th className="py-5 px-6">Final Score & Tier</th>
                  <th className="py-5 px-6">Coupon Code</th>
                  <th className="py-5 px-6">Played On</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr>
                    <td colSpan="5" className="py-20 text-center">
                      <Loader2 className="animate-spin text-indigo-500 mx-auto mb-4" size={40} />
                      <p className="text-gray-500 font-medium">Fetching contestant data...</p>
                    </td>
                  </tr>
                ) : filteredContestants.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-20 text-center">
                      <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users size={32} className="text-gray-400" />
                      </div>
                      <p className="text-gray-900 font-bold text-lg">No contestants found</p>
                      <p className="text-gray-500">Try adjusting your search terms.</p>
                    </td>
                  </tr>
                ) : (
                  filteredContestants.map((contestant) => (
                    <tr key={contestant._id} className="hover:bg-indigo-50/30 transition-colors group">
                      
                      <td className="py-4 px-6">
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-900 text-base">{contestant.name}</span>
                          <span className="text-sm font-mono text-gray-500">{contestant.phone}</span>
                        </div>
                      </td>
                      
                      <td className="py-4 px-6">
                        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg text-sm font-semibold border border-gray-200">
                          {contestant.course}
                        </span>
                      </td>
                      
                      <td className="py-4 px-6">
                        <div className="flex flex-col gap-1.5">
                          <span className="font-black text-xl text-indigo-600 drop-shadow-sm">
                            {contestant.score.toLocaleString()} <span className="text-xs text-indigo-400 font-bold">PTS</span>
                          </span>
                          {getTierBadge(contestant.score)}
                        </div>
                      </td>
                      
                      <td className="py-4 px-6">
                        <div className="inline-block bg-green-50 border border-green-200 text-green-700 font-mono font-bold px-3 py-1.5 rounded-lg shadow-sm">
                          {contestant.couponCode}
                        </div>
                      </td>
                      
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                          <Calendar size={16} className="text-gray-400" />
                          {formatDate(contestant.createdAt)}
                        </div>
                      </td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
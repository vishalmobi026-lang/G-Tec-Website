import React, { useState } from 'react';
import { Percent, Trophy, AlertCircle, Gamepad2, User, Phone, BookOpen, Search, Loader2 } from 'lucide-react';

export default function AdminCouponDecoder() {
  const [inputCode, setInputCode] = useState("");
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = async () => {
    const code = inputCode.trim().toUpperCase();
    
    if (!code.startsWith("GTEC-")) {
      setResult({ valid: false, message: "Invalid Coupon Format. Must start with GTEC-" });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      // Fetch all game scores from the backend
      const response = await fetch('http://localhost:5000/api/gamescores/all');
      const data = await response.json();

      // Find the specific user who owns this coupon code
      const foundStudent = data.find(student => student.couponCode === code);

      if (foundStudent) {
        // Determine the tier dynamically based on the exact score
        let level = "Base Tier Offer";
        let discount = "5% Discount";
        let hits = "Under 5000 Pts";

        if (foundStudent.score > 10000) {
          level = "Top Tier Offer";
          discount = "20% Discount";
          hits = "10,000+ Pts (Pro)";
        } else if (foundStudent.score > 5000) {
          level = "Mid Tier Offer";
          discount = "10% Discount";
          hits = "5,000+ Pts (Good)";
        }

        setResult({ 
          valid: true, 
          name: foundStudent.name,
          phone: foundStudent.phone,
          course: foundStudent.course,
          score: foundStudent.score.toLocaleString(),
          hits, 
          level, 
          discount 
        });
      } else {
        setResult({ valid: false, message: "Coupon code not found in the database. It may be fake or expired." });
      }
    } catch (error) {
      console.error("Error fetching coupon data:", error);
      setResult({ valid: false, message: "Failed to connect to the server." });
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#f8fafc] p-4 pt-32">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-[2rem] shadow-2xl p-8 relative overflow-hidden">
        
        {/* Background Decorative element */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-bl-full pointer-events-none -z-10"></div>

        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
            <Gamepad2 size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-900 leading-none">Coupon Decoder</h2>
            <p className="text-gray-500 text-sm mt-1">Verify student game rewards</p>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div className="relative">
            <input 
              type="text" 
              placeholder="e.g., GTEC-X9-A1B2" 
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
              className="w-full bg-gray-50 border border-gray-300 text-gray-900 font-mono tracking-wider text-lg rounded-xl py-4 pl-4 pr-12 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all uppercase placeholder:normal-case placeholder:tracking-normal"
            />
            <Percent className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          </div>

          <button 
            onClick={handleVerify}
            disabled={isLoading || !inputCode.trim()}
            className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-all active:scale-[0.98] shadow-lg shadow-blue-600/30 flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Search size={20} />}
            {isLoading ? "Verifying..." : "Verify Secret Code"}
          </button>
        </div>

        {result && (
          <div className={`p-6 rounded-2xl border transition-all duration-300 ${result.valid ? 'bg-green-50 border-green-200 shadow-[0_0_20px_rgba(34,197,94,0.1)]' : 'bg-red-50 border-red-200 shadow-[0_0_20px_rgba(239,68,68,0.1)]'}`}>
            {result.valid ? (
              <div className="space-y-4">
                
                {/* Status Banner */}
                <p className="flex items-center gap-2 text-green-800 font-black text-lg border-b border-green-200/60 pb-3">
                  <CheckCircle size={24} className="text-green-600" /> Verified Match
                </p>

                {/* Student Details */}
                <div className="space-y-3 py-2">
                  <div className="flex items-center gap-3 text-gray-700">
                    <User size={18} className="text-gray-400" />
                    <span className="font-semibold">{result.name}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <Phone size={18} className="text-gray-400" />
                    <span className="font-mono">{result.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <BookOpen size={18} className="text-gray-400" />
                    <span className="font-medium text-sm bg-white px-3 py-1 rounded-lg border border-green-200 shadow-sm">{result.course}</span>
                  </div>
                </div>

                <div className="w-full h-px bg-green-200/60 my-2"></div>

                {/* Game Stats & Discount */}
                <div className="flex justify-between items-center text-sm text-green-700 pt-1">
                  <strong className="font-semibold text-green-800 flex items-center gap-2"><Trophy size={16} /> Final Score:</strong> 
                  <span className="bg-green-100 px-3 py-1 rounded-md font-black">{result.score}</span>
                </div>
                
                <div className="flex justify-between items-center text-sm text-green-700 mt-2">
                  <strong className="font-semibold text-green-800 flex items-center gap-2"><Percent size={16} /> Deal Unlocked:</strong> 
                  <span className="font-black text-xl text-green-600 drop-shadow-sm bg-white px-3 py-1 rounded-lg border border-green-200">
                    {result.discount}
                  </span>
                </div>
                <p className="text-xs text-green-600/80 text-right font-medium">Tier: {result.level}</p>

              </div>
            ) : (
              <div className="flex items-start gap-3 text-red-700">
                <AlertCircle size={24} className="shrink-0 text-red-500" />
                <div>
                  <p className="font-bold text-red-800 mb-1">Verification Failed</p>
                  <p className="text-sm leading-snug">{result.message}</p>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

// Small helper component to keep icons consistent
function CheckCircle({ size, className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
  );
}
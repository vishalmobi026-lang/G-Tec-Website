import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LottieBase from "lottie-react";
import { useLottie } from "lottie-react";
import successAnimation from "../assets/Female.json"; 
import errorAnimation from "../assets/Thinking.json";
import gaming from "../assets/Chatbot.json";

const Lottie = LottieBase.default || LottieBase;

const PopupAnimation = ({ type }) => {
  const { View } = useLottie({
    animationData: type === "success" ? successAnimation : errorAnimation,
    loop: false,
    autoplay: true,
  });
  return <>{View}</>;
};

export default function Chatbot() {
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: "success",
    message: "",
  });

  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  
  // Real-time precise tracking for Footer
  const [offsetY, setOffsetY] = useState(0);
  const footerRef = useRef(null);

  useEffect(() => {
    // Locate the footer element natively in the DOM
    footerRef.current = document.querySelector('footer');

    const handleScroll = () => {
      if (footerRef.current) {
        const footerRect = footerRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        // If the footer breaches the bottom of the screen, calculate exact overlap
        if (footerRect.top < viewportHeight) {
          const overlap = viewportHeight - footerRect.top;
          setOffsetY(overlap); // Push up by EXACTLY the amount the footer is visible
        } else {
          setOffsetY(0);
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    handleScroll(); // Initial calibration
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // FIXED BUG: Changed from /api/enquiries to /api/chatbot to match adress.js
      const response = await fetch('http://localhost:5000/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData), 
      });
      const data = await response.json();
      
      if (data.success) {
        setModalState({ isOpen: true, type: "success", message: "Message sent successfully!" });
        setIsOpen(false);
        setFormData({ name: '', email: '', phone: '' });
      } else {
        setModalState({ isOpen: true, type: "error", message: "Failed to send message." });
      }
    } catch (error) {
      setModalState({ isOpen: true, type: "error", message: "Network error occurred." });
    }
  };

  return (
    <>
      <motion.div
        className="fixed bottom-6 right-6 z-9999 flex flex-col items-end pointer-events-auto"
        animate={{ y: -offsetY }}
        transition={{ type: "spring", stiffness: 600, damping: 50 }}
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className={`relative flex items-center justify-center p-3 rounded-full transition-colors duration-500 w-16 h-16 
            ${isOpen ? 'bg-blue-600 text-white shadow-2xl' : 'bg-transparent'} 
          `}
        >
          {!isOpen && (
            <div className="absolute inset-0 rounded-full bg-blue-500/10 blur-md animate-[pulse_4s_ease-in-out_infinite]"></div>
          )}

          <div className="w-30 h-30 flex items-center justify-center relative z-10 transition-transform duration-500">
            {isOpen ? <X size={30} className="text-white" /> : <Lottie animationData={gaming} loop={true} style={{ width: 100, height: 100 }} />}
          </div>
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.95, filter: "blur(5px)" }}
              animate={{ opacity: 1, y: -20, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: 20, scale: 0.95, filter: "blur(5px)" }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="absolute bottom-16 right-0 bg-white/95 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.2)] rounded-[2rem] w-[340px] p-6 z-[9999] border border-white/20 origin-bottom-right"
            >
               <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                 <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                    <MessageCircle size={20} />
                 </div>
                 <div>
                   <h3 className="text-lg font-black text-gray-900 leading-tight">Need Help?</h3>
                   <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Live Support</p>
                 </div>
               </div>

               <form onSubmit={handleSubmit} className="space-y-4">
                 <input type="text" name="name" value={formData.name} placeholder="Your Name" onChange={handleChange} required className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-medium text-gray-800" />
                 
                 <input type="email" name="email" value={formData.email} placeholder="Email Address" onChange={handleChange} required className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-medium text-gray-800" />
                 
                 <input type="text" name="phone" value={formData.phone} placeholder="Phone Number" onChange={handleChange} required className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-medium text-gray-800" />
                 
                 <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all active:scale-95 flex justify-center items-center gap-2 text-sm uppercase tracking-wide shadow-lg shadow-blue-600/30 mt-2">
                   Send Request <Send size={16} />
                 </button>
               </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {modalState.isOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[99999] flex items-center justify-center bg-zinc-900/40 backdrop-blur-md px-4">
            <motion.div initial={{ scale: 0.9, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.9, y: 20, opacity: 0 }} transition={{ type: "spring", duration: 0.5 }} className="bg-white rounded-3xl p-8 max-w-sm w-full flex flex-col items-center text-center shadow-2xl border border-gray-100">
              <div className="w-48 h-48 mb-5 flex justify-center items-center">
                <PopupAnimation type={modalState.type} />
              </div>
              <h3 className={`text-2xl font-black mb-2 ${modalState.type === "success" ? "text-emerald-600" : "text-red-600"}`}>
                {modalState.type === "success" ? "Success!" : "Oops!"}
              </h3>
              <p className="text-gray-600 font-medium mb-6">{modalState.message}</p>
              <button onClick={() => setModalState({ ...modalState, isOpen: false })} className="w-full bg-gray-900 hover:bg-black text-white font-bold py-3.5 rounded-xl transition-all">Close</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
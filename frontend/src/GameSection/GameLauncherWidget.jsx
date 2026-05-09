import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LottieBase from "lottie-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Sparkles, X } from "lucide-react";
import gaming from "../assets/Joystick.json"; 

const Lottie = LottieBase.default || LottieBase;

export default function GameLauncherWidget() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showTooltip, setShowTooltip] = useState(true);
  
  // Real-time precise tracking
  const [offsetY, setOffsetY] = useState(0);
  const footerRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowTooltip(false), 8000);
    return () => clearTimeout(timer);
  }, []);

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

  if (location.pathname === "/game") return null;

  return (
    <motion.div 
      className="fixed bottom-6 left-6 z-[90000] flex flex-col items-start pointer-events-auto"
      // Buttery smooth dynamic positioning matching the chatbot
      animate={{ y: -offsetY }}
      transition={{ type: "spring", stiffness: 600, damping: 50 }}
    >
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95, filter: "blur(5px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.95, filter: "blur(5px)" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mb-4 bg-[#0f172a]/90 backdrop-blur-xl border border-cyan-500/30 text-white px-5 py-3 rounded-2xl rounded-bl-none shadow-[0_15px_30px_rgba(0,0,0,0.3)] flex items-center gap-3 cursor-pointer relative"
            onClick={() => navigate("/game")}
          >
            <Sparkles size={18} className="text-cyan-400 animate-pulse" />
            <span className="font-bold text-sm tracking-wide text-cyan-50">Play & Win <strong className="text-cyan-400">100% Scholarship!</strong></span>
            <button 
              onClick={(e) => { e.stopPropagation(); setShowTooltip(false); }} 
              className="ml-1 text-slate-400 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  onClick={() => navigate("/game")}
  className="w-20 h-30 flex items-center justify-center relative group"
>
  {/* The Refractive Glass Ripple */}
  {[...Array(2)].map((_, i) => (
    <motion.div
      key={i}
      className="absolute rounded-full border border-red-500 backdrop-blur-[2px]"
      style={{
        width: "60px",
        height: "60px",
      }}
      initial={{ scale: 1, opacity: 0 }}
      animate={{
        scale: [1, 2.8],
        opacity: [0, 0.4, 0],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        delay: i * 2,
        // High-end "Apple-style" easing
        ease: [0.16, 1, 0.3, 1], 
      }}
    />
  ))}

  {/* Secondary Soft Atmospheric Bloom */}
  <motion.div
    className="absolute w-12 h-12 bg-blue-500/10 rounded-full blur-2xl"
    animate={{
      scale: [1, 1.5, 1],
      opacity: [0.3, 0.6, 0.3],
    }}
    transition={{
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />

  {/* Lottie Animation Container */}
  <div className="w-[130%] h-[130%] relative z-10 flex items-center justify-center pointer-events-none">
    <Lottie animationData={gaming} loop={true} />
  </div>
</motion.button>
    </motion.div>
  );
}
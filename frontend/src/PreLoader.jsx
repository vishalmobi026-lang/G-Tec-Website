import React from 'react';
import { motion } from 'framer-motion';

export default function Preloader() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      // Changed bg-white to a deep dark navy (slate-950)
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-transparent backdrop-blur-sm"
    >
      {/* OPTIONAL: Soft background glow behind the logo */}
      <div className="absolute w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full" />

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: [0.8, 1.05, 1], opacity: 1 }}
        transition={{ 
          duration: 1, 
          repeat: Infinity, 
          repeatType: "reverse" 
        }}
        className="relative flex items-center justify-center"
      >
        <img 
          src="/logo1.webp" 
          alt="G-TEC Logo" 
          className="w-28 h-28 object-contain mb-4 relative z-10"
        />
        
        {/* Animated Outer Ring - Made brighter for the dark background */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute w-36 h-36 border-4 border-white/5 border-t-blue-500 rounded-full"
        />
      </motion.div>

      {/* Changed text color to be visible on dark bg */}
      <motion.p 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-10 text-blue-400 font-bold tracking-[0.4em] uppercase text-[10px]"
      >
        Engineering the Future
      </motion.p>
    </motion.div>
  );
}

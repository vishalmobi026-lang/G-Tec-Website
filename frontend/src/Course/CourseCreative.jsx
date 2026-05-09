import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, GraduationCap, Rocket, CheckCircle2 } from 'lucide-react';
import { useLottie } from "lottie-react";
import { Link } from "react-router-dom";

import welcomeAnimation from '../assets/stage.json';

export default function CourseCreative() {
    const { View } = useLottie({ animationData: welcomeAnimation, loop: true });

    const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const leftColumnVariants = {
    hidden: { opacity: 0, x: -100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.15,
      },
    },
  };

  const rightColumnVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <section className="py-60 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Main 3-Column Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
          
          {/* LEFT COLUMN: The "Welcome" Hook */}
          <motion.div 
            variants={leftColumnVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, margin: "-100px" }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-widest">
              <Sparkles size={14} /> Start Your Journey
            </div>
            
            <h2 className="text-4xl font-black text-gray-900 leading-tight">
              Don't Just Learn. <br />
              <span className="text-blue-600">Transform.</span>
            </h2>
            
            <p className="text-gray-500 text-lg leading-relaxed">
              Step into an environment where your curiosity meets industry expertise. 
              G-TEC Nagercoil isn't just a training center—it's a launchpad for your professional life.
            </p>

            <ul className="space-y-4">
              {[
                "Global Certification Standards",
                "Hands-on Project Experience",
                "Expert Mentorship"
              ].map((item, i) => (
                <motion.li
                  variants={itemVariants} key={i} className="flex items-center gap-3 text-gray-700 font-medium">
                  <CheckCircle2 className="text-emerald-500" size={20} />
                  {item}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* CENTER COLUMN: The Animated Lottie File */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative flex justify-center items-center"
          >
            {/* Background Glow */}
            <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-[80px] animate-pulse" />
            
            <div className="relative w-full max-w-[400px]">
  {View}
            </div>
          </motion.div>

          {/* RIGHT COLUMN: The "Call to Action" */}
          <motion.div 
            variants={rightColumnVariants}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: false, margin: "-100px" }}
            className="bg-zinc-900 p-10 rounded-[3rem] text-white space-y-8 relative overflow-hidden"
          >
            {/* Decorative Icon */}
            <Rocket className="absolute -right-4 -top-4 text-white/5 w-32 h-32 rotate-12" />
            
            <motion.div variants={containerVariants} className="relative z-10">
              <h3 className="text-3xl font-black mb-4">Ready to Skill Up?</h3>
              <p className="text-zinc-400 mb-8 leading-relaxed">
                Our admissions are currently open for the 2026 session. 
                Join 5,000+ alumni who have paved their way through G-TEC.
              </p>
              
              <div className="space-y-4">
                <Link to="/enroll" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02]">
                  <GraduationCap size={20} /> Enroll For Free Demo
                </Link>
                <p className="text-center text-xs text-zinc-500">
                  Limited slots available for this month's intake.
                </p>
              </div>
            </motion.div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
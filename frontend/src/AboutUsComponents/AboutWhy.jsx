import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Layout, ShieldCheck, Sparkles } from "lucide-react";

export default function AboutWhy() {
  const text1="Our Vision & Core Values";
  const words1=text1.split(" ");

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { 
        staggerChildren: 0.12,
        delayChildren: 0.04 * i 
      },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)", 
      transition: {
        type: "spring",
        damping: 20,   
        stiffness: 100,
        duration: 0.8   
      },
    },
    hidden: {
      opacity: 0,
      y: 20,            
      filter: "blur(10px)", 
    },
  };
  const whyGtecPoints = [
    {
      title: "Industry-Aligned Curriculum",
      description: "Our courses are constantly updated to match the latest tech trends and employer demands."
    },
    {
      title: "Hands-on Dashboard Training",
      description: "Learn by doing. Build real projects using the exact tools professionals use every day."
    },
    {
      title: "Dedicated Placement Cell",
      description: "We don't just train you; we prepare you for interviews and connect you with top companies."
    }
  ];

  return (
    <section className="w-full bg-white pt-12 pb-48 px-6 md:px-12 lg:px-24 font-sans overflow-hidden mb-0">
      
      <div className="max-w-7xl mx-auto flex flex-col">
        
        {/* ========================================= */}
        {/* TOP TEXT SECTION (Exact line formats)       */}
        {/* ========================================= */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center mb-24" 
        >
          <motion.h3 
           variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
          className="text-4xl md:text-5xl font-clash font-medium text-blue-800 mb-6 tracking-tight">
            {words1.map((word, index) => (
                          <motion.span
                            variants={child}
                            key={index}
                            className="inline-block"
                          >
                            {word}
                          </motion.span>
                        ))}
          </motion.h3>

          {/* 2 Lines of small text */}
          <p className="text-sm md:text-base text-black leading-relaxed mb-6">
            We aim to bridge the skills gap by delivering accessible, high-quality technical education.<br/>
            Our goal is to make every student job-ready from day one.
          </p>

          {/* 3 Lines of small text */}
          <p className="text-sm md:text-base text-black leading-relaxed mb-6">
            Education should not be confined to theory. We emphasize a practical approach where<br/>
            students interact with live scenarios, complete rigorous assignments, and develop a<br/>
            portfolio that speaks volumes about their actual capabilities and skills.
          </p>

          {/* 3 Lines of small text */}
          <p className="text-sm md:text-base text-black leading-relaxed">
            By fostering a community of passionate learners and expert mentors, G-TEC Nagercoil<br/>
            continues to set the benchmark for professional training in IT, software development,<br/>
            and creative design technologies across the region.
          </p>
        </motion.div>


        {/* ========================================= */}
        {/* BOTTOM TWO-COLUMN SECTION                   */}
        {/* ========================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.8 }}
            className="relative w-full aspect-square md:aspect-4/3 lg:aspect-square"
          >
            <div className="absolute top-10 -left-10 w-full h-full bg-blue-50 rounded-[3rem] -z-10"></div>
            
            <div className="w-full h-full bg-white rounded-3xl shadow-2xl border border-gray-100 p-2 md:p-4 overflow-hidden relative">
              
              <div className="w-full h-8 flex items-center gap-2 px-4 mb-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>

              <div className="w-full h-[calc(100%-2.5rem)] rounded-2xl overflow-hidden border border-gray-100 bg-gray-50">
                <img 
                  src="/students.jpg" // Replace with an actual dashboard or software UI image!
                  alt="Student Dashboard" 
                  className="w-full h-full object-cover"
                />
              </div>

              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -right-6 top-20 bg-white p-4 rounded-2xl shadow-xl border border-gray-50 flex items-center gap-4"
              >
                <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold">Certified</p>
                  <p className="text-sm font-bold text-gray-900">100% Verified</p>
                </div>
              </motion.div>

              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -left-6 bottom-20 bg-white p-4 rounded-2xl shadow-xl border border-gray-50 flex items-center gap-4"
              >
                <div className="w-10 h-10 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center">
                  <Layout size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold">Live Projects</p>
                  <p className="text-sm font-bold text-gray-900">50+ Included</p>
                </div>
              </motion.div>

            </div>
          </motion.div>


          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.8 }}
            className="flex flex-col gap-8"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gray-200 bg-gray-50 mb-6">
                <Sparkles size={14} className="text-blue-700" />
                <span className="text-xs font-bold tracking-widest uppercase text-gray-800">
                  Why Choose Us
                </span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-clash text-gray-900 tracking-tight leading-[1.1] mb-6">
                A different kind of <br className="hidden md:block"/>
                <span className="text-blue-800">learning experience.</span>
              </h2>
              
              <p className="text-gray-500 text-base leading-relaxed">
                We believe that true mastery comes from immersion. Our unique approach ensures that you aren't just memorizing concepts, but actively building, designing, and creating from your very first day.
              </p>
            </div>

            <div className="flex flex-col gap-6 mt-4">
              {whyGtecPoints.map((point, index) => (
                <div key={index} className="flex gap-4">
                  <div className="mt-1">
                    <CheckCircle2 className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-1">{point.title}</h4>
                    <p className="text-sm text-gray-500 leading-relaxed">{point.description}</p>
                  </div>
                </div>
              ))}
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
}
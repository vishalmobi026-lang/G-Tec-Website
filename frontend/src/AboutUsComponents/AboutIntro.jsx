import React from "react";
import { motion } from "framer-motion";

export default function AboutIntro(){
  const text1="The story behind";
  const words1=text1.split(" ");

  const text2="Our";
  const words2=text2.split(" ");

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

    return(
        <section className=" w-full bg-white pt-40 pb-30 px-6 md:px-12 lg:px-24 font-sans mb-0 bg-linear-to-b from-white via-blue-200 to-white">
      
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gray-200 bg-gray-50 mb-8 shadow-sm"
        >
          <div className="w-2 h-2 rounded-full bg-blue-600"></div>
          <span className="text-xs font-bold tracking-widest uppercase text-gray-800">
            About Us
          </span>
        </motion.div>

        <motion.h2
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            className="text-4xl md:text-6xl pt-10 lg:text-7xl font-clash text-gray-900 tracking-tighter leading-none mb-2 text-center uppercase flex justify-center flex-wrap gap-x-4"
          >
            {words1.map((word, index) => (
              <motion.span
                variants={child}
                key={index}
                className="inline-block"
              >
                {word}
              </motion.span>
            ))}
          </motion.h2>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
          className="flex flex-wrap items-center justify-center gap-3 md:gap-6 mb-8"
        >
          
          <motion.h2
          variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            className="text-4xl md:text-6xl lg:text-7xl font-clash text-blue-700 tracking-tighter leading-none uppercase">
            {words2.map((word, index) => (
              <motion.span
                variants={child}
                key={index}
                className="inline-block"
              >
                {word}
              </motion.span>
            ))}
          </motion.h2><div className="w-24 md:w-40 lg:w-56 h-12 md:h-20 lg:h-24 rounded-full overflow-hidden shadow-lg shrink-0 border-4 border-white mt-1 md:mt-2">
            <img 
              src="/std.jpg" 
              alt="Passion" 
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-clash text-blue-700 tracking-tighter leading-none uppercase">
            Passion
          </h2>
        </motion.div>

        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-base md:text-lg text-gray-500 text-center max-w-2xl leading-relaxed mb-16 font-medium"
        >
          At G-TEC Nagercoil, we believe education is more than just teaching a syllabus. It's about solving real-world problems, creating seamless learning experiences, and bringing career ambitions to life.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 40 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="w-full h-100 md:h-150 lg:h-175 rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden shadow-2xl relative shadow-blue-500"
        >
          <img 
            src="/grp.jpg" 
            alt="G-TEC Campus Overview" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent"></div>
        </motion.div>

      </div>
    </section>
    )
}
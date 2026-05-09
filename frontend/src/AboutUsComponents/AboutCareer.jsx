import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Lottie from "lottie-react";
import remoteJobAnimation from "../assets/GirlinLaptop.json"; 

export default function CareersSection() {
  const positions = [
    {
      department: "Academics",
      title: "Full-Stack Development Instructor",
      location: "On-site",
      link: "#"
    },
    {
      department: "Academics",
      title: "Senior Tally & ERP Trainer",
      location: "On-site",
      link: "#"
    },
    {
      department: "Administration",
      title: "Student Career Counselor",
      location: "Hybrid",
      link: "#"
    }
  ];

  const LottieComponent = Lottie.default || Lottie;

  return (
    <section className="w-full bg-white pb-50 px-6 md:px-12 lg:px-24 font-sans">
      
      <div className="max-w-7xl mx-auto">
        
        <div className="flex justify-start mb-16 lg:mb-20">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6 }}
            className="w-full lg:w-7/12 flex items-center gap-4"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-clash tracking-tight text-gray-900 leading-none">
              Our Openings
            </h2>
            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-900 font-semibold text-sm border border-gray-200">
              {positions.length}
            </span>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 flex justify-center lg:justify-start"
          >
            <div className="w-full h-10 max-w-17.5 lg:max-w-none">
              <LottieComponent 
                animationData={remoteJobAnimation} 
                loop={true} 
                autoplay={true}
              />
            </div>
          </motion.div>

          <div className="lg:col-span-7 flex flex-col border-t border-gray-200">
            {positions.map((job, index) => (
              <motion.a
                key={index}
                href={job.link}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group flex flex-col md:flex-row md:items-center justify-between py-10 border-b border-gray-200 hover:bg-gray-50 transition-all px-4 -mx-4 rounded-xl cursor-pointer"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-12 w-full">
                  <span className="text-gray-400 font-medium text-xs uppercase tracking-widest w-28 shrink-0">
                    {job.department}
                  </span>
                  
                  <h3 className="text-xl md:text-2xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors leading-tight">
                    {job.title}
                  </h3>
                </div>

                <div className="flex items-center gap-6 mt-6 md:mt-0 shrink-0">
                  <span className="px-4 py-1.5 rounded-full border border-gray-200 text-xs font-medium text-gray-600 bg-white shadow-sm">
                    {job.location}
                  </span>
                  <ArrowUpRight 
                    className="text-gray-300 group-hover:text-blue-600 group-hover:-translate-y-1 group-hover:translate-x-1 transition-all duration-300" 
                    size={24} 
                  />
                </div>
              </motion.a>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
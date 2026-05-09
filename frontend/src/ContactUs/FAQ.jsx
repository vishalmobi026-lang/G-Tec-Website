import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import LottieBase from "lottie-react";
import { useLottie } from "lottie-react";
import gaming from "../assets/Loadercat.json";

const Lottie = LottieBase.default || LottieBase;

const faqData = [
  {
    question: "What is G-TEC Education?",
    answer: "G-TEC Education is a premier IT and professional skills training institute. We offer a wide range of industry-aligned courses in IT, Accounting, Designing, and Civil Architecture to help students build successful careers."
  },
  {
    question: "Who can enroll in G-TEC courses?",
    answer: "Our courses are designed for everyone! Whether you are a school student, a college graduate, or a working professional looking to upskill, we have specific programs tailored to your educational background and career goals."
  },
  {
    question: "Do you provide practical training and certifications?",
    answer: "Yes! All our courses focus heavily on practical, hands-on training. Upon successful completion of your course, you will receive a globally recognized G-TEC certification to boost your resume."
  },
  {
    question: "Does G-TEC provide placement assistance?",
    answer: "Absolutely. We offer dedicated placement support to our successful candidates. We help connect our students with top companies, provide interview preparation, and offer career guidance."
  },
  {
    question: "How do I enroll in a specific course?",
    answer: "Enrolling is easy! Just browse our course categories, select the specific program you are interested in, and click 'Enroll Now'. You will be redirected to a quick registration form to fill in your details."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-white pt-20 pb-40 px-6 font-sans relative z-10 overflow-hidden">
      {/* Changed to max-w-7xl to accommodate the split layout */}
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section (Centered above the grid) */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-medium font-clash text-gray-900 mb-4 tracking-tight">
            Frequently asked questions
          </h2>
          <p className="text-lg text-gray-500 font-medium">
            Find quick answers to common questions about G-TEC.
          </p>
        </motion.div>

        {/* 2-Column Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* LEFT COLUMN: Accordion List */}
          <div className="w-full space-y-4">
            {faqData.map((item, index) => {
              const isOpen = openIndex === index;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="w-full bg-white rounded-full overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100"
                  style={{
                    borderRadius: isOpen ? "24px" : "9999px" 
                  }}
                >
                  {/* Clickable Question Header */}
                  <button
                    onClick={() => toggleAccordion(index)}
                    className="w-full flex items-center justify-between px-8 py-5 text-left focus:outline-none"
                  >
                    <span className="text-base font-medium text-gray-900 pr-4">
                      {item.question}
                    </span>
                    
                    {/* Icon Animation */}
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-blue-500 flex-shrink-0 ml-4 bg-blue-50 p-1.5 rounded-full"
                    >
                      {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                    </motion.div>
                  </button>

                  {/* Expandable Answer Content */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ 
                          height: { duration: 0.3, ease: "easeInOut" }, 
                          opacity: { duration: 0.2, delay: 0.1 } 
                        }}
                      >
                        <div className="px-8 pb-6 pt-2 text-gray-600 leading-relaxed text-sm md:text-base border-t border-gray-50 mx-4 mt-2">
                          {item.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

          {/* RIGHT COLUMN: Floating Lottie Animation */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, x: 30 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="hidden lg:flex flex-col items-center justify-center relative"
          >
            {/* Subtle soft blue glow behind the animation to make it look premium */}
            <div className="absolute inset-0 bg-blue-500/5 blur-[100px] rounded-full pointer-events-none"></div>
            
            <div className="relative w-full max-w-[450px]">
              <Lottie animationData={gaming} loop={true} />
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
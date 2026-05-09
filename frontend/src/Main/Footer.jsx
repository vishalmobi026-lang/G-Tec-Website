import React from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail } from "lucide-react"; 
import { Link } from "react-router-dom";

export default function FooterSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15, 
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 80, damping: 15 },
    },
  };

  const iconContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.4, 
      },
    },
  };

  const iconVariants = {
    hidden: { opacity: 0, scale: 0, rotate: -45 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: { type: "spring", stiffness: 200, damping: 12 },
    },
  };

  const listContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.5,
      },
    },
  };

  const listItemVariants = {
    hidden: { opacity: 0, x: -15 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 120, damping: 12 },
    },
  };

  return (
    <footer className="relative z-50 w-full bg-[#0a0a0a] text-white pt-12 md:pt-20 pb-8 md:pb-12 px-4 md:px-12 lg:px-24 font-sans overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 pb-10 md:pb-16 text-left"
        >
          
          <motion.div variants={cardVariants} className="bg-[#111111] hover:bg-[#151515] border border-zinc-800/80 rounded-[1.5rem] p-5 md:p-7 flex flex-col h-full transition-colors duration-300 shadow-xl">
            <h3 className="text-2xl md:text-3xl font-black tracking-tighter mb-3 md:mb-4">
              G-TEC<span className="text-blue-600">.</span>
            </h3>
            <p className="text-zinc-400 text-[11px] md:text-sm leading-relaxed mb-6 md:mb-8 flex-1">
              Empowering students with industry-standard skills in IT, Accounting, and CAD.
            </p>
            
            <motion.div 
              variants={iconContainerVariants}
              className="flex flex-wrap gap-2 md:gap-3"
            >
              {[
                { name: 'instagram', color: 'white' },
                { name: 'x', color: 'white' },
                { name: 'facebook', color: 'white' }
              ].map((social) => (
                <motion.a 
                  key={social.name} 
                  variants={iconVariants}
                  href="#" 
                  className="p-2 md:p-2.5 bg-zinc-900 rounded-full hover:bg-blue-600 hover:border-blue-600 transition-colors border border-zinc-800"
                >
                  <img 
                    src={`https://cdn.simpleicons.org/${social.name}/${social.color}`} 
                    alt={social.name} 
                    className="w-3.5 h-3.5 md:w-4 md:h-4" 
                  />
                </motion.a>
              ))}

              <motion.a 
                variants={iconVariants}
                href="#" 
                className="p-2 md:p-2.5 bg-zinc-900 rounded-full hover:bg-blue-600 hover:border-blue-600 transition-colors border border-zinc-800 flex items-center justify-center"
              >
                <svg className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </motion.a>
            </motion.div>
          </motion.div>

          <motion.div variants={cardVariants} className="bg-[#111111] hover:bg-[#151515] border border-zinc-800/80 rounded-[1.5rem] p-5 md:p-7 flex flex-col h-full transition-colors duration-300 shadow-xl">
            <h4 className="text-sm md:text-lg font-bold mb-4 md:mb-6 text-white border-b border-zinc-800 pb-2">Navigation</h4>
            <motion.ul 
              variants={listContainerVariants}
              className="space-y-3 text-xs md:text-sm text-zinc-400 flex-1"
            >
              <motion.li variants={listItemVariants}><Link to="/" className="hover:text-blue-500 transition-colors inline-block">Home</Link></motion.li>
              <motion.li variants={listItemVariants}><Link to="/courses" className="hover:text-blue-500 transition-colors inline-block">All Courses</Link></motion.li>
              <motion.li variants={listItemVariants}><Link to="/about" className="hover:text-blue-500 transition-colors inline-block">About Us</Link></motion.li>
              <motion.li variants={listItemVariants}><Link to="/contact" className="hover:text-blue-500 transition-colors inline-block">Contact Us</Link></motion.li>
              <motion.li variants={listItemVariants}><Link to="/enroll" className="hover:text-blue-500 transition-colors font-semibold text-blue-400 inline-block">Enroll Now</Link></motion.li>
            </motion.ul>
          </motion.div>

          <motion.div variants={cardVariants} className="bg-[#111111] hover:bg-[#151515] border border-zinc-800/80 rounded-[1.5rem] p-5 md:p-7 flex flex-col h-full transition-colors duration-300 shadow-xl">
            <h4 className="text-sm md:text-lg font-bold mb-4 md:mb-6 text-white border-b border-zinc-800 pb-2">Contact Info</h4>
            <motion.ul 
              variants={listContainerVariants}
              className="space-y-5 md:space-y-6 flex-1"
            >
              <motion.li variants={listItemVariants} className="flex items-start gap-3">
                <div className="p-2 bg-blue-900/20 rounded-lg shrink-0">
                  <Phone size={16} className="text-blue-500" />
                </div>
                <div className="text-[11px] md:text-sm text-zinc-400">
                  <p className="font-semibold text-zinc-200 mb-0.5">Phones</p>
                  <p>+91 94861 88648</p>
                  <p>+91 72002 86091</p>
                </div>
              </motion.li>
              <motion.li variants={listItemVariants} className="flex items-start gap-3">
                <div className="p-2 bg-blue-900/20 rounded-lg shrink-0">
                  <Mail size={16} className="text-blue-500" />
                </div>
                <div className="text-[11px] md:text-sm text-zinc-400 overflow-hidden">
                  <p className="font-semibold text-zinc-200 mb-0.5">Email</p>
                  <p className="truncate">infozenxit@gmail.com</p>
                </div>
              </motion.li>
            </motion.ul>
          </motion.div>

          <motion.div variants={cardVariants} className="bg-[#111111] hover:bg-[#151515] border border-zinc-800/80 rounded-[1.5rem] p-5 md:p-7 flex flex-col h-full transition-colors duration-300 shadow-xl">
            <h4 className="text-sm md:text-lg font-bold mb-4 md:mb-6 text-white border-b border-zinc-800 pb-2">Campus</h4>
            <motion.div 
              variants={listContainerVariants}
              className="flex-1"
            >
              <motion.div variants={listItemVariants} className="flex items-start gap-3">
                <div className="p-2 bg-blue-900/20 rounded-lg shrink-0">
                  <MapPin size={16} className="text-blue-500" />
                </div>
                <p className="text-[11px] md:text-sm text-zinc-400 leading-relaxed">
                  Upstair, Tower Jn, Sivaraj Building 2nd Floor, <br className="hidden md:block" />
                  Rose Centre, Nagercoil, <br className="hidden md:block" />
                  Tamil Nadu 629001
                </p>
              </motion.div>
            </motion.div>
          </motion.div>

        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center pt-6 md:pt-8 border-t border-zinc-900 text-zinc-600 text-[10px] md:text-xs gap-4 text-left"
        >
          <p>© 2026 G-TEC Education, Nagercoil. All rights reserved.</p>
          <div className="flex flex-wrap gap-4 md:gap-6">
            <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
            <span>Designed with ❤️ for Students</span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
import React from "react";
import { motion } from "framer-motion";

export default function StaffSection() {
   
  const staff = [
    {
      name: "Arun Kumar",
      role: "Managing Director",
      image:
        "https://images.unsplash.com/photo-1592734859005-887ba63b4e52?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDV8fGNoZW5uYWklMjBpdCUyMHdvcmtlcnxlbnwwfHwwfHx8MA%3D%3D",
      socials: { instagram: "#", x: "#", facebook: "#", linkedin: "#" },
    },
    {
      name: "Sara Johnson",
      role: "Academic Head",
      image:
        "https://images.unsplash.com/photo-1518518873111-6ca469aa4560?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGluZGlhbiUyMHBlcnNvbnxlbnwwfHwwfHx8MA%3D%3D",
      socials: { instagram: "#", x: "#", facebook: "#", linkedin: "#" },
    },
    {
      name: "Rajesh Sekar",
      role: "Lead Full-Stack Instructor",
      image:
        "https://images.unsplash.com/photo-1730458001024-df18936795d2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nzd8fGluZGlhbiUyMGl0JTIwd29ya2VyfGVufDB8fDB8fHww",
      socials: { instagram: "#", x: "#", facebook: "#", linkedin: "#" },
    },
    {
      name: "Priya Lakshmi",
      role: "Senior UI/UX Mentor",
      image:
        "https://images.unsplash.com/photo-1728141123512-87c415cecc9d?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      socials: { instagram: "#", x: "#", facebook: "#", linkedin: "#" },
    },
  ];

   const text1="Meet Our Expert Team";
    const words1=text1.split(" ");

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.04 * i,
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
        duration: 0.8,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      filter: "blur(10px)",
    },
  };

  return (
    <section className="w-full bg-white py-24 px-6 md:px-12 lg:px-24 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-center mb-16 lg:mb-20">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            className="flex flex-col gap-2 items-center text-center mas-w-3xl">
            <motion.h2
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            className="text-3xl md:text-5xl pt-10 py-20 lg:text-6xl font-clash text-blue-800 tracking-tighter leading-none mb-2 text-center font-medium flex justify-center flex-wrap gap-x-4"
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
            <p className="text-gray-500 font-medium text-lg md:text-2xl w-200 leading-relaxed">
              A dedicated collective of industry veterans and passionate mentors
              committed to bridging the gap between classroom learning and your
              future career success.
            </p>
          </motion.div>
        </div>

        {/* STAFF GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {staff.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group flex flex-col shadow-black shadow-2xl p-2 rounded-3xl">
              {/* Image with subtle hover zoom */}
              <div className="relative overflow-hidden rounded-3xl bg-gray-100 aspect-square mb-6">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Text Details */}
              <div className="space-y-1 mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  {member.name}
                </h3>
                <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider">
                  {member.role}
                </p>
              </div>

              {/* SOCIAL LINKS: Your requested format */}
              <div className="flex gap-4">
                {[
                  { name: "instagram", color: "white" },
                  { name: "x", color: "white" },
                  { name: "facebook", color: "white" },
                ].map((social) => (
                  <a
                    key={social.name}
                    href="#"
                    className="p-2.5 bg-zinc-900 rounded-full hover:bg-zinc-800 transition-all border border-zinc-800 flex items-center justify-center">
                    <img
                      src={`https://cdn.simpleicons.org/${social.name}/${social.color}`}
                      alt={social.name}
                      className="w-4.5 h-4.5"
                    />
                  </a>
                ))}

                {/* LinkedIn SVG format */}
                <a
                  href="#"
                  className="p-2.5 bg-zinc-900 rounded-full hover:bg-zinc-800 transition-all border border-zinc-800 flex items-center justify-center">
                  <svg
                    className="w-4.5 h-4.5 text-white"
                    viewBox="0 0 24 24"
                    fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
            </motion.div>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="my-24 w-full shadow-2xl shadow-blue-500 bg-blue-50 border border-blue-100/50 rounded-[2.5rem] p-8 md:p-16 lg:p-20 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-10">
          {/* Subtle background glow effect */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-white/40 blur-[80px] pointer-events-none" />

          <div className="relative z-10 max-w-2xl">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-clash font-medium text-gray-900 leading-tight">
              Ready to kickstart your{" "}
              <span className="text-blue-600">career?</span>
            </h2>
            <p className="text-gray-600 text-lg md:text-xl mt-6 leading-relaxed">
              Learn directly from industry experts. Gain practical experience,
              master in-demand skills, and build a portfolio that stands out
              with G-TEC Nagercoil.
            </p>
          </div>

          <div className="relative z-10 shrink-0">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-5 bg-blue-600 text-white font-bold rounded-full text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20">
              Explore Programs
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

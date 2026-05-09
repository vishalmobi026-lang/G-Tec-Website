import React from "react";
import { motion } from "framer-motion";
import {
  MousePointer2,
  Type,
  Image as ImageIcon,
  LayoutTemplate,
  PenTool,
  Shapes,
  Settings,
  LayoutDashboard,
  FileText,
  Sprout,
  ChevronRight,
  CheckCircle,
  Calendar,
  DollarSign,
  Download,
  Paperclip,
  History,
} from "lucide-react";
import {Link} from 'react-router-dom';

const specializedCourses = [
  {
    title: "SAP ERP",
    icon: Settings,
    description:
      "Master enterprise Financial Accounting (FI) and Controlling (CO) modules.",
  },
  {
    title: "Tally Prime",
    icon: LayoutDashboard,
    description:
      "Learn complete business accounting, inventory control, and statutory compliance (GST).",
  },
  {
    title: "Sage 50 Accounting",
    icon: FileText,
    description:
      "Gain hands-on bookkeeping, invoicing, and financial reporting skills for small businesses.",
  },
];

const SpecialAccounting = () => {
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

  const path='/courses/accounting';

  return (
    <>
      <section className="w-full py-10 md:py-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.1fr,0.9fr] gap-12 lg:gap-20 items-center">
          {/* ================= LEFT COLUMN: TEXT CONTENT ================= */}
          <motion.div
            variants={leftColumnVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, margin: "-100px" }}
            className="flex flex-col items-start gap-8 order-2 md:order-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col gap-4 items-start">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white flex items-center justify-center shadow-sm text-gray-800">
                <Sprout size={28} strokeWidth={1.5} />
              </div>

              <h2 className="text-4xl md:text-5xl lg:text-[3.5rem] font-semibold font-clash text-gray-950 tracking-tight leading-tight font-">
                Special Area
              </h2>
              <p className="text-gray-800 text-lg md:text-xl font-medium max-w-lg">
                Expertise in specialized Accounting, Tally, SAP, and Sage 50
                courses.
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              className="w-full flex flex-col gap-6 md:gap-8 mt-2">
              {specializedCourses.map((course, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="flex items-start gap-4 md:gap-5">
                  <div className="text-blue-600 mt-1 shrink-0">
                    <course.icon size={32} strokeWidth={2} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-xl md:text-2xl font-bold text-gray-950">
                      {course.title}
                    </h3>
                    <p className="text-gray-800 text-base leading-relaxed max-w-md">
                      {course.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="relative mt-2 flex items-center pl-6 md:pl-8 pr-16 md:pr-20 py-3 md:py-4 bg-black text-white rounded-full font-bold text-base md:text-lg group overflow-hidden shadow-xl shadow-gray-200">
              {/* Text stays above the expanding background and changes to black on hover */}
              <Link to={path} className="relative z-10 transition-colors duration-300 group-hover:text-black">
                Explore Courses
              </Link>

              {/* The expanding white circle background container */}
              <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-white rounded-full transition-all duration-300 group-hover:w-[calc(100%-0.75rem)] group-active:scale-95 z-0">
                <ChevronRight
                  size={20}
                  className="text-black transition-transform duration-300 group-hover:-translate-x-25"
                />
              </div>
            </motion.button>
          </motion.div>

          {/* ================= RIGHT COLUMN: DASHBOARD UI MOCKUP ================= */}
          <motion.div
  variants={rightColumnVariants}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: false, margin: "-100px" }}
  className="relative w-full order-1 lg:order-2 mb-10 lg:mb-0"
>
  {/* NEW: Outer Card Wrapper (The Frame) */}
  <div className="w-full bg-gray-100 p-4 md:px-16 md:py-15 rounded-[2.5rem]">
    
    {/* Main Dashboard Container (The Screen) */}
    <div className="w-full aspect-4/3 lg:aspect-16/17 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex">
      
      {/* 1. Sidebar (Tools) */}
      <div className="w-16 bg-gray-50 border-r border-gray-100 flex flex-col items-center py-6 gap-6 shrink-0 z-10">
        <div className="p-2.5 bg-white rounded-xl shadow-sm text-blue-600">
          <MousePointer2 size={20} className="fill-blue-600" />
        </div>
        <div className="p-2.5 text-gray-400 hover:text-blue-600 transition-colors cursor-pointer">
          <LayoutTemplate size={20} />
        </div>
        <div className="p-2.5 text-gray-400 hover:text-blue-600 transition-colors cursor-pointer">
          <Type size={20} />
        </div>
        <div className="p-2.5 text-gray-400 hover:text-blue-600 transition-colors cursor-pointer">
          <PenTool size={20} />
        </div>
        <div className="p-2.5 text-gray-400 hover:text-blue-600 transition-colors cursor-pointer">
          <Shapes size={20} />
        </div>
        <div className="p-2.5 text-gray-400 hover:text-blue-600 transition-colors cursor-pointer">
          <ImageIcon size={20} />
        </div>
        <div className="mt-auto p-2.5 text-gray-400 hover:text-blue-600 transition-colors cursor-pointer">
          <Settings size={20} />
        </div>
      </div>

      {/* 2. Main Area Wrapper (Contains Top Header + Workspace) */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        
        {/* Top Navigation Bar */}
        <div className="h-16 border-b border-gray-100 bg-white flex items-center justify-between px-6 shrink-0 z-20">
          <span className="text-sm font-bold text-gray-800">
            Agency / Portfolio
          </span>

          {/* User Avatars & Share */}
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <img
                src="https://i.pravatar.cc/100?img=1"
                alt="User 1"
                className="w-8 h-8 rounded-full border-2 border-white bg-blue-100 z-10 shadow-sm"
              />
              <img
                src="https://i.pravatar.cc/100?img=2"
                alt="User 2"
                className="w-8 h-8 rounded-full border-2 border-white bg-green-100 -ml-2 z-20 shadow-sm"
              />
              <img
                src="https://i.pravatar.cc/100?img=3"
                alt="User 3"
                className="w-8 h-8 rounded-full border-2 border-white bg-pink-100 -ml-2 z-30 shadow-sm"
              />
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-colors shadow-sm hidden md:block">
              Share
            </button>
          </div>
        </div>

        {/* Workspace Split (Canvas on left, Properties on right) */}
        <div className="flex-1 flex relative overflow-hidden">
          
          {/* Canvas Area with Image and Animated Mouse */}
          <div className="flex-1 relative flex items-center justify-center p-8 bg-gray-50/50">
            {/* Active Selection Box around the image */}
            <div className="relative inline-block px-5 bg-white rounded-lg shadow-sm group">
              <img
                src="acf.jpg"
                alt="Workspace object"
                className="w-48 h-40 lg:w-64 lg:h-40 object-contain drop-shadow-xl"
              />
            </div>

            {/* Auto-Moving Cursor */}
            <motion.div
              className="absolute pointer-events-none flex flex-col items-start z-50"
              animate={{
                x: [0, 100, -30, 0],
                y: [0, -60, 30, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{ top: "45%", left: "40%" }}
            >
              <MousePointer2 className="w-6 h-6 text-indigo-500 fill-indigo-500 -rotate-12" />
              <div className="bg-indigo-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md ml-4 mt-0">
                David
              </div>
            </motion.div>
          </div>

          {/* Right Sidebar (Properties Panel) */}
          <div className="w-48 lg:w-56 bg-white border-l border-gray-100 flex flex-col shrink-0 z-10 text-[12px] text-gray-600 overflow-y-auto custom-scrollbar">
            
            {/* Document Details Section */}
            <div className="p-4 border-b border-gray-100">
              <h4 className="font-semibold text-gray-800 mb-3 text-[13px] flex items-center gap-2">
                <FileText size={14} className="text-blue-600" />
                Document Info
              </h4>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between bg-gray-50 px-2 py-1.5 rounded-md border border-gray-100">
                  <span className="text-gray-500 font-medium">Doc No.</span>
                  <span className="font-mono font-medium text-gray-800 text-[11px]">
                    INV-2026-89
                  </span>
                </div>
                <div className="flex items-center justify-between bg-gray-50 px-2 py-1.5 rounded-md border border-gray-100">
                  <span className="text-gray-500 font-medium">Status</span>
                  <span className="font-medium text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wide flex items-center gap-1">
                    <CheckCircle size={10} /> Posted
                  </span>
                </div>
                <div className="flex items-center justify-between bg-gray-50 px-2 py-1.5 rounded-md border border-gray-100">
                  <span className="text-gray-500 font-medium flex items-center gap-1">
                    <Calendar size={12} /> Date
                  </span>
                  <span className="font-medium text-gray-800">16 Apr, 2026</span>
                </div>
                <div className="flex items-center justify-between bg-gray-50 px-2 py-1.5 rounded-md border border-gray-100">
                  <span className="text-gray-500 font-medium">Currency</span>
                  <span className="font-medium text-gray-800">USD ($)</span>
                </div>
              </div>
            </div>

            {/* Financial Summary Section */}
            <div className="p-4 border-b border-gray-100">
              <h4 className="font-semibold text-gray-800 mb-3 text-[13px] flex items-center gap-2">
                <DollarSign size={14} className="text-emerald-600" />
                Financials
              </h4>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between px-1">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium text-gray-800">$12,450.00</span>
                </div>
                <div className="flex items-center justify-between px-1">
                  <span className="text-gray-500">Tax (VAT 5%)</span>
                  <span className="font-medium text-gray-800">$622.50</span>
                </div>
                <div className="flex items-center justify-between px-1">
                  <span className="text-gray-500">Discount</span>
                  <span className="font-medium text-red-500">-$150.00</span>
                </div>
                <div className="h-px w-full bg-gray-200 my-1"></div>
                <div className="flex items-center justify-between px-1">
                  <span className="font-semibold text-gray-800">Net Payable</span>
                  <span className="font-bold text-gray-900 text-[13px]">$12,922.50</span>
                </div>
              </div>
            </div>

            {/* Actions & Workflow Section */}
            <div className="p-4">
              <h4 className="font-semibold text-gray-800 mb-3 text-[13px]">
                Quick Actions
              </h4>
              <div className="flex flex-col gap-2">
                <button className="flex items-center justify-between w-full bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded-md border border-gray-100 transition-colors text-left group">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Download size={14} className="text-gray-400 group-hover:text-blue-600" />
                    <span className="font-medium">Export PDF</span>
                  </div>
                </button>

                <button className="flex items-center justify-between w-full bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded-md border border-gray-100 transition-colors text-left group">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Paperclip size={14} className="text-gray-400 group-hover:text-blue-600" />
                    <span className="font-medium">Attachments (2)</span>
                  </div>
                  <ChevronRight size={14} className="text-gray-400" />
                </button>

                <button className="flex items-center justify-between w-full bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded-md border border-gray-100 transition-colors text-left group">
                  <div className="flex items-center gap-2 text-gray-700">
                    <History size={14} className="text-gray-400 group-hover:text-blue-600" />
                    <span className="font-medium">Audit Trail</span>
                  </div>
                  <ChevronRight size={14} className="text-gray-400" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</motion.div>
        </div>
      </section>
    </>
  );
};

export default SpecialAccounting;

import React, { useState } from "react";
import { LayoutGrid, FolderPlus, Tag, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CourseManagement from "./CourseManagement";
import AdminOffers from "./AdminOffers";
import AdminCategoryManager from "./CourseCatagoryManager";

export default function WebUpdater() {
  const [activeTab, setActiveTab] = useState("courses");

  const tabs = [
    { id: "courses", label: "Manage Courses", icon: LayoutGrid },
    { id: "categories", label: "Course Categories", icon: FolderPlus },
    { id: "offers", label: "Special Offers", icon: Tag },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 md:p-10 py-50 md:py-50 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* PAGE HEADER */}
        <div>
          <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3 mb-2">
            <Settings className="text-blue-600" size={32} /> Web Updater
          </h1>
          <p className="text-gray-500 font-medium">
            Centrally manage your website's courses, categories, and offers.
          </p>
        </div>

        {/* TAB NAVIGATION */}
        <div className="flex flex-col sm:flex-row gap-2 bg-white p-2 rounded-2xl border border-gray-200 shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-bold text-sm transition-all duration-300 ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20 scale-[1.02]"
                  : "bg-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <tab.icon size={18} /> {tab.label}
            </button>
          ))}
        </div>

        {/* TAB CONTENT AREA */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden min-h-[600px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="p-6 md:p-8 w-full"
            >
              {activeTab === "courses" && <CourseManagement />}
              {activeTab === "categories" && <AdminCategoryManager />}
              {activeTab === "offers" && <AdminOffers />}
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
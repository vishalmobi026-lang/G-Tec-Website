import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Clock,
  X,
  CheckCircle2,
  Calendar,
  BookOpen,
  Award,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Civil() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedCourse, setSelectedCourse] = useState(null);

  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/courses")
      .then((res) => res.json())
      .then((data) => {
        // Filter so this page only shows Accounting courses
        const civilCourses = data.filter((c) => c.category === "civil");
        setCourses(civilCourses);
      });
  }, []);

  useEffect(() => {
    if (courses.length > 0 && location.state?.autoOpenCourse) {
      const courseToOpen = courses.find(
        (c) => c.title === location.state.autoOpenCourse
      );
      if (courseToOpen) {
        setSelectedCourse(courseToOpen);
        
        // Optional: Clean up the state so it doesn't re-open if they refresh the page
        window.history.replaceState({}, document.title);
      }
    }
  }, [courses, location.state]);

  const smoothTransition = {
    type: "tween",
    ease: [0.43, 0.13, 0.23, 0.96],
    duration: 0.7,
  };
  return (
    <div className="w-full bg-[#f8f9fa] min-h-screen pt-40 pb-70 px-6 md:px-12 lg:px-24 font-sans text-zinc-900">
      <div className="max-w-350 mx-auto">
        {/* HEADER */}
        <div className="flex flex-col mb-16 lg:mb-24 border-b border-zinc-200 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}>
            <p className="text-blue-600 font-bold text-sm tracking-[0.2em] uppercase mb-6">
              Department of Civil, Computer Science, Design & Electrical
            </p>
            <h1 className="text-3xl md:text-4xl lg:text-[4rem] font-clash font-bold tracking-tighter leading-none uppercase">
              CAD / 3D / 2D{" "}
              <span className="text-zinc-400 font-light text-xl md:text-3xl lg:text-5xl align-top ml-2 lg:ml-4">
                ({courses.length.toString().padStart(2, "0")})
              </span>
            </h1>
          </motion.div>
        </div>

        {/* LOOKBOOK GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10">
          {courses.map((course, index) => (
            <motion.div
              layoutId={`card-${course._id}`}
              transition={smoothTransition}
              key={course._id}
              onClick={() => setSelectedCourse(course)}
              className="group relative overflow-hidden rounded-[2.5rem] aspect-4/5 bg-zinc-900 cursor-pointer shadow-lg">
              {/* The Course Image */}
              <motion.img
                layoutId={`image-${course._id}`}
                transition={smoothTransition}
                src={course.image}
                className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:scale-105 transition-all duration-1000"
              />

              {/* GLASSY GRADIENT OVERLAY (The Fix) */}
              {/* This creates a smooth transition from transparent to a dark, blurry glass effect at the bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Additional Blur Layer for the "Glass" look at the bottom */}
              <div
                className="absolute bottom-0 w-full h-1/2 backdrop-blur-[2px] mask-gradient"
                style={{
                  maskImage: "linear-gradient(to top, black, transparent)",
                }}
              />

              {/* Top Section: Number */}
              <div className="absolute top-0 w-full p-8 z-10">
                <motion.span
                  layoutId={`number-${course._id}`}
                  transition={smoothTransition}
                  className="text-white/70 font-clash text-3xl font-medium tracking-tight group-hover:text-white transition-colors">
                  {String(index + 1).padStart(2, "0")}
                </motion.span>
              </div>

              {/* Bottom Section: Content (Now perfectly visible) */}
              <div className="absolute bottom-0 w-full p-8 z-20">
                <motion.h3
                  layoutId={`title-${course._id}`}
                  transition={smoothTransition}
                  className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight leading-tight">
                  {course.title}
                </motion.h3>

                <p className="text-zinc-300 text-sm font-medium leading-relaxed line-clamp-2 mb-6 opacity-90">
                  {course.shortDesc}
                </p>

                <motion.div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center -rotate-45 group-hover:rotate-0 transition-all duration-500 shadow-xl">
                  <ArrowRight size={20} />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* MODAL OVERLAY */}
        <AnimatePresence>
          {selectedCourse && (
            <>
              {/* Dark Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedCourse(null)}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[110] cursor-zoom-out"
              />

              {/* Expanded Card (Modal) */}
              <div className="fixed inset-0 flex items-center justify-center z-[120] p-4 md:p-10 pointer-events-none">
                <motion.div
                  layoutId={`card-${selectedCourse._id}`}
                  className="bg-white w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-[3rem] pointer-events-auto flex flex-col md:flex-row">
                  {/* Left: Image Section */}
                  <div className="relative w-full md:w-5/12 h-64 md:h-auto overflow-hidden">
                    <motion.img
                      layoutId={`image-${selectedCourse._id}`}
                      src={selectedCourse.image}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:hidden" />
                    <motion.span
                      layoutId={`number-${selectedCourse._id}`}
                      className="absolute top-8 left-8 text-white font-clash text-5xl font-bold opacity-50">
                      {String(
                        courses.findIndex((c) => c._id === selectedCourse._id) +
                          1,
                      ).padStart(2, "0")}
                    </motion.span>
                  </div>

                  {/* Right: Content Section */}
                  <div className="w-full md:w-7/12 p-8 md:p-12 overflow-y-auto custom-scrollbar">
                    <div className="flex justify-between items-start mb-6">
                      <motion.h3
                        layoutId={`title-${selectedCourse._id}`}
                        className="text-4xl md:text-5xl font-bold text-zinc-900 tracking-tighter">
                        {selectedCourse.title}
                      </motion.h3>
                      <button
                        onClick={() => setSelectedCourse(null)}
                        className="p-2 bg-zinc-100 rounded-full hover:bg-zinc-200 transition-colors">
                        <X size={24} />
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-6 mb-8 text-zinc-500 font-medium">
                      <div className="flex items-center gap-2">
                        <Calendar size={18} className="text-blue-600" />{" "}
                        {selectedCourse.duration}
                      </div>
                      {/* --- CERTIFICATIONS SECTION --- */}
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                          <Award size={18} className="text-blue-600" />{" "}
                          Certification of Course Completion
                        </div>
                        {/* We check if certifications exist, if the array has items, AND if the first item isn't just an empty string */}
                        {selectedCourse?.certifications?.length > 0 &&
                          selectedCourse.certifications[0].trim() !== "" &&
                          selectedCourse.certifications.map((cert, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                              <Award size={18} className="text-blue-600" />{" "}
                              {cert}
                            </div>
                          ))}
                      </div>
                    </div>

                    <p className="text-zinc-600 text-lg leading-relaxed mb-8">
                      {selectedCourse.fullDesc}
                    </p>

                    <div className="mb-10">
                      <h4 className="font-bold uppercase tracking-widest text-xs text-zinc-400 mb-4">
                        What you will learn
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {selectedCourse.syllabus.map((item, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-2 text-zinc-800 font-medium">
                            <CheckCircle2
                              size={18}
                              className="text-green-500"
                            />{" "}
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* ENROLLMENT ACTION */}
                    <div className="flex flex-col sm:flex-row gap-4 items-center border-t border-zinc-100 pt-8">
                      <button
                        onClick={() => {
                          // Redirect to enrollment page and pass the selected course data
                          navigate("/enroll", {
                            state: {
                              courseCategory: "civil",
                              specificCourse: selectedCourse.title,
                            },
                          });
                        }}
                        className="w-full sm:w-auto px-10 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-200">
                        Enroll Now
                      </button>
                      <p className="text-zinc-400 text-xs font-medium text-center sm:text-left">
                        * Limited seats available for the <br />
                        upcoming batch.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CourseExplorer() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/categories")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setCategories(data);
        } else {
          setCategories([]);
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Error fetching categories:", err);
        setCategories([]);
        setIsLoading(false);
      });
  }, []);

  // Animation variants from your original file
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  if (isLoading) return <div className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-blue-600" /></div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-200 to-white pt-50 pb-20 px-6 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* --- RESTORED INTRO SECTION --- */}
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.1 }}
            className="relative w-50 h-50 md:w-200 md:h-100 mb-10 overflow-hidden rounded-4xl shadow-2xl shadow-blue-200 border-4 border-white"
          >
            <video 
              autoPlay 
              loop 
              muted 
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src="https://www.pexels.com/download/video/36410723/" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="absolute inset-0 bg-blue-600/10 mix-blend-overlay" />
          </motion.div>

          <motion.h1 
            variants={itemVariants}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-medium font-clash text-gray-900 leading-[1.1] text-center"
          >
            Your Future. <br />
            <span className="text-blue-600">Defined by Skill.</span>
          </motion.h1>

          <motion.p
            variants={itemVariants} 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-12 text-sm md:text-xl text-gray-500 font-medium max-w-2xl leading-relaxed text-center"
          >
            G-TEC Nagercoil provides industry-leading certifications in IT, 
            Accounting, and CAD to bridge the gap between education and career.
          </motion.p>

          <div className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-12 text-left border-t border-gray-100 pt-12">
            <motion.div
              variants={itemVariants}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h4 className="text-blue-600 font-bold uppercase tracking-widest text-xs mb-4">The Mission</h4>
              <p className="text-gray-600 leading-relaxed">
                We empower students with practical knowledge through high-end infrastructure and expert-led training. 
                Our curriculum is constantly updated to meet the ever-evolving demands of the global tech and business landscape.
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h4 className="text-blue-600 font-bold uppercase tracking-widest text-xs mb-4">The Outcome</h4>
              <p className="text-gray-600 leading-relaxed">
                Join thousands of successful alumni who have built careers in Software Development, Professional 
                Accounting, and Architectural Modeling. We don't just teach; we prepare you for the real world.
              </p>
            </motion.div>
          </div>

          <div className="mt-36 w-full h-px bg-transparent"></div>
        </div>
        {/* --- END RESTORED INTRO SECTION --- */}


        {/* --- DYNAMIC GRID SECTION --- */}
        <div className="max-w-7xl mx-auto px-6">
          <div className="space-y-32">
            {categories.map((cat, index) => {
              const isEven = index % 2 === 0;

              return (
                <motion.div
                  key={cat._id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12 lg:gap-24`}
                >
                  
                  {/* LEFT/RIGHT SIDE: THE IMAGE CARD (Restored Hover effects) */}
                  <div className="w-full md:w-1/2">
                    <motion.div 
                      whileHover={{ scale: 1.02, rotate: isEven ? -1 : 1 }}
                      className="relative group cursor-pointer"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden rounded-[3rem] shadow-2xl shadow-blue-500/10 border border-gray-100">
                        <img 
                          src={cat.image || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800"} 
                          alt={cat.name}
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      </div>
                      
                      {/* Floating Badge (Dynamic title) */}
                      <div className="absolute -top-4 -right-4 bg-blue-600 text-white px-6 py-2 rounded-full font-bold text-xs tracking-widest uppercase shadow-xl">
                        {cat.name}
                      </div>
                    </motion.div>
                  </div>

                  {/* RIGHT/LEFT SIDE: THE EXPLANATION */}
                  <div className="w-full md:w-1/2 space-y-6">
                    <motion.div
                      initial={{ opacity: 0, x: isEven ? 20 : -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <h4 className="text-blue-600 font-bold uppercase tracking-[0.2em] text-xs mb-4">
                        Department of {cat.name}
                      </h4>
                      <h2 className="text-4xl lg:text-5xl font-black text-gray-900 leading-tight mb-6">
                        {cat.headline}
                      </h2>
                      <p className="text-gray-500 text-lg leading-relaxed mb-8">
                        {cat.explorerDescription || cat.description}
                      </p>
                      
                      <Link 
                        to={`/courses/${cat.slug}`}
                        className="inline-flex items-center gap-3 bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-600 transition-all group"
                      >
                        Explore Courses 
                        <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                      </Link>
                    </motion.div>
                  </div>

                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
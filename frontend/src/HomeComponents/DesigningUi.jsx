import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLottie } from "lottie-react";

import chatAnimation from "../assets/LetsChat.json"; 


export default function DesignTestimonial() {
  const testimonials = [
    {
      id: 0,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
      quote: "\"Before G-Tec, we juggled five different tools to manage Figma files, UI tasks, and UX reports. Now it's all in one place.\"",
      name: "Sofia Delgado",
      role: "Lead UI/UX Designer"
    },
    {
      id: 1,
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop",
      quote: "\"This Institution has completely transformed my workflow. The real-time editing and seamless integration make everything so much smoother!\"",
      name: "Emily Ray",
      role: "UX Designer"
    },
    {
      id: 2,
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      quote: "\"I can't imagine going back to our old process. The intuitive interface and powerful features have saved us countless hours on every project.\"",
      name: "Alex Chen",
      role: "Product Designer"
    },
    {
      id: 3,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      quote: "\"G-Tec bridged the gap between our design and development teams. The handoff process is finally painless and accurate.\"",
      name: "Marcus Johnson",
      role: "Frontend Developer"
    },
    {
      id: 4,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
      quote: "\"We designed 3 campaigns faster this quarter than ever before. The collaborative features are exactly what we were missing.\"",
      name: "Chloe Smith",
      role: "Creative Director"
    }
  ];

  const angles = ["-rotate-12", "rotate-6", "-rotate-6", "rotate-12", "-rotate-3"];
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length);
    }, 5000); 
    
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const activeTestimonial = testimonials[activeIndex];

  const { View } = useLottie({ animationData: chatAnimation, loop: true });

  return (
    <section className="w-full bg-white py-25 px-6 md:px-12 lg:px-24 font-sans overflow-hidden">
      
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center" // Changed to items-center to balance the Lottie file
      >
        <div className="flex flex-col font-clash justify-center">
          <h2 className="text-4xl md:text-5xl lg:text-[3.5rem] leading-tight tracking-tight text-gray-900 mb-8">
            Loved by students & <br className="hidden lg:block" /> tech teams
          </h2>
          
          <div className="w-full max-w-sm md:max-w-md mx-auto md:mx-0">
            {View}
          </div>
        </div>

        <div className="flex flex-col pt-2">
          <div className="flex -space-x-2 mb-8 items-center ml-2">
            {testimonials.map((testimonial, index) => {
              const isActive = index === activeIndex;
              const rotationClass = isActive ? "rotate-0" : angles[index % angles.length];
              
              return (
                <button 
                  key={testimonial.id} 
                  onClick={() => setActiveIndex(index)}
                  className={`relative rounded-lg overflow-hidden border-2 border-white transition-all duration-300 ease-out focus:outline-none origin-center
                    ${isActive 
                      ? 'w-14 h-14 z-20 ring-2 ring-blue-500 shadow-lg opacity-100 rotate-0 scale-110' 
                      : `w-11 h-11 z-0 opacity-60 hover:opacity-100 hover:z-10 ${rotationClass}`}
                  `}
                >
                  <img
                    src={testimonial.avatar}
                    alt={`Team member ${testimonial.name}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              );
            })}
          </div>

          <div className="relative min-h-40 md:min-h-45">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="absolute inset-0" 
              >
                <p className="text-lg md:text-xl text-gray-800 leading-relaxed font-medium mb-6">
                  {activeTestimonial.quote}
                </p>

                <p className="text-sm font-semibold text-gray-900">
                  {activeTestimonial.name}, <span className="font-normal text-gray-600">{activeTestimonial.role}</span>
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>


    </section>
  );
}
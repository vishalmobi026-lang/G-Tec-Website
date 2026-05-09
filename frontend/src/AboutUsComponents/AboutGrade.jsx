import React from "react";
import { useState } from "react";
import {
    motion,
  useAnimationFrame,
  useMotionValue,
  useTransform,
  wrap,
} from "framer-motion";

  

export default function StatsSection() {

    const logos = [
    { name: "Certificate-1", src: "https://gteceducation.com/storage/app/public/filemanager/09-09-25-06-07-13.jpg" },
    { name: "Certificate-2", src: "https://gteceducation.com/storage/app/public/filemanager/09-09-25-06-56-16.jpg" },
    {name: "Certificate-3", src:"https://gteceducation.com/storage/app/public/filemanager/09-09-25-06-26-7.jpg"}
  ];

  const duplicatedLogos = [...logos, ...logos];
  
    const [isHovered, setIsHovered] = useState(false);
  
    const baseX = useMotionValue(0);
  
    const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);
  
    useAnimationFrame((t, delta) => {
      const baseVelocity = isHovered ? 0.3 : 1.2;
  
      const moveBy = baseVelocity * (delta / 1000);
  
      baseX.set(baseX.get() - moveBy);
    });
  

  const metrics = [
    { 
      value: "98%", 
      label: "Student satisfaction score across all active courses and programs." 
    },
    { 
      value: "12x", 
      label: "More hands-on practical training compared to traditional theory." 
    },
    { 
      value: "30+", 
      label: "Active branches successfully established across the region." 
    },
    { 
      value: "85%", 
      label: "Industry professionals who switched to teaching at our institute." 
    }
  ];

  return (
    <>
    <section className=" bg-black py-10 md:py-22 px-6 mx-20 md:mx-30 md:px-12 lg:px-24 font-sans border-y border-gray-100 rounded-3xl">
      <div className="max-w-7xl">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          
          {metrics.map((metric, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="flex flex-col items-start"
            >
                
              <h3 className="text-5xl lg:text-[3.5rem] font-sans font-semibold text-white tracking-tighter mb-4 leading-none">
                {metric.value}
              </h3>
              
              <p className="text-sm md:text-base text-white leading-relaxed font-medium pr-4">
                {metric.label}
              </p>
            </motion.div>
          ))}

        </div>

      </div>
       
    </section>
    <motion.h1
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center font-clash text-4xl md:text-5xl font-medium bg-linear-to-r from-red-500 via-blue-900 to-orange-500 bg-clip-text text-transparent tracking-tight my-34">
        Our Value added Certificates
      </motion.h1>
    <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mt-20 w-full max-w-7xl mx-auto overflow-hidden relative mask-[linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
            
          <motion.div style={{ x }} className="flex items-center w-max">
            {duplicatedLogos.map((logo, index) => (
              <div
                key={`${logo.name}-${index}`}
                className="shrink-0 mx-10 md:mx-16 flex items-center justify-center"
              >
                <img
                  src={logo.src}
                  alt={logo.name}
                  title={logo.name}
                  className="h-7 md:h-50 w-auto object-contain hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                />
              </div>
            ))}
          </motion.div>
        </motion.div>
        </>
  );
}
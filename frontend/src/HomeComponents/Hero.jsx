import React from "react";
import { useState } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useTransform,
  wrap,
} from "framer-motion";
import {
  ChevronRight,
  ArrowUpRight,
  LayoutTemplate,
  Type,
  Image as ImageIcon,
  MousePointer2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Pause,
  SkipForward,
  Menu,
} from "lucide-react";

export default function Hero() {
  const logos = [
    { name: "JavaScript", src: "/js.png" },
    { name: "C++", src: "/Cpp.png" },
    { name: "C", src: "/C.png" },
    { name: "Devops", src: "/code.png" },
    { name: "Python", src: "/python.png" },
    { name: "Java", src: "/java.png" },
    { name: "React", src: "/reactjs.svg" },
    { name: "MongoDb", src: "/mdb.png" },
    { name: "Node.js", src: "/nodejs.png" },
    { name: "PowerPoint", src: "/ppt.png" },
    { name: "Word", src: "/word.png" },
    { name: "HTML", src: "/html.png" },
    { name: "CSS", src: "/tcss.png" },
    { name: "Tally", src: "/tally.webp" },
    { name: "SketchUp", src: "/sketchup.png" },
    { name: "Visual Basic", src: "/vb.png" },
    { name: "Vite", src: "/vite.png" },
    { name: "Videvo", src: "/videvo.png" },
    { name: "Microsoft Access", src: "/msas.png" },
    { name: "2D Design", src: "/2d.png" },
    { name: "Figma", src: "/figma.png" },
    { name: "Microsoft Word", src: "/ms.png" },
    { name: "CSS", src: "/css.png" },
  ];

  const duplicatedLogos = [...logos, ...logos];

  const [isHovered, setIsHovered] = useState(false);

  const baseX = useMotionValue(0);

  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);

  useAnimationFrame((t, delta) => {
    const baseVelocity = isHovered ? 0.3 : 0.7;

    const moveBy = baseVelocity * (delta / 1000);

    baseX.set(baseX.get() - moveBy);
  });

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

  return (
    <>
      <section className="relative w-full pt-20 pb-20 px-6 flex flex-col items-center overflow-hidden bg-linear-to-b from-white via-blue-200 to-white">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-150 h-75 bg-blue-200/30 blur-[120px] rounded-full -z-10" />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.1 }}
          className="max-w-4xl text-center"
        >
          {/* Badge */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-3 mb-8"
          >
            <span className="bg-[#101011] text-white text-xs font-semibold px-3 py-1 rounded-full tracking-wide">
              New
            </span>

            <span className="text-sm md:text-base font-medium text-gray-600">
              G-Tech Courses 2026 are now live
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-8xl font-semibold font-clash tracking-tight text-gray-900 mb-8 leading-[1.1]"
          >
            Master your future in <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-900 to-blue-500">
              just a few clicks.
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-lg text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Technical expertise and creative skills all in one powerful
            platform. Elevate your{" "}
            <span className="font-semibold text-gray-700">career</span> with{" "}
            <span className="font-semibold text-gray-700">offline courses</span>{" "}
            and real-time mentorship.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button className="group relative px-8 py-4 bg-blue-900 text-white rounded-full font-bold text-lg hover:bg-blue-800 transition-all flex items-center gap-2 shadow-xl shadow-blue-600">
              Get Started — it's free
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button className="px-8 py-4 bg-white text-gray-900 border border-gray-200 rounded-full font-bold text-lg hover:bg-gray-50 transition-all flex items-center gap-2">
              View Courses <ArrowUpRight className="w-5 h-5" />
            </button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.1 }}
          transition={{ delay: 0.2, duration: 1, ease: "easeOut" }}
          className="mt-20 w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 px-4"
        >
          {/* VIDEO DASHBOARD:
            Added 'hidden lg:flex' to hide on mobile and only show on large screens. 
          */}
          <div className="hidden lg:flex relative flex-1 rounded-[2.5rem] bg-white shadow-2xl overflow-hidden aspect-video border border-gray-100">
            <div className="hidden md:flex flex-col items-center py-6 w-16 bg-white border-r border-gray-100 z-20 shrink-0 gap-6 text-gray-400">
              <div className="w-8 h-8 bg-black p-1 rounded-md mb-4 flex items-center justify-center text-white text-xs font-bold">
                <img
                  src="/logo1.webp"
                  alt="G-Tech Logo"
                  className="h-20 w-auto object-contain"
                />
              </div>
              <LayoutTemplate
                size={20}
                className="hover:text-blue-600 cursor-pointer transition-colors"
              />
              <Type
                size={20}
                className="hover:text-blue-600 cursor-pointer transition-colors"
              />
              <ImageIcon
                size={20}
                className="hover:text-blue-600 cursor-pointer transition-colors"
              />
            </div>

            <div className="relative flex-1 w-full h-full bg-[#F8FAFC]">
              <div className="absolute top-0 left-0 right-0 h-14 bg-white/90 backdrop-blur-md z-20 flex items-center justify-between px-6 border-b border-gray-100">
                <span className="text-xs font-semibold text-gray-500">
                  Institution / <span className="text-gray-900">Profile</span>
                </span>
                <div className="flex gap-2">
                  <div className="w-7 h-7 rounded-full bg-green-200 border-2 border-white shadow-sm flex items-center justify-center text-[10px] font-bold">
                    <img
                      src="/boy1.jpg"
                      alt="Boy 1"
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <div className="w-7 h-7 rounded-full bg-blue-200 border-2 border-white shadow-sm flex items-center justify-center text-[10px] font-bold -ml-3">
                    <img
                      src="/boy2.jpg"
                      alt="Boy 2"
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                </div>
              </div>

              <div className="w-full h-full pt-20 pb-10 px-10 flex flex-col">
                <span className="text-sm font-medium text-gray-500 mb-2">
                  Learn now
                </span>
                <div className="relative flex-1 w-full border border-blue-500 bg-black overflow-hidden shadow-sm">
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    src="/ai.mp4"
                    type="video/mp4"
                    className="absolute inset-0 w-full h-full object-cover opacity-90"
                  />
                  <div className="absolute inset-0 z-20 flex items-center px-8 md:px-0">
                    <div className="bg-[#0F172A]/50 h-130 backdrop-blur-sm p-8 py-40 border border-white/10 max-w-sm rounded-2xl shadow-2xl">
                      <h3 className="text-white text-3xl font-bold mb-3 leading-tight">
                        Master In-Demand <br />
                        Tech Skills
                      </h3>
                      <p className="text-gray-300 text-sm mb-6">
                        Designed for maximum retention and hands-on practical
                        learning.
                      </p>
                      <button className="bg-[#EAB308] text-black px-6 py-2.5 rounded-full text-sm font-bold pointer-events-auto hover:bg-yellow-400 transition-colors">
                        Explore Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <motion.div
                animate={{ x: [0, 20, 0], y: [0, -15, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 4,
                  ease: "easeInOut",
                }}
                className="absolute top-28 right-1/4 z-30 pointer-events-none flex flex-col items-start"
              >
                <MousePointer2
                  className="text-blue-500 fill-blue-500 -rotate-12"
                  size={24}
                />
                <div className="bg-blue-500 text-white text-[10px] font-bold px-3 py-1 rounded-full mt-1 ml-4 shadow-lg">
                  Jody Hekla
                </div>
              </motion.div>
              <motion.div
                animate={{ x: [0, -15, 0], y: [0, 15, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 3.5,
                  ease: "easeInOut",
                  delay: 1,
                }}
                className="absolute bottom-16 left-1/4 z-30 pointer-events-none flex flex-col items-start"
              >
                <MousePointer2
                  className="text-[#F97316] fill-[#F97316] -rotate-12"
                  size={24}
                />
                <div className="bg-[#F97316] text-white text-[10px] font-bold px-3 py-1 rounded-full mt-1 ml-4 shadow-lg">
                  Click Me
                </div>
              </motion.div>
            </div>
          </div>

          {/* NAGERCOIL DASHBOARD:
            Changed from 'hidden lg:flex ... w-85' to 'flex ... w-full lg:w-85'.
            This makes it visible and full-width on mobile, while staying w-85 on desktop.
          */}
          <div className="flex flex-col w-full lg:w-85 shrink-0 bg-white rounded-[2.5rem] shadow-2xl p-6 border border-gray-100 relative">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <span className="font-bold text-xl text-gray-900 tracking-tight">
                G-Tec Nagercoil Branch
              </span>
              <Menu className="text-gray-900 w-6 h-6" strokeWidth={2.5} />
            </div>

            {/* Main Image Area with Blue Bounding Box */}
            <div className="bg-linear-to-br from-[#FFD166] to-[#FF9F1C] rounded-4xl p-6 mb-10 aspect-square flex items-center justify-center relative">
              <div className="border border-blue-500 w-full h-full relative flex items-center justify-center">
                <div className="absolute -top-1 -left-1 w-2 h-2 bg-white border border-blue-500"></div>
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-white border border-blue-500"></div>
                <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-white border border-blue-500"></div>
                <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-white border border-blue-500"></div>
                <img
                  src="/not.webp"
                  alt="3D Shape"
                  className="w-3/4 h-3/4 object-contain drop-shadow-xl hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

            {/* Bottom Control Bar */}
            <div className="mt-auto pb-4">
              <div className="bg-[#111111] rounded-[1.25rem] py-4 px-6 mx-auto w-full flex justify-between items-center shadow-xl relative z-10">
                <div className="flex items-center gap-3">
                  <AlignLeft className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                  <AlignCenter className="w-5 h-5 text-white cursor-pointer" />
                  <AlignRight className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                </div>
                <div className="w-px h-5 bg-gray-700"></div>
                <div className="flex items-center gap-3">
                  <Pause className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer fill-current transition-colors" />
                  <SkipForward className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer fill-current transition-colors" />
                </div>
              </div>
              <div className="bg-gray-200 h-3 w-[85%] mx-auto rounded-b-xl -mt-1"></div>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mt-35 w-full max-w-7xl mx-auto overflow-hidden relative mask-[linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]"
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
                  className="h-7 md:h-9 w-auto object-contain hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                />
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>
      
    </>
  );
}
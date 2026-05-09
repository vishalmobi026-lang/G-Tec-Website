import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";

const stackIcons = [
  {
    id: "mongo1",
    x: 10,
    y: 10,
    icon: "/mdb.png",
    name: "MongoDB",
    bg: "bg-emerald-900",
    delay: 0,
  },
  {
    id: "express1",
    x: 33.3,
    y: 10,
    icon: "/Express.png",
    name: "Express.js",
    bg: "bg-slate-700",
    delay: 0.1,
  },
  {
    id: "react",
    x: 56.6,
    y: 10,
    icon: "/React.png",
    name: "React.js",
    bg: "bg-slate-900",
    delay: 0.2,
  },
  {
    id: "node1",
    x: 80,
    y: 10,
    icon: "/Node.js.png",
    name: "Node.js",
    bg: "bg-green-900",
    delay: 0.3,
  },

  {
    id: "mongo2",
    x: 10,
    y: 35,
    icon: "/mdb.png",
    name: "MongoDB",
    bg: "bg-emerald-900",
    delay: 0.4,
  },
  {
    id: "express2",
    x: 33.3,
    y: 35,
    icon: "/Express.png",
    name: "Express.js",
    bg: "bg-slate-700",
    delay: 0.5,
  },
  {
    id: "angular",
    x: 56.6,
    y: 35,
    icon: "/Angular.png",
    name: "Angular.js",
    bg: "bg-orange-800",
    delay: 0.6,
  },
  {
    id: "node2",
    x: 80,
    y: 35,
    icon: "/Node.js.png",
    name: "Node.js",
    bg: "bg-green-900",
    delay: 0.7,
  },
];

const flowColumns = [15, 38.3, 61.6, 85];

const START_Y = 55;
const MERGE_Y = 85;
const TRUNK_END_Y = 90;

const VITE_X = 43;
const VITE_Y = 85;

const generateFlowBranches = () => {
  return flowColumns.map((startX, index) => {
    const d = `M ${startX} ${START_Y} C ${startX} 80, 50 55, 50 ${MERGE_Y} L 50 ${TRUNK_END_Y}`;
    return { id: `branch-${index}`, d, delay: 0 }; 
  });
};

const WebDevSpecial = () => {
  const branches = generateFlowBranches();

  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const leftX = useTransform(
    scrollYProgress,
    [0, 0.35, 0.65, 1],
    [-300, 0, 0, -300],
  );
  const leftOpacity = useTransform(
    scrollYProgress,
    [0, 0.35, 0.65, 1],
    [0, 1, 1, 0],
  );

  const rightX = useTransform(
    scrollYProgress,
    [0, 0.35, 0.65, 1],
    [300, 0, 0, 300],
  );
  const rightOpacity = useTransform(
    scrollYProgress,
    [0, 0.35, 0.65, 1],
    [0, 1, 1, 0],
  );

  return (
    <>
    <section
      ref={sectionRef}
      className="w-full bg-white py-10 px-6 md:px-12 overflow-hidden"
    >
      <div className="max-w-8xl md:mx-35 mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.1fr,0.9fr] gap-12 lg:gap-16 items-center">
        {/* ================= LEFT SIDE: INTERACTIVE GRAPHIC ================= */}
        <motion.div
          style={{ x: leftX, opacity: leftOpacity }}
          className="w-full bg-gray-100 rounded-[2.5rem] p-4 md:p-3 relative overflow-hidden shadow-sm border border-gray-100 "
        >
          <div className="relative w-full aspect-square  md:aspect-7/6 rounded-4xl mb-15">
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="absolute inset-0 w-full h-full z-0 pointer-events-none"
            >
              <defs>
                <linearGradient
                  id="flowGradient"
                  x1="0%"
                  y1="0%"
                  x2="0%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#9b9efa" />
                  <stop offset="50%" stopColor="#6065fc" />
                  <stop offset="100%" stopColor="#050dfc" />
                </linearGradient>
              </defs>

              {branches.map((branch) => (
                <g key={branch.id}>
                  <path
                    d={branch.d}
                    fill="none"
                    stroke="rgba(82, 53, 239, 0.15)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                  />
                  <motion.path
                    d={branch.d}
                    fill="none"
                    stroke="url(#flowGradient)"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                    pathLength="30"
                    strokeDasharray="40 200"
                    animate={{ strokeDashoffset: [200, -20] }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      ease: "linear",
                      delay: branch.delay,
                    }}
                  />
                </g>
              ))}
            </svg>

            {stackIcons.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.5, y: -20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: false, amount: 0.5 }}
                transition={{
                  duration: 0.5,
                  delay: item.delay,
                  type: "spring",
                }}
                className={`absolute w-12 hover:shadow-blue-400 hover:shadow-xl hover:scale-110 transition duration-200 ease-in-out h-12 md:w-15 md:h-15 rounded-2xl rotate-45 ${item.bg} md:shadow-2xl flex items-center justify-center z-10 overflow-hidden p-2`}
                style={{
                  top: `${item.y}%`,
                  left: `${item.x}%`,
                  transform: "translate(-50%, -50%)",
                }}
                title={item.name}
              >
                <img
                  src={item.icon}
                  alt={item.name}
                  className="w-10 h-full object-contain rotate-315"
                />
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false, amount: 0.5 }}
              transition={{ duration: 0.6, delay: 0.8, type: "spring" }}
              className="absolute w-16 h-16 md:w-20 md:h-20 bg-violet-900 rounded-2xl shadow-[0_10px_30px_-10px_rgba(139,92,246,0.3)] border border-gray-100 flex items-center justify-center z-20 p-3"
              style={{
                top: `${VITE_Y}%`,
                left: `${VITE_X}%`,
                transform: "translate(-50%, -50%)",
              }}
              title="Vite Build Tool"
            >
              <img
                src="/vite.png"
                alt="Vite Logo"
                className="w-full h-full object-contain relative z-10"
              />

              <motion.div
                animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 rounded-2xl border-2 border-indigo-400 z-0"
              />
            </motion.div>
          </div>
        </motion.div>

        {/* ================= RIGHT SIDE: TEXT CONTENT ================= */}
        <motion.div
          style={{ x: rightX, opacity: rightOpacity }}
          className="flex flex-col items-start ml-20"
        >
          <span className="text-sm font-bold tracking-wider uppercase text-blue-600 bg-blue-100 px-3 py-1 rounded-full mb-6">
            Web Development
          </span>

          <h2 className="text-4xl md:text-4xl lg:text-5xl font-semibold font-clash text-gray-900 tracking-normal leading-tight mb-6">
            One ecosystem, <br />
            unlimited potential.
          </h2>

          <p className="text-black text-sm md:text-md leading-relaxed mb-10 max-w-lg">
            Empower your coding journey by mastering both the{" "}
            <strong>MERN</strong> and <strong>MEAN</strong> stacks. Bring your
            ideas to life—seamlessly and effortlessly—powered by the blazing
            fast Vite build tool.
          </p>

          <button
            type="button"
            className="flex justify-center gap-2 items-center shadow-xl text-lg bg-gray-50 backdrop-blur-md lg:font-semibold isolation-auto border-gray-50 hover:bg-black duration-150  before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-left-full hover:text-white before:hover:left-0 before:rounded-full before:bg-[#111111] before:-z-10 before:aspect-square before:hover:scale-150 before:hover:duration-700 relative z-10 px-8 py-4 mb-12 overflow-hidden border-2 rounded-full group"
          >
            View Web Courses
            <ArrowRight
              strokeWidth={2.5}
              className="w-8 h-8 justify-end group-hover:rotate-0 group-hover:bg-gray-50 text-gray-800 ease-linear duration-300 rounded-full border border-gray-700 group-hover:border-transparent p-1.5 -rotate-45"
            />
          </button>

          <div className="flex items-center gap-4 pt-8 border-t border-gray-100 w-full max-w-md">
            <img
              src="https://i.pravatar.cc/150?img=11"
              alt="Instructor"
              className="w-12 h-12 rounded-full object-cover border border-gray-200"
            />
            <div className="flex flex-col">
              <span className="text-sm italic text-gray-600 mb-1">
                "Our platform unifies the best tech stacks so you can build
                scalable enterprise apps."
              </span>
              <span className="text-xs font-bold text-gray-900 uppercase tracking-wide">
                — Athithyan A, Software Developer
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
    </>
  );
};

export default WebDevSpecial;

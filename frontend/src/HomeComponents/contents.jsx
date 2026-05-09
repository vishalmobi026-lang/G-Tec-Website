import React, { useState } from "react";
import { motion } from "framer-motion";
import { Code2, GraduationCap, Palette, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
const categories = [
  {
    title: "Technical",
    description:
      "Master programming, web development, and deep tech skills with hands-on coding courses.",
    icon: Code2,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    image: "/tech.jpg",
    path: "/courses/it-technical",
  },
  {
    title: "Non-Technical",
    description:
      "Explore essential business, management, finance, and soft skill courses to accelerate your career.",
    icon: GraduationCap,
    color: "text-violet-600",
    bgColor: "bg-violet-100",
    image: "/non-tech.jpg",
    path: "/courses/it-non-technical",
  },
  {
    title: "Designing",
    description:
      "Unleash your creativity with UI/UX, graphic design, and advanced 2D/3D modeling courses.",
    icon: Palette,
    color: "text-pink-600",
    bgColor: "bg-pink-100",
    image: "/des.jpg",
    path: "/courses/designing",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const LogoCarousel = () => {
  return (
    <>
      <section className="w-full bg-white py-20 pb-10 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-clash text-gray-900 tracking-tight mb-4">
              Explore our{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-800 to-blue-400">
                learning paths
              </span>
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Choose from our industry-leading curriculums designed to help you
              master the most in-demand skills for the modern workforce.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover={{ y: -10 }}
                className="group p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-2xl hover:shadow-violet-200/50 transition-all duration-300">
                <div
                  className={`w-14 h-14 ${category.bgColor} ${category.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <category.icon size={28} />
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {category.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {category.description}
                </p>

                <div>
                  <img src={category.image} className="rounded" />
                </div>

                <div className="text-gray-900 font-semibold">
                  <Link
                    to={category.path}
                    className="flex items-center gap-2 group cursor-pointer hover:text-blue-600 transition-colors">
                    View Courses
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default LogoCarousel;

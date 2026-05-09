import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
export default function ScrollImageGallery() {
  const { scrollY } = useScroll();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const moveRight = useTransform(scrollY, (y) => -3000 + y * 0.3);
  const moveLeft = useTransform(scrollY, (y) => -1000 + y * -0.2);

  const rows = [
    {
      id: 1,
      reverse: false, 
      images: [
        "https://gteceducation.com/storage/app/public/filemanager/09-09-25-06-15-1.jpg",
        "https://gteceducation.com/storage/app/public/filemanager/09-09-25-06-58-2.jpg",
        "https://gteceducation.com/storage/app/public/filemanager/09-09-25-06-45-3.jpg",
        "https://gteceducation.com/storage/app/public/filemanager/09-09-25-06-29-4.jpg",
        "https://gteceducation.com/storage/app/public/filemanager/09-09-25-06-26-17.jpg",
      ],
      style:"hover:scale-110 hover:shadow-2xl transition duration-500 hover:shadow-blue-500"
    },
    {
      id: 2,
      reverse: true, 
      images: [
        "https://gteceducation.com/storage/app/public/filemanager/09-09-25-06-14-5.jpg",
        "https://gteceducation.com/storage/app/public/filemanager/09-09-25-06-59-6.jpg",
        "https://gteceducation.com/storage/app/public/filemanager/09-09-25-06-48-8.jpg",
        "https://gteceducation.com/storage/app/public/filemanager/09-09-25-06-26-7.jpg",
        "https://gteceducation.com/storage/app/public/filemanager/11-09-25-10-26-18.jpg", 
      ],
      style:"hover:scale-110 hover:shadow-2xl transition duration-500 hover:shadow-blue-500"
    },
    {
      id: 3,
      reverse: false, 
      images: [
        "https://gteceducation.com/storage/app/public/filemanager/09-09-25-06-15-9.jpg",
        "https://gteceducation.com/storage/app/public/filemanager/09-09-25-06-05-10.jpg",
        "https://gteceducation.com/storage/app/public/filemanager/09-09-25-06-54-11.jpg",
        "https://gteceducation.com/storage/app/public/filemanager/09-09-25-06-35-12.jpg",
        "https://gteceducation.com/storage/app/public/filemanager/11-09-25-10-44-19.jpg",
      ],
      style:"hover:scale-110 hover:shadow-2xl transition duration-500 hover:shadow-blue-500"
    },
    {
      id: 4,
      reverse: true, 
      images: [
        "https://gteceducation.com/storage/app/public/filemanager/09-09-25-06-20-14.jpg",
        "https://gteceducation.com/storage/app/public/filemanager/09-09-25-06-07-13.jpg",
        "https://gteceducation.com/storage/app/public/filemanager/09-09-25-06-56-16.jpg",
        "https://gteceducation.com/storage/app/public/filemanager/09-09-25-06-43-15.jpg",
        "https://gteceducation.com/storage/app/public/filemanager/11-09-25-10-07-23.jpg",
      ],
      style:"hover:scale-110 hover:shadow-2xl transition duration-500 hover:shadow-blue-500"
    },
  ];

  return (
    <>
    <section className="w-full bg-white py-24 md:py-32 flex flex-col gap-6 md:gap-8 relative z-10 overflow-hidden">
      {rows.map((row) => (
        <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false, amount: 0.1 }} key={row.id} className="w-full flex whitespace-nowrap relative">
          <motion.div
            className="flex gap-6 md:gap-8 items-center w-max"
            style={{ x: row.reverse ? moveLeft : moveRight }}
          >
            {[...Array(8)].map((_, i) => (
              <React.Fragment key={`${row.id}-repeat-${i}`}>
                
                {row.images.map((src, index) => (
                  <div 
                    key={`${row.id}-img-${index}`} 
                    className={`w-64 h-40 md:w-80 md:h-52 ${row.style} shrink-0 rounded-2xl overflow-hidden shadow-md border border-gray-100 bg-gray-50 relative block`}
                  >
                    <img 
                      src={src} 
                      alt="Gallery Visual" 
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500 ease-out cursor-pointer"
                    />
                  </div>
                ))}
              </React.Fragment>
            ))}
          </motion.div>
        </motion.div>
      ))}
    </section>
    </>
  );
}
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PricingSection() {
  const navigate = useNavigate();
  const [isMonthly, setIsMonthly] = useState(true);
  const [plans, setPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ FETCH OFFERS DYNAMICALLY FROM BACKEND
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/offers");
        const data = await response.json();

        if (data && data.length > 0) {
          setPlans(data);
        }
      } catch (error) {
        console.error("Failed to fetch offers:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOffers();
  }, []);

  if (isLoading) {
    return (
      <div className="py-24 text-center text-gray-500 font-medium">
        Loading amazing offers...
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <div className="py-24 text-center text-gray-500 font-medium">
        No offers currently available.
      </div>
    );
  }

  return (
    <section className="py-24 bg-white font-sans">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-clash text-gray-900 mb-6 tracking-tight">
            Special <span className="text-blue-600">Offers</span>
          </h2>
          <p className="text-lg text-gray-500 mb-8 max-w-2xl mx-auto">
            Kickstart your career with our industry-leading courses at special
            discounted prices.
          </p>

          <div className="flex items-center justify-center gap-3">
            <span
              className={`text-sm font-semibold transition-colors duration-300 ${!isMonthly ? "text-gray-900" : "text-gray-400"}`}>
              Original Price
            </span>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={isMonthly}
                onChange={() => setIsMonthly(!isMonthly)}
              />
              <div className="group peer bg-white rounded-full duration-300 w-16 h-8 ring-2 ring-gray-300 after:duration-300 after:bg-gray-400 peer-checked:after:bg-blue-600 peer-checked:ring-blue-600 after:rounded-full after:absolute after:h-6 after:w-6 after:top-1 after:left-1 after:flex after:justify-center after:items-center peer-checked:after:translate-x-8 peer-hover:after:scale-95"></div>
            </label>

            <span
              className={`text-sm font-semibold transition-colors duration-300 ${isMonthly ? "text-gray-900" : "text-gray-400"}`}>
              Offer Price
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, index) => (
            <motion.div
              key={plan._id || index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative flex flex-col p-8 rounded-3xl transition-all duration-300 
                ${
                  plan.highlighted
                    ? "bg-blue-600 text-white shadow-xl shadow-blue-600/20 md:-translate-y-4"
                    : "bg-white text-gray-900 border border-gray-100 shadow-lg shadow-gray-200/50 hover:border-gray-200 hover:shadow-xl"
                }
              `}>
              {plan.highlighted && (
                <div className="absolute -top-4 left-0 right-0 flex justify-center">
                  <span className="bg-linear-to-r from-blue-400 to-blue-300 text-blue-950 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                    Most Popular
                  </span>
                </div>
              )}

              <h3
                className={`text-2xl font-bold mb-2 ${plan.highlighted ? "text-white" : "text-gray-900"}`}>
                {plan.name}
              </h3>
              <p
                className={`text-sm mb-6 ${plan.highlighted ? "text-blue-100" : "text-gray-500"}`}>
                {plan.description}
              </p>

              <div className="flex items-baseline mb-2">
                <span
                  className={`text-5xl font-extrabold tracking-tight ${plan.highlighted ? "text-white" : "text-gray-900"}`}>
                  ₹
                </span>

                {/* Value animation wrapper */}
                <div className="relative overflow-hidden h-14 w-45 flex items-center ml-1">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={isMonthly ? plan.priceOn : plan.priceOff}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`text-5xl font-extrabold tracking-tight absolute ${plan.highlighted ? "text-white" : "text-gray-900"}`}>
                      {isMonthly ? plan.priceOn : plan.priceOff}
                    </motion.div>
                  </AnimatePresence>
                </div>

                <span
                  className={`ml-1 font-medium text-5xl ${plan.highlighted ? "text-blue-200" : "text-blue-600"}`}>
                  /-
                </span>
              </div>

              <button
                onClick={() => {
                  if (plan.linkedCategory && plan.linkedCourseTitle) {
                    // Navigate to the category page and pass the specific course title
                    navigate(`/courses/${plan.linkedCategory}`, { 
                      state: { autoOpenCourse: plan.linkedCourseTitle } 
                    });
                  }
                }}
                className={`w-full py-3.5 mt-5 rounded-xl font-semibold mb-8 transition-all duration-200
                  ${
                    plan.highlighted
                      ? "bg-white text-blue-600 hover:bg-gray-50 hover:scale-[1.02]"
                      : "bg-gray-900 text-white hover:bg-gray-800 hover:scale-[1.02]"
                  }
                `}>
                Get started
              </button>

              <ul className="flex flex-col gap-4 mt-auto">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div
                      className={`mt-0.5 shrink-0 ${plan.highlighted ? "text-blue-300" : "text-green-500"}`}>
                      <Check size={18} strokeWidth={3} />
                    </div>
                    <span
                      className={`text-sm font-medium ${plan.highlighted ? "text-blue-50" : "text-gray-600"}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLottie } from "lottie-react";
import { Phone, Mail, MapPin } from "lucide-react";
// IMPORTANT: Update this path to where your actual Lottie JSON is stored
import contactAnimation from "../assets/Contact Us.json"; 

export default function ContactUsForm() {
 const [formData, setFormData] = useState({
  firstName: "",
  lastName: "",
  email: "",
  countryCode: "+91",
  phone: "",
  message: "",
  agreedToPolicy: false,
});

const [isSubmitting, setIsSubmitting] = useState(false);
const [statusMessage, setStatusMessage] = useState("");
const [countries, setCountries] = useState([]);

  // ✅ 1. UNCOMMENTED: Setup Lottie Animation properly
  const { View: LottieView } = useLottie({
    animationData: contactAnimation,
    loop: true,
    autoplay: true,
  });

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/countries"); 
        const data = await response.json();
        
        if (data && data.length > 0) {
          // Store the real data directly from your backend!
          setCountries(data);
        }
      } catch (error) {
        console.error("Failed to fetch country codes from backend:", error);
      }
    };

    fetchCountries();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "countryCode") {
      // Find the country based on the selected phonecode
      const selectedCountry = countries.find(c => {
        // Some libraries return '91', some return '+91'. This handles both securely!
        const code = c.phonecode.includes('+') ? c.phonecode : `+${c.phonecode}`;
        return code === value;
      });

      setFormData(prev => ({
        ...prev,
        countryCode: value,
        // Your backend uses "id" for the ISO code (e.g., "IN")
        countryIso: selectedCountry ? selectedCountry.id : "IN" 
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  setStatusMessage("");

  try {
    const response = await fetch("http://localhost:5000/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (data.success) {
      setStatusMessage("✅ Success! Your message has been sent.");
      // Reset the form on success
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        countryCode: "+91",
        phone: "",
        message: "",
        agreedToPolicy: false,
      });
    } else {
      setStatusMessage("❌ Error: " + data.error);
    }
  } catch (error) {
    console.error("Submission Error:", error);
    setStatusMessage("❌ Server unreachable. Please try again later.");
  } finally {
    setIsSubmitting(false);
  }
};

  const inputClass =
    "w-full px-4 py-3.5 mt-2 bg-[#f4f4f5] border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all text-gray-900 text-base placeholder-gray-400";
  const labelClass = "block text-sm font-medium text-gray-900";
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
    <AnimatePresence>
      <div className="min-h-screen overflow-hidden bg-linear-to-b from-white via-blue-200 to-white px-6 py-50 pb-30 sm:pb-30 sm:py-50 lg:px-12 selection:bg-blue-100 flex flex-col items-center">
        
        {/* Top Header Section */}
        <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false, amount: 0.1 }}
                  className="max-w-4xl text-center"
                >
                  <motion.div
                              variants={itemVariants}
                            >
          <h2 className="text-5xl md:text-7xl font-clash tracking-tight text-blue-900 mb-6 drop-shadow-sm">
            Get in touch with us
          </h2>
          <p className="text-lg md:text-xl leading-relaxed text-blue-600/70 max-w-lg mx-auto font-medium">
            We'd love to hear from you. Please fill out this form.
          </p></motion.div>
        </motion.div>

        {/* Main Grid: Lottie (Left) & Form (Right) */}
        <div className="mx-auto max-w-7xl w-full mt-16 sm:mt-20 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center z-10">
          
          {/* LEFT: Lottie Animation */}
          <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false, amount: 0.1 }}
                  className="w-full"
                >
            {LottieView}
          </motion.div>

          {/* RIGHT: Unique Form Card */}
          <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false, amount: 0.1 }}
                  className="max-w-4xl text-center"
                >
  <form 
    onSubmit={handleSubmit} 
    className="bg-white rounded-2xl p-8 sm:p-12 shadow-[0_20px_50px_rgba(37,99,235,0.15)] border border-white/50 backdrop-blur-sm"
  >
    <div className="grid grid-cols-1 gap-x-6 gap-y-7 sm:grid-cols-2">
      
      {/* First Name */}
      <div>
        <label htmlFor="firstName" className={labelClass}>First name</label>
        <input type="text" name="firstName" id="firstName" placeholder="First name" value={formData.firstName} onChange={handleChange} className={inputClass} required />
      </div>

      {/* Last Name */}
      <div>
        <label htmlFor="lastName" className={labelClass}>Last name</label>
        <input type="text" name="lastName" id="lastName" placeholder="Last name" value={formData.lastName} onChange={handleChange} className={inputClass} required />
      </div>

      {/* Email */}
      <div className="sm:col-span-2">
        <label htmlFor="email" className={labelClass}>Email</label>
        <input type="email" name="email" id="email" placeholder="you@company.com" value={formData.email} onChange={handleChange} className={inputClass} required />
      </div>

      {/* Phone Number */}
      {/* Phone Number */}
      <div className="sm:col-span-2">
        <label htmlFor="phone" className={labelClass}>Phone number</label>
        
        {/* NEW: Flexbox Wrapper with focus-within to mimic standard input styling */}
        <div className="mt-2 flex items-center w-full bg-[#f4f4f5] border border-transparent rounded-xl focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-600 focus-within:border-blue-600 transition-all overflow-hidden">
          
          {/* LEFT SIDE: Flag & Dropdown */}
          <div className="flex items-center pl-4 pr-1">
            {formData.countryIso && (
              <img
                src={`https://flagcdn.com/w20/${formData.countryIso.toLowerCase()}.png`}
                alt="flag"
                className="w-5 h-auto mr-1.5 rounded-sm object-cover shadow-sm shrink-0"
              />
            )}
            <select 
              id="countryCode" 
              name="countryCode" 
              value={formData.countryCode}
              onChange={handleChange}
              className="bg-transparent border-0 py-3.5 pl-1 pr-2 text-gray-700 font-medium focus:ring-0 sm:text-base outline-none cursor-pointer appearance-none shrink-0"
            >
              {countries.map((country) => {
                const displayCode = country.phonecode.includes('+') ? country.phonecode : `+${country.phonecode}`;
                return (
                  <option key={country.id} value={displayCode}>
                    {country.id} ({displayCode})
                  </option>
                );
              })}
            </select>
          </div>

          {/* Divider Line (Makes the separation super clear) */}
          <div className="w-[1px] h-6 bg-gray-300 mx-1 shrink-0"></div>

          {/* RIGHT SIDE: Text Input */}
          <input 
            type="tel" 
            name="phone" 
            id="phone" 
            placeholder="00000 00000" 
            value={formData.phone} 
            onChange={handleChange} 
            // flex-1 forces the input to take up all the remaining space
            // bg-transparent ensures it blends into the wrapper seamlessly
            className="flex-1 w-full px-3 py-3.5 bg-transparent border-0 focus:ring-0 outline-none text-gray-900 text-base placeholder-gray-400" 
            required 
          />
        </div>
      </div>

      {/* Message */}
      <div className="sm:col-span-2">
        <label htmlFor="message" className={labelClass}>Message</label>
        <textarea name="message" id="message" rows={4} placeholder="Leave us a message..." value={formData.message} onChange={handleChange} className={`${inputClass} resize-none`} required />
      </div>

      {/* Privacy Policy Checkbox */}
      <div className="sm:col-span-2 flex items-start gap-3 mt-1">
        <div className="flex h-6 items-center">
          <input type="checkbox" name="agreedToPolicy" id="agreedToPolicy" checked={formData.agreedToPolicy} onChange={handleChange} className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-600 cursor-pointer bg-white" required />
        </div>
        <label htmlFor="agreedToPolicy" className="text-sm sm:text-base text-gray-500 cursor-pointer">
          You agree to our friendly <a href="#" className="font-medium text-blue-600 underline underline-offset-4 hover:text-blue-700 transition-all">privacy policy</a>.
        </label>
      </div>
    </div>

    {/* Status Message */}
    {statusMessage && (
      <div className={`mt-4 text-sm font-medium ${statusMessage.includes("success") ? "text-green-600" : "text-red-600"}`}>
        {statusMessage}
      </div>
    )}

    {/* Submit Button */}
    <div className="mt-6">
      <button 
        type="submit" 
        disabled={isSubmitting}
        className="block w-full rounded-xl bg-blue-600 px-4 py-4 text-center text-base font-bold text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-600/30 transition-all active:scale-[0.98] shadow-lg shadow-blue-600/20 disabled:bg-blue-400 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Sending..." : "Send message"}
      </button>
    </div>
  </form>
</motion.div>

        </div>
        <motion.div
  initial={{ opacity: 0, y: 40 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
  className="mx-auto max-w-7xl w-full mt-50 z-10"
>
  {/* ✅ CHANGED: lg:grid-cols-3 instead of lg:grid-cols-2 */}
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10 items-stretch">
    
    {/* LEFT COLUMN: Contact Details (✅ lg:col-span-1 makes it take 33% width) */}
    <div className="lg:col-span-1 bg-white/40 backdrop-blur-xl rounded-3xl p-8 sm:p-10 shadow-2xl shadow-blue-900/5 border border-white/60 flex flex-col gap-8 divide-y divide-gray-200/50">
      
      {/* Phone */}
      <div className="flex flex-col items-center sm:items-start w-full pt-0">
        <div className="p-4 bg-white/60 backdrop-blur-md text-blue-600 rounded-2xl shadow-sm border border-white/50 mb-4 transition-transform hover:scale-105">
          <Phone size={24} />
        </div>
        <h4 className="text-xs font-bold uppercase tracking-widest text-blue-600/70 mb-2">Call Us</h4>
        <a href="tel:+919486188648" className="text-lg text-gray-800 font-semibold hover:text-blue-600 transition-colors">
          +91 94861 88648
        </a>
        <a href="tel:+917200286091" className="text-lg text-gray-800 font-semibold hover:text-blue-600 transition-colors mt-1">
          +91 72002 86091
        </a>
      </div>

      {/* Email */}
      <div className="flex flex-col items-center sm:items-start w-full pt-8">
        <div className="p-4 bg-white/60 backdrop-blur-md text-blue-600 rounded-2xl shadow-sm border border-white/50 mb-4 transition-transform hover:scale-105">
          <Mail size={24} />
        </div>
        <h4 className="text-xs font-bold uppercase tracking-widest text-blue-600/70 mb-2">Email Us</h4>
        <a href="mailto:infozenxit@gmail.com" className="text-lg text-gray-800 font-semibold hover:text-blue-600 transition-colors break-all">
          infozenxit@gmail.com
        </a>
      </div>

      {/* Location */}
      <div className="flex flex-col items-center sm:items-start w-full pt-8">
        <div className="p-4 bg-white/60 backdrop-blur-md text-blue-600 rounded-2xl shadow-sm border border-white/50 mb-4 transition-transform hover:scale-105">
          <MapPin size={24} />
        </div>
        <h4 className="text-xs font-bold uppercase tracking-widest text-blue-600/70 mb-2">Visit Us</h4>
        <p className="text-base text-gray-800 font-medium leading-relaxed text-center sm:text-left max-w-[250px] sm:mx-0">
          Upstair, Tower Jn, <br />
          Sivaraj Building 2nd Floor, <br />
          Rose Centre, Nagercoil, <br />
          Tamil Nadu 629001, India
        </p>
      </div>

    </div>

    {/* RIGHT COLUMN: Google Maps Embed (✅ lg:col-span-2 makes it take 66% width) */}
    <div className="lg:col-span-2 bg-white/40 backdrop-blur-xl rounded-3xl p-3 sm:p-4 shadow-2xl shadow-blue-900/5 border border-white/60 flex flex-col min-h-[400px] lg:min-h-full">
      <iframe
      title="G-TEC Education Nagercoil Location"
      src="https://maps.google.com/maps?q=G-TEC+Education,+Sivaraj+Building,+Nagercoil,+Tamil+Nadu&t=&z=16&ie=UTF8&iwloc=&output=embed"
      width="100%"
      height="100%"
      style={{ border: 0, borderRadius: "1.25rem" }}
      allowFullScreen=""
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      className="flex-1 w-full h-full shadow-inner"
    ></iframe>
    </div>

  </div>
</motion.div>
      </div>
    </AnimatePresence>
  );
}
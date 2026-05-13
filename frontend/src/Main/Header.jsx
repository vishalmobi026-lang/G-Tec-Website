import React, { useState, useEffect } from "react";
import { Info, Phone, Users, MapPin, BookOpen, MessageCircleQuestionMark, ChevronDown, LayoutGrid, 
  User, Settings, LogOut, Menu, X, Gamepad2, Trophy, MessageSquareDot } from "lucide-react";
import { Link } from "react-router-dom";

export default function HeaderSection() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [courseCategories, setCourseCategories] = useState([]);
  
  // State to control the mobile menu
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    setIsAdmin(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    window.location.href = "/"; // Redirect to home
  };


  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false);
        setIsMobileMenuOpen(false); 
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    setIsAdmin(!!token);

    // 2. Fetch categories from your backend
    fetch("http://localhost:5000/api/categories")
      .then(res => res.json())
      .then(data => {
        // ✅ SAFETY CHECK: Only save it if it's an actual array list
        if (Array.isArray(data)) {
          setCourseCategories(data);
        } else {
          setCourseCategories([]); // Prevent .map crashes
        }
      })
      .catch(err => {
        console.error("Failed to fetch categories for header", err);
        setCourseCategories([]); // Fallback to empty array on error
      });
  }, []);

  return (
    <>
      <header
        className={`fixed w-full top-0 z-100 bg-blue-900/95 backdrop-blur-md border-b border-white/10 transition-transform duration-500 ease-in-out ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="max-w-362.5 mx-auto px-4 lg:px-8 h-28 flex items-center justify-between">
          
          {/* Logo Section - Preserved exactly as requested */}
          <Link to="/" className="flex items-center gap-3 cursor-pointer shrink-0" onClick={() => setIsMobileMenuOpen(false)}>
            <img
              src="/logo1.webp"
              alt="G-Tech Logo"
              className="h-24 w-auto object-contain"
            />
            <div className="flex text-white mt-1">
              <MapPin size={22} className="mr-1" />
              <span className="text-xl font-light tracking-tight border-l border-white/20 pl-3">
                Nagercoil
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-7 whitespace-nowrap">
            <div className="relative group flex items-center h-28">
  <Link 
    to="/courses" 
    className="flex items-center gap-1.5 text-[15px] xl:text-[16px] font-semibold text-white hover:text-blue-300 transition-colors cursor-pointer"
  >
    <LayoutGrid size={18} />
    Courses
    <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
  </Link>

  {/* Dynamic Dropdown Menu (Matched to Admin Style) */}
  <div className="absolute top-[80%] left-1/2 -translate-x-1/2 w-[280px] bg-white rounded-b-2xl shadow-2xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-0 overflow-hidden z-[110]">
    <div className="p-2 flex flex-col gap-1">
      {courseCategories.length > 0 ? (
        courseCategories.map((category) => (
          <Link 
            key={category._id} 
            to={`/courses/${category.slug}`} 
            className="group/item flex flex-col p-3 rounded-xl hover:bg-blue-50 transition-colors"
          >
            <span className="flex items-center gap-2 text-sm font-bold text-gray-900 group-hover/item:text-blue-600 transition-colors">
              <BookOpen size={16} /> {category.name}
            </span>
            <span className="text-[10px] font-medium text-gray-400 mt-0.5 ml-6 leading-tight">
              {category.description}
            </span>
          </Link>
        ))
      ) : (
        <p className="text-gray-400 text-xs font-medium p-3 text-center">Loading categories...</p>
      )}
    </div>
  </div>
</div>

            {/* FIXED ADMIN SECTION: Collapsed into a single modern Dropdown */}
            {isAdmin && (
              <div className="relative group flex items-center h-28 border-x border-white/10 px-4 xl:px-6">
                <button className="flex items-center gap-1.5 text-[15px] xl:text-[16px] font-bold text-yellow-400 hover:text-yellow-300 whitespace-nowrap cursor-pointer transition-colors">
                  <Settings size={18} /> 
                  Admin Panel
                  <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
                </button>
                
                {/* Admin Dropdown Menu */}
                <div className="absolute top-[80%] left-1/2 -translate-x-1/2 w-[280px] bg-white rounded-b-2xl shadow-2xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-0 overflow-hidden z-110">
                  <div className="p-2 flex flex-col gap-1">
                    <Link to="/admin/enrollment-log" className="group/item flex flex-col p-3 rounded-xl hover:bg-blue-50 transition-colors">
                      <span className="flex items-center gap-2 text-sm font-bold text-gray-900 group-hover/item:text-blue-600 transition-colors">
                        <BookOpen size={16} /> Enrollment Log
                      </span>
                      <span className="text-[10px] font-medium text-gray-400 mt-0.5 ml-6 leading-tight">Master database of all applications</span>
                    </Link>
                    
                    <Link to="/admin/students" className="group/item flex flex-col p-3 rounded-xl hover:bg-yellow-50 transition-colors">
                      <span className="flex items-center gap-2 text-sm font-bold text-gray-900 group-hover/item:text-yellow-600 transition-colors">
                        <Users size={16} /> Manage Students
                      </span>
                      <span className="text-[10px] font-medium text-gray-400 mt-0.5 ml-6 leading-tight">Active workspace to edit records</span>
                    </Link>
                    
                    <div className="border-t border-gray-100 my-1"></div>

                    <Link to="/admin/contact-us" className="group/item flex items-center gap-2 p-3 rounded-xl hover:bg-green-50 transition-colors">
                      <MessageSquareDot size={16} className="text-gray-900 group-hover/item:text-pink-600 transition-colors" />
                      <span className="text-sm font-bold text-gray-900 group-hover/item:text-pink-600 transition-colors">ContactUs Box</span>
                    </Link>
                    
                    <Link to="/admin/courses" className="group/item flex items-center gap-2 p-3 rounded-xl hover:bg-green-50 transition-colors">
                      <LayoutGrid size={16} className="text-gray-900 group-hover/item:text-green-600 transition-colors" />
                      <span className="text-sm font-bold text-gray-900 group-hover/item:text-green-600 transition-colors">Web Updater</span>
                    </Link>
                    
                    <Link to="/admin/enquiry" className="group/item flex items-center gap-2 p-3 rounded-xl hover:bg-purple-50 transition-colors">
                      <MessageCircleQuestionMark size={16} className="text-gray-900 group-hover/item:text-purple-600 transition-colors" />
                      <span className="text-sm font-bold text-gray-900 group-hover/item:text-purple-600 transition-colors">Enquiry Inbox</span>
                    </Link>

                    <Link to="/admin/decoder" className="group/item flex items-center gap-2 p-3 rounded-xl hover:bg-orange-50 transition-colors">
                      <Gamepad2 size={16} className="text-gray-900 group-hover/item:text-orange-600 transition-colors" />
                      <span className="text-sm font-bold text-gray-900 group-hover/item:text-orange-600 transition-colors">Coupon Decoder</span>
                    </Link>

                    {/* NEW GAME CONTESTANTS LINK */}
                    <Link to="/admin/contestants" className="group/item flex items-center gap-2 p-3 rounded-xl hover:bg-rose-50 transition-colors">
                      <Trophy size={16} className="text-gray-900 group-hover/item:text-rose-600 transition-colors" />
                      <span className="text-sm font-bold text-gray-900 group-hover/item:text-rose-600 transition-colors">Game Contestants</span>
                    </Link>
                  </div>
                </div>
              </div>
            )}
            
            <Link to="/about" className="flex items-center gap-1.5 text-[15px] xl:text-[16px] font-semibold text-white hover:text-blue-300 transition-colors whitespace-nowrap">
              <Info size={18} /> About
            </Link>
            
            <Link to="/contact" className="flex items-center gap-1.5 text-[15px] xl:text-[16px] font-semibold text-white hover:text-blue-300 transition-colors whitespace-nowrap">
              <Phone size={18} /> Contact
            </Link>
          </nav>

          {/* Desktop Right Action Buttons */}
          <div className="hidden lg:flex items-center gap-4 xl:gap-6 shrink-0">

            {isAdmin ? (
              <button
  onClick={handleLogout}
  className="group relative flex items-center justify-start w-[50px] h-[50px] border-none rounded-full cursor-pointer overflow-hidden transition-all duration-400 shadow-[2px_2px_10px_rgba(0,0,0,0.2)] bg-gradient-to-r from-[#3498db] to-[#e74c3c] hover:w-[150px] hover:rounded-[20px] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
>
  {/* The Sign (Icon Container) */}
  <div className="flex items-center justify-center w-full transition-all duration-400 group-hover:w-[30%] group-hover:pl-3">
    <LogOut size={17} className="text-white" />
  </div>

  {/* The Text */}
  <div className="absolute right-0 opacity-0 text-[#ecf0f1] text-[1.2em] font-semibold transition-all duration-400 group-hover:opacity-100 group-hover:w-[70%] group-hover:pr-2 whitespace-nowrap">
    Logout
  </div>
</button>
            ) : (
              <Link to="/login" className="flex items-center gap-2 text-[15px] xl:text-[16px] font-bold text-white hover:text-blue-300 transition-colors whitespace-nowrap">
                <User size={20} /> Login
              </Link>
            )}
            
            <Link 
              to="/enroll" 
              className="relative group overflow-hidden flex items-center gap-2 bg-white text-blue-900 px-10 py-3.5 rounded-full text-base xl:text-lg font-black transition-all duration-300 whitespace-nowrap shadow-md hover:shadow-blue-500/20"
            >
              <div className="absolute group-hover:-top-1 group-hover:-right-2 z-0 w-16 h-16 rounded-full group-hover:scale-150 duration-700 right-12 top-12 bg-yellow-400/40"></div>
              <div className="absolute group-hover:-top-1 group-hover:-right-2 z-0 w-12 h-12 rounded-full group-hover:scale-150 duration-700 right-20 -top-6 bg-orange-400/40"></div>
              <div className="absolute group-hover:-top-1 group-hover:-right-2 z-0 w-8 h-8 rounded-full group-hover:scale-150 duration-700 right-32 top-6 bg-pink-400/40"></div>
              <span className="relative z-10">Enroll Now</span>
            </Link>
          </div>

          {/* Mobile Hamburger Menu Toggle */}
          <button 
            className="lg:hidden text-white p-2 hover:text-blue-300 transition-colors shrink-0"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={32} /> : <Menu size={32} />}
          </button>

        </div>

        {/* Mobile Dropdown Menu */}
        <div 
          className={`lg:hidden absolute top-28 left-0 w-full bg-blue-900/98 backdrop-blur-xl border-t border-white/10 transition-all duration-300 ease-in-out shadow-2xl ${
            isMobileMenuOpen ? "max-h-[85vh] opacity-100 visible overflow-y-auto" : "max-h-0 opacity-0 invisible overflow-hidden"
          }`}
        >
          <div className="flex flex-col p-6 gap-6">
            
            <Link to="/courses" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-lg font-semibold text-white">
              <LayoutGrid size={22} className="text-blue-300" /> Courses
            </Link>
            
            <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-lg font-semibold text-white">
              <Info size={22} className="text-blue-300" /> About
            </Link>
            
            <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-lg font-semibold text-white">
              <Phone size={22} className="text-blue-300" /> Contact
            </Link>

            {isAdmin && (
              <div className="flex flex-col gap-5 pt-5 border-t border-white/10">
                <span className="text-xs font-bold text-yellow-400 uppercase tracking-wider">Admin Panel</span>
                <Link to="/admin/enrollment-log" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-lg font-semibold text-white">
                  <BookOpen size={22} className="text-yellow-400" /> Enrollment Log
                </Link>
                <Link to="/admin/students" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-lg font-semibold text-white">
                  <Users size={22} className="text-yellow-400" /> Manage Students
                </Link>
                <Link to="/admin/courses" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-lg font-semibold text-white">
                  <LayoutGrid size={22} className="text-yellow-400" /> Web Updater
                </Link>
                <Link to="/admin/enquiry" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-lg font-semibold text-white">
                  <MessageCircleQuestionMark size={22} className="text-yellow-400" /> Enquiry
                </Link>
                <Link to="/admin/decoder" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-lg font-semibold text-white">
                  <Gamepad2 size={22} className="text-yellow-400" /> Coupon Decoder
                </Link>
                
                {/* NEW GAME CONTESTANTS LINK MOBILE */}
                <Link to="/admin/contestants" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-lg font-semibold text-white">
                  <Trophy size={22} className="text-yellow-400" /> Game Contestants
                </Link>
              </div>
            )}

            {/* Mobile Action Buttons */}
            <div className="flex flex-col gap-4 mt-2 pt-6 border-t border-white/10">

              {isAdmin ? (
                <button 
                  onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                  className="flex items-center justify-center gap-2 bg-red-500/10 text-red-500 px-5 py-3.5 rounded-xl text-base font-bold border border-red-500/20"
                >
                  <LogOut size={20}/> Logout
                </button>
              ) : (
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center gap-2 bg-white/5 text-white px-5 py-3.5 rounded-xl text-base font-bold border border-white/10">
                  <User size={20} /> Login
                </Link>
              )}
              
              <Link 
                to="/enroll" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 bg-white text-blue-900 px-5 py-3.5 rounded-xl text-lg font-black shadow-lg"
              >
                Enroll Now
              </Link>
            </div>

          </div>
        </div>
      </header>
    </>
  );
}
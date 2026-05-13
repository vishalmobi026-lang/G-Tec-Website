import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import "./App.css";
import Preloader from "./PreLoader";

import HeaderSection from "./Main/Header";
import HomeSection from "./HomeComponents/HomeSection";
import FooterSection from "./Main/Footer";
import EnrollmentForm from "./Enrollment/EnrollmentForm";
import AboutSection from "./AboutUsComponents/Aboutus";
import Course from "./Course/Course"
import ContactUs from "./ContactUs/ContactUs";
import Chatbot from "./Chatbot/Chatbot";
import GameLauncherWidget from "./GameSection/GameLauncherWidget";
import CourseCategoryPage from "./CoursesSection/CourseCategoryPage";

import LoginPage from "./LoginPage";
import StudentsTab from "./StudentsDetails/StudentsTab";
import StudentsEnrollment from "./StudentsDetails/StudentsEnrollment";
import WebUpdater from "./StudentsDetails/WebUpdater";
import ScoreListener from "./Score/ScoreListener";
import EnquiryTab from "./Enrollment/EnquiryTab";
import AdminInquiries from "./ContactUs/ContactUsViewer";

import NeonStrikeGame from "./GameSection/NeonStrikeGame"; 
import AdminCouponDecoder from "./GameSection/AdminCouponDecoder";

function AppContent() {
  const location = useLocation();
  const [isPageLoading, setIsPageLoading] = useState(false);

  useEffect(() => {
    setIsPageLoading(true);
    window.scrollTo(0, 0);
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Check if we are on the game page (optional: hide header/footer there if needed)
  const isGamePage = location.pathname === "/game";

  return (
    /* THE FIX: Use a flex column with min-h-screen. 
       This ensures the Footer stays at the bottom even on short pages.
    */
    <div className="flex flex-col min-h-screen bg-zinc-950">
      <AnimatePresence>
        {isPageLoading && <Preloader />}
      </AnimatePresence>

      {!isGamePage && <HeaderSection />}

      {/* THE FIX: 'flex-1' grows to fill space, 'pt-28' (or your header height) 
          prevents content from going under the fixed header.
      */}
      <main className={`flex-1 ${!isGamePage ? "pt-24 md:pt-28" : ""}`}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/game" element={<NeonStrikeGame />} />
            <Route path="/" element={<HomeSection />} />
            <Route path="/about" element={<AboutSection />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/courses" element={<Course />} />
            <Route path="/courses/:categorySlug" element={<CourseCategoryPage />} />
            <Route path="/enroll" element={<EnrollmentForm />} />
            <Route path="/login" element={<LoginPage />} />
            
            {/* Admin Routes - These will now have the Header/Footer visible */}
            <Route path="/admin/students" element={<StudentsTab />} />
            <Route path="/admin/enrollment-log" element={<StudentsEnrollment />} />
            <Route path="/admin/courses" element={<WebUpdater />} />
            <Route path="/admin/enquiry" element={<EnquiryTab />} />
            <Route path="/admin/contestants" element={<ScoreListener />} />
            <Route path="/admin/decoder" element={<AdminCouponDecoder />} />
            <Route path="/admin/contact-us" element={<AdminInquiries />} />
          </Routes>
        </AnimatePresence>
      </main>
      
      {!isGamePage && (
        <>
          <Chatbot />
          <GameLauncherWidget />
          <FooterSection />
        </>
      )}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
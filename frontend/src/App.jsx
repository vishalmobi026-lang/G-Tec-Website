import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion"; // Added missing import
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

  return (
    <>
      <AnimatePresence>
        {isPageLoading && <Preloader />}
      </AnimatePresence>

      <HeaderSection />

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
          <Route path="/admin/students" element={<StudentsTab />} />
          <Route path="/admin/enrollment-log" element={<StudentsEnrollment />} />
          <Route path="/admin/courses" element={<WebUpdater />} />
          <Route path="/admin/enquiry" element={<EnquiryTab />} />
          <Route path="/admin/contestants" element={<ScoreListener />} />
          <Route path="/admin/decoder" element={<AdminCouponDecoder />} />
          <Route path="/admin/contact-us" element={<AdminInquiries />} />
        </Routes>
      </AnimatePresence>
      
      <Chatbot />
      <GameLauncherWidget />
      <FooterSection />
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
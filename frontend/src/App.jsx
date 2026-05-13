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

  // ✅ Step 1: Define which pages should NOT show the public Header/Footer
  // This checks if the path starts with /admin or is exactly /login
  const isHideLayout = location.pathname.startsWith("/admin") || location.pathname === "/login";

  return (
    <>
      <AnimatePresence>
        {isPageLoading && <Preloader />}
      </AnimatePresence>

      {/* ✅ Step 2: Only show Header if NOT an admin/login route */}
      {!isHideLayout && <HeaderSection />}

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
          
          {/* Admin Routes */}
          <Route path="/admin/students" element={<StudentsTab />} />
          <Route path="/admin/enrollment-log" element={<StudentsEnrollment />} />
          <Route path="/admin/courses" element={<WebUpdater />} />
          <Route path="/admin/enquiry" element={<EnquiryTab />} />
          <Route path="/admin/contestants" element={<ScoreListener />} />
          <Route path="/admin/decoder" element={<AdminCouponDecoder />} />
          <Route path="/admin/contact-us" element={<AdminInquiries />} />
        </Routes>
      </AnimatePresence>
      
      {/* ✅ Step 3: Only show Widgets and Footer if NOT an admin/login route */}
      {!isHideLayout && (
        <>
          <Chatbot />
          <GameLauncherWidget />
          <FooterSection />
        </>
      )}
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
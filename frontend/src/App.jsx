import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useEffect } from "react";
import "./App.css";

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

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <Router>
      <ScrollToTop />

      <HeaderSection />

      <Routes>
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
      
      <Chatbot />
      <GameLauncherWidget />
      <FooterSection />
    </Router>
  );
}

export default App;
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
  useNavigate,
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
import Course from "./Course/Course";
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

function ProtectedRoute({
  isAdminLoggedIn,
  children,
}) {
  if (!isAdminLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function AppContent() {
  const location = useLocation();

  const navigate = useNavigate();

  const [isPageLoading, setIsPageLoading] =
    useState(false);

  const [isAdminLoggedIn, setIsAdminLoggedIn] =
    useState(
      !!localStorage.getItem("adminToken")
    );

  const isAdminRoute =
    location.pathname.startsWith("/admin");

  // ✅ Handle page loader
  useEffect(() => {
    if (isAdminRoute) {
      setIsPageLoading(false);
      return;
    }

    setIsPageLoading(true);

    window.scrollTo(0, 0);

    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 700);

    return () => clearTimeout(timer);
  }, [location.pathname, isAdminRoute]);

  // ✅ Auto redirect logged-in admin away from login
  useEffect(() => {
    if (
      isAdminLoggedIn &&
      location.pathname === "/login"
    ) {
      navigate("/admin/students", {
        replace: true,
      });
    }
  }, [
    isAdminLoggedIn,
    location.pathname,
    navigate,
  ]);

  const handleAdminLogin = () => {
    setIsAdminLoggedIn(true);

    navigate("/admin/students", {
      replace: true,
    });
  };

  return (
    <>
      {/* Loader */}
      <AnimatePresence>
        {isPageLoading && <Preloader />}
      </AnimatePresence>

      {/* Public Header */}
      {!isAdminRoute && <HeaderSection />}

      <AnimatePresence mode="wait">
        <Routes
          location={location}
          key={location.pathname}
        >
          {/* Public */}
          <Route
            path="/"
            element={<HomeSection />}
          />

          <Route
            path="/about"
            element={<AboutSection />}
          />

          <Route
            path="/contact"
            element={<ContactUs />}
          />

          <Route
            path="/courses"
            element={<Course />}
          />

          <Route
            path="/courses/:categorySlug"
            element={<CourseCategoryPage />}
          />

          <Route
            path="/enroll"
            element={<EnrollmentForm />}
          />

          <Route
            path="/game"
            element={<NeonStrikeGame />}
          />

          {/* Login */}
          <Route
            path="/login"
            element={
              <LoginPage
                onLoginSuccess={
                  handleAdminLogin
                }
              />
            }
          />

          {/* Protected Admin Routes */}

          <Route
            path="/admin/students"
            element={
              <ProtectedRoute
                isAdminLoggedIn={
                  isAdminLoggedIn
                }
              >
                <StudentsTab />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/enrollment-log"
            element={
              <ProtectedRoute
                isAdminLoggedIn={
                  isAdminLoggedIn
                }
              >
                <StudentsEnrollment />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/courses"
            element={
              <ProtectedRoute
                isAdminLoggedIn={
                  isAdminLoggedIn
                }
              >
                <WebUpdater />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/enquiry"
            element={
              <ProtectedRoute
                isAdminLoggedIn={
                  isAdminLoggedIn
                }
              >
                <EnquiryTab />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/contestants"
            element={
              <ProtectedRoute
                isAdminLoggedIn={
                  isAdminLoggedIn
                }
              >
                <ScoreListener />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/decoder"
            element={
              <ProtectedRoute
                isAdminLoggedIn={
                  isAdminLoggedIn
                }
              >
                <AdminCouponDecoder />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/contact-us"
            element={
              <ProtectedRoute
                isAdminLoggedIn={
                  isAdminLoggedIn
                }
              >
                <AdminInquiries />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AnimatePresence>

      {/* Public Footer */}
      {!isAdminRoute && (
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
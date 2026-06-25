import React, { useState, useEffect } from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Components
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import StudentDashboard from "./pages/StudentDashboard";
import PredictionForm from "./pages/PredictionForm";
import SkillGap from "./pages/SkillGap";
import CompanyRecommendations from "./pages/CompanyRecommendations";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import SalaryPrediction from "./pages/SalaryPrediction";
import LearningRoadmap from "./pages/LearningRoadmap";
import StudentRanking from "./pages/StudentRanking";
import AIChatbot from "./pages/AIChatbot";
import AdminDashboard from "./pages/AdminDashboard";
import Reports from "./pages/Reports";
import InterviewSimulator from "./pages/InterviewSimulator";
import MyProfile from "./pages/MyProfile";

export default function App() {
  const [activeStudent, setActiveStudent] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const [isSessionLoading, setIsSessionLoading] = useState(true);

  // Sync / load student profile from database
  const fetchStudentProfile = async (regNo) => {
    if (!regNo) return;
    try {
      const res = await fetch(`http://localhost:8000/api/students/${regNo}`);
      if (res.ok) {
        const data = await res.json();
        setActiveStudent(data);
      } else {
        setActiveStudent(null);
      }
    } catch (err) {
      console.log("Could not load student profile: backend unreachable.");
      setActiveStudent(null);
    }
  };

  // Restore session on mount
  useEffect(() => {
    const verifySession = async () => {
      const savedToken = localStorage.getItem("jwt_token");
      const savedUser = localStorage.getItem("user_profile");
      
      if (savedToken && savedUser) {
        try {
          const res = await fetch("http://localhost:8000/api/verify-token", {
            headers: { "Authorization": `Bearer ${savedToken}` }
          });
          
          if (res.ok) {
            const parsedUser = JSON.parse(savedUser);
            setToken(savedToken);
            setUser(parsedUser);
            setIsAuthenticated(true);
            fetchStudentProfile(parsedUser.register_number);
          } else {
            handleLogout();
          }
        } catch (e) {
          // Offline local backup fallback
          const parsedUser = JSON.parse(savedUser);
          setToken(savedToken);
          setUser(parsedUser);
          setIsAuthenticated(true);
          fetchStudentProfile(parsedUser.register_number);
        }
      }
      setIsSessionLoading(false);
    };
    verifySession();
  }, []);

  const handleLogin = (jwtToken, userProfile) => {
    setIsAuthenticated(true);
    setToken(jwtToken);
    setUser(userProfile);
    localStorage.setItem("is_auth", "true");
    localStorage.setItem("jwt_token", jwtToken);
    localStorage.setItem("user_profile", JSON.stringify(userProfile));
    
    // Auto load student details
    fetchStudentProfile(userProfile.register_number);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setToken("");
    setUser(null);
    setActiveStudent(null);
    localStorage.removeItem("is_auth");
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("user_profile");
  };

  const handleUpdateUser = (updatedProfile) => {
    setUser(updatedProfile);
    localStorage.setItem("user_profile", JSON.stringify(updatedProfile));
  };

  const handleSearchStudent = async (regNo) => {
    try {
      const res = await fetch(`http://localhost:8000/api/students/${regNo}`);
      if (!res.ok) {
        alert("Student profile not found. Please verify the registration number or submit the prediction form.");
        return;
      }
      const data = await res.json();
      setActiveStudent(data);
    } catch (err) {
      console.error(err);
      alert("Failed to connect to the backend server. Please verify it is running.");
    }
  };

  const handleSelectStudent = async (student) => {
    if (!student) return;
    try {
      const res = await fetch(`http://localhost:8000/api/students/${student.register_no}`);
      if (res.ok) {
        const fullStudent = await res.json();
        setActiveStudent(fullStudent);
      } else {
        const parsed = { ...student };
        const jsonFields = ["weak_areas", "learning_roadmap", "recommended_companies", "resume_missing_skills", "resume_missing_keywords", "resume_strengths", "resume_weaknesses", "resume_suggestions"];
        jsonFields.forEach(field => {
          if (typeof parsed[field] === "string") {
            try {
              parsed[field] = JSON.parse(parsed[field]);
            } catch (e) {
              parsed[field] = [];
            }
          }
        });
        setActiveStudent(parsed);
      }
    } catch (err) {
      const parsed = { ...student };
      const jsonFields = ["weak_areas", "learning_roadmap", "recommended_companies", "resume_missing_skills", "resume_missing_keywords", "resume_strengths", "resume_weaknesses", "resume_suggestions"];
      jsonFields.forEach(field => {
        if (typeof parsed[field] === "string") {
          try {
            parsed[field] = JSON.parse(parsed[field]);
          } catch (e) {
            parsed[field] = [];
          }
        }
      });
      setActiveStudent(parsed);
    }
  };

  const handleClearStudent = () => {
    setActiveStudent(null);
  };

  if (isSessionLoading) {
    return (
      <div className="min-h-screen w-screen bg-[#070a13] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-violet-500 animate-spin" />
        <p className="text-xs text-gray-400 font-semibold tracking-wider uppercase">Verifying User Session...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen flex bg-[#0b0f19] text-[#f3f4f6] overflow-x-hidden">
        {/* Sidebar Nav */}
        {isAuthenticated && (
          <Sidebar 
            user={user}
            activeStudent={activeStudent} 
            onSearchStudent={handleSearchStudent} 
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            onLogout={handleLogout}
          />
        )}

        {/* Mobile Sidebar Overlay */}
        {isAuthenticated && isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden transition-all duration-300"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Workspace Area */}
        <div className={`flex-1 flex flex-col min-h-screen relative w-full overflow-x-hidden ${
          isAuthenticated ? "md:pl-68" : ""
        }`}>
          
          {/* Top Navbar */}
          <Navbar 
            user={user}
            activeStudent={activeStudent} 
            onClearStudent={handleClearStudent} 
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          />

          {/* Page Routing */}
          <main className="flex-1 relative z-10">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage onLogin={handleLogin} />} />
              <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />} />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={isAuthenticated ? <StudentDashboard student={activeStudent} /> : <Navigate to="/login" replace />} />
              <Route path="/predict-form" element={isAuthenticated ? <PredictionForm user={user} onPredictSuccess={handleSelectStudent} /> : <Navigate to="/login" replace />} />
              <Route path="/skill-gap" element={isAuthenticated ? <SkillGap student={activeStudent} /> : <Navigate to="/login" replace />} />
              <Route path="/companies" element={isAuthenticated ? <CompanyRecommendations student={activeStudent} /> : <Navigate to="/login" replace />} />
              
              <Route 
                path="/resume-analyzer" 
                element={
                  isAuthenticated ? (
                    <ResumeAnalyzer 
                      student={activeStudent} 
                      onResumeAnalyzeSuccess={handleSelectStudent} 
                    />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                } 
              />
              
              <Route 
                path="/interview" 
                element={
                  isAuthenticated ? (
                    <InterviewSimulator 
                      student={activeStudent} 
                      onInterviewSuccess={handleSelectStudent} 
                    />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                } 
              />
              <Route path="/salary-prediction" element={isAuthenticated ? <SalaryPrediction student={activeStudent} /> : <Navigate to="/login" replace />} />
              <Route path="/roadmap" element={isAuthenticated ? <LearningRoadmap student={activeStudent} /> : <Navigate to="/login" replace />} />
              <Route path="/ranking" element={isAuthenticated ? <StudentRanking onSelectStudent={handleSelectStudent} /> : <Navigate to="/login" replace />} />
              <Route path="/chatbot" element={isAuthenticated ? <AIChatbot student={activeStudent} /> : <Navigate to="/login" replace />} />
              <Route path="/admin" element={isAuthenticated ? <AdminDashboard onSelectStudent={handleSelectStudent} /> : <Navigate to="/login" replace />} />
              <Route path="/reports" element={isAuthenticated ? <Reports student={activeStudent} /> : <Navigate to="/login" replace />} />
              <Route path="/profile" element={isAuthenticated ? <MyProfile user={user} token={token} onUpdateUser={handleUpdateUser} /> : <Navigate to="/login" replace />} />
              
              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Footer Component */}
          <Footer />
        </div>
      </div>
    </Router>
  );
}

// Simple loader helper inside file to avoid missing exports
const Loader2 = ({ className }) => (
  <svg
    className={`animate-spin ${className}`}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

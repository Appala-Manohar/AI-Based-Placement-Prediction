import React, { useState, useEffect } from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Components
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

// Pages
import LandingPage from "./pages/LandingPage";
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

const MOCK_DEMO_STUDENT = {
  student_name: "Aniket Sharma",
  register_no: "REG2026000",
  department: "Computer Science",
  gender: "Male",
  tenth_percentage: 89.5,
  twelfth_percentage: 86.4,
  cgpa: 8.75,
  backlogs: 0,
  programming_skills: 85,
  aptitude_score: 80,
  communication_skills: 82,
  technical_skills: 84,
  projects: 3,
  internship: "Yes",
  certifications: 2,
  hackathons: 1,
  resume_uploaded: "Yes",
  mock_interview_score: 85,
  placed: 1,
  probability: 0.94,
  readiness_score: 88,
  salary_low: 7.2,
  salary_avg: 9.5,
  salary_high: 12.4,
  prediction_reason: "Excellent academic track record (CGPA) | Strong technical & programming skills | Valuable hands-on internship experience",
  weak_areas: [],
  learning_roadmap: [
    { week: "Week 1", focus: "Advanced Coding", tasks: ["Solve medium/hard questions on LeetCode.", "Review system design concepts."] },
    { week: "Week 2", focus: "Company Prep", tasks: ["Research target companies (Google, Microsoft, Amazon).", "Solve company-specific past interview papers."] },
    { week: "Week 3", focus: "Mock Interviews", tasks: ["Do mock coding interviews on Pramp.", "Fine-tune resume details."] },
    { week: "Week 4", focus: "Application Drive", tasks: ["Connect with alumni for referrals.", "Apply for developer/analyst roles."] }
  ],
  recommended_companies: [
    { name: "Google", skills: "Data Structures, Algorithms, System Design", package: "₹15 - ₹35 LPA", tier: "Dream", match: 92 },
    { name: "Microsoft", skills: "C++, C#, Coding, OOPs, Problem Solving", package: "₹12 - ₹25 LPA", tier: "Dream", match: 94 },
    { name: "Amazon", skills: "Data Structures, System Design, Leadership Principles", package: "₹14 - ₹28 LPA", tier: "Dream", match: 88 },
    { name: "Accenture (Premium/ASE)", skills: "Analytical Thinking, Coding, Java, Python", package: "₹6.5 - ₹12 LPA", tier: "Dream", match: 95 }
  ],
  resume_score: 85,
  resume_missing_skills: ["System Design"],
  resume_missing_keywords: ["Kubernetes", "AWS"],
  resume_strengths: ["Strong programming languages", "Multiple personal projects listed", "Detailed internship description"],
  resume_weaknesses: ["Missing cloud architecture exposure"],
  resume_suggestions: ["Add Cloud/AWS hosting details to your projects section", "List system design coursework"]
};

export default function App() {
  const [activeStudent, setActiveStudent] = useState(MOCK_DEMO_STUDENT);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Automatically attempt to load a seeded student on mount for demonstration purposes
  useEffect(() => {
    const loadDemoStudent = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/students/REG2026000");
        if (res.ok) {
          const data = await res.json();
          setActiveStudent(data);
        }
      } catch (err) {
        console.log("Using local mock student fallback (backend db not seeded yet).");
      }
    };
    loadDemoStudent();
  }, []);

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
    setActiveStudent(MOCK_DEMO_STUDENT); // Fallback to demo student to avoid locks
  };

  return (
    <Router>
      <div className="min-h-screen flex bg-[#0b0f19] text-[#f3f4f6] overflow-x-hidden">
        {/* Sidebar Nav */}
        <Sidebar 
          activeStudent={activeStudent} 
          onSearchStudent={handleSearchStudent} 
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden transition-all duration-300"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Workspace Area */}
        <div className="flex-1 flex flex-col md:pl-68 min-h-screen relative w-full overflow-x-hidden">
          
          {/* Top Navbar */}
          <Navbar 
            activeStudent={activeStudent} 
            onClearStudent={handleClearStudent} 
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          />

          {/* Page Routing */}
          <main className="flex-1 relative z-10">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/dashboard" element={<StudentDashboard student={activeStudent} />} />
              <Route path="/predict-form" element={<PredictionForm onPredictSuccess={handleSelectStudent} />} />
              <Route path="/skill-gap" element={<SkillGap student={activeStudent} />} />
              <Route path="/companies" element={<CompanyRecommendations student={activeStudent} />} />
              
              <Route 
                path="/resume-analyzer" 
                element={
                  <ResumeAnalyzer 
                    student={activeStudent} 
                    onResumeAnalyzeSuccess={handleSelectStudent} 
                  />
                } 
              />
              
              <Route 
                path="/interview" 
                element={
                  <InterviewSimulator 
                    student={activeStudent} 
                    onInterviewSuccess={handleSelectStudent} 
                  />
                } 
              />
              <Route path="/salary-prediction" element={<SalaryPrediction student={activeStudent} />} />
              <Route path="/roadmap" element={<LearningRoadmap student={activeStudent} />} />
              <Route path="/ranking" element={<StudentRanking onSelectStudent={handleSelectStudent} />} />
              <Route path="/chatbot" element={<AIChatbot student={activeStudent} />} />
              <Route path="/admin" element={<AdminDashboard onSelectStudent={handleSelectStudent} />} />
              <Route path="/reports" element={<Reports student={activeStudent} />} />
              
              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

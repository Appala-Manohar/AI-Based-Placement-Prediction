import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  LayoutDashboard, 
  FileSpreadsheet, 
  Activity, 
  Building2, 
  FileCheck2, 
  IndianRupee, 
  Map, 
  Trophy, 
  MessageSquare, 
  ShieldAlert, 
  FileText,
  UserCheck,
  Mic
} from "lucide-react";

export default function Sidebar({ activeStudent, onSearchStudent, isOpen, onClose }) {
  const location = useLocation();
  const [searchReg, setSearchReg] = React.useState("");

  const menuItems = [
    { path: "/", label: "Landing Page", icon: Home },
    { path: "/dashboard", label: "Student Dashboard", icon: LayoutDashboard, requiresStudent: true },
    { path: "/predict-form", label: "Prediction Form", icon: FileSpreadsheet },
    { path: "/skill-gap", label: "Skill Gap Analysis", icon: Activity, requiresStudent: true },
    { path: "/companies", label: "Company Recommender", icon: Building2, requiresStudent: true },
    { path: "/resume-analyzer", label: "Resume Analyzer", icon: FileCheck2, requiresStudent: true },
    { path: "/interview", label: "AI Interview Simulator", icon: Mic, requiresStudent: true },
    { path: "/salary-prediction", label: "Salary Prediction", icon: IndianRupee, requiresStudent: true },
    { path: "/roadmap", label: "Learning Roadmap", icon: Map, requiresStudent: true },
    { path: "/ranking", label: "Student Ranking", icon: Trophy },
    { path: "/chatbot", label: "AI Career Chatbot", icon: MessageSquare },
    { path: "/admin", label: "Admin Portal", icon: ShieldAlert },
    { path: "/reports", label: "Student Report", icon: FileText, requiresStudent: true },
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchReg.trim()) {
      onSearchStudent(searchReg.trim());
      if (onClose) onClose(); // Auto-close on mobile when student is searched/loaded
    }
  };

  return (
    <aside className={`w-68 min-h-screen fixed left-0 top-0 glass-sidebar z-40 flex flex-col p-4 transition-transform duration-300 md:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
      {/* Title */}
      <div className="py-4 px-2 mb-4 border-b border-white/5">
        <h1 className="text-xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
          AI Placement
        </h1>
        <p className="text-[10px] text-gray-400 font-medium tracking-widest uppercase">
          Prediction System
        </p>
      </div>

      {/* Active Student Search / Profile Card */}
      <div className="mb-6 px-2">
        {activeStudent ? (
          <div className="p-3 bg-violet-600/10 border border-violet-500/20 rounded-xl flex items-center gap-3">
            <div className="p-2 bg-violet-500/20 text-violet-400 rounded-lg">
              <UserCheck size={18} />
            </div>
            <div className="overflow-hidden">
              <p className="text-[10px] uppercase tracking-wider text-violet-400 font-semibold">Active Student</p>
              <h4 className="text-sm font-semibold truncate text-white">{activeStudent.student_name}</h4>
              <p className="text-[11px] text-gray-400 truncate">{activeStudent.register_no}</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSearchSubmit} className="space-y-2">
            <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
              Load Student Data
            </label>
            <div className="flex gap-1.5">
              <input
                type="text"
                placeholder="e.g. REG2026000"
                value={searchReg}
                onChange={(e) => setSearchReg(e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 glass-input font-medium"
              />
              <button
                type="submit"
                className="bg-violet-600 hover:bg-violet-500 text-white px-2 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition"
              >
                Load
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 space-y-1.5 overflow-y-auto pr-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => {
                if (onClose) onClose(); // Auto-close mobile drawer when link clicked
              }}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition duration-200 group relative
                ${isActive 
                  ? "bg-violet-600/25 text-white border-l-4 border-violet-500 shadow-md" 
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
                }
              `}
            >
              <Icon size={18} className={`${isActive ? "text-violet-400" : "text-gray-400 group-hover:text-white"}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="pt-4 border-t border-white/5 text-center">
        <p className="text-[10px] text-gray-500">Antigravity AI Platform v1.0</p>
      </div>
    </aside>
  );
}

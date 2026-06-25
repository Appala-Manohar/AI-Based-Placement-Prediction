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
  LogOut,
  Mic,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Search
} from "lucide-react";

export default function Sidebar({ user, activeStudent, onSearchStudent, isOpen, onClose, onLogout, isCollapsed, onToggleCollapse }) {
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
    { path: "/profile", label: "My Profile", icon: UserCheck },
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
    <aside className={`h-screen bottom-0 fixed left-0 top-0 glass-sidebar z-40 flex flex-col p-4 transition-all duration-300 md:translate-x-0 
      ${isOpen ? "translate-x-0" : "-translate-x-full"}
      ${isCollapsed ? "w-20" : "w-68"}
    `}>
      {/* Title */}
      <div className={`py-4 px-2 mb-4 border-b border-white/5 flex items-center justify-between ${isCollapsed ? "flex-col items-center" : ""}`}>
        {isCollapsed ? (
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500/20 transform hover:scale-105 transition duration-300">
            <GraduationCap size={22} className="text-white" />
          </div>
        ) : (
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              AI Placement
            </h1>
            <p className="text-[10px] text-gray-400 font-medium tracking-widest uppercase">
              Prediction System
            </p>
          </div>
        )}
        <button 
          onClick={onToggleCollapse} 
          className={`text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition hidden md:block cursor-pointer ${isCollapsed ? "mt-3" : ""}`}
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
        </button>
      </div>

      {/* Logged in User Profile Card */}
      {user && (
        <div className="mb-4 px-1">
          <div className={`p-2.5 bg-white/5 border border-white/5 rounded-2xl flex items-center gap-3 ${isCollapsed ? "justify-center" : ""}`} title={isCollapsed ? user.full_name : ""}>
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-violet-500 to-fuchsia-500 flex items-center justify-center overflow-hidden font-bold text-xs text-white shadow-inner flex-shrink-0">
              {user.profile_photo ? (
                <img src={user.profile_photo} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                user.full_name.charAt(0)
              )}
            </div>
            {!isCollapsed && (
              <div className="overflow-hidden text-left flex-1">
                <h4 className="text-xs font-semibold text-white truncate">{user.full_name}</h4>
                <p className="text-[9px] text-violet-400 font-semibold truncate uppercase tracking-wider">@{user.username}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Active Student Search / Profile Card */}
      <div className="mb-6 px-1">
        {activeStudent ? (
          <div className={`p-2.5 bg-violet-600/10 border border-violet-500/20 rounded-xl flex items-center gap-3 ${isCollapsed ? "justify-center" : ""}`} title={isCollapsed ? `Active: ${activeStudent.student_name} (${activeStudent.register_no})` : ""}>
            <div className="p-2 bg-violet-500/20 text-violet-400 rounded-lg flex-shrink-0">
              <UserCheck size={18} />
            </div>
            {!isCollapsed && (
              <div className="overflow-hidden">
                <p className="text-[10px] uppercase tracking-wider text-violet-400 font-semibold">Active Student</p>
                <h4 className="text-sm font-semibold truncate text-white">{activeStudent.student_name}</h4>
                <p className="text-[11px] text-gray-400 truncate">{activeStudent.register_no}</p>
              </div>
            )}
          </div>
        ) : (
          isCollapsed ? (
            <button 
              onClick={onToggleCollapse} 
              className="w-full p-2.5 bg-white/5 border border-white/5 rounded-xl flex items-center justify-center text-gray-400 hover:text-white transition cursor-pointer"
              title="Search Student"
            >
              <Search size={18} />
            </button>
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
          )
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
              className={`flex items-center rounded-xl text-sm font-medium transition duration-200 group relative
                ${isCollapsed ? "justify-center p-2.5" : "px-3.5 py-2.5 gap-3"}
                ${isActive 
                  ? "bg-violet-600/25 text-white border-l-4 border-violet-500 shadow-md" 
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
                }
              `}
              title={isCollapsed ? item.label : ""}
            >
              <Icon size={18} className={`${isActive ? "text-violet-400" : "text-gray-400 group-hover:text-white"}`} />
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer & Logout */}
      <div className="pt-4 border-t border-white/5 space-y-2">
        {onLogout && (
          <button
            onClick={onLogout}
            title={isCollapsed ? "Log Out" : ""}
            className={`w-full flex items-center justify-center gap-2 bg-red-950/20 hover:bg-red-900/30 border border-red-500/20 hover:border-red-500/40 text-red-400 rounded-xl text-xs font-semibold cursor-pointer transition
              ${isCollapsed ? "p-2.5" : "px-3 py-2"}
            `}
          >
            <LogOut size={isCollapsed ? 16 : 14} />
            {!isCollapsed && <span>Log Out</span>}
          </button>
        )}
        {!isCollapsed && (
          <div className="text-center">
            <p className="text-[10px] text-gray-500">Antigravity AI Platform v1.0</p>
          </div>
        )}
      </div>
    </aside>
  );
}

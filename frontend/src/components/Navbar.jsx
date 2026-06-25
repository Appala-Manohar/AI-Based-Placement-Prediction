import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Bell, 
  GraduationCap, 
  RefreshCw, 
  Menu, 
  Sun, 
  Moon, 
  UserCheck, 
  LayoutDashboard, 
  LogOut 
} from "lucide-react";

export default function Navbar({ 
  user, 
  activeStudent, 
  onClearStudent, 
  onToggleSidebar, 
  theme, 
  onToggleTheme, 
  onLogout, 
  isSidebarCollapsed 
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className={`h-16 fixed top-0 right-0 left-0 glass-nav z-20 flex items-center justify-between px-6 transition-all duration-300 ${
      user 
        ? (isSidebarCollapsed ? "md:left-20" : "md:left-68") 
        : ""
    }`}>
      {/* Left side info */}
      <div className="flex items-center gap-3">
        {user && (
          <button
            onClick={onToggleSidebar}
            className="p-2 -ml-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 md:hidden transition cursor-pointer"
            aria-label="Toggle Sidebar"
          >
            <Menu size={20} />
          </button>
        )}
        <GraduationCap size={24} className="text-violet-400" />
        <div>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Smart Placement Portal
          </h2>
          {user ? (
            activeStudent ? (
              <p className="text-[11px] text-violet-300 font-medium">
                Analyzing Profile: <span className="font-semibold">{activeStudent.student_name}</span> ({activeStudent.register_no}) 
              </p>
            ) : (
              <p className="text-[11px] text-gray-400 font-medium">
                No student loaded. Load data using the sidebar to unlock personal dashboards.
              </p>
            )
          ) : (
            <p className="text-[11px] text-gray-400 font-medium">
              Welcome Guest. Please sign in to access predictive career analytics.
            </p>
          )}
        </div>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-4">
        {/* Theme Toggle Button */}
        <button 
          onClick={onToggleTheme}
          className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition cursor-pointer"
          title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {theme === "dark" ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        {user ? (
          <>
            {activeStudent && (
              <button
                onClick={onClearStudent}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-950/30 border border-red-500/20 text-red-400 rounded-lg text-xs font-semibold cursor-pointer hover:bg-red-900/20 transition"
              >
                <RefreshCw size={12} />
                Switch Student
              </button>
            )}

            {/* Notifications Mockup */}
            <button className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition relative cursor-pointer">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-violet-500 rounded-full animate-ping"></span>
            </button>

            {/* User Profile dropdown */}
            <div className="relative pl-3 border-l border-white/10">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2.5 text-left focus:outline-none cursor-pointer group"
                title="Account Menu"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-500 to-fuchsia-500 flex items-center justify-center overflow-hidden font-bold text-xs text-white shadow-inner flex-shrink-0 group-hover:ring-2 group-hover:ring-violet-500/50 transition">
                  {user.profile_photo ? (
                    <img src={user.profile_photo} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    user.full_name.charAt(0)
                  )}
                </div>
                <div className="hidden md:block">
                  <h4 className="text-xs font-semibold text-white truncate max-w-[120px] group-hover:text-violet-300 transition">
                    {user.full_name}
                  </h4>
                  <p className="text-[10px] text-gray-400 font-medium">
                    {user.username === "admin" ? "Administrator" : "Student Profile"}
                  </p>
                </div>
              </button>

              {isDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setIsDropdownOpen(false)}></div>
                  <div className="absolute right-0 mt-2 w-48 rounded-xl bg-[#0f172a] border border-white/10 p-1.5 shadow-xl z-40 animate-scale-up">
                    <Link
                      to="/profile"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition"
                    >
                      <UserCheck size={14} className="text-violet-400" />
                      My Profile
                    </Link>
                    <Link
                      to="/dashboard"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition"
                    >
                      <LayoutDashboard size={14} className="text-violet-400" />
                      Dashboard
                    </Link>
                    <div className="border-t border-white/5 my-1"></div>
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        onLogout();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition cursor-pointer text-left"
                    >
                      <LogOut size={14} />
                      Log Out
                    </button>
                  </div>
                </>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login" className="px-3 py-1.5 text-xs font-semibold text-gray-300 hover:text-white transition">
              Sign In
            </Link>
            <Link to="/register" className="px-3.5 py-1.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white rounded-xl text-xs font-bold shadow-md shadow-violet-500/15 transition transform hover:-translate-y-0.5">
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

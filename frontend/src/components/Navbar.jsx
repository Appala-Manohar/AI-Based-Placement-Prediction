import React from "react";
import { Bell, Search, GraduationCap, RefreshCw, Menu } from "lucide-react";

export default function Navbar({ activeStudent, onClearStudent, onToggleSidebar }) {
  return (
    <header className="h-16 fixed top-0 right-0 left-0 md:left-68 glass-nav z-20 flex items-center justify-between px-6">
      {/* Left side info */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 -ml-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 md:hidden transition cursor-pointer"
          aria-label="Toggle Sidebar"
        >
          <Menu size={20} />
        </button>
        <GraduationCap size={24} className="text-violet-400" />
        <div>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Smart Placement Portal
          </h2>
          {activeStudent ? (
            <p className="text-[11px] text-violet-300 font-medium">
              Analyzing Profile: <span className="font-semibold">{activeStudent.student_name}</span> ({activeStudent.register_no}) 
              {activeStudent.student_name === "Aniket Sharma" && (
                <span className="ml-1.5 px-1.5 py-0.25 bg-amber-500/20 text-amber-400 border border-amber-500/20 rounded-md text-[9px] font-bold">
                  Demo Mode
                </span>
              )}
            </p>
          ) : (
            <p className="text-[11px] text-gray-400 font-medium">
              No student loaded. Load data using the sidebar to unlock personal dashboards.
            </p>
          )}
        </div>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-4">
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

        {/* User Profile */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-white/10">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-500 to-fuchsia-500 flex items-center justify-center font-bold text-xs text-white shadow-inner">
            {activeStudent ? activeStudent.student_name.charAt(0) : "PO"}
          </div>
          <div className="hidden md:block text-left">
            <h4 className="text-xs font-semibold text-white">
              {activeStudent ? activeStudent.student_name : "Placement Officer"}
            </h4>
            <p className="text-[10px] text-gray-400 font-medium">
              {activeStudent ? "Student Profile" : "Administrator"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

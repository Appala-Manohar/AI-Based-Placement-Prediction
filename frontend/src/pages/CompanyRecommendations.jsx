import React from "react";
import { Link } from "react-router-dom";
import { 
  Building2, 
  AlertCircle, 
  Sparkles, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Briefcase
} from "lucide-react";

export default function CompanyRecommendations({ student }) {
  if (!student) {
    return (
      <div className="pt-24 px-6 max-w-4xl mx-auto text-center h-[70vh] flex flex-col justify-center items-center">
        <div className="w-16 h-16 bg-red-950/20 border border-red-500/20 text-red-400 rounded-full flex items-center justify-center mb-4">
          <AlertCircle size={28} />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">No Student Profile Loaded</h2>
        <p className="text-gray-400 mb-6">Please enter your Register Number in the sidebar or create a profile to view company recommendations.</p>
        <Link to="/predict-form" className="bg-violet-600 hover:bg-violet-500 text-white font-bold px-6 py-3 rounded-xl transition cursor-pointer">
          Open Prediction Form
        </Link>
      </div>
    );
  }

  // Categorize recommendations dynamically from the loaded profile
  const companies = student.recommended_companies || [];
  const score = student.readiness_score || 0;

  const dreamCompanies = companies.filter(c => c.tier === "Dream");
  const serviceCompanies = companies.filter(c => c.tier === "Service");
  const startups = companies.filter(c => c.tier === "Startup");

  const renderCompanySection = (title, subtitle, list, badgeColor) => {
    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Briefcase size={20} className="text-violet-400" /> {title}
          </h3>
          <p className="text-xs text-gray-400">{subtitle}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map((c, i) => {
            const isMatchHigh = c.match >= 80;
            const isMatchMid = c.match >= 55 && c.match < 80;
            
            const matchBadgeColor = isMatchHigh 
              ? "text-emerald-400 bg-emerald-950/20 border-emerald-500/20" 
              : (isMatchMid ? "text-amber-400 bg-amber-950/20 border-amber-500/20" : "text-rose-400 bg-rose-950/20 border-rose-500/20");
              
            return (
              <div key={i} className="glass-card glass-card-hover p-6 border border-white/5 flex flex-col justify-between h-[200px]">
                <div>
                  <div className="flex justify-between items-start">
                    <h4 className="text-base font-bold text-white">{c.name}</h4>
                    <span className={`text-[9px] font-bold px-2 py-0.5 border rounded-full ${matchBadgeColor}`}>
                      {c.match}% Match
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-2 font-medium">
                    Package range: <span className="text-white font-semibold">{c.package}</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-3 leading-relaxed">
                    <span className="font-semibold text-gray-300">Required: </span>
                    {c.skills}
                  </p>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-white/5">
                  <span className="text-[10px] text-gray-500 font-medium">Eligibility: {c.match >= 75 ? "Direct Apply" : "Requires Prep"}</span>
                  <a 
                    href={`https://www.google.com/search?q=${encodeURIComponent(c.name + " career placement syllabus")}`}
                    target="_blank" 
                    rel="noreferrer"
                    className="text-[10px] font-bold text-violet-400 hover:text-violet-300 flex items-center gap-1 cursor-pointer"
                  >
                    View Syllabus <ExternalLink size={10} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="pt-20 pb-16 px-6 max-w-6xl mx-auto space-y-12">
      {/* Header */}
      <div>
        <span className="text-xs font-semibold text-violet-400 uppercase tracking-widest block">Matching Analysis</span>
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
          <Building2 className="text-violet-400" /> Company Recommendation System
        </h1>
        <p className="text-xs text-gray-400 font-medium">
          Personalized company suggestions based on student profile. Review match ratings and target required skills.
        </p>
      </div>

      {/* Profile summary banner */}
      <div className="glass-card p-6 border border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h4 className="text-base font-bold text-white">Your Readiness Profile is categorized as: 
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent ml-2 font-extrabold">
              {score >= 75 ? "High Profile (Dream Tier)" : (score >= 50 ? "Medium Profile (Corporate Tier)" : "Beginner Profile (Startup/Training Tier)")}
            </span>
          </h4>
          <p className="text-xs text-gray-400 mt-1">
            Based on your placement readiness index of **{score}/100** and CGPA of **{student.cgpa}**.
          </p>
        </div>
        <div className="p-3 bg-violet-600/10 border border-violet-500/20 text-violet-400 rounded-xl text-xs font-bold text-center">
          Readiness Rank: {score >= 75 ? "Tier A+" : (score >= 55 ? "Tier B" : "Tier C")}
        </div>
      </div>

      {/* Render sections */}
      {renderCompanySection(
        "Dream Tier (Tier-1 Tech)", 
        "High salary packages, requires deep problem-solving skills and extensive coding practice.",
        dreamCompanies, 
        "indigo"
      )}

      <hr className="border-white/5" />

      {renderCompanySection(
        "Corporate & Service Tier (Tier-2)", 
        "Core/Service firms, high recruitment volumes, checks basic aptitude and core programming skills.",
        serviceCompanies, 
        "fuchsia"
      )}

      <hr className="border-white/5" />

      {renderCompanySection(
        "Startups & Internships", 
        "Fast-paced environment, hires web developers, offers excellent learning curves and early career launches.",
        startups, 
        "cyan"
      )}

    </div>
  );
}

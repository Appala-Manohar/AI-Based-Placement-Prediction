import React from "react";
import { Link } from "react-router-dom";
import {
  GraduationCap,
  Mail,
  CheckCircle,
  Users
} from "lucide-react";

// Inline Custom SVG Icons to avoid lucide version mismatch
const GithubIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    width="16"
    height="16"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const LinkedinIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    width="16"
    height="16"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const featuresList = [
    {
      category: "ML Predictors",
      items: [
        { name: "Placement Predictor", desc: "Calculates readiness using classification models", path: "/predict-form" },
        { name: "Salary Estimator", desc: "Forecasts LPA using Random Forest Regressor", path: "/salary-prediction" }
      ]
    },
    {
      category: "AI Preparation",
      items: [
        { name: "Resume NLP Analyzer", desc: "Grades and highlights missing keywords/skills", path: "/resume-analyzer" },
        { name: "Mock Interview Simulator", desc: "Conducts tailored interactive verbal sessions", path: "/interview" }
      ]
    },
    {
      category: "Insights & Guidance",
      items: [
        { name: "Learning Roadmap", desc: "Generates week-by-week targeted modules", path: "/roadmap" },
        { name: "Skill Gap Analysis", desc: "Compares metrics against standard recruiter cutoffs", path: "/skill-gap" }
      ]
    },
    {
      category: "Portals & Utilities",
      items: [
        { name: "Company Recommender", desc: "Suggests dream/premium companies & matches", path: "/companies" },
        { name: "Student Ranking Portal", desc: "Leaderboards comparing student profile scores", path: "/ranking" }
      ]
    }
  ];

  return (
    <footer className="w-full mt-auto border-t border-white/5 bg-[#090d16]/80 backdrop-blur-md relative z-10">
      {/* Decorative Top Accent line with gradient */}
      <div className="h-0.5 w-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500 opacity-60"></div>
      
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          
          {/* Brand and Description */}
          <div className="lg:col-span-2 flex flex-col space-y-4">
            <div className="flex items-center gap-2.5">
              <GraduationCap size={28} className="text-violet-400" />
              <div>
                <h3 className="text-base font-bold text-white uppercase tracking-wider">
                  Smart Placement Portal
                </h3>
                <p className="text-[10px] text-violet-300 font-semibold tracking-wider uppercase">
                  AI-Based Placement Prediction
                </p>
              </div>
            </div>
            
            <p className="text-xs text-gray-400 leading-relaxed max-w-sm">
              An end-to-end placement readiness platform leveraging machine learning to empower students, facilitate mock interviews, assess resume quality, and tailor personalized roadmaps.
            </p>

            {/* Contributor Profile */}
            <div className="pt-2">
              <span className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold block mb-2 flex items-center gap-1.5">
                <Users size={12} className="text-violet-400" />
                Contributors
              </span>
              <div className="inline-flex items-center gap-3 p-2.5 bg-white/5 rounded-xl border border-white/5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-500 to-fuchsia-500 flex items-center justify-center font-bold text-xs text-white">
                  AM
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">Appala Manohar</h4>
                  <p className="text-[10px] text-gray-400">Lead Full-Stack & ML Developer</p>
                </div>
              </div>
            </div>
          </div>

          {/* Features Navigation */}
          <div className="lg:col-span-4 grid grid-cols-2 sm:grid-cols-4 gap-6">
            {featuresList.map((cat, idx) => (
              <div key={idx} className="flex flex-col space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider border-b border-white/5 pb-2">
                  {cat.category}
                </h4>
                <ul className="space-y-2">
                  {cat.items.map((item, itemIdx) => (
                    <li key={itemIdx}>
                      <Link 
                        to={item.path} 
                        className="group flex flex-col text-left hover:text-white transition duration-150"
                      >
                        <span className="text-xs font-medium text-gray-300 group-hover:text-violet-400 transition-colors">
                          {item.name}
                        </span>
                        <span className="text-[10px] text-gray-500 leading-tight mt-0.5">
                          {item.desc}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

        </div>

        {/* Footer Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-gray-500 text-center md:text-left">
            &copy; {currentYear} Smart Placement Portal. Built with FastAPI, React & Tailwind CSS. All rights reserved.
          </p>
          
          <div className="flex items-center gap-4 text-gray-500">
            <span className="text-[11px] flex items-center gap-1">
              <CheckCircle size={10} className="text-emerald-400 animate-pulse" />
              System Status: <span className="text-emerald-400 font-semibold ml-0.5">Active</span>
            </span>
            <span className="text-white/10">|</span>
            <div className="flex gap-3">
              <a href="#" className="hover:text-violet-400 transition" title="GitHub">
                <GithubIcon size={16} />
              </a>
              <a href="#" className="hover:text-violet-400 transition" title="LinkedIn">
                <LinkedinIcon size={16} />
              </a>
              <a href="#" className="hover:text-violet-400 transition" title="Contact Email">
                <Mail size={16} className="hover:text-violet-400 transition" />
              </a>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}

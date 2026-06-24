import React from "react";
import { Link } from "react-router-dom";
import { 
  GraduationCap, 
  BrainCircuit, 
  TrendingUp, 
  FileCheck, 
  MessageSquare, 
  Award,
  ArrowRight,
  ShieldCheck,
  Zap,
  Info
} from "lucide-react";

export default function LandingPage() {
  const features = [
    {
      title: "Placement Predictor",
      desc: "Evaluate placement status and compute numerical readiness scores using trained models.",
      icon: BrainCircuit,
      color: "from-violet-500 to-indigo-500",
      link: "/predict-form"
    },
    {
      title: "Skill Gap Analysis",
      desc: "Highlights gaps in core domains (Aptitude, Coding, CS basics) compared to recruiter cutoffs.",
      icon: TrendingUp,
      color: "from-fuchsia-500 to-pink-500",
      link: "/skill-gap"
    },
    {
      title: "Resume NLP Analyzer",
      desc: "Runs keyword density parsing on uploaded PDF/Word resumes to optimize score profiles.",
      icon: FileCheck,
      color: "from-blue-500 to-cyan-500",
      link: "/resume-analyzer"
    },
    {
      title: "AI Guidance Chatbot",
      desc: "Generates real-time custom responses using Gemini API prompts or local NLP libraries.",
      icon: MessageSquare,
      color: "from-teal-500 to-emerald-500",
      link: "/chatbot"
    },
    {
      title: "Student Ranking",
      desc: "Leaderboard register matching and sorting students based on numerical readiness rankings.",
      icon: Award,
      color: "from-amber-500 to-orange-500",
      link: "/ranking"
    },
    {
      title: "Admin Portal Console",
      desc: "Trained classifier metrics comparisons, confusion matrix registers, and profile deletion logs.",
      icon: ShieldCheck,
      color: "from-red-500 to-rose-500",
      link: "/admin"
    }
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 px-6 relative flex flex-col justify-between overflow-hidden">
      
      {/* Glow Blur Circles in Backdrop */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl animate-pulse-slow -z-10"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-fuchsia-600/10 rounded-full blur-3xl animate-pulse-slow -z-10"></div>

      {/* Hero Body */}
      <div className="max-w-5xl mx-auto text-center mt-12 mb-16 relative z-10 space-y-6">
        
        {/* Sparkle Header */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-semibold tracking-wider uppercase mb-2">
          <Zap size={12} className="animate-bounce text-violet-400" />
          Next-Gen Career Readiness Platform
        </div>
        
        {/* Core Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-tight">
          AI-Based <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-500 bg-clip-text text-transparent">Placement Prediction</span> System
        </h1>
        
        {/* Subtitle */}
        <p className="text-sm sm:text-base md:text-lg text-gray-400 max-w-2xl mx-auto font-medium leading-relaxed">
          Smart Placement Assistance Hub using trained machine learning models to assess student profiles, run NLP resume scans, map study guides, and deliver chatbot advice.
        </p>

        {/* Buttons */}
        <div className="pt-4 flex flex-wrap justify-center gap-4">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-violet-500/20 cursor-pointer transform hover:-translate-y-0.5 transition duration-200"
          >
            Explore Active Dashboard <ArrowRight size={18} />
          </Link>
          <Link
            to="/predict-form"
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white font-semibold px-8 py-4 rounded-xl border border-white/10 cursor-pointer transition"
          >
            Run New Prediction
          </Link>
        </div>
      </div>

      {/* Interactive Feature Cards */}
      <div className="max-w-6xl mx-auto relative z-10 w-full mb-16">
        <h3 className="text-xs font-bold text-violet-400 uppercase tracking-widest text-center mb-8">
          Feature Modules
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div 
                key={i} 
                className="glass-card glass-card-hover p-6 flex flex-col justify-between min-h-[200px]"
              >
                <div>
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${f.color} flex items-center justify-center text-white mb-4 shadow-md shadow-violet-500/5`}>
                    <Icon size={20} />
                  </div>
                  <h4 className="text-base font-bold text-white mb-2">{f.title}</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">{f.desc}</p>
                </div>
                <Link 
                  to={f.link} 
                  className="mt-6 flex items-center gap-1.5 text-xs font-bold text-violet-400 hover:text-violet-300 transition"
                >
                  Configure Module <ArrowRight size={12} />
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* Model Tech Description Block */}
      <div className="max-w-4xl mx-auto relative z-10 w-full">
        <div className="glass-card p-6 border border-white/5 flex flex-col md:flex-row gap-5 items-start">
          <div className="p-3 bg-violet-500/10 text-violet-400 rounded-xl flex-shrink-0 mt-0.5">
            <BrainCircuit size={20} />
          </div>
          <div className="space-y-2 text-xs">
            <h4 className="text-sm font-bold text-white">How the Prediction Engine Works</h4>
            <p className="text-gray-400 leading-relaxed">
              When student details are entered, parameters are formatted and checked by a pre-trained **Logistic Regression** model (achieving **92.0% accuracy** on testing data). The model calculates numerical eligibility thresholds and placement probabilities.
            </p>
            <p className="text-gray-400 leading-relaxed">
              An auxiliary **Random Forest Regressor** estimates starting package brackets (₹3.5 LPA - ₹18 LPA) based on coding score levels, mock interview ranks, active backlogs, and academic CGPA metrics.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}

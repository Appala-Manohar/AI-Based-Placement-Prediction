import React from "react";
import { Link } from "react-router-dom";
import { 
  Activity, 
  AlertCircle, 
  CheckCircle2, 
  HelpCircle, 
  Sparkles,
  ArrowRight,
  TrendingUp,
  BrainCircuit,
  Compass
} from "lucide-react";

export default function SkillGap({ student }) {
  if (!student) {
    return (
      <div className="pt-24 px-6 max-w-4xl mx-auto text-center h-[70vh] flex flex-col justify-center items-center">
        <div className="w-16 h-16 bg-red-950/20 border border-red-500/20 text-red-400 rounded-full flex items-center justify-center mb-4">
          <AlertCircle size={28} />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">No Student Profile Loaded</h2>
        <p className="text-gray-400 mb-6">Please enter your Register Number in the sidebar or create a profile to view your skill gaps.</p>
        <Link to="/predict-form" className="bg-violet-600 hover:bg-violet-500 text-white font-bold px-6 py-3 rounded-xl transition cursor-pointer">
          Open Prediction Form
        </Link>
      </div>
    );
  }

  // Categories list
  const skillCategories = [
    {
      name: "Programming Skills",
      score: student.programming_skills,
      benchmark: 75,
      description: "Covers syntax, algorithms, data structures (DSA), and coding tests.",
      gapDesc: student.programming_skills < 75 
        ? "Your programming score is below the 75% placement benchmark. Recruiters look for fast problem-solving in DSA." 
        : "Excellent programming foundation. Ready for advanced technical coding tests.",
      recs: student.programming_skills < 75 
        ? ["Practice 2 coding problems on arrays and strings daily.", "Learn fundamental structures: HashMaps, Linked Lists, Stacks.", "Participate in weekly coding challenges on HackerRank."]
        : ["Start practicing Graph Theory and Dynamic Programming.", "Participate in LeetCode Weekly Contests to improve speed.", "Revise system design basics."]
    },
    {
      name: "Aptitude & Logical Ability",
      score: student.aptitude_score,
      benchmark: 70,
      description: "Covers quantitative aptitude, verbal ability, and logical reasoning puzzles.",
      gapDesc: student.aptitude_score < 70 
        ? "Aptitude cutoffs are typical in first-round screenings. You need logical puzzles and speed drills." 
        : "Strong cognitive scores. Ready for standard screening examinations.",
      recs: student.aptitude_score < 70 
        ? ["Solve 20 practice questions daily on percentages, ratios, and work-time.", "Learn logical shortcuts and reasoning puzzles.", "Take 1 timed mock screening test every weekend."]
        : ["Maintain consistency by solving analytical logic puzzles.", "Practice high-difficulty logical deduction tests."]
    },
    {
      name: "Technical Core Subjects",
      score: student.technical_skills,
      benchmark: 70,
      description: "Covers computer science fundamentals: DBMS, SQL queries, OOPs, and Operating Systems.",
      gapDesc: student.technical_skills < 70 
        ? "Interviewers frequently check SQL querying and core OOP concepts. Gaps identified in fundamentals." 
        : "Strong understanding of CS core domains. Ready for technical interviews.",
      recs: student.technical_skills < 70 
        ? ["Revise SQL joins, indexes, subqueries, and database constraints.", "Understand encapsulation, polymorphism, inheritance, and abstraction.", "Review basic operating systems threads and memory allocation."]
        : ["Write complex nested database queries and indexing optimizations.", "Learn basic system architecture design patterns."]
    },
    {
      name: "Communication & Soft Skills",
      score: student.communication_skills,
      benchmark: 75,
      description: "Covers english fluency, vocabulary, group discussions, and confidence.",
      gapDesc: student.communication_skills < 75 
        ? "Essential for HR rounds and group discussions. Gaps identified in professional speaking confidence." 
        : "Strong communicative presence. Ready for HR evaluation.",
      recs: student.communication_skills < 75 
        ? ["Practice mirror speech for 10-15 minutes daily on technology topics.", "Form study groups and run mock Group Discussions in English.", "Prepare mock behavioral questions like 'Why should we hire you?' using STAR method."]
        : ["Fine-tune body language and tone modulation.", "Practice executive-level brief business pitches."]
    },
    {
      name: "Project Achievements",
      score: student.projects >= 2 ? 100 : (student.projects === 1 ? 60 : 20),
      benchmark: 70,
      description: "Evaluates academic/personal hands-on projects.",
      gapDesc: student.projects < 2 
        ? "Most recruiters check project sections to verify implementation capability. Need at least 2 full-scale projects." 
        : "Good project portfolio. Ensure they are listed on GitHub with readable Readme files.",
      recs: student.projects < 2 
        ? ["Develop a full-stack web app (React + Node/FastAPI) or a machine learning model.", "Publish the code on GitHub with clean documentations.", "Add project links directly in your resume."]
        : ["Add advanced features like authentication or test coverage.", "Prepare to describe the system design details during technical rounds."]
    },
    {
      name: "Professional Internship",
      score: student.internship === "Yes" ? 100 : 30,
      benchmark: 70,
      description: "Evaluates prior industry exposure and work experience.",
      gapDesc: student.internship === "No" 
        ? "Prior industrial experience significantly boosts shortlist chances. Gaps identified in hands-on work exposure." 
        : "Internship experience adds high value to your resume. Ready to answer work-related queries.",
      recs: student.internship === "No" 
        ? ["Apply for virtual internships (like AICTE, Forage modules) to showcase exposure.", "Contribute to open-source project libraries.", "Build a freelance or client project."]
        : ["Prepare a detailed breakdown of your internship deliverables, tech stacks, and team contributions."]
    }
  ];

  return (
    <div className="pt-20 pb-16 px-6 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <span className="text-xs font-semibold text-violet-400 uppercase tracking-widest block">Skills Profile</span>
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
          <Activity className="text-violet-400" /> Skill Gap Analysis
        </h1>
        <p className="text-xs text-gray-400 font-medium">
          A category-wise breakdown of student skills compared to corporate recruitment thresholds, highlighting weak areas and giving custom recommendations.
        </p>
      </div>

      {/* Main Analysis Cards */}
      <div className="grid grid-cols-1 gap-6">
        {skillCategories.map((c, idx) => {
          const isGap = c.score < c.benchmark;
          const ratingColor = c.score >= 75 
            ? "text-emerald-400 bg-emerald-950/20 border-emerald-500/20" 
            : (c.score >= 55 ? "text-amber-400 bg-amber-950/20 border-amber-500/20" : "text-rose-400 bg-rose-950/20 border-rose-500/20");
            
          const progressColor = c.score >= 75 
            ? "bg-emerald-500" 
            : (c.score >= 55 ? "bg-amber-500" : "bg-red-500");

          return (
            <div key={idx} className="glass-card p-6 border border-white/5 flex flex-col lg:flex-row gap-6 items-start justify-between">
              
              {/* Left Column: Skill Description & Status */}
              <div className="space-y-4 flex-1">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-lg font-bold text-white">{c.name}</h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 border rounded-full uppercase ${ratingColor}`}>
                      {c.score >= 75 ? "Proficient" : (c.score >= 55 ? "Moderate Gap" : "Critical Gap")}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1 max-w-xl">{c.description}</p>
                </div>

                {/* Score bars */}
                <div className="space-y-1.5 max-w-md">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-gray-400">Student score: {c.score}%</span>
                    <span className="text-gray-500">Benchmark: {c.benchmark}%</span>
                  </div>
                  <div className="w-full bg-white/5 h-2.5 rounded-full overflow-hidden relative">
                    {/* Benchmark mark */}
                    <div 
                      className="absolute top-0 bottom-0 w-[2px] bg-gray-600 z-10" 
                      style={{ left: `${c.benchmark}%` }}
                      title={`Benchmark line: ${c.benchmark}%`}
                    ></div>
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${progressColor}`} 
                      style={{ width: `${c.score}%` }}
                    ></div>
                  </div>
                </div>

                {/* Status description */}
                <p className="text-xs text-gray-300 leading-relaxed max-w-2xl bg-white/2 p-3 rounded-xl border border-white/5">
                  <span className="font-semibold text-white">Analysis: </span>{c.gapDesc}
                </p>
              </div>

              {/* Right Column: Custom Actions / Recommendations */}
              <div className="w-full lg:w-[320px] p-4 bg-violet-600/5 border border-violet-500/10 rounded-2xl space-y-3">
                <h4 className="text-xs font-bold text-violet-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Sparkles size={14} /> Recommended Action Items
                </h4>
                <ul className="space-y-2">
                  {c.recs.map((r, i) => (
                    <li key={i} className="text-[11px] text-gray-300 flex items-start gap-2 leading-relaxed">
                      <span className="text-violet-500 font-bold mt-0.5">•</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          );
        })}
      </div>

      {/* Action panel */}
      <div className="glass-card p-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h4 className="text-base font-bold text-white mb-1">Unlock study schedule!</h4>
          <p className="text-xs text-gray-400">Generate a personalized weekly learning roadmap to solve these gaps systematically.</p>
        </div>
        <Link 
          to="/roadmap" 
          className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-500 text-white font-bold px-6 py-3 rounded-xl text-xs transition cursor-pointer self-start md:self-auto"
        >
          View Learning Roadmap <ArrowRight size={14} />
        </Link>
      </div>

    </div>
  );
}

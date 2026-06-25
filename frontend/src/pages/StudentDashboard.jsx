import React from "react";
import { Link } from "react-router-dom";
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell
} from "recharts";
import { 
  Trophy, 
  AlertTriangle, 
  TrendingUp, 
  Building2, 
  IndianRupee, 
  ArrowRight,
  Sparkles,
  BookOpen,
  Zap,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

export default function StudentDashboard({ student }) {
  if (!student) {
    return (
      <div className="pt-24 px-6 max-w-4xl mx-auto text-center h-[70vh] flex flex-col justify-center items-center">
        <div className="w-16 h-16 bg-red-950/20 border border-red-500/20 text-red-400 rounded-full flex items-center justify-center mb-4 animate-bounce">
          <AlertCircle size={28} />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">No Student Profile Loaded</h2>
        <p className="text-gray-400 mb-6 max-w-md">
          Please load a student profile using their Register Number in the sidebar search, or create a new profile by filling out the prediction form.
        </p>
        <Link
          to="/predict-form"
          className="bg-violet-600 hover:bg-violet-500 text-white font-bold px-6 py-3 rounded-xl transition cursor-pointer"
        >
          Open Prediction Form
        </Link>
      </div>
    );
  }

  // Skill scores for Radar Chart
  const skillData = [
    { subject: "Programming", A: student.programming_skills, B: 75, fullMark: 100 },
    { subject: "Aptitude", A: student.aptitude_score, B: 70, fullMark: 100 },
    { subject: "Communication", A: student.communication_skills, B: 75, fullMark: 100 },
    { subject: "Technical Core", A: student.technical_skills, B: 70, fullMark: 100 },
    { subject: "Mock Interview", A: student.mock_interview_score, B: 70, fullMark: 100 },
  ];

  // Data for the package bar chart inside dashboard
  const packageChartData = [
    { name: "Low Est.", amount: student.salary_low, color: "#f43f5e" },
    { name: "Avg Est.", amount: student.salary_avg, color: "#a855f7" },
    { name: "High Est.", amount: student.salary_high, color: "#10b981" }
  ];

  const placementProbability = Math.round(student.probability * 100);
  const isPlaced = student.placed === 1;

  // Compute Career Insights dynamically
  let employabilityRating = "Medium (Targeted Prep Needed)";
  let employabilityColor = "text-amber-400 bg-amber-500/10 border-amber-500/20";
  if (student.readiness_score >= 80) {
    employabilityRating = "High (Excellent Shortlist Profile)";
    employabilityColor = "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
  } else if (student.readiness_score < 60) {
    employabilityRating = "Critical (Urgent Skill Gaps)";
    employabilityColor = "text-rose-400 bg-rose-500/10 border-rose-500/20";
  }

  // Find key placement driver
  const scores = [
    { name: "Academics (CGPA)", val: student.cgpa * 10 },
    { name: "Programming Skills", val: student.programming_skills },
    { name: "Aptitude Score", val: student.aptitude_score },
    { name: "Communication Skills", val: student.communication_skills },
    { name: "Technical Core", val: student.technical_skills }
  ];
  scores.sort((a, b) => b.val - a.val);
  const keyDriver = scores[0].name;

  return (
    <div className="pt-20 pb-16 px-6 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Welcome & Result Header */}
      <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
        <div>
          <span className="text-xs font-semibold text-violet-400 uppercase tracking-widest block font-bold">Dashboard Summary</span>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">{student.student_name}</h1>
          <p className="text-xs text-gray-400 font-medium">
            Department: {student.department} | Register No: {student.register_no} | Languages: <span className="text-violet-400 font-semibold">{student.programming_languages || "Python, Java, SQL"}</span>
          </p>
        </div>
        
        {/* Prediction Banner */}
        <div className={`p-4 rounded-2xl flex items-center gap-4 border shadow-lg ${
          isPlaced 
            ? "bg-emerald-950/20 border-emerald-500/20 text-emerald-400" 
            : "bg-rose-950/20 border-rose-500/20 text-rose-400"
        }`}>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            isPlaced ? "bg-emerald-500/10 shadow-emerald-500/10" : "bg-rose-500/10 shadow-rose-500/10"
          } shadow-inner`}>
            {isPlaced ? <Trophy size={20} /> : <AlertTriangle size={20} />}
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Predicted Placement</p>
            <h3 className="text-lg font-black uppercase tracking-tight">
              {isPlaced ? "PLACED" : "NOT PLACED"}
            </h3>
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Probability Card */}
        <div className="glass-card p-6 flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Placement Probability</span>
            <div className="flex items-baseline gap-2">
              <h2 className="text-3xl font-black text-white leading-none">{placementProbability}%</h2>
              <span className="text-[9px] font-bold bg-violet-600/20 text-violet-300 border border-violet-500/20 px-1.5 py-0.5 rounded-md">
                Conf: {student.confidence_score || 0}%
              </span>
            </div>
            <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden mt-4">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ${
                  placementProbability >= 75 ? "bg-emerald-500" : (placementProbability >= 50 ? "bg-amber-500" : "bg-red-500")
                }`} 
                style={{ width: `${placementProbability}%` }}
              ></div>
            </div>
          </div>
          <p className="text-[10px] text-gray-500 mt-4 leading-normal">Inference generated based on model weight inputs</p>
        </div>

        {/* Readiness Card */}
        <div className="glass-card p-6 flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Readiness Index</span>
            <h2 className="text-3.5xl font-black text-white leading-none">{student.readiness_score}<span className="text-sm text-gray-500">/100</span></h2>
            <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden mt-4">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ${
                  student.readiness_score >= 75 ? "bg-emerald-500" : (student.readiness_score >= 50 ? "bg-amber-500" : "bg-red-500")
                }`} 
                style={{ width: `${student.readiness_score}%` }}
              ></div>
            </div>
          </div>
          <p className="text-[10px] text-gray-500 mt-4 leading-normal">Computed rating across academics & core skills</p>
        </div>

        {/* Expected Salary Card */}
        <div className="glass-card p-6 flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Estimated Package Range</span>
            <h2 className="text-2.5xl font-black text-white flex items-center gap-1 leading-none mt-1">
              <IndianRupee size={20} className="text-violet-400" />
              {student.salary_low} - {student.salary_high} <span className="text-xs text-gray-500 font-semibold uppercase">LPA</span>
            </h2>
            <div className="p-1 px-2.5 bg-violet-600/10 border border-violet-500/20 text-violet-400 rounded-lg text-[9px] font-bold w-fit mt-4">
              Median: {student.salary_avg} LPA
            </div>
          </div>
          <p className="text-[10px] text-gray-500 mt-3 leading-normal">Estimated potential package tier</p>
        </div>

        {/* Resume Score Card */}
        <div className="glass-card p-6 flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Resume NLP Score</span>
            <h2 className="text-3.5xl font-black text-white leading-none">{student.resume_score || "N/A"}<span className="text-sm text-gray-500">/100</span></h2>
            <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden mt-4">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ${
                  student.resume_score >= 80 ? "bg-emerald-500" : (student.resume_score >= 60 ? "bg-amber-500" : "bg-red-500")
                }`} 
                style={{ width: `${student.resume_score || 0}%` }}
              ></div>
            </div>
          </div>
          <Link to="/resume-analyzer" className="text-[11px] text-violet-400 hover:text-violet-300 font-bold mt-4 flex items-center gap-1 self-start">
            Re-run Resume NLP Scan <ArrowRight size={10} />
          </Link>
        </div>
      </div>

      {/* Middle Section: Radar Skill Chart, Progress Summary & Career Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Radar Chart Card */}
        <div className="glass-card p-6 lg:col-span-2 flex flex-col justify-between h-[360px]">
          <div>
            <h3 className="text-base font-bold text-white mb-1">Skill Gap Analysis Radar</h3>
            <p className="text-xs text-gray-400 font-medium">Comparing your skill points (Purple) against recruitment averages (Gray)</p>
          </div>
          <div className="h-64 w-full mt-4 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" radius="70%" data={skillData}>
                <PolarGrid stroke="var(--chart-grid)" />
                <PolarAngleAxis dataKey="subject" stroke="var(--chart-axis)" tick={{ fontSize: 10 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="var(--chart-axis-radius)" />
                <Radar name="Student" dataKey="A" stroke="var(--chart-purple)" fill="var(--chart-purple)" fillOpacity={0.25} />
                <Radar name="Benchmark" dataKey="B" stroke="var(--chart-benchmark)" fill="var(--chart-benchmark)" fillOpacity={0.08} />
                <Tooltip contentStyle={{ backgroundColor: "var(--bg-tooltip)", borderColor: "var(--border-tooltip)", color: "var(--text-tooltip)", fontSize: 11 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Skill Gap Progress Summary */}
        <div className="glass-card p-6 flex flex-col justify-between h-[360px]">
          <div>
            <h3 className="text-base font-bold text-white mb-1">Skill Gap Summary</h3>
            <p className="text-[11px] text-gray-500 mb-4">Benchmarks compared to your actual scores</p>
            <div className="space-y-3">
              {[
                { name: "Programming", score: student.programming_skills, bench: 75 },
                { name: "Aptitude", score: student.aptitude_score, bench: 70 },
                { name: "Tech Core", score: student.technical_skills, bench: 70 },
                { name: "Communication", score: student.communication_skills, bench: 75 },
                { name: "Mock Interview", score: student.mock_interview_score, bench: 70 }
              ].map((skill, index) => {
                const isUnder = skill.score < skill.bench;
                return (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between text-[10px] font-bold">
                      <span className="text-gray-300">{skill.name}</span>
                      <span className={isUnder ? "text-amber-400" : "text-emerald-400"}>
                        {skill.score}% <span className="text-gray-500">/ {skill.bench}%</span>
                      </span>
                    </div>
                    <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden relative">
                      <div 
                        className={`h-full rounded-full ${isUnder ? "bg-amber-500" : "bg-emerald-500"}`} 
                        style={{ width: `${skill.score}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <Link to="/skill-gap" className="text-[11px] text-violet-400 hover:text-violet-300 font-bold mt-2 flex items-center gap-1 self-start">
            Detailed Gap Optimizer <ArrowRight size={10} />
          </Link>
        </div>

        {/* Dynamic Career Insights Card */}
        <div className="glass-card p-6 flex flex-col justify-between h-[360px]">
          <div>
            <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
              <Zap size={18} className="text-violet-400" />
              Career Insights
            </h3>
            
            <div className="space-y-4">
              {/* Employability Rating */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Employability Classification</span>
                <div className={`p-2.5 rounded-xl border text-xs font-bold ${employabilityColor}`}>
                  {employabilityRating}
                </div>
              </div>

              {/* Key Placement Driver */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Primary Profile Booster</span>
                <div className="p-2.5 bg-white/2 border border-white/5 rounded-xl text-xs font-bold text-white flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-400" />
                  {keyDriver}
                </div>
              </div>

              {/* Next Milestone */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Next Roadmap Target</span>
                <div className="p-2.5 bg-violet-600/5 border border-violet-500/10 rounded-xl text-xs text-gray-300 flex items-start gap-2 leading-relaxed">
                  <BookOpen size={14} className="text-violet-400 flex-shrink-0 mt-0.5" />
                  <span className="truncate">
                    {student.learning_roadmap?.[0]?.focus || "Review technical fundamentals"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <Link to="/skill-gap" className="text-xs font-bold text-violet-400 hover:text-violet-300 mt-4 flex items-center gap-1 self-start">
            Detailed Gap Analysis <ArrowRight size={12} />
          </Link>
        </div>
      </div>

      {/* Bottom Section: Company Suggestions & Study roadmap summary & Salary estimates chart */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Company Suggestions Card */}
        <div className="glass-card p-6 flex flex-col justify-between min-h-[300px]">
          <div>
            <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-1.5">
              <Building2 size={16} className="text-violet-400" />
              Company Matches
            </h3>
            <p className="text-[11px] text-gray-500 mb-4">Recommended hiring positions matching skills</p>
            <div className="space-y-3">
              {student.recommended_companies && student.recommended_companies.slice(0, 3).map((c, i) => (
                <div key={i} className="p-2.5 bg-white/2 border border-white/5 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-bold text-white">{c.name}</h4>
                    <p className="text-[10px] text-gray-500 truncate max-w-[120px]">Syllabus: {c.skills}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-white text-[11px]">{c.package}</p>
                    <span className="text-[9px] font-bold text-emerald-400 bg-emerald-950/20 px-1 py-0.25 rounded border border-emerald-500/10">
                      {c.match}% match
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Link to="/companies" className="text-xs font-bold text-violet-400 hover:text-violet-300 mt-4 flex items-center gap-1 self-start">
            View All Job Openings <ArrowRight size={12} />
          </Link>
        </div>

        {/* Salary Prediction Chart Card */}
        <div className="glass-card p-6 flex flex-col justify-between min-h-[300px]">
          <div>
            <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-1.5">
              <IndianRupee size={16} className="text-violet-400" />
              Package Estimations
            </h3>
            <p className="text-[11px] text-gray-500 mb-4">Regression predictions comparison (LPA)</p>
            <div className="h-40 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={packageChartData} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#6b7280" tick={{ fontSize: 9 }} />
                  <YAxis stroke="#6b7280" tick={{ fontSize: 9 }} />
                  <Tooltip contentStyle={{ backgroundColor: "#111827", borderColor: "rgba(255,255,255,0.08)", fontSize: 10 }} />
                  <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                    {packageChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <Link to="/salary-prediction" className="text-xs font-bold text-violet-400 hover:text-violet-300 mt-2 flex items-center gap-1 self-start">
            Package Analysis Details <ArrowRight size={12} />
          </Link>
        </div>

        {/* Roadmap Summary Card */}
        <div className="glass-card p-6 flex flex-col justify-between min-h-[300px]">
          <div>
            <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-1.5">
              <BookOpen size={16} className="text-violet-400" />
              Roadmap Progress
            </h3>
            <p className="text-[11px] text-gray-500 mb-4">Study guide task milestones based on gaps</p>
            <div className="space-y-3">
              {student.learning_roadmap && student.learning_roadmap.slice(0, 2).map((r, wIdx) => (
                <div key={wIdx} className="p-2.5 bg-violet-600/5 border border-violet-500/10 rounded-xl text-xs">
                  <h4 className="font-bold text-violet-400">{r.week} - {r.focus}</h4>
                  <ul className="mt-1 space-y-1">
                    {r.tasks.slice(0, 2).map((t, tIdx) => (
                      <li key={tIdx} className="text-[10px] text-gray-400 flex items-start gap-1">
                        <span className="text-violet-500 mt-0.5">•</span>
                        <span className="truncate">{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <Link to="/roadmap" className="text-xs font-bold text-violet-400 hover:text-violet-300 mt-4 flex items-center gap-1 self-start">
            Open Interactive Roadmap <ArrowRight size={12} />
          </Link>
        </div>

      </div>
    </div>
  );
}

import React from "react";
import { Link } from "react-router-dom";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from "recharts";
import { 
  IndianRupee, 
  AlertCircle, 
  TrendingUp, 
  ArrowUpRight, 
  Award,
  MinusCircle
} from "lucide-react";

export default function SalaryPrediction({ student }) {
  if (!student) {
    return (
      <div className="pt-24 px-6 max-w-4xl mx-auto text-center h-[70vh] flex flex-col justify-center items-center">
        <div className="w-16 h-16 bg-red-950/20 border border-red-500/20 text-red-400 rounded-full flex items-center justify-center mb-4">
          <AlertCircle size={28} />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">No Student Profile Loaded</h2>
        <p className="text-gray-400 mb-6">Please enter your Register Number in the sidebar or create a profile to view salary predictions.</p>
        <Link to="/predict-form" className="bg-violet-600 hover:bg-violet-500 text-white font-bold px-6 py-3 rounded-xl transition cursor-pointer">
          Open Prediction Form
        </Link>
      </div>
    );
  }

  // Data for the package chart
  const salaryData = [
    { name: "Low Estimate", amount: student.salary_low, color: "#ef4444" },
    { name: "Average Package", amount: student.salary_avg, color: "#8b5cf6" },
    { name: "High Estimate", amount: student.salary_high, color: "#10b981" }
  ];

  // Derive salary drivers based on values
  const boosters = [];
  const anchors = [];

  if (student.cgpa >= 8.5) {
    boosters.push({ factor: "High Academic Standing (CGPA)", impact: "+ ₹2.0 LPA", desc: "Your CGPA is above 8.5, qualifying you for elite company cutoffs." });
  } else if (student.cgpa < 6.5) {
    anchors.push({ factor: "Low CGPA Rating", impact: "- ₹1.5 LPA", desc: "A CGPA below 6.5 restricts entry into top packages." });
  }

  if (student.programming_skills >= 80) {
    boosters.push({ factor: "Excellent Programming Score", impact: "+ ₹2.5 LPA", desc: "A coding score above 80% maps to higher-level engineering roles." });
  } else if (student.programming_skills < 60) {
    anchors.push({ factor: "Weak Programming Foundation", impact: "- ₹1.0 LPA", desc: "Strong coding skills are a prerequisite for major developers." });
  }

  if (student.internship === "Yes") {
    boosters.push({ factor: "Prior Internship Experience", impact: "+ ₹1.5 LPA", desc: "Hands-on work experience is highly valued during salary negotiations." });
  } else {
    anchors.push({ factor: "No Internship Exposure", impact: "Baseline", desc: "Having zero industry experience keeps salary closer to the standard entry tier." });
  }

  if (student.projects >= 3) {
    boosters.push({ factor: "Project Portfolios (3+ projects)", impact: "+ ₹1.2 LPA", desc: "Multiple active project listings show building capacity." });
  }

  if (student.backlogs > 0) {
    anchors.push({ factor: "Active Backlog History", impact: "- ₹1.2 LPA", desc: "Active backlogs disqualify students from many premium recruitment drives." });
  }

  return (
    <div className="pt-20 pb-16 px-6 max-w-5xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <span className="text-xs font-semibold text-violet-400 uppercase tracking-widest block">ML Regression Analysis</span>
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
          <IndianRupee className="text-violet-400" /> Expected Salary Prediction
        </h1>
        <p className="text-xs text-gray-400 font-medium">
          Estimating starting salary package range based on academic GPA, programming scores, projects, internship, and interview performance using a Random Forest Regressor.
        </p>
      </div>

      {/* Primary Figures */}
      <div className="glass-card p-8 border border-white/5 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Predicted Package Range</span>
          <h2 className="text-3xl md:text-5xl font-black text-white flex justify-center items-center gap-1.5">
            <span className="text-violet-400">₹</span> {student.salary_low} LPA - {student.salary_high} LPA
          </h2>
          <p className="text-xs text-gray-500 font-medium">
            Calculated median predicted value: <span className="text-white font-semibold">₹{student.salary_avg} LPA</span>
          </p>
        </div>

        {/* Chart representation */}
        <div className="h-64 w-full mt-6 flex justify-center items-center">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salaryData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="name" stroke="#9ca3af" tick={{ fontSize: 11 }} />
              <YAxis stroke="#9ca3af" tickFormatter={(v) => `${v}L`} />
              <Tooltip formatter={(value) => [`${value} LPA`, "Amount"]} contentStyle={{ backgroundColor: "#1e1b4b", borderColor: "#312e81" }} />
              <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                {salaryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Salary Drivers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Boosters */}
        <div className="glass-card p-6 border border-white/5 space-y-4">
          <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
            <ArrowUpRight size={18} />
            Package Boosters
          </h3>
          <div className="space-y-3">
            {boosters.length > 0 ? (
              boosters.map((b, i) => (
                <div key={i} className="p-3 bg-emerald-950/10 border border-emerald-500/10 rounded-xl flex justify-between items-start gap-4">
                  <div>
                    <h4 className="text-xs font-bold text-white">{b.factor}</h4>
                    <p className="text-[10px] text-gray-400 leading-normal mt-0.5">{b.desc}</p>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 whitespace-nowrap">{b.impact}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-500 py-6 text-center">No major positive multipliers identified. Improve programming skills or CGPA to unlock boosters.</p>
            )}
          </div>
        </div>

        {/* Anchors */}
        <div className="glass-card p-6 border border-white/5 space-y-4">
          <h3 className="text-sm font-bold text-rose-400 uppercase tracking-widest flex items-center gap-1.5">
            <MinusCircle size={18} />
            Package Drag Factors
          </h3>
          <div className="space-y-3">
            {anchors.length > 0 ? (
              anchors.map((a, i) => (
                <div key={i} className="p-3 bg-rose-950/10 border border-rose-500/10 rounded-xl flex justify-between items-start gap-4">
                  <div>
                    <h4 className="text-xs font-bold text-white">{a.factor}</h4>
                    <p className="text-[10px] text-gray-400 leading-normal mt-0.5">{a.desc}</p>
                  </div>
                  <span className="text-[10px] font-bold text-rose-400 whitespace-nowrap">{a.impact}</span>
                </div>
              ))
            ) : (
              <div className="p-3 bg-emerald-950/10 border border-emerald-500/10 rounded-xl flex items-center gap-2">
                <Award className="text-emerald-400" size={16} />
                <p className="text-xs text-emerald-400 font-semibold">Zero drag factors! Your profile is clean and fully optimized.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
    </div>
  );
}

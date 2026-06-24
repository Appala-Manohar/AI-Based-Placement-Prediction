import React from "react";
import { Link } from "react-router-dom";
import { 
  FileText, 
  AlertCircle, 
  Printer, 
  ChevronRight,
  TrendingUp,
  Award,
  Building2,
  Map,
  CheckCircle2,
  XCircle,
  Download
} from "lucide-react";

export default function Reports({ student }) {
  if (!student) {
    return (
      <div className="pt-24 px-6 max-w-4xl mx-auto text-center h-[70vh] flex flex-col justify-center items-center">
        <div className="w-16 h-16 bg-red-950/20 border border-red-500/20 text-red-400 rounded-full flex items-center justify-center mb-4">
          <AlertCircle size={28} />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">No Student Profile Loaded</h2>
        <p className="text-gray-400 mb-6">Please enter your Register Number in the sidebar or create a profile to generate reports.</p>
        <Link to="/predict-form" className="bg-violet-600 hover:bg-violet-500 text-white font-bold px-6 py-3 rounded-xl transition cursor-pointer">
          Open Prediction Form
        </Link>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    window.location.href = `http://localhost:8000/api/pdf-report/${student.register_no}`;
  };

  const isPlaced = student.placed === 1;

  return (
    <div className="pt-20 pb-16 px-6 max-w-4xl mx-auto space-y-8 animate-fade-in">
      
      {/* Printable Actions (no-print) */}
      <div className="flex justify-between items-center gap-4 no-print">
        <div>
          <span className="text-xs font-semibold text-violet-400 uppercase tracking-widest block">Export Center</span>
          <h1 className="text-2xl font-extrabold text-white">Generate Student Report</h1>
        </div>
        <button
          onClick={handleDownloadPDF}
          className="bg-violet-600 hover:bg-violet-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-lg shadow-violet-500/10 transition"
        >
          <Download size={14} /> Download PDF Report
        </button>
      </div>

      {/* Main Report Page (formatted for printing) */}
      <div className="bg-white text-gray-900 rounded-2xl p-8 border border-gray-200 shadow-md space-y-8 print-container relative">
        
        {/* Decorative print headers (only visible in print or report page) */}
        <div className="flex justify-between items-center border-b border-gray-300 pb-5">
          <div>
            <h2 className="text-xl font-black uppercase text-violet-900 tracking-tight">AI-Based Placement Prediction System</h2>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mt-0.5">Comprehensive Performance & Career Readiness Evaluation</p>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-gray-800 bg-gray-100 border border-gray-200 px-3 py-1 rounded-full uppercase">
              Official Report
            </span>
          </div>
        </div>

        {/* Section 1: Student Demographics */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-violet-900 uppercase tracking-widest border-b border-gray-200 pb-1">
            1. Student Academic Details
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-[10px] text-gray-500 font-bold block uppercase">Student Name</span>
              <p className="font-bold text-black text-sm">{student.student_name}</p>
            </div>
            <div>
              <span className="text-[10px] text-gray-500 font-bold block uppercase">Register Number</span>
              <p className="font-bold text-black text-sm">{student.register_no}</p>
            </div>
            <div>
              <span className="text-[10px] text-gray-500 font-bold block uppercase">Department</span>
              <p className="font-bold text-black text-sm">{student.department}</p>
            </div>
            <div>
              <span className="text-[10px] text-gray-500 font-bold block uppercase">Gender</span>
              <p className="font-bold text-black text-sm">{student.gender}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs pt-2">
            <div>
              <span className="text-[10px] text-gray-500 font-bold block uppercase">10th Percentage</span>
              <p className="font-semibold text-gray-800">{student.tenth_percentage}%</p>
            </div>
            <div>
              <span className="text-[10px] text-gray-500 font-bold block uppercase">12th Percentage</span>
              <p className="font-semibold text-gray-800">{student.twelfth_percentage}%</p>
            </div>
            <div>
              <span className="text-[10px] text-gray-500 font-bold block uppercase">Current CGPA</span>
              <p className="font-bold text-violet-800">{student.cgpa} / 10.0</p>
            </div>
            <div>
              <span className="text-[10px] text-gray-500 font-bold block uppercase">Active Backlogs</span>
              <p className="font-semibold text-gray-800">{student.backlogs}</p>
            </div>
          </div>
        </div>

        {/* Section 2: Predictive Placement Metrics */}
        <div className="space-y-4 pt-2">
          <h3 className="text-xs font-bold text-violet-900 uppercase tracking-widest border-b border-gray-200 pb-1">
            2. ML Predictive Evaluation
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl text-center space-y-1">
              <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block">Placement Status</span>
              <div className="flex items-center justify-center gap-1">
                {isPlaced ? <CheckCircle2 className="text-emerald-600" size={16} /> : <XCircle className="text-rose-600" size={16} />}
                <p className={`text-base font-black uppercase ${isPlaced ? "text-emerald-700" : "text-rose-700"}`}>
                  {isPlaced ? "PLACED" : "NOT PLACED"}
                </p>
              </div>
            </div>

            <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl text-center space-y-1">
              <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block">Probability</span>
              <p className="text-lg font-black text-black">{Math.round(student.probability * 100)}%</p>
            </div>

            <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl text-center space-y-1">
              <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block">Readiness Score</span>
              <p className="text-lg font-black text-black">{student.readiness_score} / 100</p>
            </div>

            <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl text-center space-y-1">
              <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block">Expected Packages</span>
              <p className="text-sm font-bold text-gray-800">₹{student.salary_low} - ₹{student.salary_high} LPA</p>
            </div>
          </div>
          
          <p className="text-[11px] text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100 font-medium">
            <span className="font-bold text-gray-800">Decision Rationale: </span>{student.prediction_reason}
          </p>
        </div>

        {/* Section 3: Skill Gaps & Weaknesses */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-bold text-violet-900 uppercase tracking-widest border-b border-gray-200 pb-1">
            3. Skill Gap Analysis
          </h3>
          <div className="space-y-2.5">
            {student.weak_areas && student.weak_areas.length > 0 ? (
              student.weak_areas.map((w, idx) => (
                <div key={idx} className="text-xs flex justify-between items-start gap-4">
                  <div className="space-y-0.5 flex-1">
                    <span className="font-bold text-black">{w.area}</span>
                    <p className="text-[11px] text-gray-500 leading-normal">{w.suggestion}</p>
                  </div>
                  <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded">
                    Score: {w.score}%
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-emerald-600 font-semibold">No critical skill gaps identified. Student displays exceptional readiness levels.</p>
            )}
          </div>
        </div>

        {/* Section 4: Company Matches */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-bold text-violet-900 uppercase tracking-widest border-b border-gray-200 pb-1">
            4. Suggested Companies Matching Profile
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {student.recommended_companies && student.recommended_companies.slice(0, 4).map((c, i) => (
              <div key={i} className="p-3 bg-gray-50 border border-gray-200 rounded-lg flex justify-between items-center text-xs">
                <div>
                  <h4 className="font-bold text-black">{c.name}</h4>
                  <p className="text-[10px] text-gray-500">Skills: {c.skills}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-violet-800">{c.package}</p>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.25 rounded border border-emerald-100">
                    {c.match}% match
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 5: Learning Roadmap */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-bold text-violet-900 uppercase tracking-widest border-b border-gray-200 pb-1">
            5. Recommended Study Roadmaps
          </h3>
          <div className="space-y-3">
            {student.learning_roadmap && student.learning_roadmap.slice(0, 3).map((r, i) => (
              <div key={i} className="text-xs">
                <h4 className="font-bold text-black">{r.week}: {r.focus}</h4>
                <ul className="mt-1 grid grid-cols-1 md:grid-cols-3 gap-2">
                  {r.tasks.map((t, idx) => (
                    <li key={idx} className="text-[10px] text-gray-600 bg-gray-50 p-2 rounded border border-gray-100 leading-normal flex items-start gap-1">
                      <span className="text-violet-700 font-bold">•</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Report Footer */}
        <div className="pt-8 border-t border-gray-300 text-center flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-gray-400 font-medium uppercase tracking-wider">
          <span>Date Generated: {new Date().toLocaleDateString()}</span>
          <span>Validated by: Placement Predictive Classifier Model</span>
          <span>Signature: Placement Cell Office</span>
        </div>

      </div>
    </div>
  );
}

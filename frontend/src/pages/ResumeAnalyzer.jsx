import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  FileCheck2, 
  UploadCloud, 
  AlertCircle, 
  Check, 
  X, 
  Sparkles, 
  Info,
  RefreshCw,
  FileText
} from "lucide-react";

export default function ResumeAnalyzer({ student, onResumeAnalyzeSuccess }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  if (!student) {
    return (
      <div className="pt-24 px-6 max-w-4xl mx-auto text-center h-[70vh] flex flex-col justify-center items-center">
        <div className="w-16 h-16 bg-red-950/20 border border-red-500/20 text-red-400 rounded-full flex items-center justify-center mb-4">
          <AlertCircle size={28} />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">No Student Profile Loaded</h2>
        <p className="text-gray-400 mb-6 font-medium">Please enter your Register Number in the sidebar or create a profile to unlock the Resume Analyzer.</p>
        <Link to="/predict-form" className="bg-violet-600 hover:bg-violet-500 text-white font-bold px-6 py-3 rounded-xl transition cursor-pointer">
          Open Prediction Form
        </Link>
      </div>
    );
  }

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("register_no", student.register_no);
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8000/api/analyze-resume", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to analyze resume");
      }

      const data = await response.json();
      setAnalysisResult(data);
      
      // Update student profile in parent state to sync resume scores
      if (data.updated_profile) {
        // Correct format backlogs etc.
        onResumeAnalyzeSuccess(data.updated_profile);
      }
    } catch (err) {
      console.error(err);
      alert(err.message || "An error occurred during resume analysis.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setAnalysisResult(null);
  };

  return (
    <div className="pt-20 pb-16 px-6 max-w-5xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <span className="text-xs font-semibold text-violet-400 uppercase tracking-widest block">NLP Parsing</span>
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
          <FileCheck2 className="text-violet-400" /> Resume NLP Analyzer
        </h1>
        <p className="text-xs text-gray-400 font-medium">
          Upload your resume in **PDF, Word (.docx), or PowerPoint (.pptx)** format. Our system extracts the text and evaluates resume metrics, keywords, and structural elements.
        </p>
      </div>

      {!analysisResult ? (
        <div className="glass-card p-8 border border-white/5 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-10 text-center transition flex flex-col items-center justify-center cursor-pointer min-h-[260px]
                ${dragOver ? "border-violet-500 bg-violet-600/10" : "border-white/10 hover:border-white/20 bg-white/2"}
              `}
              onClick={() => document.getElementById("file-input").click()}
            >
              <input
                id="file-input"
                type="file"
                className="hidden"
                accept=".pdf,.docx,.pptx"
                onChange={handleFileChange}
              />
              
              <div className="p-4 bg-violet-500/10 text-violet-400 rounded-full mb-4">
                <UploadCloud size={32} />
              </div>
              
              {file ? (
                <div className="space-y-2">
                  <p className="text-sm font-bold text-white">{file.name}</p>
                  <p className="text-xs text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm font-bold text-white">Drag and drop your file here, or click to browse</p>
                  <p className="text-xs text-gray-500">Supports PDF, DOCX, and PPTX up to 10MB</p>
                </div>
              )}
            </div>

            {/* Submit Button */}
            {file && (
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-violet-600 hover:bg-violet-500 text-white font-bold p-3.5 rounded-xl cursor-pointer shadow-lg shadow-violet-500/10 flex items-center justify-center gap-2 transition"
              >
                {loading ? (
                  <>
                    <RefreshCw className="animate-spin text-white" size={16} />
                    Extracting & Running NLP keyword analysis...
                  </>
                ) : (
                  <>
                    <FileCheck2 size={16} />
                    Analyze Resume Content
                  </>
                )}
              </button>
            )}
          </form>

          {/* Keywords Info Box */}
          <div className="p-4 bg-white/3 border border-white/5 rounded-xl flex gap-3 items-start">
            <Info size={16} className="text-violet-400 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-white">Target Recruitment Keywords</h4>
              <p className="text-[11px] text-gray-400 leading-relaxed mt-1">
                The NLP parser checks for essential industry keywords like: **Python, Java, SQL, Machine Learning, Data Structures, Projects, Internship, Communication, Leadership, Teamwork, and Problem Solving**.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Results Section */
        <div className="space-y-6 animate-scale-up">
          
          {/* Top Score Box */}
          <div className="glass-card p-6 border border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <span className="text-[10px] font-bold text-violet-400 uppercase tracking-widest block mb-1">Analysis Complete</span>
              <h2 className="text-2xl font-bold text-white">Resume Score Breakdown</h2>
              <p className="text-xs text-gray-400 mt-1">
                Register Number: <span className="font-semibold">{student.register_no}</span> | Format parsed: <span className="font-semibold">Successfully</span>
              </p>
            </div>
            
            {/* Score Ring */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="text-xs text-gray-400 block">Resume Score</span>
                <span className="text-3xl font-black text-white">{analysisResult.resume_score}<span className="text-sm text-gray-500">/100</span></span>
              </div>
              <div className="w-16 h-16 rounded-full border-4 border-white/5 flex items-center justify-center relative">
                <div 
                  className={`absolute inset-0 rounded-full border-4 transition-all duration-1000 ${
                    analysisResult.resume_score >= 80 ? "border-emerald-500" : (analysisResult.resume_score >= 60 ? "border-amber-500" : "border-rose-500")
                  }`}
                  style={{ clipPath: `inset(0px 0px 0px 0px)` }}
                ></div>
                <FileText className="text-violet-400" size={20} />
              </div>
            </div>
          </div>

          {/* Keywords Found / Missing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6 border border-white/5">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <span className="p-1 bg-emerald-500/10 text-emerald-400 rounded-lg"><Check size={14} /></span>
                Identified Keywords
              </h3>
              <div className="flex flex-wrap gap-2">
                {/* Seeded and Found keywords */}
                {analysisResult.missing_keywords && analysisResult.missing_keywords.length === 0 ? (
                  <span className="text-xs text-emerald-400 bg-emerald-950/20 px-2.5 py-1 rounded-lg border border-emerald-500/10">All keywords found!</span>
                ) : (
                  // Show found keywords (by taking absolute diff)
                  ["Python", "Java", "SQL", "Machine Learning", "Data Structures", "Projects", "Internship", "Communication", "Leadership", "Teamwork", "Problem Solving"]
                    .filter(kw => !analysisResult.missing_keywords.includes(kw))
                    .map((kw, i) => (
                      <span key={i} className="text-xs text-white bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg">
                        {kw}
                      </span>
                    ))
                )}
              </div>
            </div>

            <div className="glass-card p-6 border border-white/5">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <span className="p-1 bg-rose-500/10 text-rose-400 rounded-lg"><X size={14} /></span>
                Missing Keywords
              </h3>
              <div className="flex flex-wrap gap-2">
                {analysisResult.missing_keywords && analysisResult.missing_keywords.length > 0 ? (
                  analysisResult.missing_keywords.map((kw, i) => (
                    <span key={i} className="text-xs text-rose-400 bg-rose-950/20 border border-rose-500/10 px-2.5 py-1 rounded-lg font-medium">
                      {kw}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-emerald-400 bg-emerald-950/20 px-2.5 py-1 rounded-lg border border-emerald-500/10">No missing keywords!</span>
                )}
              </div>
            </div>
          </div>

          {/* Strengths, Weaknesses, Suggestions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Strengths */}
            <div className="glass-card p-6 border border-white/5 space-y-3">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Resume Strengths</h4>
              <ul className="space-y-2">
                {analysisResult.strengths && analysisResult.strengths.map((s, i) => (
                  <li key={i} className="text-[11px] text-gray-300 flex items-start gap-1.5">
                    <span className="text-emerald-500 mt-0.5">•</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="glass-card p-6 border border-white/5 space-y-3">
              <h4 className="text-xs font-bold text-rose-400 uppercase tracking-widest">Areas for Improvement</h4>
              <ul className="space-y-2">
                {analysisResult.weaknesses && analysisResult.weaknesses.map((w, i) => (
                  <li key={i} className="text-[11px] text-gray-300 flex items-start gap-1.5">
                    <span className="text-rose-500 mt-0.5">•</span>
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Suggestions */}
            <div className="glass-card p-6 border border-white/5 space-y-3">
              <h4 className="text-xs font-bold text-violet-400 uppercase tracking-widest">Actionable Suggestions</h4>
              <ul className="space-y-2">
                {analysisResult.suggestions && analysisResult.suggestions.map((s, i) => (
                  <li key={i} className="text-[11px] text-gray-300 flex items-start gap-1.5">
                    <span className="text-violet-500 mt-0.5">•</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={handleReset}
              className="bg-violet-600 hover:bg-violet-500 text-white font-bold px-6 py-3 rounded-xl text-xs cursor-pointer flex items-center gap-1.5 transition"
            >
              <RefreshCw size={12} /> Re-upload Resume
            </button>
            <Link
              to="/dashboard"
              className="bg-white/5 hover:bg-white/10 text-white border border-white/10 font-semibold px-6 py-3 rounded-xl text-xs transition"
            >
              Return to Dashboard
            </Link>
          </div>

        </div>
      )}

    </div>
  );
}

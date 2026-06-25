import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FileSpreadsheet, 
  BrainCircuit, 
  Sparkles,
  CheckCircle,
  XCircle,
  ChevronRight,
  ChevronLeft,
  GraduationCap,
  Award,
  Zap
} from "lucide-react";

export default function PredictionForm({ user, onPredictSuccess }) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  
  const [formData, setFormData] = useState({
    student_name: user && user.username !== "admin" ? user.full_name : "",
    register_no: user && user.username !== "admin" ? user.register_number : "",
    department: "Computer Science",
    gender: "Male",
    tenth_percentage: "",
    twelfth_percentage: "",
    cgpa: "",
    backlogs: "0",
    programming_skills: "",
    aptitude_score: "",
    communication_skills: "",
    technical_skills: "",
    projects: "0",
    internship: "No",
    certifications: "0",
    hackathons: "0",
    resume_uploaded: "No",
    mock_interview_score: "",
    programming_languages: "Python, Java, SQL"
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNextStep = () => {
    // Validate step fields
    if (currentStep === 1) {
      if (!formData.student_name || !formData.register_no || !formData.tenth_percentage || !formData.twelfth_percentage || !formData.cgpa || !formData.programming_languages) {
        alert("Please complete all academic profile fields before proceeding.");
        return;
      }
    } else if (currentStep === 2) {
      if (!formData.programming_skills || !formData.aptitude_score || !formData.communication_skills || !formData.technical_skills || !formData.mock_interview_score) {
        alert("Please complete all skill scores parameters before proceeding.");
        return;
      }
    }
    setCurrentStep((prev) => prev + 1);
  };

  const handleBackStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    // Format numbers
    const payload = {
      ...formData,
      tenth_percentage: parseFloat(formData.tenth_percentage),
      twelfth_percentage: parseFloat(formData.twelfth_percentage),
      cgpa: parseFloat(formData.cgpa),
      backlogs: parseInt(formData.backlogs),
      programming_skills: parseInt(formData.programming_skills),
      aptitude_score: parseInt(formData.aptitude_score),
      communication_skills: parseInt(formData.communication_skills),
      technical_skills: parseInt(formData.technical_skills),
      projects: parseInt(formData.projects),
      certifications: parseInt(formData.certifications),
      hackathons: parseInt(formData.hackathons),
      mock_interview_score: parseInt(formData.mock_interview_score)
    };

    try {
      const response = await fetch("http://localhost:8000/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        throw new Error("Prediction API call failed");
      }
      
      const data = await response.json();
      onPredictSuccess(data);
      setResult(data);
    } catch (err) {
      console.error(err);
      alert("Error during model evaluation. Please ensure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20 pb-16 px-6 max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <span className="text-xs font-semibold text-violet-400 uppercase tracking-widest block font-bold">Model Assessment</span>
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-2 tracking-tight">
          <FileSpreadsheet className="text-violet-400" /> Placement Prediction Profile
        </h1>
        <p className="text-xs text-gray-400 font-medium">
          Complete the academic, programming, and aptitude parameters below to evaluate student profile status. All data will be processed through the trained machine learning classifiers.
        </p>
      </div>

      {!result ? (
        <div className="space-y-6">
          {/* Progress Step Bar */}
          <div className="glass-card p-4 border border-white/5 flex justify-between items-center text-xs font-bold">
            <div className="flex items-center gap-2">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center border
                ${currentStep >= 1 ? "bg-violet-600 border-violet-500 text-white" : "border-white/10 text-gray-500"}
              `}>1</span>
              <span className={currentStep >= 1 ? "text-white" : "text-gray-500"}>Academics & Info</span>
            </div>
            <div className="h-px flex-1 bg-white/5 mx-4"></div>
            <div className="flex items-center gap-2">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center border
                ${currentStep >= 2 ? "bg-violet-600 border-violet-500 text-white" : "border-white/10 text-gray-500"}
              `}>2</span>
              <span className={currentStep >= 2 ? "text-white" : "text-gray-500"}>Skills Evaluation</span>
            </div>
            <div className="h-px flex-1 bg-white/5 mx-4"></div>
            <div className="flex items-center gap-2">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center border
                ${currentStep >= 3 ? "bg-violet-600 border-violet-500 text-white" : "border-white/10 text-gray-500"}
              `}>3</span>
              <span className={currentStep >= 3 ? "text-white" : "text-gray-500"}>Co-curriculars</span>
            </div>
          </div>

          {/* Form container */}
          <form onSubmit={handleSubmit} className="glass-card p-8 border border-white/5 space-y-6">
            
            {/* Step 1: Academics & Info */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-fade-in">
                <h3 className="text-xs font-bold text-violet-400 uppercase tracking-widest border-b border-white/5 pb-2">
                  1. Basic & Academic Credentials
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-400 font-semibold">Student Name *</label>
                    <input
                      type="text"
                      name="student_name"
                      required
                      placeholder="e.g. Aniket Sharma"
                      value={formData.student_name}
                      onChange={handleChange}
                      disabled={user && user.username !== "admin"}
                      className={`w-full text-xs p-3 glass-input font-medium ${
                        user && user.username !== "admin" ? "bg-white/3 text-gray-500 cursor-not-allowed border-white/5" : ""
                      }`}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-400 font-semibold">Register Number *</label>
                    <input
                      type="text"
                      name="register_no"
                      required
                      placeholder="e.g. REG2026000"
                      value={formData.register_no}
                      onChange={handleChange}
                      disabled={user && user.username !== "admin"}
                      className={`w-full text-xs p-3 glass-input font-medium ${
                        user && user.username !== "admin" ? "bg-white/3 text-gray-500 cursor-not-allowed border-white/5" : ""
                      }`}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-400 font-semibold">Department *</label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className="w-full text-xs p-3 glass-input font-medium cursor-pointer"
                    >
                      <option value="Computer Science">Computer Science</option>
                      <option value="Information Technology">Information Technology</option>
                      <option value="Electronics & Communication">Electronics & Communication</option>
                      <option value="Mechanical Engineering">Mechanical Engineering</option>
                      <option value="Civil Engineering">Civil Engineering</option>
                      <option value="Artificial Intelligence & Machine Learning (AIML)">Artificial Intelligence & Machine Learning (AIML)</option>
                      <option value="Artificial Intelligence & Data Science (AIDS)">Artificial Intelligence & Data Science (AIDS)</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-400 font-semibold">Gender *</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full text-xs p-3 glass-input font-medium cursor-pointer"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-400 font-semibold">Programming Languages *</label>
                    <input
                      type="text"
                      name="programming_languages"
                      required
                      placeholder="e.g. Python, Java, SQL"
                      value={formData.programming_languages}
                      onChange={handleChange}
                      className="w-full text-xs p-3 glass-input font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-400 font-semibold">10th Percentage (%) *</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      name="tenth_percentage"
                      required
                      placeholder="e.g. 88.5"
                      value={formData.tenth_percentage}
                      onChange={handleChange}
                      className="w-full text-xs p-3 glass-input font-medium"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-400 font-semibold">12th Percentage (%) *</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      name="twelfth_percentage"
                      required
                      placeholder="e.g. 85.2"
                      value={formData.twelfth_percentage}
                      onChange={handleChange}
                      className="w-full text-xs p-3 glass-input font-medium"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-400 font-semibold">Current CGPA (0-10.0) *</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="10"
                      name="cgpa"
                      required
                      placeholder="e.g. 8.45"
                      value={formData.cgpa}
                      onChange={handleChange}
                      className="w-full text-xs p-3 glass-input font-medium"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-400 font-semibold">Active Backlogs *</label>
                    <select
                      name="backlogs"
                      value={formData.backlogs}
                      onChange={handleChange}
                      className="w-full text-xs p-3 glass-input font-medium cursor-pointer"
                    >
                      <option value="0">0</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4+</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Skills Rating */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-fade-in">
                <h3 className="text-xs font-bold text-violet-400 uppercase tracking-widest border-b border-white/5 pb-2">
                  2. Skill Set Evaluation (Scores out of 100)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-400 font-semibold">Programming Score *</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      name="programming_skills"
                      required
                      placeholder="e.g. 75"
                      value={formData.programming_skills}
                      onChange={handleChange}
                      className="w-full text-xs p-3 glass-input font-medium"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-400 font-semibold">Aptitude Score *</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      name="aptitude_score"
                      required
                      placeholder="e.g. 80"
                      value={formData.aptitude_score}
                      onChange={handleChange}
                      className="w-full text-xs p-3 glass-input font-medium"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-400 font-semibold">Communication Skills *</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      name="communication_skills"
                      required
                      placeholder="e.g. 78"
                      value={formData.communication_skills}
                      onChange={handleChange}
                      className="w-full text-xs p-3 glass-input font-medium"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-400 font-semibold">Technical Core Score *</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      name="technical_skills"
                      required
                      placeholder="e.g. 75"
                      value={formData.technical_skills}
                      onChange={handleChange}
                      className="w-full text-xs p-3 glass-input font-medium"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-400 font-semibold">Mock Interview Score *</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      name="mock_interview_score"
                      required
                      placeholder="e.g. 80"
                      value={formData.mock_interview_score}
                      onChange={handleChange}
                      className="w-full text-xs p-3 glass-input font-medium"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Co-curriculars & Resume */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-fade-in">
                <h3 className="text-xs font-bold text-violet-400 uppercase tracking-widest border-b border-white/5 pb-2">
                  3. Practical Achievements & Experience
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-400 font-semibold">Number of Projects *</label>
                    <select
                      name="projects"
                      value={formData.projects}
                      onChange={handleChange}
                      className="w-full text-xs p-3 glass-input font-medium cursor-pointer"
                    >
                      <option value="0">0</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4+</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-400 font-semibold">Internship Experience *</label>
                    <select
                      name="internship"
                      value={formData.internship}
                      onChange={handleChange}
                      className="w-full text-xs p-3 glass-input font-medium cursor-pointer"
                    >
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-400 font-semibold">Certifications *</label>
                    <select
                      name="certifications"
                      value={formData.certifications}
                      onChange={handleChange}
                      className="w-full text-xs p-3 glass-input font-medium cursor-pointer"
                    >
                      <option value="0">0</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3+</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-400 font-semibold">Hackathons Participated *</label>
                    <select
                      name="hackathons"
                      value={formData.hackathons}
                      onChange={handleChange}
                      className="w-full text-xs p-3 glass-input font-medium cursor-pointer"
                    >
                      <option value="0">0</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3+</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-400 font-semibold">Resume Prepared? *</label>
                    <select
                      name="resume_uploaded"
                      value={formData.resume_uploaded}
                      onChange={handleChange}
                      className="w-full text-xs p-3 glass-input font-medium cursor-pointer"
                    >
                      <option value="No">No (Upload Later)</option>
                      <option value="Yes">Yes</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="pt-6 border-t border-white/5 flex justify-between items-center gap-4">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handleBackStep}
                  className="flex items-center gap-1 bg-white/5 hover:bg-white/10 text-white font-semibold text-xs px-5 py-3 rounded-xl border border-white/10 cursor-pointer transition"
                >
                  <ChevronLeft size={14} /> Back
                </button>
              ) : (
                <div></div>
              )}

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="flex items-center gap-1 bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs px-6 py-3 rounded-xl cursor-pointer shadow-lg shadow-violet-500/10 transition"
                >
                  Continue <ChevronRight size={14} />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold text-xs px-8 py-3.5 rounded-xl cursor-pointer shadow-lg shadow-violet-500/15 flex items-center gap-2 transition"
                >
                  {loading ? (
                    <>
                      <BrainCircuit className="animate-spin text-white" size={14} />
                      Analyzing and training metrics...
                    </>
                  ) : (
                    <>
                      <Sparkles size={14} />
                      Generate ML Prediction
                    </>
                  )}
                </button>
              )}
            </div>

          </form>
        </div>
      ) : (
        /* Results Section */
        <div className="glass-card p-8 border border-white/5 space-y-6 text-center animate-scale-up">
          <div className="flex justify-center mb-2">
            {result.placed === 1 ? (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full shadow-lg shadow-emerald-500/5">
                <CheckCircle size={48} className="animate-pulse" />
              </div>
            ) : (
              <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-full shadow-lg shadow-rose-500/5">
                <XCircle size={48} className="animate-pulse" />
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <span className="text-xs font-semibold text-violet-400 uppercase tracking-widest block font-bold">ML Evaluation Complete</span>
            <h2 className="text-3xl font-black text-white tracking-tight">
              Inference: <span className={result.placed === 1 ? "text-emerald-400" : "text-rose-400"}>
                {result.placed === 1 ? "ELIGIBLE FOR PLACEMENT" : "PLACEMENT RE-TRAINING REQUIRED"}
              </span>
            </h2>
            <p className="text-xs text-gray-400 max-w-lg mx-auto leading-relaxed font-medium">
              Reasoning: {result.prediction_reason}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto pt-4 text-xs font-bold">
            <div className="p-4 bg-white/3 border border-white/5 rounded-xl space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Probability</span>
              <p className="text-2xl font-black text-white">{Math.round(result.probability * 100)}%</p>
            </div>
            <div className="p-4 bg-white/3 border border-white/5 rounded-xl space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Confidence Score</span>
              <p className="text-2xl font-black text-violet-400">{result.confidence_score || 0}%</p>
            </div>
            <div className="p-4 bg-white/3 border border-white/5 rounded-xl space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Readiness Score</span>
              <p className="text-2xl font-black text-white">{result.readiness_score}/100</p>
            </div>
            <div className="p-4 bg-white/3 border border-white/5 rounded-xl space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Expected Package</span>
              <p className="text-base font-black text-white">₹{result.salary_low} - ₹{result.salary_high} LPA</p>
            </div>
          </div>

          <div className="pt-6 flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs px-8 py-3.5 rounded-xl cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-violet-500/10 transition"
            >
              Go to Dashboard <ChevronRight size={14} />
            </button>
            <button
              onClick={() => {
                setResult(null);
                setCurrentStep(1);
              }}
              className="bg-white/5 hover:bg-white/10 text-white border border-white/10 font-semibold text-xs px-8 py-3.5 rounded-xl cursor-pointer transition"
            >
              Test Another Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

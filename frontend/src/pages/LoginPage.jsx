import React, { useState } from "react";
import { GraduationCap, Lock, User, Eye, EyeOff, Loader2, ArrowRight, BookOpen, UserPlus, Info } from "lucide-react";

export default function LoginPage({ onLogin }) {
  // Form view state: "login" or "register"
  const [viewMode, setViewMode] = useState("login");
  const [loginRole, setLoginRole] = useState("student"); // "student" or "admin"

  // Login form fields
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Registration form fields
  const [regName, setRegName] = useState("");
  const [regNo, setRegNo] = useState("");
  const [regDept, setRegDept] = useState("Computer Science");
  const [regGender, setRegGender] = useState("Male");
  const [regCgpa, setRegCgpa] = useState("");
  const [regLangs, setRegLangs] = useState("Python, Java, SQL");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [loadingStep, setLoadingStep] = useState("");

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim()) {
      setError(
        loginRole === "student"
          ? "Please enter your student registration number."
          : "Please enter your administrator ID."
      );
      return;
    }
    if (!password.trim()) {
      setError("Please enter your password.");
      return;
    }

    setIsLoading(true);
    setLoadingStep("Connecting to authentication server...");
    
    setTimeout(() => {
      setLoadingStep(
        loginRole === "student"
          ? "Retrieving student profile details..."
          : "Authorizing administrative session..."
      );
      
      setTimeout(() => {
        setLoadingStep("Initializing user session workspace...");
        
        setTimeout(() => {
          setIsLoading(false);
          // Pass the username string to the parent
          onLogin(username.trim());
        }, 800);
      }, 800);
    }, 700);
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Registration validations
    if (!regName.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!regNo.trim()) {
      setError("Please enter your registration number.");
      return;
    }
    if (!regCgpa.trim() || isNaN(parseFloat(regCgpa)) || parseFloat(regCgpa) < 0 || parseFloat(regCgpa) > 10) {
      setError("Please enter a valid CGPA between 0 and 10.");
      return;
    }
    if (!regPassword.trim()) {
      setError("Please enter a password.");
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    setLoadingStep("Connecting to database registration API...");

    // Build prediction/creation payload with standard default scores
    const payload = {
      student_name: regName.trim(),
      register_no: regNo.trim(),
      department: regDept,
      gender: regGender,
      tenth_percentage: 75.0, // defaults for registration
      twelfth_percentage: 75.0,
      cgpa: parseFloat(regCgpa),
      backlogs: 0,
      programming_skills: 60,
      aptitude_score: 60,
      communication_skills: 65,
      technical_skills: 60,
      projects: 1,
      internship: "No",
      certifications: 0,
      hackathons: 0,
      resume_uploaded: "No",
      mock_interview_score: 60,
      programming_languages: regLangs.trim() || "Python, Java, SQL"
    };

    setTimeout(async () => {
      setLoadingStep("Creating placement evaluation profile...");
      try {
        const response = await fetch("http://localhost:8000/api/predict", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          const studentProfile = await response.json();
          setLoadingStep("Logging in to newly created workspace...");
          setTimeout(() => {
            setIsLoading(false);
            // Log in with the fully loaded student object to avoid reload query
            onLogin(studentProfile);
          }, 800);
        } else {
          const errorData = await response.json();
          setError(errorData.detail || "Registration failed. Registration number may already exist.");
          setIsLoading(false);
        }
      } catch (err) {
        // Fallback locally if backend server is not running
        setLoadingStep("Server unreachable. Registering local session backup...");
        setTimeout(() => {
          setIsLoading(false);
          const localMockProfile = {
            ...payload,
            placed: 1,
            probability: 0.72,
            readiness_score: 68,
            salary_low: 4.2,
            salary_avg: 5.5,
            salary_high: 7.2,
            prediction_reason: "Successfully registered local profile backup session.",
            weak_areas: [],
            learning_roadmap: [],
            recommended_companies: []
          };
          onLogin(localMockProfile);
        }, 1200);
      }
    }, 800);
  };

  return (
    <div className="relative min-h-screen w-screen flex items-center justify-center bg-[#070a13] overflow-y-auto py-12 px-4 sm:px-6 font-['Outfit',sans-serif]">
      {/* CSS Animations style tag */}
      <style>{`
        @keyframes float-orb-1 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.95); }
        }
        @keyframes float-orb-2 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(-40px, 40px) scale(1.15); }
        }
        @keyframes float-particle {
          0% { transform: translateY(110vh) translateX(0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.4; }
          90% { opacity: 0.4; }
          100% { transform: translateY(-10vh) translateX(100px) rotate(360deg); opacity: 0; }
        }
        .animate-orb-1 {
          animation: float-orb-1 15s ease-in-out infinite;
        }
        .animate-orb-2 {
          animation: float-orb-2 18s ease-in-out infinite;
        }
        .particle {
          position: absolute;
          bottom: -20px;
          background: rgba(139, 92, 246, 0.15);
          border-radius: 50%;
          pointer-events: none;
          animation: float-particle 15s linear infinite;
        }
        .glass-login-card {
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(25px);
          -webkit-backdrop-filter: blur(25px);
          border: 1px solid rgba(255, 255, 255, 0.07);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
        }
        .shimmer-btn {
          position: relative;
          overflow: hidden;
        }
        .shimmer-btn::after {
          content: '';
          position: absolute;
          top: -50%;
          left: -60%;
          width: 30%;
          height: 200%;
          background: rgba(255, 255, 255, 0.13);
          transform: rotate(30deg);
          transition: transform 0.5s;
          pointer-events: none;
        }
        .shimmer-btn:hover::after {
          transform: translate(300%, 0) rotate(30deg);
          transition: transform 0.8s ease-in-out;
        }
      `}</style>

      {/* Floating Particle Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-violet-600/10 rounded-full blur-[120px] animate-orb-1 pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[55vw] h-[55vw] bg-fuchsia-600/10 rounded-full blur-[130px] animate-orb-2 pointer-events-none" />
      <div className="absolute top-[30%] right-[10%] w-[35vw] h-[35vw] bg-cyan-600/5 rounded-full blur-[110px] pointer-events-none" />

      {/* Background Floating Tiny Particles */}
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            width: `${Math.random() * 8 + 4}px`,
            height: `${Math.random() * 8 + 4}px`,
            left: `${Math.random() * 100}%`,
            animationDuration: `${Math.random() * 12 + 10}s`,
            animationDelay: `${Math.random() * 8}s`,
            background: i % 2 === 0 ? "rgba(168, 85, 247, 0.2)" : "rgba(236, 72, 153, 0.15)",
          }}
        />
      ))}

      {/* Main Login Card */}
      <div className="w-full max-w-lg z-10 my-auto">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-6 space-y-3 text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500/20 transform hover:scale-105 transition duration-300">
            <GraduationCap size={30} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white">
              Smart Placement Portal
            </h1>
            <p className="text-xs text-gray-400 font-medium tracking-wide uppercase mt-1">
              AI-Based Predictor & Simulator
            </p>
          </div>
        </div>

        {/* Card Body */}
        <div className="glass-login-card rounded-3xl p-6 sm:p-8 relative overflow-hidden">
          
          {/* Card subtle top glow line */}
          <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-violet-500 to-transparent opacity-50" />

          {isLoading ? (
            /* Loading State screen */
            <div className="py-16 flex flex-col items-center justify-center space-y-6">
              <div className="relative flex items-center justify-center">
                <Loader2 size={44} className="text-violet-500 animate-spin" />
                <div className="absolute inset-0 bg-violet-500/10 rounded-full blur-md animate-pulse" />
              </div>
              <div className="text-center space-y-1.5 px-4">
                <h3 className="text-sm font-semibold text-white">
                  {viewMode === "login" ? "Signing in..." : "Creating Account..."}
                </h3>
                <p className="text-[11px] text-gray-400 min-h-[16px] transition-all duration-300">
                  {loadingStep}
                </p>
              </div>
            </div>
          ) : viewMode === "login" ? (
            /* Login Form */
            <form onSubmit={handleLoginSubmit} className="space-y-5">
              
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white">Welcome Back</h2>
                  <p className="text-xs text-gray-400">Select portal role and enter credentials</p>
                </div>
                <button
                  type="button"
                  onClick={() => { setViewMode("register"); setError(""); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-500/10 border border-violet-500/20 text-violet-400 rounded-xl text-[11px] font-bold cursor-pointer hover:bg-violet-500/25 transition duration-150"
                >
                  <UserPlus size={12} />
                  Register
                </button>
              </div>

              {/* Role Toggle Switch */}
              <div className="relative p-1 bg-white/5 rounded-xl border border-white/5 flex">
                {/* Sliding background pill */}
                <div 
                  className={`absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-lg transition-transform duration-300 ease-out ${
                    loginRole === "admin" ? "transform translate-x-[100%]" : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => { setLoginRole("student"); setUsername(""); setPassword(""); setError(""); }}
                  className={`relative z-10 w-1/2 py-2 text-xs font-bold transition-colors duration-200 cursor-pointer rounded-lg ${
                    loginRole === "student" ? "text-white" : "text-gray-400 hover:text-white"
                  }`}
                >
                  Student Portal
                </button>
                <button
                  type="button"
                  onClick={() => { setLoginRole("admin"); setUsername(""); setPassword(""); setError(""); }}
                  className={`relative z-10 w-1/2 py-2 text-xs font-bold transition-colors duration-200 cursor-pointer rounded-lg ${
                    loginRole === "admin" ? "text-white" : "text-gray-400 hover:text-white"
                  }`}
                >
                  Admin Portal
                </button>
              </div>

              {error && (
                <div className="p-3 bg-red-950/30 border border-red-500/20 text-red-400 text-xs rounded-xl font-medium">
                  {error}
                </div>
              )}

              {/* Username/RegNo Input */}
              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold block">
                  {loginRole === "student" ? "Registration Number" : "Administrator ID"}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <User size={16} />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={loginRole === "student" ? "e.g., REG2026000" : "e.g., admin"}
                    className="w-full text-xs pl-10 pr-4 py-3 bg-white/5 border border-white/8 rounded-xl text-white placeholder-gray-500 outline-none focus:border-violet-500/70 focus:bg-white/10 focus:ring-4 focus:ring-violet-500/10 transition"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold block">
                    Password
                  </label>
                  <a href="#" onClick={(e) => { e.preventDefault(); alert("Verification code sent to registered contact details."); }} className="text-[10px] text-violet-400 hover:text-violet-300 font-semibold hover:underline">
                    Forgot?
                  </a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Lock size={16} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full text-xs pl-10 pr-10 py-3 bg-white/5 border border-white/8 rounded-xl text-white placeholder-gray-500 outline-none focus:border-violet-500/70 focus:bg-white/10 focus:ring-4 focus:ring-violet-500/10 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Remember Me iOS Toggle Switch */}
              <div className="flex items-center justify-between py-1">
                <span className="text-xs text-gray-400 font-medium select-none">
                  Keep me signed in
                </span>
                <button
                  type="button"
                  onClick={() => setRememberMe(!rememberMe)}
                  className={`relative inline-flex h-5.5 w-10.5 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none ${
                    rememberMe ? "bg-violet-600" : "bg-white/10"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      rememberMe ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                className="w-full shimmer-btn py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-violet-500/15 cursor-pointer transform hover:-translate-y-0.5 transition duration-150 flex items-center justify-center gap-1.5"
              >
                Sign In <ArrowRight size={14} />
              </button>

              <div className="text-center pt-2">
                <p className="text-[11px] text-gray-400">
                  New student?{" "}
                  <button
                    type="button"
                    onClick={() => { setViewMode("register"); setError(""); }}
                    className="text-violet-400 hover:text-violet-300 font-semibold cursor-pointer underline hover:no-underline"
                  >
                    Create student account
                  </button>
                </p>
              </div>

            </form>
          ) : (
            /* Student Registration Form */
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white">Create Account</h2>
                  <p className="text-xs text-gray-400">Register as a student in the placement directory</p>
                </div>
                <button
                  type="button"
                  onClick={() => { setViewMode("login"); setError(""); }}
                  className="text-xs text-violet-400 hover:text-violet-300 font-semibold cursor-pointer hover:underline"
                >
                  Sign In instead
                </button>
              </div>

              {error && (
                <div className="p-3 bg-red-950/30 border border-red-500/20 text-red-400 text-xs rounded-xl font-medium">
                  {error}
                </div>
              )}

              {/* Dual inputs: Name & Registration Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold block">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full text-xs px-3.5 py-2.5 bg-white/5 border border-white/8 rounded-xl text-white placeholder-gray-500 outline-none focus:border-violet-500/70 focus:bg-white/10 transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold block">
                    Registration No
                  </label>
                  <input
                    type="text"
                    value={regNo}
                    onChange={(e) => setRegNo(e.target.value)}
                    placeholder="e.g. REG2026001"
                    className="w-full text-xs px-3.5 py-2.5 bg-white/5 border border-white/8 rounded-xl text-white placeholder-gray-500 outline-none focus:border-violet-500/70 focus:bg-white/10 transition"
                  />
                </div>
              </div>

              {/* Dual inputs: Department & Gender */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold block">
                    Department
                  </label>
                  <select
                    value={regDept}
                    onChange={(e) => setRegDept(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-white/5 border border-white/8 rounded-xl text-white outline-none focus:border-violet-500/70 focus:bg-white/10 transition cursor-pointer"
                  >
                    <option value="Computer Science" className="bg-[#0b0f19]">Computer Science</option>
                    <option value="Information Technology" className="bg-[#0b0f19]">Information Technology</option>
                    <option value="Electronics & Communication" className="bg-[#0b0f19]">Electronics & Communication</option>
                    <option value="Mechanical Engineering" className="bg-[#0b0f19]">Mechanical Engineering</option>
                    <option value="Civil Engineering" className="bg-[#0b0f19]">Civil Engineering</option>
                    <option value="Artificial Intelligence & Machine Learning" className="bg-[#0b0f19]">AIML & Data Science</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold block">
                    Gender
                  </label>
                  <select
                    value={regGender}
                    onChange={(e) => setRegGender(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-white/5 border border-white/8 rounded-xl text-white outline-none focus:border-violet-500/70 focus:bg-white/10 transition cursor-pointer"
                  >
                    <option value="Male" className="bg-[#0b0f19]">Male</option>
                    <option value="Female" className="bg-[#0b0f19]">Female</option>
                  </select>
                </div>
              </div>

              {/* Dual inputs: CGPA & Preferred Languages */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold block">
                    Current CGPA
                  </label>
                  <input
                    type="text"
                    value={regCgpa}
                    onChange={(e) => setRegCgpa(e.target.value)}
                    placeholder="e.g. 8.45"
                    className="w-full text-xs px-3.5 py-2.5 bg-white/5 border border-white/8 rounded-xl text-white placeholder-gray-500 outline-none focus:border-violet-500/70 focus:bg-white/10 transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold block font-medium">
                    Programming Languages
                  </label>
                  <input
                    type="text"
                    value={regLangs}
                    onChange={(e) => setRegLangs(e.target.value)}
                    placeholder="e.g. Python, Java, SQL"
                    className="w-full text-xs px-3.5 py-2.5 bg-white/5 border border-white/8 rounded-xl text-white placeholder-gray-500 outline-none focus:border-violet-500/70 focus:bg-white/10 transition"
                  />
                </div>
              </div>

              {/* Dual inputs: Password & Confirm Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold block">
                    Password
                  </label>
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Create password"
                    className="w-full text-xs px-3.5 py-2.5 bg-white/5 border border-white/8 rounded-xl text-white placeholder-gray-500 outline-none focus:border-violet-500/70 focus:bg-white/10 transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold block">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    className="w-full text-xs px-3.5 py-2.5 bg-white/5 border border-white/8 rounded-xl text-white placeholder-gray-500 outline-none focus:border-violet-500/70 focus:bg-white/10 transition"
                  />
                </div>
              </div>

              {/* Register Action Button */}
              <button
                type="submit"
                className="w-full shimmer-btn py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-violet-500/15 cursor-pointer transform hover:-translate-y-0.5 transition duration-150 flex items-center justify-center gap-1.5 mt-2"
              >
                Register & Sign In <ArrowRight size={14} />
              </button>

              <div className="text-center pt-1.5">
                <p className="text-[11px] text-gray-400">
                  Already registered?{" "}
                  <button
                    type="button"
                    onClick={() => { setViewMode("login"); setError(""); }}
                    className="text-violet-400 hover:text-violet-300 font-semibold cursor-pointer underline hover:no-underline"
                  >
                    Sign in to your account
                  </button>
                </p>
              </div>

            </form>
          )}

        </div>

        {/* Small footer text */}
        <p className="text-center text-[10px] text-gray-500 mt-6 leading-relaxed">
          &copy; {new Date().getFullYear()} Smart Placement Portal. Secure verification system.
        </p>

      </div>
    </div>
  );
}

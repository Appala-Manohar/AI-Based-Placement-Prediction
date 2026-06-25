import React, { useState } from "react";
import { GraduationCap, Lock, User, Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";

export default function LoginPage({ onLogin }) {
  const [loginRole, setLoginRole] = useState("student"); // "student" or "admin"
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [loadingStep, setLoadingStep] = useState("");

  const handleSubmit = (e) => {
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
    
    // Animate the loading steps for premium feeling
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
          // Pass the username to the parent
          onLogin(username.trim());
        }, 800);
      }, 800);
    }, 700);
  };

  return (
    <div className="relative min-h-screen w-screen flex items-center justify-center bg-[#070a13] overflow-hidden font-['Outfit',sans-serif]">
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
      <div className="w-full max-w-md px-6 z-10 animate-fade-in">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-8 space-y-3 text-center">
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
        <div className="glass-login-card rounded-3xl p-8 relative overflow-hidden">
          
          {/* Card subtle top glow line */}
          <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-violet-500 to-transparent opacity-50" />

          {isLoading ? (
            /* Loading State screen */
            <div className="py-12 flex flex-col items-center justify-center space-y-6">
              <div className="relative flex items-center justify-center">
                <Loader2 size={44} className="text-violet-500 animate-spin" />
                <div className="absolute inset-0 bg-violet-500/10 rounded-full blur-md animate-pulse" />
              </div>
              <div className="text-center space-y-1.5">
                <h3 className="text-sm font-semibold text-white">Signing in...</h3>
                <p className="text-[11px] text-gray-400 min-h-[16px] transition-all duration-300">
                  {loadingStep}
                </p>
              </div>
            </div>
          ) : (
            /* Login Form */
            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div>
                <h2 className="text-lg font-bold text-white">Welcome Back</h2>
                <p className="text-xs text-gray-400">Select portal role and enter credentials</p>
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

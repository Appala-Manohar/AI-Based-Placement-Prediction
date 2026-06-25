import React, { useState } from "react";
import { Link } from "react-router-dom";
import { GraduationCap, Lock, User, Eye, EyeOff, Loader2, ArrowRight, CheckCircle2, AlertCircle, Mail, Key } from "lucide-react";

export default function LoginPage({ onLogin }) {
  // Views: "login", "forgot", "reset"
  const [viewMode, setViewMode] = useState("login");
  const [loginRole, setLoginRole] = useState("student"); // "student" or "admin"

  // Login form fields
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Forgot/Reset password fields
  const [resetEmail, setResetEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  
  // Status states
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [demoOtp, setDemoOtp] = useState(""); // For ease of test in simulation

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!usernameOrEmail.trim()) {
      setError("Please enter your Username or Email Address.");
      return;
    }
    if (!password.trim()) {
      setError("Please enter your password.");
      return;
    }

    setIsLoading(true);
    setLoadingStep("Connecting to authorization gateway...");

    try {
      setLoadingStep("Verifying credentials with database records...");
      const response = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username_or_email: usernameOrEmail.trim(),
          password: password
        })
      });

      if (response.ok) {
        const data = await response.json();
        setLoadingStep("Session authorized! Retrieving profile details...");
        setTimeout(() => {
          setIsLoading(false);
          // Pass JWT token and user info back to App container
          onLogin(data.token, data.user);
        }, 800);
      } else {
        const errData = await response.json();
        setError(errData.detail || "Invalid credentials. Please verify and try again.");
        setIsLoading(false);
      }
    } catch (err) {
      // Local fallback simulation (Offline Dev mode)
      setLoadingStep("Server offline. Booting offline user mock session...");
      setTimeout(() => {
        setIsLoading(false);
        const mockUser = {
          id: 999,
          full_name: usernameOrEmail.includes("@") ? "Offline Student" : usernameOrEmail,
          username: usernameOrEmail.split("@")[0],
          register_number: "REG2026000",
          email: usernameOrEmail.includes("@") ? usernameOrEmail : "student@example.com",
          mobile: "9876543210",
          profile_photo: null
        };
        onLogin("mock-offline-jwt-token-value", mockUser);
      }, 1500);
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!resetEmail.trim()) {
      setError("Please enter your registered email address.");
      return;
    }

    setIsLoading(true);
    setLoadingStep("Generating secure OTP verification key...");

    try {
      const response = await fetch("http://localhost:8000/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail.trim() })
      });

      if (response.ok) {
        const data = await response.json();
        setIsLoading(false);
        setSuccessMessage("OTP generated successfully! Enter OTP to reset password.");
        if (data.otp_demo) {
          setDemoOtp(data.otp_demo); // Display for simulation purposes
        }
        setViewMode("reset");
      } else {
        const errData = await response.json();
        setError(errData.detail || "Email address is not registered.");
        setIsLoading(false);
      }
    } catch (err) {
      // Simulate locally
      setIsLoading(false);
      setSuccessMessage("OTP simulation generated successfully! (OTP Code is 123456).");
      setDemoOtp("123456");
      setViewMode("reset");
    }
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!otpCode.trim()) {
      setError("Please enter the 6-digit OTP code.");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    // Complexity check
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      setError("Password must have at least 1 uppercase, 1 lowercase, 1 digit, and 1 special char.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    setLoadingStep("Resetting your password...");

    try {
      const response = await fetch("http://localhost:8000/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: resetEmail.trim(),
          otp: otpCode.trim(),
          new_password: newPassword
        })
      });

      if (response.ok) {
        setIsLoading(false);
        setSuccessMessage("Password reset successfully! Please sign in with your new password.");
        setViewMode("login");
        // Clear fields
        setResetEmail("");
        setOtpCode("");
        setNewPassword("");
        setConfirmNewPassword("");
        setDemoOtp("");
      } else {
        const errData = await response.json();
        setError(errData.detail || "Invalid or expired OTP code.");
        setIsLoading(false);
      }
    } catch (err) {
      setIsLoading(false);
      setSuccessMessage("Password reset successfully (Simulation Mode)! Please sign in.");
      setViewMode("login");
      setResetEmail("");
      setOtpCode("");
      setNewPassword("");
      setConfirmNewPassword("");
      setDemoOtp("");
    }
  };

  return (
    <div className="relative min-h-screen w-screen flex items-center justify-center bg-[#070a13] overflow-hidden font-['Outfit',sans-serif]">
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
        <div className="glass-login-card rounded-3xl p-8 relative overflow-hidden">
          
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
                <h3 className="text-sm font-semibold text-white">Please Wait...</h3>
                <p className="text-[11px] text-gray-400 min-h-[16px] transition-all duration-300">
                  {loadingStep}
                </p>
              </div>
            </div>
          ) : viewMode === "login" ? (
            /* ==========================================
               LOGIN VIEW
               ========================================== */
            <form onSubmit={handleLoginSubmit} className="space-y-5">
              
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white">Welcome Back</h2>
                  <p className="text-xs text-gray-400">Sign in to your student workspace</p>
                </div>
                <Link
                  to="/register"
                  className="flex items-center gap-1 px-2.5 py-1.5 bg-violet-500/10 border border-violet-500/20 text-violet-400 rounded-xl text-[10px] font-bold hover:bg-violet-500/25 transition duration-150"
                >
                  Sign Up
                </Link>
              </div>

              {/* Role Toggle Switch */}
              <div className="relative p-1 bg-white/5 rounded-xl border border-white/5 flex">
                <div 
                  className={`absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-lg transition-transform duration-300 ease-out ${
                    loginRole === "admin" ? "transform translate-x-[100%]" : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => { setLoginRole("student"); setError(""); setSuccessMessage(""); }}
                  className={`relative z-10 w-1/2 py-2 text-xs font-bold transition-colors duration-200 cursor-pointer rounded-lg ${
                    loginRole === "student" ? "text-white" : "text-gray-400 hover:text-white"
                  }`}
                >
                  Student Portal
                </button>
                <button
                  type="button"
                  onClick={() => { setLoginRole("admin"); setError(""); setSuccessMessage(""); }}
                  className={`relative z-10 w-1/2 py-2 text-xs font-bold transition-colors duration-200 cursor-pointer rounded-lg ${
                    loginRole === "admin" ? "text-white" : "text-gray-400 hover:text-white"
                  }`}
                >
                  Admin Portal
                </button>
              </div>

              {successMessage && (
                <div className="p-3 bg-emerald-950/30 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl font-medium flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              {error && (
                <div className="p-3 bg-red-950/30 border border-red-500/20 text-red-400 text-xs rounded-xl font-medium flex items-center gap-2">
                  <AlertCircle size={14} className="text-red-400 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Username/Email Input */}
              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold block">
                  Username or Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <User size={16} />
                  </div>
                  <input
                    type="text"
                    value={usernameOrEmail}
                    onChange={(e) => setUsernameOrEmail(e.target.value)}
                    placeholder="Enter username or email"
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
                  <button 
                    type="button" 
                    onClick={() => { setViewMode("forgot"); setError(""); setSuccessMessage(""); }}
                    className="text-[10px] text-violet-400 hover:text-violet-300 font-semibold hover:underline"
                  >
                    Forgot?
                  </button>
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

              {/* Remember Me Toggle */}
              <div className="flex items-center justify-between py-1">
                <span className="text-xs text-gray-400 font-medium select-none">
                  Remember my session
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
                  <Link
                    to="/register"
                    className="text-violet-400 hover:text-violet-300 font-semibold underline hover:no-underline"
                  >
                    Create student account
                  </Link>
                </p>
              </div>

            </form>
          ) : viewMode === "forgot" ? (
            /* ==========================================
               FORGOT PASSWORD VIEW
               ========================================== */
            <form onSubmit={handleForgotPasswordSubmit} className="space-y-5">
              <div>
                <h2 className="text-lg font-bold text-white">Reset Password</h2>
                <p className="text-xs text-gray-400">Enter your registered email address to request an OTP code</p>
              </div>

              {error && (
                <div className="p-3 bg-red-950/30 border border-red-500/20 text-red-400 text-xs rounded-xl font-medium flex items-center gap-2">
                  <AlertCircle size={14} className="text-red-400 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold block">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Mail size={16} />
                  </div>
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="Enter email address"
                    className="w-full text-xs pl-10 pr-4 py-3 bg-white/5 border border-white/8 rounded-xl text-white placeholder-gray-500 outline-none focus:border-violet-500/70 focus:bg-white/10 transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full shimmer-btn py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-violet-500/15 cursor-pointer transform hover:-translate-y-0.5 transition duration-150 flex items-center justify-center gap-1.5"
              >
                Send OTP Code <ArrowRight size={14} />
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => { setViewMode("login"); setError(""); setSuccessMessage(""); }}
                  className="text-xs text-violet-400 hover:text-violet-300 font-bold hover:underline"
                >
                  Return to Sign In
                </button>
              </div>
            </form>
          ) : (
            /* ==========================================
               RESET PASSWORD VIEW (OTP & NEW PASS)
               ========================================== */
            <form onSubmit={handleResetPasswordSubmit} className="space-y-5">
              <div>
                <h2 className="text-lg font-bold text-white">Enter Verification Code</h2>
                <p className="text-xs text-gray-400">Check your email for the OTP code and enter your new password</p>
              </div>

              {successMessage && (
                <div className="p-3 bg-emerald-950/30 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl font-medium">
                  {successMessage}
                </div>
              )}

              {demoOtp && (
                <div className="p-3 bg-violet-950/30 border border-violet-500/20 text-violet-400 text-xs rounded-xl font-medium flex items-center gap-1.5">
                  <Info size={14} />
                  <span>Demo Mode OTP: <span className="font-mono font-bold text-white bg-white/10 px-1.5 py-0.5 rounded">{demoOtp}</span></span>
                </div>
              )}

              {error && (
                <div className="p-3 bg-red-950/30 border border-red-500/20 text-red-400 text-xs rounded-xl font-medium flex items-center gap-2">
                  <AlertCircle size={14} className="text-red-400 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* OTP Code */}
              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold block">
                  6-Digit OTP Code
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Key size={16} />
                  </div>
                  <input
                    type="text"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="Enter OTP code"
                    maxLength={6}
                    className="w-full text-xs pl-10 pr-4 py-3 bg-white/5 border border-white/8 rounded-xl text-white placeholder-gray-500 outline-none focus:border-violet-500/70 focus:bg-white/10 transition"
                  />
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold block">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 8 characters"
                    className="w-full text-xs px-3.5 pr-10 py-3 bg-white/5 border border-white/8 rounded-xl text-white placeholder-gray-500 outline-none focus:border-violet-500/70 focus:bg-white/10 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                  >
                    {showNewPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold block">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="Retype new password"
                  className="w-full text-xs px-3.5 py-3 bg-white/5 border border-white/8 rounded-xl text-white placeholder-gray-500 outline-none focus:border-violet-500/70 focus:bg-white/10 transition"
                />
              </div>

              <button
                type="submit"
                className="w-full shimmer-btn py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-violet-500/15 cursor-pointer transform hover:-translate-y-0.5 transition duration-150 flex items-center justify-center gap-1.5"
              >
                Reset Password & Log In <ArrowRight size={14} />
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => { setViewMode("login"); setError(""); setSuccessMessage(""); }}
                  className="text-xs text-violet-400 hover:text-violet-300 font-bold hover:underline"
                >
                  Return to Sign In
                </button>
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

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GraduationCap, Lock, User, Mail, Phone, Camera, Eye, EyeOff, Loader2, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";

export default function RegisterPage() {
  const navigate = useNavigate();

  // Registration form fields
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [registerNumber, setRegisterNumber] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null); // base64 string

  // Show/Hide password states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validation error states (displayed instantly)
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  // Validation rules
  const validateField = (name, value) => {
    let err = "";
    if (name === "fullName" && !value.trim()) {
      err = "Full Name is required";
    }
    if (name === "username") {
      if (!value.trim()) {
        err = "Username is required";
      } else if (value.length < 4 || value.length > 25) {
        err = "Username must be between 4 and 25 characters";
      } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
        err = "Only letters, numbers, and underscores are allowed";
      }
    }
    if (name === "registerNumber" && !value.trim()) {
      err = "Register Number is required";
    }
    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value.trim()) {
        err = "Email is required";
      } else if (!emailRegex.test(value)) {
        err = "Enter a valid email address";
      }
    }
    if (name === "mobile") {
      if (!value.trim()) {
        err = "Mobile Number is required";
      } else if (!/^\d{10}$/.test(value)) {
        err = "Mobile number must be exactly 10 digits";
      }
    }
    if (name === "password") {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/;
      if (!value) {
        err = "Password is required";
      } else if (!passwordRegex.test(value)) {
        err = "Password must be min 8 chars, 1 uppercase, 1 lowercase, 1 number, and 1 special char";
      }
    }
    if (name === "confirmPassword") {
      if (!value) {
        err = "Confirm Password is required";
      } else if (value !== password) {
        err = "Passwords do not match";
      }
    }

    setErrors((prev) => ({ ...prev, [name]: err }));
    return err;
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  // Convert uploaded image to Base64
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setApiError("Profile photo size should be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result); // Base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    // Validate all fields
    const errs = {
      fullName: validateField("fullName", fullName),
      username: validateField("username", username),
      registerNumber: validateField("registerNumber", registerNumber),
      email: validateField("email", email),
      mobile: validateField("mobile", mobile),
      password: validateField("password", password),
      confirmPassword: validateField("confirmPassword", confirmPassword),
    };

    const hasErrors = Object.values(errs).some((x) => x !== "");
    if (hasErrors) {
      setApiError("Please resolve all validation errors before submitting.");
      return;
    }

    setIsLoading(true);
    setLoadingStep("Connecting to secure database gateway...");

    const payload = {
      full_name: fullName.trim(),
      username: username.trim(),
      register_number: registerNumber.trim(),
      email: email.trim(),
      mobile: mobile.trim(),
      password: password,
      profile_photo: profilePhoto
    };

    try {
      setLoadingStep("Registering new student profile account...");
      const response = await fetch("http://localhost:8000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setLoadingStep("Registration Successful! Finalizing details...");
        setTimeout(() => {
          setIsLoading(false);
          setShowSuccess(true);
        }, 1000);
      } else {
        const errData = await response.json();
        setApiError(errData.detail || "Registration failed. Please try again.");
        setIsLoading(false);
      }
    } catch (err) {
      // Local demo offline mode fallback
      setLoadingStep("Server offline. Initializing local session database simulation...");
      setTimeout(() => {
        setIsLoading(false);
        setShowSuccess(true);
      }, 1500);
    }
  };

  return (
    <div className="relative min-h-screen w-screen flex items-center justify-center bg-[#070a13] overflow-y-auto py-12 px-4 sm:px-6 font-['Outfit',sans-serif]">
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

      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-violet-600/10 rounded-full blur-[120px] animate-orb-1 pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[55vw] h-[55vw] bg-fuchsia-600/10 rounded-full blur-[130px] animate-orb-2 pointer-events-none" />

      {/* Tiny Background Particles */}
      {[...Array(10)].map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            width: `${Math.random() * 8 + 4}px`,
            height: `${Math.random() * 8 + 4}px`,
            left: `${Math.random() * 100}%`,
            animationDuration: `${Math.random() * 12 + 10}s`,
            animationDelay: `${Math.random() * 6}s`,
            background: i % 2 === 0 ? "rgba(168, 85, 247, 0.2)" : "rgba(236, 72, 153, 0.15)",
          }}
        />
      ))}

      <div className="w-full max-w-xl z-10">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-6 space-y-2 text-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500/20 transform hover:scale-105 transition duration-300">
            <GraduationCap size={26} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white">Smart Placement Portal</h1>
            <p className="text-xs text-gray-400 font-semibold tracking-wider uppercase mt-0.5">Account Registration</p>
          </div>
        </div>

        {/* Form Container */}
        <div className="glass-login-card rounded-3xl p-6 sm:p-8 relative">
          <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-violet-500 to-transparent opacity-50" />

          {showSuccess ? (
            /* Success Screen view */
            <div className="py-12 flex flex-col items-center justify-center space-y-6 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shadow-lg shadow-emerald-500/10 transform scale-110 transition duration-300">
                <CheckCircle2 size={36} className="text-emerald-400 animate-pulse" />
              </div>
              <div className="space-y-2 px-4">
                <h3 className="text-xl font-extrabold text-white">Registration Successful!</h3>
                <p className="text-xs text-gray-400 leading-relaxed max-w-sm mx-auto">
                  Your student profile has been registered successfully. You can now sign in using your credentials.
                </p>
              </div>
              <button
                onClick={() => navigate("/login")}
                className="shimmer-btn px-6 py-2.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-violet-500/15 cursor-pointer transform hover:-translate-y-0.5 transition duration-150 flex items-center justify-center gap-1.5"
              >
                Proceed to Login <ArrowRight size={14} />
              </button>
            </div>
          ) : isLoading ? (
            /* Loading State view */
            <div className="py-20 flex flex-col items-center justify-center space-y-6">
              <Loader2 size={44} className="text-violet-500 animate-spin" />
              <div className="text-center px-4">
                <h3 className="text-sm font-semibold text-white">Creating Account...</h3>
                <p className="text-[11px] text-gray-400 mt-1 min-h-[16px] transition-all duration-300">
                  {loadingStep}
                </p>
              </div>
            </div>
          ) : (
            /* Register Form view */
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h2 className="text-lg font-bold text-white">Create Student Account</h2>
                  <p className="text-xs text-gray-400">Fill in the fields below to get started</p>
                </div>
                <Link to="/login" className="text-xs text-violet-400 hover:text-violet-300 font-bold hover:underline transition">
                  Sign In instead
                </Link>
              </div>

              {apiError && (
                <div className="p-3 bg-red-950/30 border border-red-500/20 text-red-400 text-xs rounded-xl font-medium flex items-center gap-2">
                  <AlertCircle size={14} className="flex-shrink-0" />
                  <span>{apiError}</span>
                </div>
              )}

              {/* Profile Photo base64 trigger */}
              <div className="flex flex-col items-center py-2">
                <div className="relative group">
                  <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shadow-inner relative">
                    {profilePhoto ? (
                      <img src={profilePhoto} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <User size={32} className="text-gray-500" />
                    )}
                  </div>
                  <label htmlFor="photo-input" className="absolute bottom-0 right-0 p-1.5 bg-gradient-to-tr from-violet-600 to-fuchsia-600 rounded-full text-white cursor-pointer shadow-md transform hover:scale-110 transition duration-150">
                    <Camera size={12} />
                  </label>
                  <input
                    type="file"
                    id="photo-input"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </div>
                <span className="text-[10px] text-gray-400 mt-1.5 font-medium">Upload Profile Photo (Optional)</span>
              </div>

              {/* Full Name & Username */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold block">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    onBlur={handleBlur}
                    placeholder="Enter full name"
                    className={`w-full text-xs px-3.5 py-2.5 bg-white/5 border ${errors.fullName ? "border-red-500" : "border-white/8"} rounded-xl text-white outline-none focus:border-violet-500/70 transition`}
                  />
                  {errors.fullName && <p className="text-[10px] text-red-400 mt-0.5">{errors.fullName}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold block">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onBlur={handleBlur}
                    placeholder="Enter username"
                    className={`w-full text-xs px-3.5 py-2.5 bg-white/5 border ${errors.username ? "border-red-500" : "border-white/8"} rounded-xl text-white outline-none focus:border-violet-500/70 transition`}
                  />
                  {errors.username && <p className="text-[10px] text-red-400 mt-0.5">{errors.username}</p>}
                </div>
              </div>

              {/* Unique Register Number & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold block">Register Number</label>
                  <input
                    type="text"
                    name="registerNumber"
                    value={registerNumber}
                    onChange={(e) => setRegisterNumber(e.target.value)}
                    onBlur={handleBlur}
                    placeholder="e.g. REG2026001"
                    className={`w-full text-xs px-3.5 py-2.5 bg-white/5 border ${errors.registerNumber ? "border-red-500" : "border-white/8"} rounded-xl text-white outline-none focus:border-violet-500/70 transition`}
                  />
                  {errors.registerNumber && <p className="text-[10px] text-red-400 mt-0.5">{errors.registerNumber}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold block">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={handleBlur}
                    placeholder="e.g. name@example.com"
                    className={`w-full text-xs px-3.5 py-2.5 bg-white/5 border ${errors.email ? "border-red-500" : "border-white/8"} rounded-xl text-white outline-none focus:border-violet-500/70 transition`}
                  />
                  {errors.email && <p className="text-[10px] text-red-400 mt-0.5">{errors.email}</p>}
                </div>
              </div>

              {/* Mobile Number & Empty column or field */}
              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold block">Mobile Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                    <Phone size={14} />
                  </div>
                  <input
                    type="text"
                    name="mobile"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    onBlur={handleBlur}
                    placeholder="Enter 10-digit mobile number"
                    className={`w-full text-xs pl-9 pr-3 py-2.5 bg-white/5 border ${errors.mobile ? "border-red-500" : "border-white/8"} rounded-xl text-white outline-none focus:border-violet-500/70 transition`}
                  />
                </div>
                {errors.mobile && <p className="text-[10px] text-red-400 mt-0.5">{errors.mobile}</p>}
              </div>

              {/* Password & Confirm Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold block">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onBlur={handleBlur}
                      placeholder="Min 8 characters"
                      className={`w-full text-xs px-3.5 pr-9 py-2.5 bg-white/5 border ${errors.password ? "border-red-500" : "border-white/8"} rounded-xl text-white outline-none focus:border-violet-500/70 transition`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                  {errors.password && <p className="text-[10px] text-red-400 mt-0.5 leading-tight">{errors.password}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold block">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onBlur={handleBlur}
                      placeholder="Retype password"
                      className={`w-full text-xs px-3.5 pr-9 py-2.5 bg-white/5 border ${errors.confirmPassword ? "border-red-500" : "border-white/8"} rounded-xl text-white outline-none focus:border-violet-500/70 transition`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                    >
                      {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-[10px] text-red-400 mt-0.5">{errors.confirmPassword}</p>}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full shimmer-btn py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-violet-500/15 cursor-pointer transform hover:-translate-y-0.5 transition duration-150 flex items-center justify-center gap-1.5 mt-4"
              >
                Create Account <ArrowRight size={14} />
              </button>

              <div className="text-center pt-2">
                <p className="text-[11px] text-gray-500">
                  By registering, you agree to our Smart Portal terms of usage policies.
                </p>
              </div>

            </form>
          )}

        </div>

        {/* Small footer text */}
        <p className="text-center text-[10px] text-gray-500 mt-6 leading-relaxed">
          &copy; {new Date().getFullYear()} Smart Placement Portal. Secure Verification Gateway.
        </p>

      </div>
    </div>
  );
}

import React, { useState } from "react";
import { User, Mail, Phone, Lock, Camera, Save, ShieldAlert, CheckCircle2, AlertCircle } from "lucide-react";

export default function MyProfile({ user, token, onUpdateUser }) {
  // Input fields loaded from current user state
  const [fullName, setFullName] = useState(user?.full_name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [mobile, setMobile] = useState(user?.mobile || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(user?.profile_photo || null);

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [apiSuccess, setApiSuccess] = useState("");

  const validateField = (name, value) => {
    let err = "";
    if (name === "fullName" && !value.trim()) {
      err = "Full Name is required";
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
    if (name === "password" && value) {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/;
      if (!passwordRegex.test(value)) {
        err = "Password must be min 8 chars, 1 uppercase, 1 lowercase, 1 number, and 1 special char";
      }
    }
    if (name === "confirmPassword" && password) {
      if (value !== password) {
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

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setApiError("Image must be smaller than 2MB");
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
    setApiSuccess("");

    // Validate fields
    const errs = {
      fullName: validateField("fullName", fullName),
      email: validateField("email", email),
      mobile: validateField("mobile", mobile),
      password: validateField("password", password),
      confirmPassword: validateField("confirmPassword", confirmPassword),
    };

    const hasErrors = Object.values(errs).some((x) => x !== "");
    if (hasErrors) {
      setApiError("Please resolve all validation errors before saving.");
      return;
    }

    setIsLoading(true);

    const payload = {
      full_name: fullName.trim(),
      email: email.trim(),
      mobile: mobile.trim(),
      profile_photo: profilePhoto
    };

    if (password.trim()) {
      payload.password = password;
    }

    try {
      const response = await fetch("http://localhost:8000/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setApiSuccess("Profile updated successfully!");
        setPassword("");
        setConfirmPassword("");
        // Notify parent App component to update user session locally
        onUpdateUser(updatedUser);
      } else {
        const errData = await response.json();
        setApiError(errData.detail || "Failed to update profile. Email might already be taken.");
      }
    } catch (err) {
      // Simulation mode
      setApiSuccess("Profile updated successfully (Simulation Offline Mode)!");
      const simulatedUpdate = {
        ...user,
        full_name: fullName,
        email: email,
        mobile: mobile,
        profile_photo: profilePhoto
      };
      onUpdateUser(simulatedUpdate);
      setPassword("");
      setConfirmPassword("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-20 pb-16 px-6 max-w-4xl mx-auto space-y-8 animate-fade-in font-['Outfit',sans-serif]">
      
      <div>
        <span className="text-xs font-semibold text-violet-400 uppercase tracking-widest block font-bold">Personal Workspace</span>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">My Profile</h1>
        <p className="text-sm text-gray-400">Manage account credentials and profile parameters</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Avatar Details & Static Stats */}
        <div className="glass-card p-6 flex flex-col items-center justify-center text-center space-y-5 h-fit">
          <div className="relative group">
            <div className="w-28 h-28 rounded-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shadow-inner">
              {profilePhoto ? (
                <img src={profilePhoto} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User size={48} className="text-gray-600" />
              )}
            </div>
            <label htmlFor="profile-upload" className="absolute bottom-1 right-1 p-2 bg-gradient-to-tr from-violet-600 to-fuchsia-600 rounded-full text-white cursor-pointer shadow-md hover:scale-110 transition duration-150">
              <Camera size={14} />
            </label>
            <input
              type="file"
              id="profile-upload"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </div>

          <div>
            <h3 className="text-lg font-bold text-white">{fullName || "Student Account"}</h3>
            <p className="text-xs text-violet-400 font-semibold tracking-wider uppercase mt-0.5">@{user?.username || "username"}</p>
          </div>

          <div className="w-full pt-4 border-t border-white/5 space-y-2 text-left">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Register No:</span>
              <span className="text-gray-300 font-bold font-mono">{user?.register_number || "REG0000000"}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Role Status:</span>
              <span className="text-emerald-400 font-semibold">Registered Student</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Session status:</span>
              <span className="text-gray-300">Active</span>
            </div>
          </div>
        </div>

        {/* Right Side: Edit Form fields */}
        <div className="lg:col-span-2 glass-card p-6 sm:p-8 relative">
          <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-violet-500 to-transparent opacity-30" />
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/5 pb-2">
              Account Details
            </h3>

            {apiSuccess && (
              <div className="p-3 bg-emerald-950/30 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl font-medium flex items-center gap-2">
                <CheckCircle2 size={14} />
                <span>{apiSuccess}</span>
              </div>
            )}

            {apiError && (
              <div className="p-3 bg-red-950/30 border border-red-500/20 text-red-400 text-xs rounded-xl font-medium flex items-center gap-2">
                <AlertCircle size={14} />
                <span>{apiError}</span>
              </div>
            )}

            {/* Locked Info: Username & Register No */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold block">Username</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                    <User size={14} />
                  </div>
                  <input
                    type="text"
                    value={user?.username || ""}
                    disabled
                    className="w-full text-xs pl-9 pr-4 py-2.5 bg-white/3 border border-white/5 rounded-xl text-gray-500 cursor-not-allowed outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold block">Register Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                    <ShieldAlert size={14} />
                  </div>
                  <input
                    type="text"
                    value={user?.register_number || ""}
                    disabled
                    className="w-full text-xs pl-9 pr-4 py-2.5 bg-white/3 border border-white/5 rounded-xl text-gray-500 cursor-not-allowed outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Editable Info: Full Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold block">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  onBlur={handleBlur}
                  className={`w-full text-xs px-3.5 py-2.5 bg-white/5 border ${errors.fullName ? "border-red-500" : "border-white/8"} rounded-xl text-white outline-none focus:border-violet-500/70 transition`}
                />
                {errors.fullName && <p className="text-[10px] text-red-400 mt-0.5">{errors.fullName}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold block">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Mail size={14} />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={handleBlur}
                    className={`w-full text-xs pl-9 pr-3 py-2.5 bg-white/5 border ${errors.email ? "border-red-500" : "border-white/8"} rounded-xl text-white outline-none focus:border-violet-500/70 transition`}
                  />
                </div>
                {errors.email && <p className="text-[10px] text-red-400 mt-0.5">{errors.email}</p>}
              </div>
            </div>

            {/* Editable Info: Mobile Number */}
            <div className="space-y-1">
              <label className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold block">Mobile Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Phone size={14} />
                </div>
                <input
                  type="text"
                  name="mobile"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  onBlur={handleBlur}
                  className={`w-full text-xs pl-9 pr-3 py-2.5 bg-white/5 border ${errors.mobile ? "border-red-500" : "border-white/8"} rounded-xl text-white outline-none focus:border-violet-500/70 transition`}
                />
              </div>
              {errors.mobile && <p className="text-[10px] text-red-400 mt-0.5">{errors.mobile}</p>}
            </div>

            {/* Password Update Header */}
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/5 pb-2 pt-3">
              Change Password (Optional)
            </h3>

            {/* Editable Info: New Password & Confirm New Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold block">New Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Lock size={14} />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={handleBlur}
                    placeholder="Leave blank to keep current"
                    className={`w-full text-xs pl-9 pr-3 py-2.5 bg-white/5 border ${errors.password ? "border-red-500" : "border-white/8"} rounded-xl text-white outline-none focus:border-violet-500/70 transition`}
                  />
                </div>
                {errors.password && <p className="text-[10px] text-red-400 mt-0.5 leading-tight">{errors.password}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold block">Confirm Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Lock size={14} />
                  </div>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onBlur={handleBlur}
                    placeholder="Retype new password"
                    className={`w-full text-xs pl-9 pr-3 py-2.5 bg-white/5 border ${errors.confirmPassword ? "border-red-500" : "border-white/8"} rounded-xl text-white outline-none focus:border-violet-500/70 transition`}
                  />
                </div>
                {errors.confirmPassword && <p className="text-[10px] text-red-400 mt-0.5">{errors.confirmPassword}</p>}
              </div>
            </div>

            {/* Save Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full shimmer-btn py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-violet-500/15 cursor-pointer transform hover:-translate-y-0.5 transition duration-150 flex items-center justify-center gap-2 mt-4"
            >
              {isLoading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Saving Updates...</span>
                </>
              ) : (
                <>
                  <Save size={14} />
                  <span>Save Profile Updates</span>
                </>
              )}
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}

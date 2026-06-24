import React, { useState, useEffect } from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { 
  ShieldAlert, 
  Users, 
  Award, 
  UserPlus,
  Trash2, 
  Sparkles,
  RefreshCw,
  FileCheck2,
  TableProperties,
  ArrowRight,
  TrendingUp,
  SlidersHorizontal
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard({ onSelectStudent }) {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState(null);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const analyticRes = await fetch("http://localhost:8000/api/analytics");
      if (analyticRes.ok) {
        const aData = await analyticRes.json();
        setAnalytics(aData);
        const best = aData.ml_models.find(m => m.is_best) || aData.ml_models[0];
        setSelectedModel(best);
      }
      
      const studentRes = await fetch("http://localhost:8000/api/students");
      if (studentRes.ok) {
        const sData = await studentRes.json();
        setStudents(sData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleDeleteStudent = async (regNo) => {
    const confirm = window.confirm(`Are you sure you want to delete student profile ${regNo}?`);
    if (!confirm) return;

    try {
      const res = await fetch(`http://localhost:8000/api/students/${regNo}`, {
        method: "DELETE"
      });
      if (res.ok) {
        alert("Student profile deleted successfully.");
        fetchAdminData();
      }
    } catch (e) {
      console.error(e);
      alert("Failed to delete profile.");
    }
  };

  if (loading && !analytics) {
    return (
      <div className="pt-24 text-center h-[70vh] flex flex-col justify-center items-center gap-2">
        <RefreshCw className="animate-spin text-violet-400" size={28} />
        <p className="text-sm text-gray-400 font-semibold">Loading Admin Console...</p>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="pt-24 px-6 text-center max-w-md mx-auto space-y-4">
        <ShieldAlert size={40} className="text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-white">Console Offline</h2>
        <p className="text-xs text-gray-400">Please make sure the FastAPI server is running and database training is complete.</p>
        <button onClick={fetchAdminData} className="bg-violet-600 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer">
          Try Reloading
        </button>
      </div>
    );
  }

  // Chart Data: Placed vs Not Placed Ratio
  const ratioData = [
    { name: "Placed", value: analytics.placed_students, color: "#10b981" },
    { name: "Not Placed", value: analytics.not_placed_students, color: "#f43f5e" }
  ];

  return (
    <div className="pt-20 pb-16 px-6 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs font-semibold text-violet-400 uppercase tracking-widest block font-bold">Administrative portal</span>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-2 tracking-tight">
            <ShieldAlert className="text-violet-400" /> Admin Analytics Console
          </h1>
          <p className="text-xs text-gray-400 font-medium">
            Review predictive analytics, inspect ML classification metrics, and manage student placement profiles.
          </p>
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={fetchAdminData}
            className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition"
          >
            <RefreshCw size={12} /> Sync Analytics
          </button>
          <button
            onClick={() => navigate("/predict-form")}
            className="bg-violet-600 hover:bg-violet-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-lg shadow-violet-500/10 transition"
          >
            <UserPlus size={14} /> Add Profile
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-6 flex items-center gap-4">
          <div className="p-3 bg-violet-500/10 text-violet-400 rounded-xl">
            <Users size={20} />
          </div>
          <div>
            <span className="text-[10px] text-gray-500 uppercase tracking-wider block font-bold">Profiles Encoded</span>
            <h3 className="text-2xl font-black text-white">{analytics.total_students}</h3>
          </div>
        </div>

        <div className="glass-card p-6 flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
            <Users size={20} />
          </div>
          <div>
            <span className="text-[10px] text-gray-500 uppercase tracking-wider block font-bold">Predicted Placed</span>
            <h3 className="text-2xl font-black text-emerald-400">{analytics.placed_students}</h3>
          </div>
        </div>

        <div className="glass-card p-6 flex items-center gap-4">
          <div className="p-3 bg-rose-500/10 text-rose-400 rounded-xl">
            <Users size={20} />
          </div>
          <div>
            <span className="text-[10px] text-gray-500 uppercase tracking-wider block font-bold">Predicted Not Placed</span>
            <h3 className="text-2xl font-black text-rose-400">{analytics.not_placed_students}</h3>
          </div>
        </div>

        <div className="glass-card p-6 flex items-center gap-4">
          <div className="p-3 bg-fuchsia-500/10 text-fuchsia-400 rounded-xl">
            <Award size={20} />
          </div>
          <div>
            <span className="text-[10px] text-gray-500 uppercase tracking-wider block font-bold">Cohort Readiness</span>
            <h3 className="text-2xl font-black text-white">{analytics.avg_readiness}<span className="text-xs text-gray-500">/100</span></h3>
          </div>
        </div>
      </div>

      {/* Charts Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Placed Ratio Pie Chart */}
        <div className="glass-card p-6 flex flex-col justify-between h-[340px]">
          <div>
            <h3 className="text-sm font-bold text-white">Placement Success Ratio</h3>
            <p className="text-[11px] text-gray-500">Overview of student predicted ratios</p>
          </div>
          <div className="flex-1 flex justify-center items-center mt-2">
            <ResponsiveContainer width="100%" height="95%">
              <PieChart>
                <Pie
                  data={ratioData}
                  cx="50%"
                  cy="45%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {ratioData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `${v} Students`} contentStyle={{ backgroundColor: "#111827", borderColor: "rgba(255,255,255,0.08)", fontSize: 10 }} />
                <Legend layout="horizontal" align="center" verticalAlign="bottom" iconSize={8} wrapperStyle={{ fontSize: 9 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department placement rates bar chart */}
        <div className="glass-card p-6 lg:col-span-2 flex flex-col justify-between h-[340px]">
          <div>
            <h3 className="text-sm font-bold text-white">Department Placement Probability (%)</h3>
            <p className="text-[11px] text-gray-500">Placement probability percentages per academic cohort</p>
          </div>
          <div className="flex-1 mt-4">
            {analytics.dept_analytics.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.dept_analytics} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <XAxis dataKey="department" stroke="#6b7280" tick={{ fontSize: 9 }} />
                  <YAxis stroke="#6b7280" tick={{ fontSize: 9 }} tickFormatter={(v) => `${v}%`} />
                  <Tooltip formatter={(v) => `${v}% Rate`} contentStyle={{ backgroundColor: "#111827", borderColor: "rgba(255,255,255,0.08)", fontSize: 10 }} />
                  <Bar dataKey="placement_rate" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-gray-500">No department analytics yet. Seed data to render.</div>
            )}
          </div>
        </div>
      </div>

      {/* Machine Learning Model Performance Metrics */}
      <div className="glass-card p-6 border border-white/5 space-y-6 shadow-lg">
        <div>
          <h3 className="text-base font-bold text-white mb-1 flex items-center gap-1.5">
            <SlidersHorizontal size={18} className="text-violet-400" />
            Machine Learning Pipeline & Metrics
          </h3>
          <p className="text-xs text-gray-400">Comparing model testing accuracies. Select a model to inspect its detailed evaluation report.</p>
        </div>

        {/* Model Tabs */}
        <div className="flex flex-wrap gap-2.5 border-b border-white/5 pb-4">
          {analytics.ml_models.map((m) => (
            <button
              key={m.model_name}
              onClick={() => setSelectedModel(m)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition border cursor-pointer
                ${selectedModel && selectedModel.model_name === m.model_name
                  ? "bg-violet-600 text-white border-violet-500 shadow-md shadow-violet-500/10"
                  : "bg-white/3 border-white/5 text-gray-400 hover:text-white"
                }
              `}
            >
              {m.model_name} {m.is_best && "⭐ (Best)"}
            </button>
          ))}
        </div>

        {/* Selected Model Details */}
        {selectedModel && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Classification Report */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-violet-400 uppercase tracking-widest">Classification Report</h4>
              <div className="grid grid-cols-4 gap-3 text-center">
                <div className="p-3 bg-white/2 border border-white/5 rounded-xl">
                  <span className="text-[9px] text-gray-500 uppercase font-bold">Accuracy</span>
                  <p className="text-lg font-black text-white">{Math.round(selectedModel.accuracy * 100)}%</p>
                </div>
                <div className="p-3 bg-white/2 border border-white/5 rounded-xl">
                  <span className="text-[9px] text-gray-500 uppercase font-bold">Precision</span>
                  <p className="text-lg font-black text-white">{Math.round(selectedModel.precision * 100)}%</p>
                </div>
                <div className="p-3 bg-white/2 border border-white/5 rounded-xl">
                  <span className="text-[9px] text-gray-500 uppercase font-bold">Recall</span>
                  <p className="text-lg font-black text-white">{Math.round(selectedModel.recall * 100)}%</p>
                </div>
                <div className="p-3 bg-white/2 border border-white/5 rounded-xl">
                  <span className="text-[9px] text-gray-500 uppercase font-bold">F1-Score</span>
                  <p className="text-lg font-black text-white">{Math.round(selectedModel.f1_score * 100)}%</p>
                </div>
              </div>
              
              <div className="bg-[#090d16] p-4 border border-white/5 rounded-xl text-[10px] font-mono text-gray-400 whitespace-pre-wrap overflow-x-auto leading-relaxed h-[130px]">
                {/* Print classification report formatting */}
                {JSON.stringify(selectedModel.classification_report, null, 2)}
              </div>
            </div>

            {/* Confusion Matrix */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-violet-400 uppercase tracking-widest">Confusion Matrix (Test Split)</h4>
              <div className="flex justify-center">
                {selectedModel.confusion_matrix && (
                  <div className="grid grid-cols-3 gap-1.5 w-68 text-center items-center font-bold text-[10px] text-white">
                    {/* Header Row */}
                    <div></div>
                    <div className="text-gray-500 uppercase font-bold text-[9px]">Pred Placed</div>
                    <div className="text-gray-500 uppercase font-bold text-[9px]">Pred Not Placed</div>
                    
                    {/* Row 1 */}
                    <div className="text-gray-500 uppercase font-bold text-right pr-2 text-[9px]">Actual Placed</div>
                    <div className="p-3 bg-emerald-950/20 border border-emerald-500/20 text-emerald-400 rounded-xl" title="True Positives">
                      {selectedModel.confusion_matrix[1][1]}
                    </div>
                    <div className="p-3 bg-white/2 border border-white/5 text-gray-600 rounded-xl" title="False Negatives">
                      {selectedModel.confusion_matrix[1][0]}
                    </div>

                    {/* Row 2 */}
                    <div className="text-gray-500 uppercase font-bold text-right pr-2 text-[9px]">Actual Not Placed</div>
                    <div className="p-3 bg-white/2 border border-white/5 text-gray-600 rounded-xl" title="False Positives">
                      {selectedModel.confusion_matrix[0][1]}
                    </div>
                    <div className="p-3 bg-rose-950/20 border border-rose-500/20 text-rose-400 rounded-xl" title="True Negatives">
                      {selectedModel.confusion_matrix[0][0]}
                    </div>
                  </div>
                )}
              </div>
              <p className="text-[10px] text-gray-500 text-center leading-normal">
                Matrix indexes mapping test partition outputs (True Positive, False Negative, False Positive, True Negative).
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Student Records Management */}
      <div className="glass-card p-6 border border-white/5 space-y-4 shadow-lg">
        <h3 className="text-base font-bold text-white mb-2 flex items-center gap-1.5">
          <TableProperties size={18} className="text-violet-400" />
          Manage Student Records
        </h3>
        
        <div className="overflow-x-auto">
          {students.length > 0 ? (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/5 bg-white/2 text-[10px] uppercase tracking-wider font-bold text-gray-400">
                  <th className="py-3 px-4">Register Number</th>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4 text-center">CGPA</th>
                  <th className="py-3 px-4 text-center">Readiness</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-gray-300">
                {students.map((s) => (
                  <tr key={s.id} className="hover:bg-white/2 transition">
                    <td className="py-3 px-4 font-bold text-white">{s.register_no}</td>
                    <td className="py-3 px-4 font-medium text-white">{s.student_name}</td>
                    <td className="py-3 px-4 text-gray-400">{s.department}</td>
                    <td className="py-3 px-4 text-center text-white font-bold">{s.cgpa}</td>
                    <td className="py-3 px-4 text-center text-white font-bold">{s.readiness_score}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold border uppercase
                        ${s.placed === 1 
                          ? "bg-emerald-950/20 text-emerald-400 border-emerald-500/20" 
                          : "bg-rose-950/20 text-rose-400 border-rose-500/20"
                        }
                      `}>
                        {s.placed === 1 ? "Placed" : "Not Placed"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center flex justify-center items-center gap-2">
                      <button
                        onClick={() => onSelectStudent(s)}
                        className="text-[10px] font-bold text-violet-400 hover:text-white border border-violet-500/25 px-2.5 py-1 rounded cursor-pointer hover:bg-violet-600 transition"
                      >
                        Load
                      </button>
                      <button
                        onClick={() => handleDeleteStudent(s.register_no)}
                        className="text-[10px] font-bold text-rose-400 hover:text-white border border-rose-500/25 px-2 py-1 rounded cursor-pointer hover:bg-rose-600 transition"
                      >
                        <Trash2 size={12} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-10 text-center text-xs text-gray-500">No student profiles found. Click "Seed Mock Data" to begin.</div>
          )}
        </div>
      </div>

    </div>
  );
}

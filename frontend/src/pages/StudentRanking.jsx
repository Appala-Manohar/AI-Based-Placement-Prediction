import React, { useState, useEffect } from "react";
import { 
  Trophy, 
  Search, 
  Filter, 
  ArrowUpDown, 
  GraduationCap, 
  ArrowRight,
  RefreshCw,
  Award,
  Sparkles,
  Medal
} from "lucide-react";

export default function StudentRanking({ onSelectStudent }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All");
  const [sortBy, setSortBy] = useState("readiness_desc");

  const fetchStudents = async () => {
    setLoading(true);
    try {
      let url = "http://localhost:8000/api/students";
      const params = [];
      if (search.trim()) params.push(`search=${encodeURIComponent(search.trim())}`);
      if (department !== "All") params.push(`dept=${encodeURIComponent(department)}`);
      if (sortBy) params.push(`sort=${sortBy}`);
      
      if (params.length > 0) {
        url += `?${params.join("&")}`;
      }

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setStudents(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [search, department, sortBy]);

  // Extract top 3 students if available and no search filters are active
  const showPodium = students.length >= 3 && !search.trim() && department === "All" && sortBy === "readiness_desc";
  const top1 = showPodium ? students[0] : null;
  const top2 = showPodium ? students[1] : null;
  const top3 = showPodium ? students[2] : null;
  const remainingStudents = showPodium ? students.slice(3) : students;

  return (
    <div className="pt-20 pb-16 px-6 max-w-6xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs font-semibold text-violet-400 uppercase tracking-widest block font-bold">Leaderboard</span>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-2 tracking-tight">
            <Trophy className="text-violet-400" /> Student Ranking Dashboard
          </h1>
          <p className="text-xs text-gray-400 font-medium">
            Search, filter, and sort students based on placement readiness index, CGPA, and predicted eligibility.
          </p>
        </div>
        
        {/* Seed Database button */}
        <button
          onClick={async () => {
            const confirm = window.confirm("Seed database with 100 mock student profiles from the trained dataset?");
            if (confirm) {
              setLoading(true);
              try {
                const res = await fetch("http://localhost:8000/api/seed-db");
                if (res.ok) {
                  alert("Database seeded successfully!");
                  fetchStudents();
                }
              } catch (e) {
                console.error(e);
              } finally {
                setLoading(false);
              }
            }
          }}
          className="text-xs font-bold text-violet-400 hover:text-white bg-violet-600/10 border border-violet-500/20 px-4 py-2.5 rounded-xl cursor-pointer hover:bg-violet-600/25 transition flex items-center gap-1.5 shadow-md shadow-violet-500/5"
        >
          <RefreshCw size={12} />
          Seed Mock Data
        </button>
      </div>

      {/* Podium Top 3 (Only shown when sorting by readiness and no filters are set) */}
      {showPodium && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end max-w-3xl mx-auto pt-6 pb-2">
          
          {/* 2nd Place */}
          <div className="glass-card p-5 border border-white/5 text-center space-y-3 relative order-2 md:order-1 transform hover:-translate-y-1 transition duration-200">
            <div className="absolute top-3 right-3 text-slate-300">
              <Medal size={24} />
            </div>
            <div className="w-12 h-12 rounded-full bg-slate-300/10 border border-slate-300/20 mx-auto flex items-center justify-center font-bold text-sm text-slate-300 shadow-inner">
              2
            </div>
            <div>
              <h4 className="text-sm font-bold text-white truncate">{top2.student_name}</h4>
              <p className="text-[10px] text-gray-400 truncate">{top2.department}</p>
            </div>
            <div className="pt-2 border-t border-white/5">
              <span className="text-[10px] text-gray-500 block uppercase font-bold">Readiness Score</span>
              <span className="text-base font-black text-slate-300">{top2.readiness_score}</span>
            </div>
            <button
              onClick={() => onSelectStudent(top2)}
              className="w-full py-1.5 bg-white/3 hover:bg-white/5 border border-white/5 hover:border-violet-500/30 text-[10px] font-bold text-gray-300 hover:text-white rounded-lg cursor-pointer transition flex items-center justify-center gap-1"
            >
              Analyze Profile <ArrowRight size={10} />
            </button>
          </div>

          {/* 1st Place (Center, Tallest) */}
          <div className="glass-card p-6 border-2 border-amber-500/30 text-center space-y-4 relative order-1 md:order-2 shadow-xl shadow-amber-500/5 transform hover:-translate-y-1.5 transition duration-200 min-h-[260px]">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 font-bold text-[9px] px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-md">
              <Trophy size={10} /> Champion
            </div>
            <div className="absolute top-4 right-4 text-amber-400">
              <Medal size={28} className="animate-pulse" />
            </div>
            <div className="w-14 h-14 rounded-full bg-amber-500/15 border-2 border-amber-500/30 mx-auto flex items-center justify-center font-bold text-base text-amber-400 shadow-lg">
              1
            </div>
            <div>
              <h4 className="text-base font-bold text-white truncate">{top1.student_name}</h4>
              <p className="text-[10px] text-gray-400 truncate">{top1.department}</p>
            </div>
            <div className="pt-3 border-t border-white/5">
              <span className="text-[10px] text-gray-500 block uppercase font-bold">Readiness Score</span>
              <span className="text-lg font-black text-amber-400">{top1.readiness_score}</span>
            </div>
            <button
              onClick={() => onSelectStudent(top1)}
              className="w-full py-2 bg-violet-600 hover:bg-violet-500 text-[10px] font-bold text-white rounded-lg cursor-pointer transition flex items-center justify-center gap-1 shadow-md shadow-violet-500/10"
            >
              Analyze Profile <ArrowRight size={10} />
            </button>
          </div>

          {/* 3rd Place */}
          <div className="glass-card p-5 border border-white/5 text-center space-y-3 relative order-3 transform hover:-translate-y-1 transition duration-200">
            <div className="absolute top-3 right-3 text-amber-700">
              <Medal size={24} />
            </div>
            <div className="w-12 h-12 rounded-full bg-amber-800/10 border border-amber-800/20 mx-auto flex items-center justify-center font-bold text-sm text-amber-600 shadow-inner">
              3
            </div>
            <div>
              <h4 className="text-sm font-bold text-white truncate">{top3.student_name}</h4>
              <p className="text-[10px] text-gray-400 truncate">{top3.department}</p>
            </div>
            <div className="pt-2 border-t border-white/5">
              <span className="text-[10px] text-gray-500 block uppercase font-bold">Readiness Score</span>
              <span className="text-base font-black text-amber-600">{top3.readiness_score}</span>
            </div>
            <button
              onClick={() => onSelectStudent(top3)}
              className="w-full py-1.5 bg-white/3 hover:bg-white/5 border border-white/5 hover:border-violet-500/30 text-[10px] font-bold text-gray-300 hover:text-white rounded-lg cursor-pointer transition flex items-center justify-center gap-1"
            >
              Analyze Profile <ArrowRight size={10} />
            </button>
          </div>

        </div>
      )}

      {/* Filters Banner */}
      <div className="glass-card p-4 border border-white/5 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 text-gray-500" size={16} />
          <input
            type="text"
            placeholder="Search student or register no..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs pl-10 pr-4 py-2.5 glass-input"
          />
        </div>

        {/* Filter Department */}
        <div className="relative flex items-center">
          <Filter className="absolute left-3.5 text-gray-500" size={16} />
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full text-xs pl-10 pr-4 py-2.5 glass-input appearance-none cursor-pointer"
          >
            <option value="All">All Departments</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Information Technology">Information Technology</option>
            <option value="Electronics & Communication">Electronics & Communication</option>
            <option value="Mechanical Engineering">Mechanical Engineering</option>
            <option value="Civil Engineering">Civil Engineering</option>
            <option value="Artificial Intelligence & Machine Learning (AIML)">Artificial Intelligence & Machine Learning (AIML)</option>
            <option value="Artificial Intelligence & Data Science (AIDS)">Artificial Intelligence & Data Science (AIDS)</option>
          </select>
        </div>

        {/* Sort */}
        <div className="relative flex items-center">
          <ArrowUpDown className="absolute left-3.5 text-gray-500" size={16} />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full text-xs pl-10 pr-4 py-2.5 glass-input appearance-none cursor-pointer"
          >
            <option value="readiness_desc">Sort by: Readiness (High to Low)</option>
            <option value="readiness_asc">Sort by: Readiness (Low to High)</option>
            <option value="cgpa_desc">Sort by: CGPA (High to Low)</option>
            <option value="cgpa_asc">Sort by: CGPA (Low to High)</option>
            <option value="name_asc">Sort by: Name (A - Z)</option>
          </select>
        </div>
      </div>

      {/* Rankings Table */}
      <div className="glass-card border border-white/5 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-20 text-center flex flex-col justify-center items-center gap-2">
              <RefreshCw className="animate-spin text-violet-400" size={24} />
              <p className="text-xs text-gray-400 font-semibold">Updating ranking leaderboard...</p>
            </div>
          ) : students.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/2 text-[10px] uppercase tracking-wider font-bold text-gray-400">
                  <th className="py-3.5 px-5 text-center w-16">Rank</th>
                  <th className="py-3.5 px-5">Student Details</th>
                  <th className="py-3.5 px-5">Department</th>
                  <th className="py-3.5 px-5 text-center">CGPA</th>
                  <th className="py-3.5 px-5 text-center">Readiness</th>
                  <th className="py-3.5 px-5 text-center">Probability</th>
                  <th className="py-3.5 px-5 text-center">Status</th>
                  <th className="py-3.5 px-5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs">
                {remainingStudents.map((std, index) => {
                  const actualRank = showPodium ? index + 4 : index + 1;
                  const isPlaced = std.placed === 1;

                  return (
                    <tr key={std.id} className="hover:bg-white/2 transition">
                      {/* Rank */}
                      <td className="py-4 px-5 text-center font-bold text-gray-400">
                        {actualRank}
                      </td>

                      {/* Name/Reg */}
                      <td className="py-4 px-5">
                        <div className="font-bold text-white">{std.student_name}</div>
                        <div className="text-[10px] text-gray-500 mt-0.5">{std.register_no}</div>
                      </td>

                      {/* Department */}
                      <td className="py-4 px-5 text-gray-300 font-medium">{std.department}</td>

                      {/* CGPA */}
                      <td className="py-4 px-5 text-center font-bold text-white">{std.cgpa}</td>

                      {/* Readiness */}
                      <td className="py-4 px-5 text-center font-bold text-white">{std.readiness_score}</td>

                      {/* Probability */}
                      <td className="py-4 px-5 text-center text-gray-300 font-semibold">
                        {Math.round(std.probability * 100)}%
                      </td>

                      {/* Status */}
                      <td className="py-4 px-5 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border
                          ${isPlaced 
                            ? "bg-emerald-950/20 text-emerald-400 border-emerald-500/20" 
                            : "bg-rose-950/20 text-rose-400 border-rose-500/20"
                          }
                        `}>
                          {isPlaced ? "Placed" : "Not Placed"}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-4 px-5 text-center">
                        <button
                          onClick={() => onSelectStudent(std)}
                          className="text-[10px] font-bold text-violet-400 hover:text-white bg-violet-600/10 hover:bg-violet-600 border border-violet-500/20 hover:border-violet-500 px-3 py-1.5 rounded-lg cursor-pointer transition flex items-center gap-1 mx-auto"
                        >
                          Load <ArrowRight size={10} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="py-20 text-center space-y-3">
              <GraduationCap className="text-gray-600 mx-auto" size={40} />
              <p className="text-sm font-semibold text-gray-400">No student profiles found.</p>
              <p className="text-xs text-gray-500 font-medium">Seed the database or create a new student using the forms page.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

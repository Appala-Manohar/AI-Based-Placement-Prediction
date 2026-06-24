import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Map, 
  AlertCircle, 
  CheckSquare, 
  Square,
  Sparkles, 
  Award,
  ChevronRight,
  BookOpen
} from "lucide-react";

export default function LearningRoadmap({ student }) {
  const [checkedTasks, setCheckedTasks] = useState({});

  // Reset checked tasks when student changes
  useEffect(() => {
    setCheckedTasks({});
  }, [student]);

  if (!student) {
    return (
      <div className="pt-24 px-6 max-w-4xl mx-auto text-center h-[70vh] flex flex-col justify-center items-center">
        <div className="w-16 h-16 bg-red-950/20 border border-red-500/20 text-red-400 rounded-full flex items-center justify-center mb-4">
          <AlertCircle size={28} />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">No Student Profile Loaded</h2>
        <p className="text-gray-400 mb-6 font-medium">Please enter your Register Number in the sidebar or create a profile to view your learning roadmap.</p>
        <Link to="/predict-form" className="bg-violet-600 hover:bg-violet-500 text-white font-bold px-6 py-3 rounded-xl transition cursor-pointer">
          Open Prediction Form
        </Link>
      </div>
    );
  }

  const toggleTask = (weekIndex, taskIndex) => {
    const key = `${weekIndex}-${taskIndex}`;
    setCheckedTasks((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const roadmap = student.learning_roadmap || [];

  // Count total tasks and completed ones
  let totalTasks = 0;
  let completedTasks = 0;

  roadmap.forEach((week, wIdx) => {
    week.tasks.forEach((_, tIdx) => {
      totalTasks++;
      if (checkedTasks[`${wIdx}-${tIdx}`]) {
        completedTasks++;
      }
    });
  });

  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="pt-20 pb-16 px-6 max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <span className="text-xs font-semibold text-violet-400 uppercase tracking-widest block">Study Guide</span>
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
          <Map className="text-violet-400" /> Personalized Learning Roadmap
        </h1>
        <p className="text-xs text-gray-400 font-medium">
          A weekly timeline of study materials, practice problems, and optimization tasks designed to target your weakest skill areas.
        </p>
      </div>

      {/* Progress tracker */}
      <div className="glass-card p-6 border border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex-1 space-y-1">
          <h3 className="text-sm font-bold text-white">Roadmap Completion</h3>
          <p className="text-xs text-gray-400 font-medium">
            Completed <span className="text-white font-bold">{completedTasks}</span> of <span className="text-white font-bold">{totalTasks}</span> tasks ({progressPercent}%)
          </p>
          <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden mt-2">
            <div 
              className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
        
        {progressPercent === 100 && totalTasks > 0 && (
          <div className="p-3 bg-emerald-950/20 border border-emerald-500/20 text-emerald-400 rounded-xl flex items-center gap-2 text-xs font-bold animate-bounce">
            <Award size={16} /> All Targets Achieved!
          </div>
        )}
      </div>

      {/* Timeline List */}
      <div className="relative border-l border-white/10 pl-6 ml-4 space-y-8">
        {roadmap.map((week, wIdx) => (
          <div key={wIdx} className="relative space-y-3">
            {/* Timeline Dot */}
            <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 border-violet-500 bg-[#0b0f19] flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-violet-500 rounded-full"></div>
            </div>

            {/* Week Details */}
            <div>
              <span className="text-[10px] font-bold text-violet-400 uppercase tracking-wider block">Timeline Target</span>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                {week.week} <ChevronRight size={14} className="text-gray-500" /> <span className="text-gray-300 font-semibold text-sm">{week.focus}</span>
              </h3>
            </div>

            {/* Task Checklist */}
            <div className="glass-card p-5 border border-white/5 space-y-3">
              {week.tasks.map((task, tIdx) => {
                const isChecked = checkedTasks[`${wIdx}-${tIdx}`];
                return (
                  <div 
                    key={tIdx} 
                    onClick={() => toggleTask(wIdx, tIdx)}
                    className="flex items-start gap-3 p-2 hover:bg-white/2 rounded-lg cursor-pointer transition select-none"
                  >
                    <div className="mt-0.5 text-violet-400 flex-shrink-0">
                      {isChecked ? <CheckSquare size={16} className="text-violet-400" /> : <Square size={16} className="text-gray-600" />}
                    </div>
                    <span className={`text-xs leading-normal font-medium ${isChecked ? "text-gray-500 line-through" : "text-gray-300"}`}>
                      {task}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Next step suggestions */}
      <div className="glass-card p-6 border border-white/5 text-center space-y-3">
        <BookOpen className="text-violet-400 mx-auto" size={24} />
        <h4 className="text-sm font-bold text-white">Need Interview Tips?</h4>
        <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed">
          Open the AI Chatbot to ask specific questions about your weekly checklist items, or practice mock interview questions.
        </p>
        <Link 
          to="/chatbot" 
          className="inline-block bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-xs px-5 py-2.5 rounded-lg transition"
        >
          Ask Career Bot
        </Link>
      </div>

    </div>
  );
}

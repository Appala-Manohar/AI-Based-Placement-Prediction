import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Mic, 
  Brain, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Key, 
  Settings, 
  RefreshCw,
  Award,
  Send,
  HelpCircle,
  Volume2,
  MicOff
} from "lucide-react";

export default function InterviewSimulator({ student, onInterviewSuccess }) {
  const navigate = useNavigate();
  const [stage, setStage] = useState("welcome"); // welcome | loading_questions | active | loading_eval | results
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [responses, setResponses] = useState({});
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [evaluation, setEvaluation] = useState(null);
  
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState(localStorage.getItem("gemini_api_key") || "");
  const [errorMsg, setErrorMsg] = useState("");

  // Speech integration states
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = "en-US";
      
      rec.onstart = () => {
        setIsListening(true);
      };
      rec.onend = () => {
        setIsListening(false);
      };
      rec.onerror = (e) => {
        console.error("Speech recognition error:", e);
        setIsListening(false);
      };
      rec.onresult = (event) => {
        let finalTranscript = "";
        let interimTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        const combined = finalTranscript || interimTranscript;
        if (combined) {
          setCurrentAnswer(combined);
        }
      };
      setRecognition(rec);
    }
  }, []);

  // Speak question helper
  const speakQuestion = (text) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      const voices = window.speechSynthesis.getVoices();
      const defaultVoice = voices.find(v => v.lang.startsWith("en")) || voices[0];
      if (defaultVoice) {
        utterance.voice = defaultVoice;
      }
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Auto-speak when question index changes
  useEffect(() => {
    if (stage === "active" && questions.length > 0 && autoSpeak) {
      const timer = setTimeout(() => {
        speakQuestion(questions[currentIdx]);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [currentIdx, stage, questions, autoSpeak]);

  // Cleanup speech synthesis & recognition on unmount/re-creation
  useEffect(() => {
    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      if (recognition) {
        recognition.stop();
      }
    };
  }, [recognition]);

  const handleToggleMic = () => {
    if (isListening) {
      if (recognition) recognition.stop();
    } else {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      }
      if (recognition) {
        setCurrentAnswer("");
        recognition.start();
      } else {
        alert("Speech recognition is not supported in this browser. Please use Chrome or Edge.");
      }
    }
  };

  // Track key sync
  const handleSaveKey = (e) => {
    e.preventDefault();
    localStorage.setItem("gemini_api_key", apiKey.trim());
    setShowSettings(false);
    alert("Gemini API Key configured and stored locally for interview grading!");
  };

  if (!student) {
    return (
      <div className="pt-24 px-6 max-w-4xl mx-auto text-center h-[70vh] flex flex-col justify-center items-center">
        <div className="w-16 h-16 bg-red-950/20 border border-red-500/20 text-red-400 rounded-full flex items-center justify-center mb-4">
          <AlertCircle size={28} />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">No Student Profile Loaded</h2>
        <p className="text-gray-400 mb-6 font-medium">Please enter your Register Number in the sidebar or create a profile to launch the AI Interview Simulator.</p>
        <button 
          onClick={() => navigate("/predict-form")}
          className="bg-violet-600 hover:bg-violet-500 text-white font-bold px-6 py-3 rounded-xl transition cursor-pointer"
        >
          Open Prediction Form
        </button>
      </div>
    );
  }

  const startInterview = async () => {
    setStage("loading_questions");
    setErrorMsg("");
    try {
      const savedKey = localStorage.getItem("gemini_api_key") || "";
      const res = await fetch("http://localhost:8000/api/interview/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          register_no: student.register_no,
          api_key: savedKey ? savedKey.trim() : null
        })
      });

      if (!res.ok) throw new Error("Failed to load interview questions");

      const data = await res.json();
      setQuestions(data.questions);
      
      // Initialize responses state
      const initialResp = {};
      data.questions.forEach(q => {
        initialResp[q] = "";
      });
      setResponses(initialResp);
      
      setCurrentIdx(0);
      setCurrentAnswer("");
      setStage("active");
    } catch (err) {
      console.error(err);
      setErrorMsg("Error generating interview questions. Verify that the backend is running.");
      setStage("welcome");
    }
  };

  const handleNext = () => {
    if (recognition && isListening) recognition.stop();
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    setIsSpeaking(false);

    // Save current response
    const currentQ = questions[currentIdx];
    setResponses(prev => ({ ...prev, [currentQ]: currentAnswer }));
    
    if (currentIdx < questions.length - 1) {
      const nextIdx = currentIdx + 1;
      setCurrentIdx(nextIdx);
      setCurrentAnswer(responses[questions[nextIdx]] || "");
    }
  };

  const handlePrev = () => {
    if (recognition && isListening) recognition.stop();
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    setIsSpeaking(false);

    // Save current response
    const currentQ = questions[currentIdx];
    setResponses(prev => ({ ...prev, [currentQ]: currentAnswer }));
    
    if (currentIdx > 0) {
      const prevIdx = currentIdx - 1;
      setCurrentIdx(prevIdx);
      setCurrentAnswer(responses[questions[prevIdx]] || "");
    }
  };

  const submitInterview = async () => {
    if (recognition && isListening) recognition.stop();
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    setIsSpeaking(false);

    // Save final response first
    const currentQ = questions[currentIdx];
    const finalResponses = { ...responses, [currentQ]: currentAnswer };
    setResponses(finalResponses);

    // Validate that all questions have answers
    const unanswered = Object.values(finalResponses).some(ans => !ans.trim());
    if (unanswered) {
      const confirmSubmit = window.confirm("You have unanswered questions. Are you sure you want to submit for grading?");
      if (!confirmSubmit) return;
    }

    setStage("loading_eval");
    try {
      const savedKey = localStorage.getItem("gemini_api_key") || "";
      const res = await fetch("http://localhost:8000/api/interview/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          register_no: student.register_no,
          responses: finalResponses,
          api_key: savedKey ? savedKey.trim() : null
        })
      });

      if (!res.ok) throw new Error("Failed to evaluate mock interview");

      const data = await res.json();
      setEvaluation(data);
      
      // Re-fetch student to trigger App.jsx update (updates placement probability etc.)
      const studentRes = await fetch(`http://localhost:8000/api/students/${student.register_no}`);
      if (studentRes.ok) {
        const updatedStudent = await studentRes.json();
        onInterviewSuccess(updatedStudent);
      }
      
      setStage("results");
    } catch (err) {
      console.error(err);
      alert("Error grading interview responses. Fallback grading will be simulated.");
      setStage("active");
    }
  };

  const getScoreRating = (score) => {
    if (score >= 90) return { label: "Excellent", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" };
    if (score >= 75) return { label: "Good", color: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/20" };
    if (score >= 60) return { label: "Average", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" };
    return { label: "Needs Improvement", color: "text-rose-400", bg: "bg-rose-500/10 border-rose-500/20" };
  };

  return (
    <div className="pt-20 pb-16 px-6 max-w-4xl mx-auto space-y-8 animate-fade-in">
      
      {/* Header section with Settings Cog */}
      <div className="flex justify-between items-start gap-4">
        <div>
          <span className="text-xs font-semibold text-violet-400 uppercase tracking-widest block font-bold">Simulator Hub</span>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-2.5 tracking-tight">
            <Mic className="text-violet-400 animate-pulse" size={26} /> AI Mock Interview Simulator
          </h1>
          <p className="text-xs text-gray-400 font-medium">
            Conduct a dynamic mock placement interview. Your text responses are graded by AI to update your readiness benchmarks.
          </p>
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2.5 bg-white/3 hover:bg-white/5 border border-white/5 rounded-xl text-gray-400 hover:text-white cursor-pointer transition relative"
          title="Configure API Settings"
        >
          <Settings size={18} />
          {!apiKey && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full animate-ping"></span>
          )}
        </button>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="glass-card p-6 border border-violet-500/30 bg-[#0d0a1b]/95 space-y-4 animate-scale-up">
          <div className="flex items-center gap-2 text-white font-bold text-sm border-b border-white/5 pb-2">
            <Key className="text-violet-400" size={16} />
            Configure Gemini Developer Key
          </div>
          <p className="text-[11px] text-gray-400 leading-relaxed font-medium">
            Providing your personal Gemini API Key enables dynamic AI questions and comprehensive response grading. 
            Without a key, the system will use environment key settings or fall back to local rule-based routing.
          </p>
          <form onSubmit={handleSaveKey} className="flex gap-2">
            <input
              type="password"
              placeholder="AIzaSy..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="flex-1 text-xs p-3 glass-input font-medium"
            />
            <button
              type="submit"
              className="bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs px-5 rounded-xl cursor-pointer transition"
            >
              Save Key
            </button>
          </form>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl flex items-center gap-2 font-medium">
          <AlertCircle size={16} />
          {errorMsg}
        </div>
      )}

      {/* Welcome Screen */}
      {stage === "welcome" && (
        <div className="glass-card p-8 border border-white/5 text-center space-y-6 animate-scale-up">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-violet-600/10 border border-violet-500/20 text-violet-400 rounded-full flex items-center justify-center shadow-lg shadow-violet-500/5">
              <Brain size={32} />
            </div>
          </div>
          <div className="space-y-2 max-w-lg mx-auto">
            <h2 className="text-xl font-bold text-white tracking-tight">Ready to begin your mock evaluation?</h2>
            <p className="text-xs text-gray-400 leading-relaxed font-medium">
              We will conduct a 5-question structured assessment:
            </p>
            <ul className="text-left text-xs text-gray-400 space-y-1.5 list-disc pl-12 pt-2 font-medium">
              <li>1 Behavioral / HR introduction query</li>
              <li>2 General Coding & Object-Oriented Principles queries</li>
              <li>1 Core DBMS / SQL structural question</li>
              <li>1 Department specific technical query ({student.department})</li>
            </ul>
          </div>

          <div className="pt-4">
            <button
              onClick={startInterview}
              className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold text-xs px-8 py-3.5 rounded-xl cursor-pointer shadow-lg shadow-violet-500/10 transition inline-flex items-center gap-2"
            >
              <Sparkles size={14} /> Start Placement Interview
            </button>
          </div>
        </div>
      )}

      {/* Loading Questions Screen */}
      {stage === "loading_questions" && (
        <div className="glass-card p-12 border border-white/5 text-center space-y-6 flex flex-col justify-center items-center h-72">
          <Brain className="text-violet-400 animate-bounce" size={40} />
          <div className="space-y-1.5">
            <h3 className="text-base font-bold text-white">Assembling custom questions...</h3>
            <p className="text-[11px] text-gray-400 font-medium">Generating technical, HR, and core engineering questions mapped to your profile.</p>
          </div>
          <RefreshCw className="animate-spin text-violet-500" size={16} />
        </div>
      )}

      {/* Active Interview Terminal */}
      {stage === "active" && questions.length > 0 && (
        <div className="glass-card p-8 border border-white/5 space-y-6 animate-scale-up">
          {/* Progress Indicator */}
          <div className="flex justify-between items-center border-b border-white/5 pb-4">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-violet-600/20 text-violet-400 border border-violet-500/20 rounded-md text-[10px] font-bold">
                Question {currentIdx + 1} of {questions.length}
              </span>
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                {currentIdx === 0 ? "HR Intro" : currentIdx === 4 ? "Project Experience" : "Technical Domain"}
              </span>
            </div>
            <div className="w-24 bg-white/5 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-violet-500 to-fuchsia-500 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Question Display */}
          <div className="space-y-2.5 bg-white/3 border border-white/5 p-5 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-1.5 flex-1">
              <div className="text-violet-400 font-bold text-xs flex items-center gap-1.5">
                <HelpCircle size={14} /> AI Recruiter Question:
              </div>
              <p className="text-sm font-semibold text-white leading-relaxed">
                {questions[currentIdx]}
              </p>
            </div>
            <div className="flex items-center gap-2 border-t md:border-t-0 md:border-l border-white/5 pt-2.5 md:pt-0 md:pl-4">
              <button
                onClick={() => speakQuestion(questions[currentIdx])}
                className={`p-2.5 rounded-xl border transition cursor-pointer flex items-center justify-center gap-1.5 text-xs font-semibold
                  ${isSpeaking 
                    ? "bg-violet-600/20 border-violet-500/40 text-violet-400 animate-pulse animate-pulse-glow" 
                    : "bg-white/3 border-white/5 text-gray-300 hover:bg-white/5 hover:text-white"
                  }
                `}
                title="Speak Question"
              >
                {isSpeaking ? <Volume2 size={16} className="animate-bounce" /> : <Volume2 size={16} />}
                Listen
              </button>
              <button
                onClick={() => setAutoSpeak(!autoSpeak)}
                className={`p-2.5 rounded-xl border transition cursor-pointer text-xs font-semibold
                  ${autoSpeak 
                    ? "bg-fuchsia-600/25 border-fuchsia-500/40 text-fuchsia-400 animate-pulse-glow" 
                    : "bg-white/3 border-white/5 text-gray-400 hover:text-white"
                  }
                `}
                title="Toggle Auto Read Questions"
              >
                {autoSpeak ? "Auto-Read: On" : "Auto-Read: Off"}
              </button>
            </div>
          </div>

          {/* Oral/Voice Response Area */}
          <div className="space-y-5 border border-white/5 p-6 rounded-2xl bg-[#0e0c1f]/40 relative overflow-hidden">
            <div className="text-center space-y-1">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block">
                Oral Response Panel
              </label>
              <p className="text-[10px] text-gray-500">Record your response orally. You can review and edit the transcribed text before submitting.</p>
            </div>

            {/* Mic Pulse Button and status */}
            <div className="flex flex-col items-center justify-center py-4 space-y-4">
              {isListening ? (
                <div className="flex flex-col items-center space-y-3">
                  <div className="relative">
                    {/* Ring ripple animations */}
                    <span className="absolute -inset-4 rounded-full bg-rose-500/25 animate-ping"></span>
                    <span className="absolute -inset-8 rounded-full bg-rose-500/10 animate-pulse"></span>
                    <button
                      onClick={handleToggleMic}
                      className="relative w-20 h-20 bg-gradient-to-tr from-rose-600 to-red-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-rose-500/40 border border-rose-400/30 cursor-pointer transition-all hover:scale-95"
                    >
                      <MicOff size={32} />
                    </button>
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-xs text-rose-400 font-extrabold animate-pulse uppercase tracking-wider flex items-center gap-1.5 justify-center">
                      <span className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping"></span>
                      Listening... Speak now
                    </p>
                    <p className="text-[9px] text-gray-400 font-medium">Click the button when done speaking</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-3">
                  <button
                    onClick={handleToggleMic}
                    className="w-20 h-20 bg-gradient-to-tr from-violet-600 to-fuchsia-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-violet-500/25 border border-violet-400/20 cursor-pointer transition-all hover:scale-105 active:scale-95"
                  >
                    <Mic size={32} />
                  </button>
                  <div className="text-center space-y-1">
                    <p className="text-xs text-violet-400 font-extrabold uppercase tracking-wider">Microphone Ready</p>
                    <p className="text-[9px] text-gray-400 font-medium">Tap to start voice recording</p>
                  </div>
                </div>
              )}
            </div>

            {/* Live Text Area review */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Transcribed Text
                </span>
                <span className="text-[10px] text-gray-500 font-semibold">
                  {currentAnswer.split(/\s+/).filter(Boolean).length} words / {currentAnswer.length} chars
                </span>
              </div>
              <textarea
                required
                rows={4}
                placeholder="Your speech transcript will populate here. You can click here to edit or adjust your response manually."
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                className="w-full text-xs p-4 glass-input font-medium leading-relaxed focus:border-violet-500/50"
              />
              <div className="text-[9px] text-gray-500 font-medium leading-relaxed">
                * Note: Speak clearly. Speak about your projects, technical skills, or behavioral experiences. You can modify any typos before clicking "Next".
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-between items-center pt-4 border-t border-white/5">
            <button
              onClick={handlePrev}
              disabled={currentIdx === 0}
              className={`flex items-center gap-1 font-semibold text-xs px-5 py-2.5 rounded-xl border transition cursor-pointer
                ${currentIdx === 0 
                  ? "border-white/5 text-gray-600 bg-transparent cursor-not-allowed" 
                  : "border-white/10 text-white bg-white/5 hover:bg-white/10"
                }
              `}
            >
              <ChevronLeft size={14} /> Previous
            </button>

            {currentIdx < questions.length - 1 ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-1 bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl cursor-pointer transition shadow-lg shadow-violet-500/10"
              >
                Next Question <ChevronRight size={14} />
              </button>
            ) : (
              <button
                onClick={submitInterview}
                className="flex items-center gap-1.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold text-xs px-7 py-3 rounded-xl cursor-pointer shadow-lg shadow-violet-500/15 transition animate-pulse"
              >
                <Send size={12} /> Submit Interview for Grading
              </button>
            )}
          </div>
        </div>
      )}

      {/* Loading Evaluation Screen */}
      {stage === "loading_eval" && (
        <div className="glass-card p-12 border border-white/5 text-center space-y-6 flex flex-col justify-center items-center h-80">
          <Brain className="text-violet-400 animate-spin" size={44} />
          <div className="space-y-1.5">
            <h3 className="text-base font-bold text-white">AI Grading engine evaluating responses...</h3>
            <p className="text-[11px] text-gray-400 font-medium max-w-sm mx-auto">
              Recruiter is checking keyword matches, structure, grammar, and technical completeness. Your profile score updates on final computation.
            </p>
          </div>
        </div>
      )}

      {/* Results Dashboard */}
      {stage === "results" && evaluation && (
        <div className="space-y-6 animate-scale-up">
          
          {/* Main Score Card */}
          <div className="glass-card p-8 border border-white/5 text-center space-y-6 relative overflow-hidden">
            
            <div className="absolute top-0 right-0 p-4">
              <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase border ${getScoreRating(evaluation.score).bg} ${getScoreRating(evaluation.score).color}`}>
                Rating: {getScoreRating(evaluation.score).label}
              </span>
            </div>

            <div className="flex justify-center pt-2">
              <div className="w-24 h-24 bg-violet-600/10 border border-violet-500/20 text-violet-400 rounded-full flex flex-col items-center justify-center shadow-lg shadow-violet-500/5">
                <span className="text-3xl font-black text-white">{evaluation.score}</span>
                <span className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">Grade / 100</span>
              </div>
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <h2 className="text-2xl font-black text-white tracking-tight">Interview Assessment Complete</h2>
              <p className="text-xs text-gray-400 leading-relaxed font-medium">
                Your placement readiness metrics have been re-calibrated. An updated prediction is available in your profile.
              </p>
            </div>
          </div>

          {/* Strengths & Weaknesses Split Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6 border border-white/5 space-y-4">
              <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest border-b border-white/5 pb-2 flex items-center gap-1.5">
                <CheckCircle size={14} /> Key Response Strengths
              </h3>
              <ul className="text-xs text-gray-300 space-y-2.5 font-medium pl-1">
                {evaluation.analysis?.strengths?.map((str, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold">•</span>
                    <span>{str}</span>
                  </li>
                )) || <li className="text-gray-500">Good vocabulary detail.</li>}
              </ul>
            </div>

            <div className="glass-card p-6 border border-white/5 space-y-4">
              <h3 className="text-xs font-bold text-rose-400 uppercase tracking-widest border-b border-white/5 pb-2 flex items-center gap-1.5">
                <XCircle size={14} /> Response Weaknesses
              </h3>
              <ul className="text-xs text-gray-300 space-y-2.5 font-medium pl-1">
                {evaluation.analysis?.weaknesses?.map((weak, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-rose-500 font-bold">•</span>
                    <span>{weak}</span>
                  </li>
                )) || <li className="text-gray-500">Explanation detail can improve.</li>}
              </ul>
            </div>
          </div>

          {/* Actionable Improvement Suggestions */}
          <div className="glass-card p-6 border border-white/5 space-y-4">
            <h3 className="text-xs font-bold text-violet-400 uppercase tracking-widest border-b border-white/5 pb-2 flex items-center gap-1.5">
              <Award size={14} /> Recruiter Suggestions for Improvement
            </h3>
            <ul className="text-xs text-gray-300 space-y-3 font-medium pl-1">
              {evaluation.suggestions?.map((sug, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="text-violet-500 font-bold">{idx + 1}.</span>
                  <span>{sug}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <button
              onClick={() => {
                setQuestions([]);
                setEvaluation(null);
                setStage("welcome");
              }}
              className="bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs px-8 py-3.5 rounded-xl cursor-pointer flex items-center gap-1.5 shadow-lg shadow-violet-500/10 transition"
            >
              <RefreshCw size={14} /> Retake Assessment
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-white/5 hover:bg-white/10 text-white border border-white/10 font-semibold text-xs px-8 py-3.5 rounded-xl cursor-pointer transition"
            >
              View Updated Dashboard
            </button>
          </div>

        </div>
      )}
    </div>
  );
}

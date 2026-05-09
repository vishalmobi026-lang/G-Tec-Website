import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LottieBase from "lottie-react"; 
import gaming from "../assets/Rocket.json"; 
import gamings from "../assets/gaming.json";
import { 
  Trophy, ArrowRight,ShieldAlert, Sparkles, Copy, CheckCircle2, 
  ChevronLeft, ChevronRight, Heart, Zap, Bomb, 
  User, Phone, BookOpen, BrainCircuit, X, Loader2,
  ChevronDown, AlertCircle, Rocket
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Lottie = LottieBase.default || LottieBase;

const API_CATEGORY_MAP = {
  "IT / Technical": 18,     
  "IT / Non-Technical": 9,  
  "Designing": 25,          
  "Accounting": 19,         
  "Civil": 17               
};

const FALLBACK_QUESTIONS = {
  "IT / Technical": [
    { q: "What does HTML stand for?", options: ["Hyper Text", "Home Tool", "Hyperlinks"], correct: 0 },
    { q: "Which acts as the 'brain' of a computer?", options: ["RAM", "Motherboard", "CPU"], correct: 2 },
    { q: "Which is a frontend React framework?", options: ["Next.js", "Django", "Laravel"], correct: 0 },
    { q: "What does CSS do?", options: ["Database", "Styling", "Server Logic"], correct: 1 },
    { q: "Python files end with which extension?", options: [".pt", ".py", ".pn"], correct: 1 }
  ],
  "IT / Non-Technical": [
    { q: "What does SEO stand for?", options: ["Search Engine Opt.", "Secure Email Org.", "System Error Out"], correct: 0 },
    { q: "Which is used for spreadsheets?", options: ["MS Word", "MS Excel", "MS Paint"], correct: 1 },
    { q: "B2B stands for?", options: ["Back to Basics", "Business to Bus.", "Binary to Base"], correct: 1 },
    { q: "Which is a social media platform?", options: ["LinkedIn", "Linux", "Linode"], correct: 0 },
    { q: "What is Google Analytics used for?", options: ["Coding", "Web Traffic", "Video Editing"], correct: 1 }
  ],
  "Designing": [
    { q: "What does CAD stand for?", options: ["Computer Art", "Code And Deploy", "Computer Aided Design"], correct: 2 },
    { q: "Which tool is best for UI/UX?", options: ["Figma", "AutoCAD", "Notepad"], correct: 0 },
    { q: "RGB is primarily used for?", options: ["Printing", "Digital Screens", "3D Models"], correct: 1 },
    { q: "Which is vector-based?", options: ["Photoshop", "Illustrator", "Lightroom"], correct: 1 },
    { q: "What does UI stand for?", options: ["User Interface", "Unix Index", "Unified Input"], correct: 0 }
  ],
  "Civil": [
    { q: "Which software is standard for 2D drafting?", options: ["Maya", "AutoCAD", "Photoshop"], correct: 1 },
    { q: "Revit is primarily used for?", options: ["Video Editing", "BIM Modeling", "Web Design"], correct: 1 },
    { q: "What does RCC stand for?", options: ["Real Cement", "Reinforced Concrete", "Rigid Core"], correct: 1 },
    { q: "Which tool is used for 3D elevation?", options: ["3ds Max", "Excel", "Tally"], correct: 0 },
    { q: "What is a foundation?", options: ["Roof top", "Base of structure", "Wall paint"], correct: 1 }
  ],
  "Accounting": [
    { q: "Which software is used for GST in India?", options: ["AutoCAD", "Tally Prime", "VS Code"], correct: 1 },
    { q: "What is a Ledger?", options: ["Account Book", "Hardware", "Tax Type"], correct: 0 },
    { q: "GST stands for?", options: ["Gross Sales Tax", "Goods & Service Tax", "General State Tax"], correct: 1 },
    { q: "Which is an asset?", options: ["Bank Loan", "Cash in Hand", "Creditors"], correct: 1 },
    { q: "What is SAP?", options: ["Game Engine", "ERP Software", "Design Tool"], correct: 1 }
  ]
};

const decodeHTML = (html) => {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
};

// BUTTERY SMOOTH CUSTOM EASING CURVE (Starts fast, slow & smooth deceleration)
const smoothEase = [0.16, 1, 0.3, 1];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 40, filter: "blur(8px)" },
  show: { 
    opacity: 1, 
    y: 0, 
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: smoothEase } 
  }
};

export default function NeonStrikeGame() {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState("intro"); 
  const [score, setScore] = useState(0);
  const [playerLane, setPlayerLane] = useState(1); 
  const [entities, setEntities] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [floatingTexts, setFloatingTexts] = useState([]);
  const [lives, setLives] = useState(3);
  const [combo, setCombo] = useState(1);
  const [shake, setShake] = useState(false); 
  const [couponCode, setCouponCode] = useState("");
  const [copied, setCopied] = useState(false);
  
  const [countries, setCountries] = useState([]);
  const [formData, setFormData] = useState({ name: "", countryCode: "+91", phone: "", course: "" });
  const [formError, setFormError] = useState("");
  const [isFetchingQs, setIsFetchingQs] = useState(false);

  const stateRef = useRef({
    lane: 1, score: 0, lives: 3, combo: 1,
    speed: 0.35, 
    entities: [], flashTimer: 0, frame: 0, 
    questions: [], qIndex: 0, isQuestionActive: false,
    spawnTimer: 30 
  });

  const gameLoopRef = useRef(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/countries")
      .then((res) => res.json())
      .then((data) => setCountries(data))
      .catch((err) => console.error("Failed to fetch countries:", err));
  }, []);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 400);
  };

  const addFloatingText = (text, color, lane) => {
    const id = Date.now() + Math.random();
    setFloatingTexts(prev => [...prev, { id, text, color, lane }]);
    setTimeout(() => setFloatingTexts(prev => prev.filter(t => t.id !== id)), 1000);
  };

  const copyToClipboard = () => {
    if (couponCode) {
      navigator.clipboard.writeText(couponCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePhoneChange = (e) => {
    const digitsOnly = e.target.value.replace(/\D/g, "");
    setFormData({ ...formData, phone: digitsOnly });
  };

  const submitForm = async () => {
    if (formData.name.trim().length < 3) return setFormError("Name must be at least 3 characters.");
    if (formData.countryCode === "+91" && formData.phone.length !== 10) return setFormError("Indian phone numbers must be exactly 10 digits.");
    if (formData.countryCode !== "+91" && formData.phone.length < 6) return setFormError("Please enter a valid phone number.");
    if (!formData.course) return setFormError("Please select a target course.");
    
    setFormError("");
    setIsFetchingQs(true);

    let finalQuestions = [];

    try {
      const categoryId = API_CATEGORY_MAP[formData.course] || 18; 
      const response = await fetch(`https://opentdb.com/api.php?amount=10&category=${categoryId}&type=multiple`);
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        finalQuestions = data.results.map((item) => {
          const options = [...item.incorrect_answers];
          const correctIndex = Math.floor(Math.random() * 4); 
          options.splice(correctIndex, 0, item.correct_answer); 

          return {
            q: decodeHTML(item.question),
            options: options.map(decodeHTML),
            correct: correctIndex,
          };
        });
      } else {
        finalQuestions = [...FALLBACK_QUESTIONS[formData.course]].sort(() => Math.random() - 0.5);
      }
    } catch (error) {
      console.error("API failed to fetch, using fallback questions:", error);
      finalQuestions = [...FALLBACK_QUESTIONS[formData.course]].sort(() => Math.random() - 0.5);
    }

    setIsFetchingQs(false);
    startGame(finalQuestions);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameState !== "playing") return;
      if (e.key === "ArrowLeft" && stateRef.current.lane > 0) movePlayer(-1);
      if (e.key === "ArrowRight" && stateRef.current.lane < 2) movePlayer(1);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState]);

  const movePlayer = (direction) => {
    const newLane = stateRef.current.lane + direction;
    if (newLane >= 0 && newLane <= 2) {
      stateRef.current.lane = newLane;
      setPlayerLane(newLane);
    }
  };

  const startGame = (questionsToPlay) => {
    setGameState("playing");
    setScore(0); setLives(3); setCombo(1); setEntities([]);
    
    setCurrentQuestion(questionsToPlay[0].q); 
    
    stateRef.current = {
      lane: 1, score: 0, lives: 3, combo: 1, speed: 0.35, entities: [], 
      flashTimer: 0, frame: 0, questions: questionsToPlay, qIndex: 0, 
      isQuestionActive: false, spawnTimer: 30
    };

    setPlayerLane(1);
    gameLoopRef.current = setInterval(gameTick, 30);
  };

  const gameTick = () => {
    const state = stateRef.current;
    state.frame += 1;
    
    if (state.frame % 300 === 0) state.speed += 0.015; 
    if (state.flashTimer > 0) state.flashTimer -= 30;

    if (!state.isQuestionActive) {
      if (state.spawnTimer > 0) {
        state.spawnTimer--;
      } else {
        if (state.qIndex >= state.questions.length) state.qIndex = 0; 
        
        const qData = state.questions[state.qIndex];
        state.isQuestionActive = true;

        const laneOrder = [0, 1, 2];
        const selectedOptions = [];
        selectedOptions.push({ text: qData.options[qData.correct], isCorrect: true });
        
        const incorrects = qData.options.filter((_, i) => i !== qData.correct);
        selectedOptions.push({ text: incorrects[0] || "None", isCorrect: false });
        selectedOptions.push({ text: incorrects[1] || "All", isCorrect: false });
        
        selectedOptions.sort(() => Math.random() - 0.5); 
        
        selectedOptions.forEach((opt, index) => {
          state.entities.push({
            id: Date.now() + Math.random(),
            lane: laneOrder[index],
            top: -10, 
            text: opt.text,
            isCorrect: opt.isCorrect,
            revealed: false 
          });
        });
      }
    }

    let hitWrong = false;
    let waveCompleted = false;

    state.entities = state.entities.map(ent => ({ ...ent, top: ent.top + state.speed }))
      .filter(ent => {
        const inHitbox = ent.top > 75 && ent.top < 90 && ent.lane === state.lane;
        
        if (inHitbox && !ent.revealed) {
          ent.revealed = true; 
          waveCompleted = true; 

          if (ent.isCorrect) {
            const pts = 1000 * state.combo;
            state.score += pts;
            state.combo = Math.min(state.combo + 1, 10);
            setCombo(state.combo);
            addFloatingText(`+${pts}`, "text-green-400", state.lane);
          } else {
            hitWrong = true;
            addFloatingText("WRONG", "text-red-500", state.lane);
          }
        }
        return ent.top < 120; 
      });

    if (waveCompleted) {
      setTimeout(() => {
        state.entities = [];
        state.isQuestionActive = false;
        state.qIndex++;
        
        if (state.qIndex >= state.questions.length) state.qIndex = 0;
        setCurrentQuestion(state.questions[state.qIndex].q);
        
        state.spawnTimer = 70; 
      }, 800); 
    }

    if (hitWrong) {
      triggerShake(); 
      state.lives -= 1;
      state.combo = 1; 
      state.flashTimer = 2000; 
      
      setLives(state.lives);
      setCombo(state.combo);
      
      if (state.lives <= 0) {
        endGame();
        return;
      }
    }

    if (state.frame % 3 === 0) {
      setScore(state.score);
      setEntities([...state.entities]);
    }
  };

  const endGame = async () => {
    clearInterval(gameLoopRef.current);
    
    const finalScore = stateRef.current.score;
    let prefix = "B2"; 
    if (finalScore > 10000) prefix = "X9"; 
    else if (finalScore > 5000) prefix = "V7"; 
    
    const code = `GTEC-${prefix}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    setCouponCode(code);
    setGameState("result");

    const fullPhoneNumber = `${formData.countryCode}${formData.phone}`;
    try {
      await fetch("http://localhost:5000/api/gamescores/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formData.name, phone: fullPhoneNumber, course: formData.course, score: finalScore, couponCode: code })
      });
    } catch (error) { console.error("Failed to save score:", error); }
  };

  const handleExit = () => {
    clearInterval(gameLoopRef.current);
    navigate("/");
  };

  return (
    <div className="fixed inset-0 z-[99999] bg-gradient-to-br from-[#0a0514] via-[#11092e] to-[#0a1930] flex items-center justify-center font-sans overflow-hidden select-none w-screen h-[100dvh]">
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-cyan-600/10 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-600/10 blur-[150px] rounded-full pointer-events-none"></div>

      {gameState !== "playing" && (
        <button onClick={handleExit} className="absolute top-4 right-4 md:top-6 md:right-6 z-[100000] bg-white/10 hover:bg-red-500/80 text-white p-3 rounded-full backdrop-blur-md transition-all duration-500 border border-white/20 shadow-lg">
          <X size={24} />
        </button>
      )}

      <motion.div 
        animate={shake ? { x: [-10, 10, -10, 10, 0], y: [-5, 5, -5, 5, 0] } : {}}
        transition={{ duration: 0.3 }}
        className="w-full h-full relative z-10 flex flex-col justify-center max-w-[1920px] mx-auto"
      >
        <AnimatePresence mode="wait">
          
          {/* ----- 1. INTRO SCREEN ----- */}
          {gameState === "intro" && (
  <div className="min-h-screen w-full bg-black flex flex-col items-center justify-center p-4 md:p-10 relative overflow-hidden">
    
    {/* LIVE ANIMATED BACKGROUND */}
    <div className="absolute inset-0 cyber-grid opacity-40 z-0" />
    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.15)_0%,transparent_50%)] z-0" />

    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }} 
      animate={{ opacity: 1, scale: 1 }}
      className="z-10 w-full max-w-7xl flex flex-col lg:flex-row gap-6 items-stretch"
    >
      
      {/* CARD 1: IDENTITY MODULE */}
      <motion.div 
        whileHover={{ y: -5, rotateX: 2, rotateY: -2 }}
        className="flex-1 bg-zinc-900/40 backdrop-blur-2xl border-t-2 border-l-2 border-blue-500/30 p-8 md:p-12 rounded-[2.5rem] shadow-[20px_20px_50px_rgba(0,0,0,0.5)] flex flex-col justify-between overflow-hidden relative group"
      >
        <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-100 transition-opacity">
          <span className="font-mono text-[10px] text-blue-500">SYS_REF: G-TEC_BRAIN_V3</span>
        </div>

        <div className="space-y-6">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="w-20 h-20 border-2 border-dashed border-blue-500/50 rounded-full flex items-center justify-center"
          >
             <BrainCircuit size={40} className="text-blue-500 neon-glow" />
          </motion.div>

          <div className="space-y-2">
            <h2 className="text-blue-400 font-mono text-xs tracking-[0.5em] uppercase">Security Clearance: Level 1</h2>
            <h1 className="text-5xl md:text-7xl font-black text-white leading-tight uppercase tracking-tighter">
              KNOWLEDGE <br /> <span className="text-blue-500 italic neon-glow">COMMAND</span>
            </h1>
          </div>
        </div>

        <p className="mt-8 text-zinc-500 font-mono text-sm leading-relaxed border-l-2 border-blue-500/50 pl-4">
          Establish neural handshake. <br />
          <span className="text-zinc-300">Target: 100% Scholarship Grant Allocation.</span>
        </p>
      </motion.div>

      {/* CARD 2: PROTOCOL (DISCLAIMER) MODULE */}
      <motion.div 
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="lg:w-[450px] bg-black/60 backdrop-blur-3xl border border-white/5 p-8 rounded-[2.5rem] shadow-2xl relative flex flex-col justify-between"
      >
        {/* Animated Scan Bar */}
        <motion.div 
          animate={{ top: ['0%', '100%', '0%'] }} 
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute left-0 right-0 h-[2px] bg-blue-500/50 blur-[4px] z-20"
        />

        <div>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-white font-bold text-xl uppercase tracking-widest flex items-center gap-2">
              <ShieldAlert className="text-blue-500" /> Directives
            </h3>
            <div className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-1 rounded border border-blue-500/20">LIVE_FEED</div>
          </div>

          <div className="space-y-6">
            {[
              { label: "01_LIMIT", text: "One session attempt per verified UID." },
              { label: "02_TIMER", text: "Sixty-second response window per node." },
              { label: "03_CRED", text: "Identity verification mandatory for grant." },
              { label: "04_DATA", text: "System logs IP and attempt metadata." }
            ].map((item, idx) => (
              <div key={idx} className="group cursor-default">
                <p className="text-[10px] text-blue-500 font-mono mb-1">{item.label}</p>
                <p className="text-zinc-400 text-xs font-medium group-hover:text-white transition-colors">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 space-y-4">
          <button 
            onClick={() => setGameState("form")}
            className="w-full relative group h-16 bg-white rounded-2xl overflow-hidden shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-95 transition-transform"
          >
            <div className="absolute inset-0 bg-blue-600 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
            <span className="relative z-10 text-black group-hover:text-white font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-colors">
              Initialize System <ArrowRight size={20} />
            </span>
          </button>
          <p className="text-[9px] text-zinc-600 text-center font-mono uppercase tracking-[0.2em]">Authorized Access Only // Port_8080</p>
        </div>
      </motion.div>

    </motion.div>
  </div>
)}
          {/* ----- 2. FORM SCREEN (Buttery Smooth Animation) ----- */}
          {gameState === "form" && (
            <motion.div 
              key="form" 
              initial={{ opacity: 0, scale: 0.98, y: 30, filter: "blur(10px)" }} 
              animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }} 
              exit={{ opacity: 0, scale: 0.98, y: -20, filter: "blur(10px)" }} 
              transition={{ duration: 1, ease: smoothEase }}
              className="w-full max-w-5xl mx-auto bg-white/5 backdrop-blur-3xl p-6 md:p-12 rounded-[2rem] md:rounded-[3rem] border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.6)] relative overflow-hidden"
            >
              {/* Dynamic rotating ambient light behind the form */}
              <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
                className="absolute -top-[50%] -right-[20%] w-[100%] h-[150%] bg-gradient-to-b from-cyan-500/10 to-transparent blur-[120px] rounded-full pointer-events-none"
              />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center relative z-10">
                
                {/* LEFT COLUMN: ANIMATED STAGGERED FORM */}
                <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-8">
                  
                  <motion.div variants={itemVariants}>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-4">
                      <Sparkles size={14} className="animate-pulse" /> Security Clearance
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-3 tracking-tight">Pilot Registration</h2>
                    <p className="text-slate-400 text-sm md:text-base font-medium leading-relaxed">
                      Authenticate your credentials to generate your secure scholarship pass and enter the arena.
                    </p>
                  </motion.div>
                  
                  <motion.div variants={itemVariants} className="space-y-5">
                    
                    {/* Smooth Input 1 */}
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User className="text-slate-500 group-focus-within:text-cyan-400 transition-colors duration-500 ease-out" size={20} />
                      </div>
                      <input 
                        type="text" placeholder="Full Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} 
                        className="w-full bg-slate-900/40 border border-slate-700/50 text-white rounded-2xl py-4 pl-12 pr-4 hover:bg-slate-800/40 focus:bg-slate-800/80 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10 outline-none transition-all duration-500 ease-out text-base placeholder:text-slate-500 font-medium shadow-inner" 
                      />
                    </div>
                    
                    {/* Smooth Input 2 */}
                    <div className="flex gap-3 relative">
                      <div className="relative w-[35%] shrink-0 group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone className="text-slate-500 group-focus-within:text-cyan-400 transition-colors duration-500 ease-out" size={18} />
                        </div>
                        <select 
                          value={formData.countryCode} onChange={(e) => setFormData({...formData, countryCode: e.target.value})} 
                          className="w-full bg-slate-900/40 border border-slate-700/50 text-white rounded-2xl py-4 pl-10 pr-8 hover:bg-slate-800/40 focus:bg-slate-800/80 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10 outline-none transition-all duration-500 ease-out appearance-none text-sm md:text-base font-medium shadow-inner cursor-pointer"
                        >
                          <option value="+91">IN (+91)</option>
                          {countries.map((c) => <option key={c.id} value={`+${c.phonecode}`}>{c.id} (+{c.phonecode})</option>)}
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <ChevronDown className="text-slate-500 group-focus-within:text-cyan-400 transition-colors duration-500 ease-out" size={16} />
                        </div>
                      </div>
                      
                      <input 
                        type="text" placeholder="Phone Number" value={formData.phone} onChange={handlePhoneChange} maxLength={formData.countryCode === "+91" ? 10 : 15} 
                        className="w-[65%] bg-slate-900/40 border border-slate-700/50 text-white rounded-2xl py-4 px-5 hover:bg-slate-800/40 focus:bg-slate-800/80 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10 outline-none transition-all duration-500 ease-out font-mono tracking-wider text-base md:text-lg placeholder:text-slate-500 placeholder:font-sans font-medium shadow-inner" 
                      />
                    </div>

                    {/* Smooth Input 3 */}
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <BookOpen className="text-slate-500 group-focus-within:text-cyan-400 transition-colors duration-500 ease-out" size={20} />
                      </div>
                      <select 
                        value={formData.course} onChange={(e) => setFormData({...formData, course: e.target.value})} 
                        className="w-full bg-slate-900/40 border border-slate-700/50 text-white rounded-2xl py-4 pl-12 pr-10 hover:bg-slate-800/40 focus:bg-slate-800/80 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10 outline-none transition-all duration-500 ease-out appearance-none text-base md:text-lg font-medium shadow-inner cursor-pointer"
                      >
                        <option value="" disabled>Select Target Sector</option>
                        {Object.keys(FALLBACK_QUESTIONS).map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                        <ChevronDown className="text-slate-500 group-focus-within:text-cyan-400 transition-colors duration-500 ease-out" size={20} />
                      </div>
                    </div>
                  </motion.div>
                  
                  {formError && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} transition={{ duration: 0.4, ease: smoothEase }} className="flex items-center gap-3 text-red-300 text-sm font-bold bg-red-500/10 py-3 px-4 rounded-xl border border-red-500/20 backdrop-blur-md">
                      <AlertCircle size={18} className="text-red-400 shrink-0" />
                      <p>{formError}</p>
                    </motion.div>
                  )}
                  
                  <motion.button 
                    variants={itemVariants}
                    whileTap={{ scale: 0.97 }}
                    onClick={submitForm} disabled={isFetchingQs} 
                    className="group relative w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black py-4 md:py-5 rounded-2xl transition-all duration-500 ease-out shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:shadow-[0_10px_40px_rgba(34,211,238,0.4)] text-lg uppercase tracking-widest flex justify-center items-center gap-3 border border-cyan-400/50 disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden hover:-translate-y-1"
                  >
                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]"></div>
                    <span className="relative z-10 flex items-center gap-3">
                      {isFetchingQs ? <><Loader2 className="animate-spin" size={22} /> Calibrating...</> : <><Rocket size={22} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-500 ease-out" /> Ready to Launch</>}
                    </span>
                  </motion.button>
                </motion.div>

                {/* RIGHT COLUMN: FLOATING HOLOGRAPHIC LOTTIE (Slower & Smoother) */}
                <div className="hidden lg:flex flex-col items-center justify-center relative border-l border-white/5 pl-16 py-8">
                  <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-blue-500/5 to-transparent blur-[60px] rounded-full pointer-events-none"></div>
                  
                  <motion.div 
                    animate={{ y: [-10, 10, -10] }} 
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} // Smoother, slower breathing
                    className="relative z-10 flex flex-col items-center justify-center w-full max-w-[320px]"
                  >
                    <div className="relative w-full aspect-square drop-shadow-[0_0_40px_rgba(34,211,238,0.4)] filter contrast-125">
                      <Lottie animationData={gamings} loop={true} />
                    </div>
                    
                    <div className="mt-8 relative group cursor-default">
                      <div className="absolute inset-0 bg-cyan-400/20 blur-md rounded-full transition-colors duration-500"></div>
                      <div className="relative px-6 py-2 border border-cyan-500/30 bg-slate-950/80 backdrop-blur-xl rounded-full flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_rgba(34,211,238,1)]"></div>
                        <span className="text-cyan-300 font-mono text-xs font-bold uppercase tracking-widest">System Calibrated</span>
                      </div>
                    </div>
                  </motion.div>
                </div>

              </div>
            </motion.div>
          )}

          {/* ----- 3. GAMEPLAY HUD ----- */}
          {gameState === "playing" && (
            <motion.div key="playing" initial={{ opacity: 0, filter: "blur(10px)" }} animate={{ opacity: 1, filter: "blur(0px)" }} exit={{ opacity: 0 }} transition={{ duration: 0.8, ease: smoothEase }} className="flex flex-col h-full w-full relative">
              
              <div className="absolute top-0 left-0 w-full z-[100] pointer-events-none p-4 md:p-6 flex justify-between items-start">
                
                <div className="flex flex-col gap-2 md:gap-3 pointer-events-auto">
                  <div className="flex flex-col gap-1 bg-black/60 backdrop-blur-md p-3 md:p-4 rounded-2xl border border-white/10 shadow-xl transition-all duration-500">
                    <div className="font-black font-mono text-2xl md:text-4xl text-white drop-shadow-md flex items-baseline gap-2 leading-none">
                      {score.toLocaleString()} <span className="text-xs md:text-sm text-cyan-400 hidden sm:inline">PTS</span>
                    </div>
                    <div className="flex gap-1 mt-1.5">
                      {[...Array(3)].map((_, i) => (
                        <Heart key={i} size={18} className={i < lives ? "text-red-500 fill-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]" : "text-white/20"} />
                      ))}
                    </div>
                  </div>
                  
                  <div className={`w-fit px-3 py-1.5 md:px-4 md:py-2 rounded-xl font-black font-mono text-sm md:text-lg flex items-center gap-2 shadow-xl backdrop-blur-md transition-all duration-500 ease-out ${combo > 1 ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-400/50 shadow-[0_0_20px_rgba(250,204,21,0.4)]' : 'bg-black/40 text-white/50 border border-white/10'}`}>
                    <Zap size={18} className={combo > 1 ? "fill-yellow-400" : ""} /> x{combo}
                  </div>
                </div>

                <div className="hidden md:flex flex-col items-center justify-start w-1/2 max-w-2xl mt-1">
                  <AnimatePresence mode="wait">
                    {currentQuestion && (
                      <motion.div 
                        initial={{ y: -20, opacity: 0, filter: "blur(5px)" }} animate={{ y: 0, opacity: 1, filter: "blur(0px)" }} exit={{ y: -20, opacity: 0, filter: "blur(5px)" }} transition={{ duration: 0.5, ease: smoothEase }}
                        className="bg-[#0b132b]/90 backdrop-blur-xl border border-cyan-500/60 rounded-2xl p-4 text-center shadow-[0_15px_30px_rgba(34,211,238,0.15)] w-full relative overflow-hidden"
                      >
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500"></div>
                        <p className="text-cyan-400 text-[10px] font-black uppercase tracking-widest mb-1.5 flex items-center justify-center gap-2">
                          <Sparkles size={12} /> Target Acquired
                        </p>
                        <h3 className="text-lg md:text-xl font-black text-white leading-tight">{currentQuestion}</h3>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="pointer-events-auto">
                  <button onClick={handleExit} className="bg-white/10 hover:bg-red-500/80 text-white p-2.5 md:p-3 rounded-full backdrop-blur-md transition-all duration-500 border border-white/20 shadow-lg">
                    <X size={20} />
                  </button>
                </div>

              </div>

              <div className="md:hidden absolute top-[120px] left-1/2 -translate-x-1/2 w-[92%] z-[90] pointer-events-none">
                <AnimatePresence mode="wait">
                  {currentQuestion && (
                    <motion.div 
                      initial={{ y: -20, opacity: 0, filter: "blur(5px)" }} animate={{ y: 0, opacity: 1, filter: "blur(0px)" }} exit={{ y: -20, opacity: 0, filter: "blur(5px)" }} transition={{ duration: 0.5, ease: smoothEase }}
                      className="bg-[#0b132b]/95 backdrop-blur-xl border border-cyan-500/60 rounded-2xl p-3 text-center shadow-[0_10px_30px_rgba(34,211,238,0.2)] relative overflow-hidden"
                    >
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500"></div>
                      <p className="text-cyan-400 text-[9px] font-black uppercase tracking-widest mb-1 flex items-center justify-center gap-1">
                        <Sparkles size={10} /> Target Acquired
                      </p>
                      <h3 className="text-sm font-black text-white leading-snug">{currentQuestion}</h3>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="relative flex-1 w-full overflow-hidden" style={{ perspective: '1200px' }}>
                <div 
                  className="absolute bottom-0 w-full h-[250%]" 
                  style={{ 
                    transform: 'rotateX(60deg)', 
                    transformOrigin: 'bottom center', 
                    transformStyle: 'preserve-3d',
                    maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 100%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 100%)'
                  }}
                >
                  <div className="absolute inset-0 opacity-40">
                    <div className="w-full h-full bg-[linear-gradient(transparent_50%,rgba(34,211,238,0.2)_50%)] bg-[length:100%_120px] animate-[slideDown_0.6s_linear_infinite]"></div>
                  </div>
                  <div className="absolute inset-0 flex justify-evenly pointer-events-none opacity-80">
                    <div className="w-3 md:w-5 h-full bg-cyan-500/50 shadow-[0_0_40px_rgba(34,211,238,0.9)] transition-all duration-500"></div>
                    <div className="w-3 md:w-5 h-full bg-cyan-500/50 shadow-[0_0_40px_rgba(34,211,238,0.9)] transition-all duration-500"></div>
                  </div>
                </div>

                <div className="absolute inset-0 z-[60] pointer-events-none">
                  {entities.map(ent => {
                    const progress = ent.top / 100;
                    
                    let xPos = 50;
                    if (ent.lane === 0) xPos = 50 - (18 + progress * 24); 
                    if (ent.lane === 2) xPos = 50 + (18 + progress * 24); 

                    const scale = 0.6 + (progress * 0.4);

                    return (
                      <div key={ent.id} 
                           className="absolute flex flex-col items-center justify-center pointer-events-auto"
                           style={{ 
                             left: `${xPos}%`, 
                             top: `${ent.top}%`, 
                             transform: `translate(-50%, -50%) scale(${scale})`, 
                             zIndex: Math.floor(ent.top),
                             width: '25%' 
                           }}>
                        
                        {!ent.revealed && (
                          <div className="bg-[#0b132b]/95 border-2 border-cyan-400 p-2 md:p-4 rounded-xl md:rounded-2xl text-white font-bold text-center shadow-[0_10px_20px_rgba(34,211,238,0.4)] backdrop-blur-md flex items-center justify-center min-h-[50px] md:min-h-[90px] w-full break-words transition-all duration-300">
                            <span className="text-[10px] leading-tight sm:text-xs md:text-lg md:leading-snug">{ent.text}</span>
                          </div>
                        )}

                        {ent.revealed ? (
                          ent.isCorrect ? (
                            <div className="w-12 h-12 md:w-20 md:h-20 bg-green-500 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(34,197,94,1)] border-4 border-white animate-pulse">
                              <CheckCircle2 size={32} className="text-white" />
                            </div>
                          ) : (
                            <div className="w-12 h-12 md:w-20 md:h-20 bg-red-600 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(239,68,68,1)] border-4 border-yellow-400">
                              <Bomb size={32} className="text-yellow-300" />
                            </div>
                          )
                        ) : null}
                      </div>
                    );
                  })}
                </div>

                <AnimatePresence>
                  {floatingTexts.map(ft => {
                    let xPos = 50;
                    if (ft.lane === 0) xPos = 16.66;
                    if (ft.lane === 2) xPos = 83.33;

                    return (
                      <motion.div key={ft.id} 
                        initial={{ opacity: 1, y: '70%', scale: 0.5 }} 
                        animate={{ opacity: 0, y: '10%', scale: 1.5 }} 
                        exit={{ opacity: 0 }} 
                        transition={{ duration: 1, ease: smoothEase }} 
                        className={`absolute flex justify-center text-3xl md:text-6xl font-black ${ft.color} drop-shadow-[0_0_20px_currentColor] z-50 text-center pointer-events-none`} 
                        style={{ left: `${xPos}%`, transform: 'translateX(-50%)', width: '100%' }}>
                        {ft.text}
                      </motion.div>
                    )
                  })}
                </AnimatePresence>

                <div className="absolute bottom-20 md:bottom-12 w-1/3 flex justify-center z-[80]" style={{ left: `${playerLane * 33.33}%`, transition: 'left 0.25s cubic-bezier(0.16, 1, 0.3, 1)' }}>
                  <div className={`w-32 h-32 md:w-48 md:h-48 relative flex items-center justify-center transition-all duration-300 drop-shadow-[0_20px_30px_rgba(0,0,0,0.8)] ${stateRef.current.flashTimer > 0 ? 'opacity-30' : 'opacity-100'}`}>
                    <Lottie animationData={gaming} loop={true} />
                  </div>
                </div>

              </div>

              <div className="flex gap-4 p-4 md:p-6 bg-black/60 backdrop-blur-xl z-[100] h-28 md:h-32 border-t border-white/10 relative">
                <button onPointerDown={() => movePlayer(-1)} className="flex-1 bg-white/5 border-t border-white/10 border-b-[6px] border-black rounded-3xl flex items-center justify-center active:border-b-0 active:translate-y-[6px] transition-all duration-300 hover:bg-white/10 shadow-2xl group">
                  <ChevronLeft size={50} className="text-cyan-400 group-active:text-white transition-colors duration-300" />
                </button>
                <button onPointerDown={() => movePlayer(1)} className="flex-1 bg-white/5 border-t border-white/10 border-b-[6px] border-black rounded-3xl flex items-center justify-center active:border-b-0 active:translate-y-[6px] transition-all duration-300 hover:bg-white/10 shadow-2xl group">
                  <ChevronRight size={50} className="text-cyan-400 group-active:text-white transition-colors duration-300" />
                </button>
              </div>
            </motion.div>
          )}

          {/* ----- 4. RESULT SCREEN ----- */}
          {gameState === "result" && (
  <motion.div 
    key="result" 
    initial={{ opacity: 0, y: 30 }} 
    animate={{ opacity: 1, y: 0 }} 
    transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }} 
    className="text-center px-4 w-full max-w-2xl mx-auto relative z-20"
  >
    {/* Minimalist Header */}
    <div className="mb-8">
      <h2 className="text-white text-sm font-black uppercase tracking-[0.3em] mb-2 opacity-50">
        Assessment Report
      </h2>
      <div className="h-[1px] w-12 bg-blue-500 mx-auto"></div>
    </div>

    {/* Main Grid Container */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      
      {/* 1. Candidate Info Tile */}
      <div className="bg-zinc-900/50 backdrop-blur-md border border-white/10 rounded-2xl p-6 text-left flex flex-col justify-between">
        <div>
          <User size={18} className="text-zinc-500 mb-4" />
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">Candidate</p>
          <p className="text-xl font-semibold text-white truncate">{formData.name}</p>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
          <span className="text-[10px] text-emerald-500 font-bold uppercase">Verified Result</span>
        </div>
      </div>

      {/* 2. Score Tile */}
      <div className="bg-zinc-900/50 backdrop-blur-md border border-white/10 rounded-2xl p-6 text-left">
        <BrainCircuit size={18} className="text-blue-500 mb-4" />
        <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">Performance Score</p>
        <p className="text-5xl font-light text-white tabular-nums mt-1">
          {score.toLocaleString()}
        </p>
      </div>

      {/* 3. Scholarship Voucher Tile (Full Width) */}
      <div className="md:col-span-2 bg-white text-black rounded-2xl p-8 relative overflow-hidden group">
        {/* Decorative pattern for the "Voucher" feel */}
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Sparkles size={80} />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="text-left">
            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-1">Benefit Unlocked</h3>
            <p className="text-2xl font-bold leading-tight">Scholarship <br />Grant Voucher</p>
          </div>

          <div className="flex flex-col items-center md:items-end gap-3">
            <div 
              onClick={copyToClipboard}
              className="text-4xl font-mono font-black tracking-tighter cursor-pointer hover:text-blue-600 transition-colors"
            >
              {couponCode}
            </div>
            <button 
              onClick={copyToClipboard}
              className="flex items-center gap-2 text-[10px] font-black uppercase bg-black text-white px-4 py-2 rounded-lg hover:bg-zinc-800 transition-all active:scale-95"
            >
              {copied ? <><CheckCircle2 size={14} /> Copied</> : <><Copy size={14} /> Copy Code</>}
            </button>
          </div>
        </div>
      </div>
    </div>

    {/* Footer Navigation */}
    <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6">
      <button 
        onClick={() => setGameState("form")}
        className="text-zinc-400 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2"
      >
        <X size={14} /> Reset Session
      </button>
      
      <div className="hidden sm:block w-px h-4 bg-zinc-800"></div>

      <button 
        onClick={handleExit}
        className="group bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-full font-bold transition-all shadow-xl shadow-blue-900/20 flex items-center gap-3 active:scale-95"
      >
        Finish & Exit 
        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  </motion.div>
)}
        </AnimatePresence>
      </motion.div>

      <style jsx="true">{`
        @keyframes slideDown {
          from { background-position: 0 0; }
          to { background-position: 0 120px; }
        }
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
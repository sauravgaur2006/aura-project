import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const nudges = [
  { text: "Great focus! Keep going 🔥", type: 'positive' },
  { text: "You're in the zone! 💪", type: 'positive' },
  { text: "Hey, stay with me 👀", type: 'warning' },
  { text: "You look tired, take a short break? ☕", type: 'info' },
  { text: "Amazing concentration! 🎯", type: 'positive' },
];

const StudyMode = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [focusScore, setFocusScore] = useState(92);
  const [status, setStatus] = useState<'focused' | 'distracted' | 'away'>('focused');
  const [currentNudge, setCurrentNudge] = useState<typeof nudges[0] | null>(null);
  const [cameraGranted, setCameraGranted] = useState(false);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(interval);
  }, [isRunning]);

  // Simulate focus changes
  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      const rand = Math.random();
      if (rand > 0.85) {
        setStatus('distracted');
        setFocusScore(s => Math.max(0, s - 3));
      } else if (rand > 0.95) {
        setStatus('away');
        setFocusScore(s => Math.max(0, s - 5));
      } else {
        setStatus('focused');
        setFocusScore(s => Math.min(100, s + 1));
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [isRunning]);

  // Show nudges periodically
  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      const nudge = nudges[Math.floor(Math.random() * nudges.length)];
      setCurrentNudge(nudge);
      setTimeout(() => setCurrentNudge(null), 4000);
    }, 15000);
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = useCallback((s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  }, []);

  const handleStart = () => {
    setCameraGranted(true);
    setIsRunning(true);
    setSeconds(0);
    setFocusScore(92);
    setStatus('focused');
  };

  const statusColors = {
    focused: { bg: 'bg-accent-cyan/15', text: 'text-accent-cyan', border: 'border-accent-cyan/30', label: '🎯 Focused' },
    distracted: { bg: 'bg-accent-amber/15', text: 'text-accent-amber', border: 'border-accent-amber/30', label: '⚡ Distracted' },
    away: { bg: 'bg-accent-rose/15', text: 'text-accent-rose', border: 'border-accent-rose/30', label: '👋 Away' },
  };

  const sc = statusColors[status];

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      {/* Top Bar */}
      <nav className="sticky top-0 z-50 px-6 md:px-8 py-4 flex items-center justify-between backdrop-blur-xl bg-[#04060e]/80 border-b border-[rgba(255,255,255,0.06)]">
        <Link to="/dashboard" className="flex items-center gap-2 no-underline">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-blue to-accent-cyan flex items-center justify-center text-primary-foreground text-xs font-bold shadow-md">S</div>
          <span className="font-grotesk font-bold text-foreground tracking-[2px] text-[1rem]">Study Mode</span>
        </Link>
        <div className="flex items-center gap-3">
          {isRunning && (
            <span className={`px-3 py-1.5 rounded-full ${sc.bg} ${sc.text} border ${sc.border} text-[0.8rem] font-semibold`}>
              {sc.label}
            </span>
          )}
          <Link to="/dashboard" className="text-text-secondary text-[0.85rem] hover:text-foreground transition-colors no-underline">← Dashboard</Link>
        </div>
      </nav>

      <div className="max-w-[900px] mx-auto px-6 py-12">
        {/* Nudge Toast */}
        <AnimatePresence>
          {currentNudge && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl glass-card border ${
                currentNudge.type === 'positive' ? 'border-accent-cyan/30' : currentNudge.type === 'warning' ? 'border-accent-amber/30' : 'border-accent-blue/30'
              } shadow-2xl`}
            >
              <span className="text-foreground font-medium">{currentNudge.text}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {!isRunning ? (
          /* Pre-Session */
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mt-16">
            <h1 className="font-grotesk text-[2.5rem] md:text-[3rem] font-bold text-foreground mb-4">Ready to Focus?</h1>
            <p className="text-text-secondary text-[1.05rem] mb-10 max-w-[500px] mx-auto leading-[1.7]">
              Start a study session to activate AI-powered focus tracking. Your camera feed stays entirely on your device.
            </p>

            <div className="glass-card rounded-3xl p-8 border border-[rgba(255,255,255,0.08)] max-w-[500px] mx-auto mb-8">
              <div className="w-full aspect-video rounded-2xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] flex items-center justify-center mb-6">
                <div className="text-center">
                  <span className="text-4xl block mb-3">📷</span>
                  <span className="text-text-secondary text-[0.9rem]">Camera preview will appear here</span>
                </div>
              </div>
              <div className="text-text-secondary text-[0.8rem] mb-6 flex items-center gap-2 justify-center">
                <span className="w-3 h-3 rounded-full bg-accent-cyan/30 flex items-center justify-center text-[0.4rem] text-accent-cyan">🔒</span>
                100% local processing · No data leaves your device
              </div>
              <button
                onClick={handleStart}
                className="w-full py-4 rounded-2xl bg-gradient-to-br from-accent-blue to-accent-violet text-primary-foreground font-semibold text-[1.05rem] border-none cursor-pointer transition-all hover:-translate-y-[1px] hover:shadow-[0_12px_40px_rgba(59,130,246,0.35)]"
              >
                🎯 Start Focus Session
              </button>
            </div>
          </motion.div>
        ) : (
          /* Active Session */
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 mt-4">
            {/* Main */}
            <div className="space-y-6">
              {/* Camera Feed Placeholder */}
              <div className="glass-card rounded-2xl border border-[rgba(255,255,255,0.08)] overflow-hidden">
                <div className="w-full aspect-video bg-[rgba(255,255,255,0.02)] flex items-center justify-center relative">
                  <div className="text-center">
                    <span className="text-5xl block mb-3">👁️</span>
                    <span className="text-text-secondary text-[0.9rem]">AI Focus Detection Active</span>
                  </div>
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-accent-cyan animate-pulse" />
                    <span className="text-accent-cyan text-[0.75rem] font-semibold">LIVE</span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full ${sc.bg} ${sc.text} text-[0.75rem] font-semibold border ${sc.border}`}>
                      {sc.label}
                    </span>
                  </div>
                </div>
              </div>

              {/* Timer */}
              <div className="glass-card rounded-2xl p-8 border border-[rgba(255,255,255,0.08)] text-center">
                <div className="font-grotesk text-[3.5rem] md:text-[4.5rem] font-bold text-foreground tracking-wider mb-4 tabular-nums">
                  {formatTime(seconds)}
                </div>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => setIsRunning(false)}
                    className="px-8 py-3 rounded-xl bg-accent-rose/15 text-accent-rose border border-accent-rose/30 font-semibold cursor-pointer hover:bg-accent-rose/25 transition-colors"
                  >
                    End Session
                  </button>
                  <button className="px-8 py-3 rounded-xl glass-card text-text-primary font-semibold border border-[rgba(255,255,255,0.08)] cursor-pointer hover:bg-[rgba(255,255,255,0.06)] transition-colors">
                    Pause
                  </button>
                </div>
              </div>
            </div>

            {/* Sidebar Stats */}
            <div className="space-y-4">
              {/* Focus Score Ring */}
              <div className="glass-card rounded-2xl p-6 border border-[rgba(255,255,255,0.08)] text-center">
                <div className="relative w-28 h-28 mx-auto mb-4">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="52" className="fill-none stroke-[rgba(255,255,255,0.04)]" strokeWidth="8" />
                    <circle
                      cx="60" cy="60" r="52"
                      className={`fill-none ${focusScore >= 80 ? 'stroke-accent-cyan' : focusScore >= 50 ? 'stroke-accent-amber' : 'stroke-accent-rose'}`}
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray="327"
                      strokeDashoffset={327 * (1 - focusScore / 100)}
                      style={{ transition: 'stroke-dashoffset 0.5s ease, stroke 0.3s' }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-grotesk text-2xl font-bold text-foreground">{focusScore}%</span>
                    <span className="text-[0.6rem] text-text-secondary uppercase tracking-wider">Focus</span>
                  </div>
                </div>
                <span className="text-text-secondary text-[0.8rem]">Real-time Focus Score</span>
              </div>

              {/* Session Stats */}
              <div className="glass-card rounded-2xl p-5 border border-[rgba(255,255,255,0.08)]">
                <h4 className="text-text-secondary text-[0.7rem] uppercase tracking-widest font-semibold mb-4">Session Stats</h4>
                <div className="space-y-3">
                  {[
                    { label: 'Focus Time', value: `${Math.floor(seconds * 0.72 / 60)}m`, icon: '🎯' },
                    { label: 'Distractions', value: `${Math.floor(seconds / 120)}`, icon: '⚡' },
                    { label: 'Breaks Taken', value: '0', icon: '☕' },
                    { label: 'Points Earned', value: `+${Math.floor(seconds / 10)}`, icon: '💰' },
                  ].map((s, i) => (
                    <div key={i} className="flex items-center justify-between py-2">
                      <span className="text-text-secondary text-[0.85rem] flex items-center gap-2">
                        <span>{s.icon}</span> {s.label}
                      </span>
                      <span className="text-foreground font-semibold text-[0.9rem]">{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyMode;

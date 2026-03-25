import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const useCounter = (target: number, duration: number = 2000, delay: number = 0) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const timeout = setTimeout(() => {
      const start = Date.now();
      const tick = () => {
        const elapsed = Date.now() - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.round(target * eased));
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, delay);
    return () => clearTimeout(timeout);
  }, [target, duration, delay]);
  return count;
};

const HeroVisual = () => {
  const focusScore = useCounter(92, 2000, 400);
  const hoursTracked = useCounter(10847, 2500, 600);
  const streak = useCounter(45, 1800, 800);
  const productivity = useCounter(320, 2000, 1000);

  const weeklyData = [35, 55, 40, 80, 60, 95, 75];
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="relative w-full max-w-[580px] mx-auto lg:ml-auto lg:mr-0">
      {/* Glow backdrop */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] rounded-full bg-accent-blue/10 blur-[100px]" />
        <div className="absolute top-0 right-0 w-[60%] h-[60%] rounded-full bg-accent-violet/10 blur-[80px]" />
      </div>

      <div className="relative grid grid-cols-2 gap-4">
        {/* Focus Score - Large Ring */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="col-span-2 glass-card rounded-2xl border border-[rgba(255,255,255,0.08)] p-6 sm:p-8 flex items-center gap-8"
        >
          <div className="relative w-32 h-32 sm:w-36 sm:h-36 flex-shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
              <circle cx="80" cy="80" r="68" className="fill-none stroke-[rgba(255,255,255,0.04)]" strokeWidth="10" />
              <motion.circle
                cx="80" cy="80" r="68"
                className="fill-none stroke-accent-cyan drop-shadow-[0_0_12px_rgba(6,214,160,0.5)]"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray="427"
                initial={{ strokeDashoffset: 427 }}
                animate={{ strokeDashoffset: 427 * (1 - 0.92) }}
                transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-grotesk text-3xl sm:text-4xl font-bold text-foreground">{focusScore}%</span>
              <span className="text-[0.65rem] text-text-secondary uppercase tracking-[2px] mt-1">Focus</span>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-foreground font-grotesk font-bold text-lg sm:text-xl mb-1">Deep Focus Active</h3>
            <p className="text-text-secondary text-sm mb-4">Real-time session tracking</p>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse" />
              <span className="text-accent-cyan text-xs font-semibold">Live Session · 45:00</span>
            </div>
            <div className="flex gap-2 mt-3">
              <div className="h-1.5 flex-1 bg-accent-cyan/20 rounded-full overflow-hidden">
                <motion.div className="h-full bg-accent-cyan rounded-full" initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 2, delay: 0.8 }} />
              </div>
              <div className="h-1.5 flex-1 bg-accent-violet/20 rounded-full overflow-hidden">
                <motion.div className="h-full bg-accent-violet rounded-full" initial={{ width: 0 }} animate={{ width: '65%' }} transition={{ duration: 2, delay: 1.0 }} />
              </div>
              <div className="h-1.5 flex-1 bg-[rgba(255,255,255,0.05)] rounded-full" />
            </div>
          </div>
        </motion.div>

        {/* Weekly Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="glass-card rounded-2xl border border-[rgba(255,255,255,0.08)] p-5"
        >
          <div className="flex justify-between items-center mb-4">
            <span className="text-text-secondary text-[0.65rem] uppercase tracking-widest font-semibold">Weekly</span>
            <span className="text-accent-cyan text-[0.65rem] font-semibold bg-accent-cyan/10 px-2 py-0.5 rounded">+14.2%</span>
          </div>
          <div className="h-24 flex items-end gap-[6px]">
            {weeklyData.map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <motion.div
                  className={`w-full rounded-t-sm ${i === 5 ? 'bg-gradient-to-t from-accent-cyan to-accent-blue shadow-[0_0_10px_rgba(6,214,160,0.3)]' : 'bg-foreground/15 hover:bg-foreground/25 transition-colors'}`}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ duration: 0.8, delay: 0.6 + i * 0.08, ease: "easeOut" }}
                  style={{ maxHeight: `${h}%` }}
                />
                <span className="text-[0.5rem] text-text-secondary">{days[i]}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Study Streak */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="glass-card rounded-2xl border border-[rgba(255,255,255,0.08)] p-5 flex flex-col justify-between"
        >
          <div>
            <span className="text-text-secondary text-[0.65rem] uppercase tracking-widest font-semibold">Streak</span>
            <div className="font-grotesk text-4xl sm:text-5xl font-bold text-foreground mt-2 leading-none">
              {streak}
              <span className="text-lg text-text-secondary ml-1">days</span>
            </div>
          </div>
          <div className="flex gap-[3px] mt-4">
            {Array.from({ length: 14 }).map((_, i) => (
              <motion.div
                key={i}
                className={`flex-1 h-2 rounded-[2px] ${i < 12 ? 'bg-accent-amber' : i < 13 ? 'bg-accent-amber/40' : 'bg-foreground/10'}`}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.3, delay: 0.8 + i * 0.04 }}
                style={{ transformOrigin: 'bottom' }}
              />
            ))}
          </div>
          <span className="text-accent-amber text-[0.6rem] font-semibold mt-2">🔥 Personal best!</span>
        </motion.div>

        {/* Hours Tracked */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="glass-card rounded-2xl border border-[rgba(255,255,255,0.08)] p-5 flex flex-col justify-between"
        >
          <span className="text-text-secondary text-[0.65rem] uppercase tracking-widest font-semibold">Hours Tracked</span>
          <div className="font-grotesk text-3xl sm:text-4xl font-bold bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent mt-2 leading-none">
            {hoursTracked.toLocaleString()}
          </div>
          <div className="flex items-center gap-2 mt-3">
            <div className="w-5 h-5 rounded-full bg-accent-blue/20 flex items-center justify-center">
              <span className="text-[0.5rem] text-accent-blue">↑</span>
            </div>
            <span className="text-accent-blue text-[0.65rem] font-medium">+126 this week</span>
          </div>
        </motion.div>

        {/* Productivity Boost */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="glass-card rounded-2xl border border-[rgba(255,255,255,0.08)] p-5 flex flex-col justify-between"
        >
          <span className="text-text-secondary text-[0.65rem] uppercase tracking-widest font-semibold">Productivity</span>
          <div className="font-grotesk text-3xl sm:text-4xl font-bold text-foreground mt-2 leading-none">
            {productivity}%
            <span className="text-accent-cyan text-sm ml-1">↑</span>
          </div>
          <div className="w-full h-1.5 bg-foreground/5 rounded-full overflow-hidden mt-3">
            <motion.div
              className="h-full bg-gradient-to-r from-accent-violet to-accent-cyan rounded-full"
              initial={{ width: 0 }}
              animate={{ width: '82%' }}
              transition={{ duration: 1.5, delay: 1, ease: "easeOut" }}
            />
          </div>
          <span className="text-text-secondary text-[0.55rem] mt-1">vs. last month</span>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroVisual;

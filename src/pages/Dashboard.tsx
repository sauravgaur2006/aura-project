import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const useCounter = (target: number, duration = 2000, delay = 0) => {
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

const weeklyData = [
  { day: 'Mon', hours: 3.5, score: 78 },
  { day: 'Tue', hours: 5.2, score: 85 },
  { day: 'Wed', hours: 4.0, score: 72 },
  { day: 'Thu', hours: 6.8, score: 91 },
  { day: 'Fri', hours: 5.5, score: 88 },
  { day: 'Sat', hours: 7.2, score: 94 },
  { day: 'Sun', hours: 4.8, score: 82 },
];

const recentSessions = [
  { subject: 'Organic Chemistry', duration: '2h 15m', score: 91, time: '2 hours ago' },
  { subject: 'Physics - Mechanics', duration: '1h 45m', score: 78, time: '5 hours ago' },
  { subject: 'Mathematics - Calculus', duration: '3h 00m', score: 95, time: 'Yesterday' },
  { subject: 'English Literature', duration: '1h 30m', score: 85, time: 'Yesterday' },
];

const Dashboard = () => {
  const totalHours = useCounter(37, 2000, 200);
  const avgScore = useCounter(86, 2000, 400);
  const streak = useCounter(45, 1800, 600);
  const points = useCounter(3420, 2500, 300);

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      {/* Top Bar */}
      <nav className="sticky top-0 z-50 px-6 md:px-8 py-4 flex items-center justify-between backdrop-blur-xl bg-[#04060e]/80 border-b border-[rgba(255,255,255,0.06)]">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 no-underline">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-blue to-accent-cyan flex items-center justify-center text-primary-foreground text-xs font-bold shadow-md">S</div>
            <span className="font-grotesk font-bold text-foreground tracking-[2px] text-[1rem]">ScholarOS</span>
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/study" className="px-5 py-2.5 rounded-xl bg-gradient-to-br from-accent-blue to-accent-violet text-primary-foreground font-semibold text-[0.85rem] no-underline hover:-translate-y-[1px] hover:shadow-[0_8px_25px_rgba(59,130,246,0.3)] transition-all">
            Start Session
          </Link>
          <Link to="/chat" className="px-4 py-2.5 rounded-xl glass-card text-text-primary font-medium text-[0.85rem] no-underline hover:bg-[rgba(255,255,255,0.06)] transition-all border border-[rgba(255,255,255,0.08)]">
            💬 AI Chat
          </Link>
        </div>
      </nav>

      <div className="max-w-[1300px] mx-auto px-6 md:px-8 py-8">
        {/* Greeting */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-grotesk text-[1.8rem] md:text-[2.2rem] font-bold text-foreground mb-1">Good Evening, Student 👋</h1>
          <p className="text-text-secondary text-[1rem]">Here's your study overview for this week</p>
        </motion.div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Hours This Week', value: `${totalHours}h`, icon: '⏱️', color: 'accent-blue', change: '+12%' },
            { label: 'Avg Focus Score', value: `${avgScore}%`, icon: '🎯', color: 'accent-cyan', change: '+5%' },
            { label: 'Study Streak', value: `${streak} days`, icon: '🔥', color: 'accent-amber', change: 'Personal best!' },
            { label: 'Total Points', value: points.toLocaleString(), icon: '💰', color: 'accent-violet', change: '+280 today' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card rounded-2xl p-5 border border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.12)] transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-text-secondary text-[0.75rem] font-semibold uppercase tracking-wider">{stat.label}</span>
                <span className="text-xl">{stat.icon}</span>
              </div>
              <div className={`font-grotesk text-[1.8rem] font-bold text-foreground leading-none mb-1`}>{stat.value}</div>
              <div className={`text-${stat.color} text-[0.75rem] font-semibold`}>{stat.change}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Weekly Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 glass-card rounded-2xl p-6 border border-[rgba(255,255,255,0.06)]"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-grotesk font-bold text-foreground text-[1.1rem]">Weekly Study Hours</h3>
              <span className="text-accent-cyan text-[0.8rem] font-semibold bg-accent-cyan/10 px-3 py-1 rounded-full">+18% vs last week</span>
            </div>
            <div className="h-48 flex items-end gap-3">
              {weeklyData.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-text-secondary text-[0.7rem]">{d.hours}h</span>
                  <motion.div
                    className={`w-full rounded-t-lg ${d.score >= 90 ? 'bg-gradient-to-t from-accent-cyan to-accent-blue shadow-[0_0_15px_rgba(6,214,160,0.3)]' : d.score >= 80 ? 'bg-accent-blue/60' : 'bg-foreground/15'}`}
                    initial={{ height: 0 }}
                    animate={{ height: `${(d.hours / 8) * 100}%` }}
                    transition={{ duration: 0.8, delay: 0.5 + i * 0.08 }}
                    style={{ maxHeight: `${(d.hours / 8) * 100}%` }}
                  />
                  <span className="text-text-secondary text-[0.7rem]">{d.day}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Focus Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card rounded-2xl p-6 border border-[rgba(255,255,255,0.06)]"
          >
            <h3 className="font-grotesk font-bold text-foreground text-[1.1rem] mb-6">Focus Breakdown</h3>
            <div className="space-y-4">
              {[
                { label: 'Focused', pct: 72, color: 'bg-accent-cyan' },
                { label: 'Distracted', pct: 15, color: 'bg-accent-amber' },
                { label: 'Away', pct: 8, color: 'bg-accent-rose' },
                { label: 'Drowsy', pct: 5, color: 'bg-accent-violet' },
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between text-[0.8rem] mb-1.5">
                    <span className="text-text-secondary">{item.label}</span>
                    <span className="text-foreground font-semibold">{item.pct}%</span>
                  </div>
                  <div className="h-2 bg-foreground/5 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full ${item.color} rounded-full`}
                      initial={{ width: 0 }}
                      animate={{ width: `${item.pct}%` }}
                      transition={{ duration: 1, delay: 0.6 + i * 0.1 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Recent Sessions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 glass-card rounded-2xl p-6 border border-[rgba(255,255,255,0.06)]"
        >
          <h3 className="font-grotesk font-bold text-foreground text-[1.1rem] mb-5">Recent Sessions</h3>
          <div className="space-y-3">
            {recentSessions.map((s, i) => (
              <div key={i} className="flex items-center justify-between py-3 px-4 rounded-xl hover:bg-[rgba(255,255,255,0.03)] transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${s.score >= 90 ? 'bg-accent-cyan/15' : s.score >= 80 ? 'bg-accent-blue/15' : 'bg-accent-amber/15'}`}>
                    {s.score >= 90 ? '🎯' : s.score >= 80 ? '📖' : '📝'}
                  </div>
                  <div>
                    <div className="text-foreground font-medium text-[0.95rem]">{s.subject}</div>
                    <div className="text-text-secondary text-[0.8rem]">{s.duration} · {s.time}</div>
                  </div>
                </div>
                <div className={`font-grotesk font-bold text-[1.1rem] ${s.score >= 90 ? 'text-accent-cyan' : s.score >= 80 ? 'text-accent-blue' : 'text-accent-amber'}`}>
                  {s.score}%
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;

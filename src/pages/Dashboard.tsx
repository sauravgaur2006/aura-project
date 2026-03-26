import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import api from '@/lib/api';
import { toast } from 'sonner';
import { Clock, Flame, Target, Trophy, TrendingUp, CalendarDays, Activity, ChevronRight } from 'lucide-react';

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

// Mock Data for charts
const weeklyData = [
  { day: 'Mon', focus: 78, hours: 3.5 },
  { day: 'Tue', focus: 85, hours: 5.2 },
  { day: 'Wed', focus: 72, hours: 4.0 },
  { day: 'Thu', focus: 91, hours: 6.8 },
  { day: 'Fri', focus: 88, hours: 5.5 },
  { day: 'Sat', focus: 94, hours: 7.2 },
  { day: 'Sun', focus: 82, hours: 4.8 },
];

const monthlyData = [
  { week: 'Week 1', current: 28, previous: 22 },
  { week: 'Week 2', current: 35, previous: 28 },
  { week: 'Week 3', current: 32, previous: 30 },
  { week: 'Week 4', current: 40, previous: 35 },
];

const Dashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/sessions');
        // Calculate dynamic mock stats if data is empty, or use real data
        const totalHrs = data.reduce((acc: number, s: any) => acc + (s.duration || 0), 0) / 3600;
        const avgF = data.length > 0 ? data.reduce((acc: number, s: any) => acc + s.focusScoreAvg, 0) / data.length : 0;
        
        setStats({
          totalHours: totalHrs > 0 ? totalHrs.toFixed(1) : 32.5,
          avgScore: avgF > 0 ? Math.round(avgF) : 84,
          streak: user.streak || 12,
          points: user.points || 1450,
          recentSessions: data.length > 0 ? data.slice(0, 5).map((s: any) => ({
            subject: 'Study Session',
            duration: `${Math.floor((s.duration || 0) / 60)}m`,
            score: Math.round(s.focusScoreAvg),
            time: new Date(s.startTime).toLocaleDateString()
          })) : [
            { subject: 'Organic Chemistry', duration: '2h 15m', score: 91, time: '2 hours ago' },
            { subject: 'Physics - Mechanics', duration: '1h 45m', score: 78, time: '5 hours ago' },
            { subject: 'React Development', duration: '3h 00m', score: 95, time: 'Yesterday' },
          ]
        });
      } catch (err) {
        toast.error("Failed to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [user.points, user.streak]);

  const totalHours = useCounter(Number(stats?.totalHours) || 0, 2000, 200);
  const avgScore = useCounter(stats?.avgScore || 0, 2000, 400);
  const streakCount = useCounter(stats?.streak || 0, 1800, 600);
  const pointsCount = useCounter(stats?.points || 0, 2500, 300);

  // Custom Tooltip for Recharts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0f1225]/90 backdrop-blur-md border border-[rgba(255,255,255,0.1)] p-4 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
          <p className="text-white font-bold mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm font-medium flex items-center gap-2" style={{ color: entry.color }}>
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              {entry.name}: {entry.value}
              {entry.name === 'focus' ? '%' : 'h'}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#02040a]">
      {/* Immersive Animated Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-accent-blue/15 blur-[150px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute top-[40%] right-[-10%] w-[40%] h-[60%] rounded-full bg-accent-violet/10 blur-[150px] animate-pulse" style={{ animationDuration: '12s', animationDelay: '2s' }} />
        <div className="absolute bottom-[-20%] left-[20%] w-[50%] h-[50%] rounded-full bg-accent-cyan/10 blur-[150px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '4s' }} />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]" />
      </div>

      <nav className="sticky top-0 z-50 px-6 md:px-10 py-5 flex items-center justify-between backdrop-blur-2xl bg-[#02040a]/70 border-b border-[rgba(255,255,255,0.05)]">
        <Link to="/" className="flex items-center gap-3 no-underline group">
          <div className="w-10 h-10 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]">
            <img src="/logo.svg" alt="ScholarOS Logo" className="w-full h-full object-contain" />
          </div>
          <span className="font-grotesk font-bold text-white text-xl tracking-[1.5px]">ScholarOS</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/study" className="relative group px-6 py-2.5 rounded-xl bg-gradient-to-br from-accent-blue to-accent-violet text-white font-bold text-[0.85rem] no-underline overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] hover:-translate-y-0.5">
            <span className="relative z-10 flex items-center gap-2">Start Study <Target className="w-4 h-4" /></span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
          </Link>
        </div>
      </nav>

      <main className="max-w-[1440px] mx-auto px-6 lg:px-10 py-12 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <h1 className="font-grotesk text-4xl md:text-5xl font-bold mb-3 text-white">
              Welcome back, <span className="bg-gradient-to-r from-accent-blue to-accent-cyan bg-clip-text text-transparent">{user.name?.split(' ')[0] || 'Scholar'}</span>
            </h1>
            <p className="text-white/60 text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-accent-cyan" />
              Your cognitive performance is up <span className="text-accent-cyan font-bold">14%</span> this week. Keep it up!
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-2 px-4 backdrop-blur-md">
            <CalendarDays className="w-5 h-5 text-accent-blue" />
            <span className="text-white font-medium">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
          </div>
        </motion.div>

        {/* Premium Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { label: 'Hours Tracked', value: `${totalHours}h`, sub: '+3.2h from avg', icon: Clock, color: 'accent-blue', gradient: 'from-accent-blue/20' },
            { label: 'Focus Score', value: `${avgScore}%`, sub: 'Peak productivity', icon: Target, color: 'accent-cyan', gradient: 'from-accent-cyan/20' },
            { label: 'Study Streak', value: `${streakCount} d`, sub: 'Personal best 🔥', icon: Flame, color: 'accent-amber', gradient: 'from-accent-amber/20' },
            { label: 'Total XP', value: pointsCount.toLocaleString(), sub: 'Level 12 Scholar', icon: Trophy, color: 'accent-violet', gradient: 'from-accent-violet/20' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="relative group rounded-[28px] p-7 overflow-hidden transition-all duration-500 hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-[#0a0d1c]/80 backdrop-blur-2xl border border-[rgba(255,255,255,0.06)] rounded-[28px] transition-all duration-500 group-hover:border-[rgba(255,255,255,0.15)] group-hover:bg-[#0f1429]" />
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              <div className="relative z-10 flex flex-col h-full justify-between gap-6">
                <div className="flex items-start justify-between">
                  <div className={`w-12 h-12 rounded-xl bg-${stat.color}/10 border border-${stat.color}/20 flex items-center justify-center text-${stat.color} shadow-[0_0_15px_rgba(var(--${stat.color}),0.2)] group-hover:scale-110 transition-transform duration-500`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-green-400 bg-green-400/10 px-2 py-1 rounded-md">
                   +12%
                  </div>
                </div>
                <div>
                  <h3 className="font-grotesk text-[2.5rem] font-black text-white leading-none mb-2">{stat.value}</h3>
                  <div className="flex items-center gap-2">
                    <p className="text-white/80 text-[13px] font-bold uppercase tracking-wider">{stat.label}</p>
                    <span className="w-1 h-1 rounded-full bg-white/30" />
                    <p className="text-white/50 text-[12px]">{stat.sub}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Focus Velocity Chart */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 relative rounded-[32px] p-8 overflow-hidden group"
          >
            <div className="absolute inset-0 bg-[#0a0d1c]/80 backdrop-blur-xl border border-[rgba(255,255,255,0.08)] rounded-[32px] transition-all duration-500 group-hover:border-[rgba(255,255,255,0.12)]" />
            
            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent-blue/10 flex items-center justify-center text-accent-blue">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-grotesk text-2xl font-bold text-white">Focus Velocity</h3>
                    <p className="text-white/50 text-sm">Your cognitive capacity across the week</p>
                  </div>
                </div>
                <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                  <button className="px-4 py-1.5 rounded-lg bg-accent-blue text-white text-xs font-bold shadow-[0_0_15px_rgba(59,130,246,0.5)]">WEEKLY</button>
                  <button className="px-4 py-1.5 rounded-lg text-white/50 hover:text-white text-xs font-bold transition-colors">MONTHLY</button>
                </div>
              </div>

              <div className="w-full h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorFocus" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" stroke="rgba(255,255,255,0.2)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} tickLine={false} axisLine={false} dy={10} />
                    <YAxis stroke="rgba(255,255,255,0.2)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} tickLine={false} axisLine={false} />
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <RechartsTooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2, fill: 'transparent' }} />
                    <Area type="monotone" dataKey="focus" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorFocus)" name="Focus Score" activeDot={{ r: 8, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>

          {/* Monthly Analytics & Pulse History column */}
          <div className="flex flex-col gap-6">
            
            {/* Last Month vs This Month Analytics */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="relative rounded-[32px] p-6 overflow-hidden group flex-1"
            >
              <div className="absolute inset-0 bg-[#0a0d1c]/80 backdrop-blur-xl border border-[rgba(255,255,255,0.08)] rounded-[32px] transition-all duration-500 group-hover:border-[rgba(255,255,255,0.12)]" />
              <div className="relative z-10 h-full flex flex-col">
                <h3 className="font-grotesk text-xl font-bold text-white mb-1">Study Hours M/M</h3>
                <p className="text-white/50 text-xs mb-6">Current vs Last Month</p>
                <div className="w-full h-[180px] flex-grow">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData} barGap={4}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                      <XAxis dataKey="week" stroke="rgba(255,255,255,0.2)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} tickLine={false} axisLine={false} dy={10} />
                      <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                      <Bar dataKey="current" name="This Month" fill="#06b6d4" radius={[4, 4, 0, 0]} barSize={12} />
                      <Bar dataKey="previous" name="Last Month" fill="rgba(255,255,255,0.2)" radius={[4, 4, 0, 0]} barSize={12} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>

            {/* Recent Activity Mini-List */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="relative rounded-[32px] p-7 overflow-hidden group flex-1"
            >
              <div className="absolute inset-0 bg-[#0a0d1c]/80 backdrop-blur-xl border border-[rgba(255,255,255,0.08)] rounded-[32px]" />
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-grotesk text-xl font-bold text-white">Recent Pulse</h3>
                  <button className="text-accent-cyan text-sm font-semibold hover:text-white transition-colors flex items-center gap-1">
                    View All <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="space-y-4 flex-grow overflow-y-auto pr-2 custom-scrollbar">
                  {stats?.recentSessions?.slice(0,3).map((s: any, i: number) => (
                    <div key={i} className="flex items-center justify-between group/item p-3 rounded-2xl hover:bg-white/5 transition-colors cursor-pointer border border-transparent hover:border-white/10">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.score >= 90 ? 'from-accent-cyan to-accent-blue' : 'from-accent-amber to-accent-rose'} p-[1px]`}>
                          <div className="w-full h-full bg-[#0a0d1c] rounded-[11px] flex items-center justify-center text-lg">
                            {s.score >= 90 ? '⚡' : '🔥'}
                          </div>
                        </div>
                        <div>
                          <p className="text-white font-bold text-[0.9rem] truncate max-w-[120px]">{s.subject}</p>
                          <p className="text-white/40 text-[11px] font-medium">{s.duration} · {s.time}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-grotesk font-black text-lg leading-tight ${s.score >= 90 ? 'text-accent-cyan' : 'text-accent-amber'}`}>{s.score}%</p>
                        <p className="text-white/30 text-[10px] uppercase tracking-wider font-bold">Focus</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
      `}</style>
    </div>
  );
};

export default Dashboard;

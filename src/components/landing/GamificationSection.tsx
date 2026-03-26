import { motion } from 'framer-motion';

const rewards = [
  { icon: '☕', name: 'Canteen Coupon', points: 500, color: 'accent-amber' },
  { icon: '📝', name: 'Stationery Kit', points: 1200, color: 'accent-blue' },
  { icon: '🎧', name: 'Study Playlist Pro', points: 800, color: 'accent-violet' },
  { icon: '🏆', name: 'Gold Badge', points: 2000, color: 'accent-cyan' },
];

const GamificationSection = () => {
  return (
    <section id="gamification" className="relative py-24 px-6 md:px-12 z-10">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left - Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 py-[0.35rem] pr-4 pl-2 rounded-full glass-card mb-6">
              <span className="w-2 h-2 rounded-full bg-accent-amber shadow-[0_0_10px_rgba(245,158,11,0.35)] animate-[pulseDot_2s_ease-in-out_infinite]" />
              <span className="text-[0.75rem] font-semibold text-text-secondary tracking-[1.2px] uppercase">Gamification Engine</span>
            </div>
            <h2 className="font-grotesk text-[2.5rem] md:text-[3rem] font-bold mb-6 leading-tight text-foreground">
              Study Hard, <span className="text-gradient">Earn Rewards</span>
            </h2>
            <p className="text-text-secondary text-[1.05rem] leading-[1.8] mb-8">
              Every focused minute earns you points. Maintain streaks for bonus multipliers. Redeem points for real rewards — from canteen coupons to stationery kits.
            </p>

            <div className="space-y-4">
              <div className="glass-card rounded-xl p-5 border border-[rgba(255,255,255,0.06)]">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-foreground font-semibold text-[0.95rem]">🔥 Streak Multiplier</span>
                  <span className="text-accent-amber text-[0.8rem] font-bold">2.5×</span>
                </div>
                <div className="h-2 bg-foreground/5 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-accent-amber to-accent-rose rounded-full"
                    initial={{ width: 0 }}
                    whileInView={{ width: '75%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                  />
                </div>
                <div className="text-text-secondary text-[0.75rem] mt-2">30 of 45 days to next tier</div>
              </div>
              <div className="glass-card rounded-xl p-5 border border-[rgba(255,255,255,0.06)]">
                <div className="flex items-center justify-between">
                  <span className="text-foreground font-semibold text-[0.95rem]">💰 Points Balance</span>
                  <span className="font-grotesk text-[1.5rem] font-bold text-gradient">3,420</span>
                </div>
                <div className="text-text-secondary text-[0.75rem] mt-1">+280 earned today</div>
              </div>
            </div>
          </motion.div>

          {/* Right - Rewards Grid */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 gap-4"
          >
            {rewards.map((r, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                className={`glass-card rounded-2xl p-6 border border-[rgba(255,255,255,0.06)] hover:border-${r.color}/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.3)] cursor-pointer group text-center`}
              >
                <span className="text-[2.5rem] block mb-3 group-hover:scale-110 transition-transform duration-300">{r.icon}</span>
                <h4 className="font-grotesk font-bold text-foreground mb-1">{r.name}</h4>
                <div className={`text-${r.color} text-[0.8rem] font-semibold`}>{r.points.toLocaleString()} pts</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default GamificationSection;

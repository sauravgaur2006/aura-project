import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, Coffee, Notebook, PenTool, Gift, Star } from 'lucide-react';
import { toast } from 'sonner';

const Rewards = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
  
  const rewards = [
    { id: 1, name: 'Canteen Coffee Coupon', cost: 500, icon: Coffee, category: 'Food', color: 'bg-orange-500' },
    { id: 2, name: 'Premium Notebook', cost: 1500, icon: Notebook, category: 'Stationery', color: 'bg-blue-500' },
    { id: 3, name: 'Parker Luxury Pen', cost: 3000, icon: PenTool, category: 'Stationery', color: 'bg-zinc-800' },
    { id: 4, name: 'Study Hall Pass', cost: 1000, icon: Star, category: 'Access', color: 'bg-amber-500' },
    { id: 5, name: 'Digital Library Pro', cost: 2000, icon: Gift, category: 'Digital', color: 'bg-purple-500' },
  ];

  const handleRedeem = (reward) => {
    if ((user.points || 0) < reward.cost) {
      toast.error('Not enough points! Keep studying to earn more focus XP.');
      return;
    }
    toast.success(`Succesfully redeemed: ${reward.name}! Your gift code has been sent to your email.`);
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: '#04060e' }}>
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-5%] left-[-5%] w-[35%] h-[35%] rounded-full bg-accent-violet/10 blur-[100px]" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[35%] h-[35%] rounded-full bg-accent-amber/10 blur-[100px]" />
      </div>

      <Navbar />

      <main className="max-w-[1300px] mx-auto pt-32 pb-12 px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="font-grotesk text-4xl md:text-5xl font-bold mb-3 tracking-tight">Scholar <span className="text-gradient">Rewards</span></h1>
            <p className="text-text-secondary text-lg">Convert your focus into tangible success.</p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card border border-white/5 px-8 py-5 rounded-[24px] flex items-center gap-6 shadow-2xl relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/10 to-transparent opacity-50" />
            <div className="p-4 bg-accent-blue/10 rounded-2xl text-accent-cyan group-hover:scale-110 transition-transform">
              <Trophy size={32} strokeWidth={2.5} />
            </div>
            <div className="relative z-10">
              <p className="text-[0.7rem] font-bold uppercase tracking-[2px] text-text-secondary mb-1">Your Balance</p>
              <p className="font-grotesk text-4xl font-black text-foreground">{user.points || 0} <span className="text-lg text-accent-blue">XP</span></p>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rewards.map((reward, i) => (
            <motion.div
              key={reward.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card rounded-[32px] p-2 border border-[rgba(255,255,255,0.06)] group hover:border-accent-blue/30 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)]"
            >
              <div className="p-6">
                <div className={`w-20 h-20 rounded-2xl ${reward.color} flex items-center justify-center text-white mb-8 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                  <reward.icon size={40} strokeWidth={1.5} />
                </div>
                
                <div className="mb-8">
                  <span className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[0.65rem] font-bold uppercase tracking-widest text-text-secondary mb-3 inline-block">
                    {reward.category}
                  </span>
                  <h3 className="font-grotesk text-2xl font-bold text-foreground mb-4">{reward.name}</h3>
                  <p className="text-text-secondary text-[0.95rem] leading-relaxed">
                    Exclusive reward for our top scholars. Boost your productivity with this {reward.name.toLowerCase()}.
                  </p>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                  <div>
                    <span className="font-grotesk text-3xl font-black text-foreground">{reward.cost}</span>
                    <span className="text-xs font-bold text-text-secondary ml-1 uppercase">XP</span>
                  </div>
                  <button 
                    onClick={() => handleRedeem(reward)}
                    className={`px-6 py-3 rounded-2xl font-bold text-[0.9rem] transition-all cursor-pointer ${
                      (user.points || 0) >= reward.cost 
                        ? 'bg-gradient-to-br from-accent-blue to-accent-violet text-primary-foreground hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:-translate-y-0.5' 
                        : 'bg-white/5 text-text-secondary border border-white/5'
                    }`}
                  >
                    Redeem Now
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24 p-12 rounded-[40px] bg-gradient-to-br from-[rgba(255,255,255,0.03)] to-transparent border border-white/5 flex flex-col md:flex-row items-center gap-12 group"
        >
           <div className="flex-shrink-0 w-32 h-32 rounded-3xl bg-accent-amber/10 flex items-center justify-center text-accent-amber group-hover:rotate-12 transition-transform duration-500">
             <Trophy size={64} strokeWidth={1.5} />
           </div>
           <div>
             <h2 className="font-grotesk text-3xl font-bold mb-4">The Scholar's Path</h2>
             <p className="text-text-secondary text-lg max-w-2xl leading-relaxed">
               Every minute of deep focus earns you 10 XP. Maintain consistency, build streaks, and unlock even more exclusive rewards. Your journey to mastery starts with a single focused hour.
             </p>
           </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Rewards;

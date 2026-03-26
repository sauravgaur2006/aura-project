import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import BackgroundCanvas from '../components/hero/BackgroundCanvas';

const Features = () => {
  const featureList = [
    {
      title: "AI Focus Tracking",
      desc: "Our proprietary AI models analyze your eye movements and posture in real-time to ensure you stay in the 'flow state'.",
      icon: "🎯",
      color: "from-accent-blue to-accent-cyan"
    },
    {
      title: "Neural Study Analytics",
      desc: "Get deep-level insights into your cognitive patterns. Understand when you're most productive and why.",
      icon: "📊",
      color: "from-accent-violet to-accent-blue"
    },
    {
      title: "Adaptive AI Tutor",
      desc: "A 24/7 personal coach that understands your curriculum and helps you solve complex problems instantly.",
      icon: "🤖",
      color: "from-accent-cyan to-accent-emerald"
    },
    {
      title: "Gamified Ecosystem",
      desc: "Turn study sessions into a quest. Earn XP, maintain streaks, and unlock real-world rewards for your hard work.",
      icon: "🔥",
      color: "from-accent-amber to-accent-rose"
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      <BackgroundCanvas />
      <Navbar />
      
      <div className="max-w-[1200px] mx-auto px-6 pt-[180px] pb-24 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <h1 className="font-grotesk text-[3.5rem] md:text-[4.5rem] font-bold leading-none mb-6">
            Engineered for <span className="text-gradient">Peak Performance</span>
          </h1>
          <p className="text-[1.2rem] text-text-secondary max-w-[700px] mx-auto leading-relaxed">
            ScholarOS isn't just a tool; it's a cognitive companion designed to amplify your intellectual output.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {featureList.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card rounded-[32px] p-10 border border-[rgba(255,255,255,0.06)] group hover:border-[rgba(255,255,255,0.15)] transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center text-3xl mb-8 group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                {f.icon}
              </div>
              <h3 className="font-grotesk text-2xl font-bold mb-4 text-foreground">{f.title}</h3>
              <p className="text-text-secondary leading-relaxed text-[1.1rem]">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="mt-20 glass-card rounded-[40px] p-12 border border-[rgba(255,255,255,0.08)] bg-gradient-to-br from-[rgba(255,255,255,0.03)] to-transparent text-center"
        >
          <h2 className="font-grotesk text-3xl font-bold mb-6">Ready to transform your study habits?</h2>
          <Link to="/signup" className="inline-flex items-center justify-center py-4 px-12 rounded-2xl bg-gradient-to-br from-accent-blue to-accent-violet text-primary-foreground font-bold text-lg hover:shadow-[0_0_40px_rgba(59,130,246,0.4)] transition-all no-underline">
            Join ScholarOS Today
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Features;

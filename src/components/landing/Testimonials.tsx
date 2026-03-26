import { motion } from 'framer-motion';

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'JEE Aspirant',
    text: 'ScholarOS literally changed my study game. The focus detection caught me scrolling Instagram mid-session — the nudge was so gentle I didn\'t feel judged, just motivated.',
    avatar: '🎓',
    score: '+38% focus',
    color: 'accent-blue',
  },
  {
    name: 'Arjun Patel',
    role: 'NEET Prep Student',
    text: 'The AI chatbot solved my organic chemistry doubts at 2 AM. No tutor needed. My streak hit 60 days and I actually redeemed canteen coupons from points.',
    avatar: '🧬',
    score: '60-day streak',
    color: 'accent-cyan',
  },
  {
    name: 'Sarah Chen',
    role: 'CS Undergrad',
    text: 'I thought focus tracking would be creepy. It\'s not. Everything runs locally, and the analytics dashboard gave me insights I never had about my own study patterns.',
    avatar: '💻',
    score: '3.5× productivity',
    color: 'accent-violet',
  },
  {
    name: 'Rahul Verma',
    role: 'UPSC Candidate',
    text: 'The session tracker with Pomodoro + ML is insane. It learned my optimal break intervals and adjusted automatically. My 8-hour study days feel effortless now.',
    avatar: '📚',
    score: '8hr avg sessions',
    color: 'accent-amber',
  },
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="relative py-24 px-6 md:px-12 z-10 bg-[#04060e] border-t border-[rgba(255,255,255,0.05)]">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-accent-violet/8 blur-[120px] rounded-full pointer-events-none" />
      <div className="max-w-[1200px] mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 py-[0.35rem] pr-4 pl-2 rounded-full glass-card mb-6">
            <span className="w-2 h-2 rounded-full bg-accent-amber shadow-[0_0_10px_rgba(245,158,11,0.35)] animate-[pulseDot_2s_ease-in-out_infinite]" />
            <span className="text-[0.75rem] font-semibold text-text-secondary tracking-[1.2px] uppercase">Real Student Results</span>
          </div>
          <h2 className="font-grotesk text-[2.5rem] md:text-[3.5rem] font-bold mb-6 leading-tight text-foreground">
            Students Who <span className="text-gradient">Transformed</span> Their Study
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-card rounded-2xl p-7 border border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.12)] transition-all duration-300 group"
            >
              <div className="flex items-center gap-4 mb-5">
                <div className={`w-12 h-12 rounded-full bg-${t.color}/15 border border-${t.color}/30 flex items-center justify-center text-xl`}>
                  {t.avatar}
                </div>
                <div className="flex-1">
                  <div className="font-grotesk font-bold text-foreground">{t.name}</div>
                  <div className="text-text-secondary text-[0.8rem]">{t.role}</div>
                </div>
                <div className={`text-${t.color} text-[0.75rem] font-bold bg-${t.color}/10 px-3 py-1 rounded-full`}>
                  {t.score}
                </div>
              </div>
              <p className="text-text-secondary text-[0.95rem] leading-[1.75] italic">"{t.text}"</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

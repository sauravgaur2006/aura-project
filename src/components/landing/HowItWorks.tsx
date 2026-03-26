import { motion } from 'framer-motion';

const steps = [
  {
    num: '01',
    icon: '🎯',
    title: 'Start a Focus Session',
    desc: 'Click "Start Session" and grant camera access. Your webcam feed stays 100% local — nothing is ever uploaded.',
    color: 'accent-blue',
    gradient: 'from-accent-blue/20 to-accent-blue/5',
  },
  {
    num: '02',
    icon: '👁️',
    title: 'AI Monitors Your Focus',
    desc: 'Our on-device AI tracks eye gaze, head pose, and presence. It detects distractions, drowsiness, and phone usage in real time.',
    color: 'accent-cyan',
    gradient: 'from-accent-cyan/20 to-accent-cyan/5',
  },
  {
    num: '03',
    icon: '💬',
    title: 'Get Friendly Nudges',
    desc: '"Hey, stay with me 👀" — instead of harsh alerts, ScholarOS gives you gentle, motivating nudges to keep you on track.',
    color: 'accent-violet',
    gradient: 'from-accent-violet/20 to-accent-violet/5',
  },
  {
    num: '04',
    icon: '📊',
    title: 'Review & Level Up',
    desc: 'After each session, see your focus score, distraction breakdown, and trends. Earn points, maintain streaks, and unlock rewards.',
    color: 'accent-amber',
    gradient: 'from-accent-amber/20 to-accent-amber/5',
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="relative py-24 px-6 md:px-12 z-10">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 py-[0.35rem] pr-4 pl-2 rounded-full glass-card mb-6">
            <span className="w-2 h-2 rounded-full bg-accent-cyan shadow-[0_0_10px_rgba(6,214,160,0.35)] animate-[pulseDot_2s_ease-in-out_infinite]" />
            <span className="text-[0.75rem] font-semibold text-text-secondary tracking-[1.2px] uppercase">Simple 4-Step Process</span>
          </div>
          <h2 className="font-grotesk text-[2.5rem] md:text-[3.5rem] font-bold mb-6 leading-tight text-foreground">
            How <span className="text-gradient">ScholarOS</span> Works
          </h2>
          <p className="text-text-secondary text-[1.1rem] leading-[1.8] max-w-[600px] mx-auto">
            From session start to analytics review — here's how you transform every study hour into peak productivity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className={`relative glass-card rounded-2xl p-7 border border-[rgba(255,255,255,0.06)] bg-gradient-to-b ${step.gradient} group hover:border-${step.color}/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.3)]`}
            >
              <div className={`text-[0.7rem] font-bold text-${step.color} tracking-[3px] uppercase mb-4`}>{step.num}</div>
              <span className="text-[2.5rem] block mb-4 group-hover:scale-110 transition-transform duration-300">{step.icon}</span>
              <h3 className="font-grotesk font-bold text-[1.2rem] text-foreground mb-3">{step.title}</h3>
              <p className="text-text-secondary text-[0.9rem] leading-[1.7]">{step.desc}</p>
              {i < 3 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-[2px] bg-gradient-to-r from-foreground/20 to-transparent" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

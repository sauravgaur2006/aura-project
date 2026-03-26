import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

type Message = { role: 'user' | 'assistant'; content: string };

const sampleResponses: Record<string, string> = {
  default: "I'm your ScholarOS AI tutor! I can help with academic doubts, study tips, and productivity coaching. What would you like to work on? 📚",
  study: "Here are some proven study techniques:\n\n**1. Pomodoro Technique** — 25 min focus, 5 min break\n**2. Active Recall** — Test yourself instead of re-reading\n**3. Spaced Repetition** — Review at increasing intervals\n**4. Feynman Technique** — Explain concepts simply\n\nWant me to help you create a study plan? 🎯",
  focus: "To improve focus:\n\n🧘 **Environment** — Remove phone, clean desk\n⏱️ **Time-boxing** — Set clear start/end times\n🎵 **Background noise** — Try lo-fi or white noise\n💧 **Hydration** — Keep water nearby\n😴 **Sleep** — 7-8 hours is non-negotiable\n\nYour ScholarOS focus score will track improvements automatically!",
};

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hey! 👋 I'm your AI study assistant. Ask me any academic question, or let me help you with study tips and productivity coaching. What's on your mind?" },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const lower = input.toLowerCase();
      let response = sampleResponses.default;
      if (lower.includes('study') || lower.includes('technique') || lower.includes('learn')) response = sampleResponses.study;
      if (lower.includes('focus') || lower.includes('concentrate') || lower.includes('distract')) response = sampleResponses.focus;

      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      setIsTyping(false);
    }, 1500);
  };

  const suggestions = ['How do I focus better?', 'Give me study techniques', 'Help me with calculus', 'Create a study plan'];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-primary)' }}>
      {/* Top Bar */}
      <nav className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between backdrop-blur-xl bg-[#04060e]/80 border-b border-[rgba(255,255,255,0.06)]">
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="flex items-center gap-2 no-underline">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-violet to-accent-blue flex items-center justify-center text-primary-foreground text-xs font-bold shadow-md">🤖</div>
            <span className="font-grotesk font-bold text-foreground tracking-[2px] text-[1rem]">AI Tutor</span>
          </Link>
        </div>
        <Link to="/dashboard" className="text-text-secondary text-[0.85rem] hover:text-foreground transition-colors no-underline">← Dashboard</Link>
      </nav>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 md:px-6 py-6">
        <div className="max-w-[750px] mx-auto space-y-4">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] rounded-2xl px-5 py-3.5 text-[0.95rem] leading-[1.7] ${
                msg.role === 'user'
                  ? 'bg-gradient-to-br from-accent-blue to-accent-violet text-primary-foreground rounded-br-md'
                  : 'glass-card border border-[rgba(255,255,255,0.06)] text-foreground rounded-bl-md'
              }`}>
                <div className="whitespace-pre-wrap">{msg.content}</div>
              </div>
            </motion.div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="glass-card border border-[rgba(255,255,255,0.06)] rounded-2xl rounded-bl-md px-5 py-4">
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 bg-text-secondary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-text-secondary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-text-secondary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div className="px-4 md:px-6 pb-2">
          <div className="max-w-[750px] mx-auto flex flex-wrap gap-2">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => { setInput(s); }}
                className="px-4 py-2 rounded-xl glass-card border border-[rgba(255,255,255,0.06)] text-text-secondary text-[0.85rem] cursor-pointer hover:text-foreground hover:border-[rgba(255,255,255,0.15)] transition-all"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="sticky bottom-0 px-4 md:px-6 py-4 backdrop-blur-xl bg-[#04060e]/80 border-t border-[rgba(255,255,255,0.06)]">
        <div className="max-w-[750px] mx-auto flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 px-5 py-3.5 rounded-2xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-foreground text-[0.95rem] outline-none focus:border-accent-violet/50 transition-colors placeholder:text-text-secondary/50"
            placeholder="Ask me anything..."
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-br from-accent-violet to-accent-blue text-primary-foreground font-semibold border-none cursor-pointer transition-all hover:shadow-[0_8px_25px_rgba(139,92,246,0.3)] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;

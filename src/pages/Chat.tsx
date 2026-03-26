import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import api from '@/lib/api';
import { toast } from 'sonner';

type Message = { role: 'user' | 'assistant'; content: string };

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

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg: Message = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const { data } = await api.post('/chat', { message: userMsg.content });
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (error) {
      toast.error("Failed to get response from AI Tutor.");
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm sorry, I'm having trouble connecting to my brain right now. Please try again in a moment! 🧠" }]);
    } finally {
      setIsTyping(false);
    }
  };

  const suggestions = ['How do I focus better?', 'Give me study techniques', 'Help me with calculus', 'Create a study plan'];

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col" style={{ background: '#04060e' }}>
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] left-[20%] w-[30%] h-[30%] rounded-full bg-accent-violet/5 blur-[120px]" />
        <div className="absolute bottom-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-accent-blue/5 blur-[120px]" />
      </div>

      <nav className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between backdrop-blur-[24px] saturate-[1.8] bg-[#04060e]/65 border-b border-[rgba(255,255,255,0.07)]">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-foreground hover:bg-white/10 transition-colors no-underline">
            ←
          </Link>
          <div>
            <h2 className="font-grotesk font-bold text-foreground text-lg mb-0 leading-tight">AI Study Coach</h2>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-pulse" />
              <span className="text-[0.65rem] text-accent-cyan font-bold uppercase tracking-widest">Always Active</span>
            </div>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2">
           <span className="text-text-secondary text-xs uppercase font-bold tracking-[2px]">Powered by Intelligence</span>
        </div>
      </nav>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-10 relative z-10 scrollbar-hide">
        <div className="max-w-[850px] mx-auto space-y-8">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] rounded-[24px] px-7 py-5 text-[1rem] leading-relaxed shadow-xl ${
                msg.role === 'user'
                  ? 'bg-gradient-to-br from-accent-blue to-accent-violet text-primary-foreground rounded-br-md border border-[rgba(255,255,255,0.1)]'
                  : 'glass-card border border-[rgba(255,255,255,0.06)] text-foreground rounded-bl-md'
              }`}>
                {msg.role === 'assistant' && (
                  <div className="flex items-center gap-2 mb-3 text-accent-cyan text-xs font-bold uppercase tracking-widest">
                    <span>AI Assistant</span>
                  </div>
                )}
                <div className="whitespace-pre-wrap">{msg.content}</div>
              </div>
            </motion.div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="glass-card border border-[rgba(255,255,255,0.06)] rounded-[20px] rounded-bl-md px-6 py-4">
                <div className="flex gap-1.5">
                  <span className="w-1.5 h-1.5 bg-accent-cyan rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-accent-cyan rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-accent-cyan rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="px-6 py-8 relative z-10">
        <div className="max-w-[850px] mx-auto">
          {messages.length <= 1 && (
            <div className="flex flex-wrap gap-3 mb-8">
              {suggestions.map((s, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => setInput(s)}
                  className="px-6 py-3 rounded-2xl glass-card border border-white/5 text-text-secondary text-[0.85rem] font-bold cursor-pointer hover:text-foreground hover:border-accent-blue/30 transition-all"
                >
                  {s}
                </motion.button>
              ))}
            </div>
          )}

          <div className="relative group">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="w-full px-8 py-5 rounded-[28px] bg-white/5 border border-white/10 text-foreground text-[1rem] outline-none focus:border-accent-blue/50 transition-all shadow-2xl placeholder:text-text-secondary/30"
              placeholder="Deep search your curriculum..."
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="absolute right-3 top-3 bottom-3 px-8 rounded-[20px] bg-gradient-to-br from-accent-blue to-accent-violet text-primary-foreground font-black text-sm uppercase tracking-widest border-none cursor-pointer transition-all hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] disabled:opacity-40"
            >
              Analyze
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;

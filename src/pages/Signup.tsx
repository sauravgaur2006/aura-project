import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import { toast } from 'sonner';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/register', { name, email, password });
      // Token is set as httpOnly cookie by the server — store only non-sensitive user info
      localStorage.setItem('user', JSON.stringify(data.user));
      toast.success('Registration successful!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative" style={{ background: 'var(--bg-primary)' }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-accent-violet/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/3 left-1/4 w-[300px] h-[300px] bg-accent-cyan/10 blur-[100px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-3xl p-8 md:p-12 border border-[rgba(255,255,255,0.08)] w-full max-w-[440px] relative z-10"
      >
        <Link to="/" className="flex items-center gap-2 mb-8 no-underline justify-center">
          <div className="w-9 h-9 flex items-center justify-center">
            <img src="/logo.svg" alt="ScholarOS Logo" className="w-full h-full object-contain" />
          </div>
          <span className="font-grotesk font-bold text-[1.2rem] text-foreground tracking-[3px]">ScholarOS</span>
        </Link>

        <h1 className="font-grotesk text-2xl font-bold text-foreground mb-2 text-center">Create Account</h1>
        <p className="text-text-secondary text-[0.9rem] text-center mb-8">Start your journey to peak productivity</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-text-secondary text-[0.8rem] font-medium block mb-2">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-foreground text-[0.95rem] outline-none focus:border-accent-cyan/50 transition-colors placeholder:text-text-secondary/50"
              placeholder="John Doe"
              required
            />
          </div>
          <div>
            <label className="text-text-secondary text-[0.8rem] font-medium block mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-foreground text-[0.95rem] outline-none focus:border-accent-cyan/50 transition-colors placeholder:text-text-secondary/50"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label className="text-text-secondary text-[0.8rem] font-medium block mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-foreground text-[0.95rem] outline-none focus:border-accent-cyan/50 transition-colors placeholder:text-text-secondary/50"
              placeholder="••••••••"
              required
              minLength={8}
            />
          </div>
          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-gradient-to-br from-accent-cyan to-accent-blue text-primary-foreground font-semibold text-[0.95rem] transition-all hover:-translate-y-[1px] hover:shadow-[0_8px_25px_rgba(6,214,160,0.35)] border-none cursor-pointer"
          >
            Create Account
          </button>
        </form>

        <p className="text-text-secondary text-[0.85rem] text-center mt-6">
          Already have an account? <Link to="/login" className="text-accent-cyan font-semibold no-underline hover:underline">Sign In</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;

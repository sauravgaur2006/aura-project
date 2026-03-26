import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import { toast } from 'sonner';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative" style={{ background: 'var(--bg-primary)' }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-accent-blue/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-accent-violet/10 blur-[100px] rounded-full" />
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

        <h1 className="font-grotesk text-2xl font-bold text-foreground mb-2 text-center">Welcome Back</h1>
        <p className="text-text-secondary text-[0.9rem] text-center mb-8">Sign in to continue your study sessions</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-text-secondary text-[0.8rem] font-medium block mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-foreground text-[0.95rem] outline-none focus:border-accent-blue/50 transition-colors placeholder:text-text-secondary/50"
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
              className="w-full px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-foreground text-[0.95rem] outline-none focus:border-accent-blue/50 transition-colors placeholder:text-text-secondary/50"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-gradient-to-br from-accent-blue to-accent-violet text-primary-foreground font-semibold text-[0.95rem] transition-all hover:-translate-y-[1px] hover:shadow-[0_8px_25px_rgba(59,130,246,0.35)] border-none cursor-pointer"
          >
            Sign In
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[rgba(255,255,255,0.06)]" /></div>
          <div className="relative flex justify-center text-[0.8rem]"><span className="bg-[#04060e] px-4 text-text-secondary">or continue with</span></div>
          <button 
            type="button"
            onClick={() => toast.info("Google Sign-In requires Client ID setup in .env")}
            className="w-full py-3.5 rounded-xl glass-card border border-[rgba(255,255,255,0.08)] flex items-center justify-center gap-3 transition-all hover:bg-[rgba(255,255,255,0.04)] cursor-pointer group"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="text-foreground font-medium text-[0.9rem]">Continue with Google</span>
          </button>
        </div>

        <p className="text-text-secondary text-[0.85rem] text-center mt-6">
          Don't have an account? <Link to="/signup" className="text-accent-blue font-semibold no-underline hover:underline">Sign Up</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;

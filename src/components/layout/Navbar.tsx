import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] px-6 md:px-12 py-4 flex items-center justify-between backdrop-blur-[24px] saturate-[1.8] bg-[#04060e]/65 border-b border-[rgba(255,255,255,0.07)]">
      <Link to="/" className="flex items-center gap-[0.7rem] no-underline">
        <div className="w-[38px] h-[38px] flex items-center justify-center transition-transform hover:scale-105 drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]">
          <img src="/logo.svg" alt="ScholarOS Logo" className="w-full h-full object-contain" />
        </div>
        <span className="font-grotesk font-bold text-[1.35rem] tracking-[4px] bg-gradient-to-r from-foreground to-foreground/65 bg-clip-text text-transparent">
          ScholarOS
        </span>
      </Link>
      <ul className="hidden md:flex items-center gap-3 lg:gap-4 list-none">
        {user ? (
          <>
            {[
              { path: '/dashboard', label: 'Dashboard' },
              { path: '/study', label: 'Study Mode' },
              { path: '/chat', label: 'AI Coach' },
              { path: '/rewards', label: 'Rewards' }
            ].map((link) => (
              <li key={link.path}>
                <Link 
                  to={link.path} 
                  className="relative px-[1.25rem] py-[0.6rem] rounded-xl bg-white/5 border border-white/10 no-underline text-text-primary text-[0.85rem] font-medium tracking-[0.5px] transition-all duration-300 hover:text-white hover:bg-white/10 hover:border-accent-cyan/40 hover:shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:-translate-y-0.5 group overflow-hidden block"
                >
                  <span className="relative z-10">{link.label}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-accent-blue/10 to-accent-cyan/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
              </li>
            ))}
            <li>
              <button 
                onClick={handleLogout}
                className="relative px-[1.25rem] py-[0.6rem] rounded-xl bg-accent-rose/10 border border-accent-rose/20 no-underline text-accent-rose text-[0.85rem] font-semibold tracking-[0.5px] transition-all duration-300 hover:bg-accent-rose/20 hover:border-accent-rose/50 hover:shadow-[0_0_20px_rgba(244,63,94,0.3)] hover:-translate-y-0.5 cursor-pointer overflow-hidden group"
              >
                <span className="relative z-10">Logout</span>
                <div className="absolute inset-0 bg-gradient-to-r from-accent-rose/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            </li>
          </>
        ) : (
          <>
            {[
              { path: '/features', label: 'Features' },
              { path: '/login', label: 'Analytics' },
              { path: '/login', label: 'AI Assistant' },
              { path: '/login', label: 'Gamification' }
            ].map((link) => (
              <li key={link.path}>
                <Link 
                  to={link.path} 
                  className="relative px-[1.25rem] py-[0.6rem] rounded-xl bg-white/5 border border-white/10 no-underline text-text-primary text-[0.85rem] font-medium tracking-[0.5px] transition-all duration-300 hover:text-white hover:bg-white/10 hover:border-accent-cyan/40 hover:shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:-translate-y-0.5 group overflow-hidden block"
                >
                  <span className="relative z-10">{link.label}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-accent-blue/10 to-accent-cyan/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
              </li>
            ))}
            <li className="ml-2">
              <Link to="/login" className="relative block px-[1.5rem] py-[0.6rem] rounded-xl bg-gradient-to-br from-accent-blue to-accent-violet text-white font-bold text-[0.85rem] cursor-pointer transition-all duration-300 hover:-translate-y-[3px] hover:shadow-[0_10px_30px_rgba(59,130,246,0.5)] no-underline tracking-[0.5px] border border-white/20 group overflow-hidden">
                <span className="relative z-10 flex items-center gap-2">
                  Get Started Free
                  <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;

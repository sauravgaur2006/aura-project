import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] px-6 md:px-12 py-4 flex items-center justify-between backdrop-blur-[24px] saturate-[1.8] bg-[#04060e]/65 border-b border-[rgba(255,255,255,0.07)]">
      <Link to="/" className="flex items-center gap-[0.7rem] no-underline">
        <div className="w-[38px] h-[38px] rounded-[11px] bg-gradient-to-br from-accent-blue to-accent-cyan flex items-center justify-center font-black text-primary-foreground shadow-[0_0_20px_rgba(59,130,246,0.35)] relative overflow-hidden after:content-[''] after:absolute after:inset-0 after:bg-gradient-to-br after:from-transparent after:from-[40%] after:to-[rgba(255,255,255,0.18)] after:rounded-[inherit]">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="relative z-10 drop-shadow-md">
            <path d="M11 19c-3 -2 -6 -2 -8 -2V4c2 0 5 0 8 2c3 -2 6 -2 8 -2v13c-2 0 -5 0 -8 2z" fill="rgba(255,255,255,0.15)"/>
            <path d="M11 19V6" strokeWidth="2.7"/>
            <path d="M6 7c2 1 3.5 1.5 5 2" strokeWidth="1.5" opacity="0.75"/>
            <path d="M16 7c-2 1 -3.5 1.5 -5 2" strokeWidth="1.5" opacity="0.75"/>
            <path d="M5 11c2 1 4 1.5 6 1.5" strokeWidth="1.5" opacity="0.4"/>
            <path d="M17 11c-2 1 -4 1.5 -6 1.5" strokeWidth="1.5" opacity="0.4"/>
          </svg>
        </div>
        <span className="font-grotesk font-bold text-[1.35rem] tracking-[4px] bg-gradient-to-r from-foreground to-foreground/65 bg-clip-text text-transparent">
          ScholarOS
        </span>
      </Link>
      <ul className="hidden md:flex items-center gap-3 lg:gap-4 list-none">
        {[
          { href: '#features', label: 'Features', hoverColor: 'hover:border-accent-blue/40 hover:bg-accent-blue/10 hover:shadow-[0_0_15px_rgba(59,130,246,0.15)]' },
          { href: '#analytics', label: 'Analytics', hoverColor: 'hover:border-accent-cyan/40 hover:bg-accent-cyan/10 hover:shadow-[0_0_15px_rgba(6,214,160,0.15)]' },
          { href: '#ai-assistant', label: 'AI Assistant', hoverColor: 'hover:border-accent-violet/40 hover:bg-accent-violet/10 hover:shadow-[0_0_15px_rgba(139,92,246,0.15)]' },
          { href: '#gamification', label: 'Gamification', hoverColor: 'hover:border-accent-amber/40 hover:bg-accent-amber/10 hover:shadow-[0_0_15px_rgba(245,158,11,0.15)]' },
        ].map((item) => (
          <li key={item.label}>
            <a href={item.href} className={`block px-[1.15rem] py-[0.55rem] rounded-[10px] bg-[rgba(255,255,255,0.025)] border border-[rgba(255,255,255,0.05)] no-underline text-text-primary text-[0.85rem] font-medium tracking-[0.3px] transition-all duration-300 hover:text-foreground hover:-translate-y-[1px] ${item.hoverColor}`}>
              {item.label}
            </a>
          </li>
        ))}
        <li className="ml-2">
          <Link to="/signup" className="px-[1.4rem] py-2.5 rounded-xl bg-gradient-to-br from-accent-blue to-accent-violet text-primary-foreground font-semibold text-[0.85rem] cursor-pointer transition-all duration-200 hover:-translate-y-[2px] hover:shadow-[0_8px_25px_rgba(59,130,246,0.35)] no-underline tracking-[0.4px] border border-[rgba(255,255,255,0.15)]">
            Get Started Free
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;

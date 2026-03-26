import { Link } from 'react-router-dom';

const CTAFooter = () => {
  return (
    <>
      {/* CTA Section */}
      <section className="relative py-24 px-6 md:px-12 z-10">
        <div className="max-w-[800px] mx-auto text-center">
          <div className="glass-card rounded-[32px] p-12 md:p-16 border border-[rgba(255,255,255,0.08)] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/10 via-transparent to-accent-violet/10 pointer-events-none" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[200px] bg-accent-cyan/15 blur-[100px] rounded-full pointer-events-none" />
            <div className="relative z-10">
              <h2 className="font-grotesk text-[2rem] md:text-[3rem] font-bold mb-4 text-foreground leading-tight">
                Ready to <span className="text-gradient">Transform</span> Your Study?
              </h2>
              <p className="text-text-secondary text-[1.05rem] leading-[1.7] mb-8 max-w-[500px] mx-auto">
                Join thousands of students who study smarter with AI-powered focus tracking. Start free — no credit card required.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center gap-2 py-4 px-10 rounded-2xl bg-gradient-to-br from-accent-blue to-accent-violet text-primary-foreground font-semibold text-[1rem] no-underline transition-all duration-200 hover:-translate-y-[2px] hover:shadow-[0_12px_40px_rgba(59,130,246,0.35)] shadow-lg"
                >
                  Get Started Free →
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-2 py-4 px-8 rounded-2xl glass-card text-text-primary font-medium text-[1rem] no-underline transition-all hover:bg-[rgba(255,255,255,0.07)]"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[rgba(255,255,255,0.05)] py-12 px-6 md:px-12">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center">
              <img src="/logo.svg" alt="ScholarOS Logo" className="w-full h-full object-contain" />
            </div>
            <span className="font-grotesk font-bold text-foreground tracking-[2px]">ScholarOS</span>
          </div>
          <div className="flex gap-8 text-text-secondary text-[0.85rem]">
            <a href="#features" className="hover:text-foreground transition-colors no-underline">Features</a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors no-underline">How It Works</a>
            <a href="#gamification" className="hover:text-foreground transition-colors no-underline">Rewards</a>
            <Link to="/login" className="hover:text-foreground transition-colors no-underline">Login</Link>
          </div>
          <div className="text-text-secondary text-[0.8rem]">
            © 2026 ScholarOS. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
};

export default CTAFooter;

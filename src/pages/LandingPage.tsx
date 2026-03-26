import Navbar from '../components/layout/Navbar';
import BackgroundCanvas from '../components/hero/BackgroundCanvas';
import Hero from '../components/hero/Hero';
import FeaturesSection from '../components/features/FeaturesSection';
import HowItWorks from '../components/landing/HowItWorks';
import Testimonials from '../components/landing/Testimonials';
import GamificationSection from '../components/landing/GamificationSection';
import CTAFooter from '../components/landing/CTAFooter';

const LandingPage = () => {
  return (
    <main className="relative min-h-screen">
      <BackgroundCanvas />
      <Navbar />
      <Hero />
      <FeaturesSection />
      <HowItWorks />
      <GamificationSection />
      <Testimonials />
      <CTAFooter />
    </main>
  );
};

export default LandingPage;

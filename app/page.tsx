import SiteHeader from '@/components/layout/SiteHeader';
import SiteFooter from '@/components/layout/SiteFooter';
import ScrollProgress from '@/components/layout/ScrollProgress';
import Hero from '@/components/landing/Hero';
import Stats from '@/components/landing/Stats';
import Features from '@/components/landing/Features';
import HowItWorks from '@/components/landing/HowItWorks';
import Testimonials from '@/components/landing/Testimonials';
import FAQ from '@/components/landing/FAQ';
import CTA from '@/components/landing/CTA';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <ScrollProgress />
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <Stats />
        <Features />
        <HowItWorks />
        <Testimonials />
        <FAQ />
        <CTA />
      </main>
      <SiteFooter />
    </div>
  );
}


import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import NavBar from '@/components/NavBar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import HowItWorks from '@/components/HowItWorks';
import FactChecker from '@/components/FactChecker';
import Footer from '@/components/Footer';

const Index = () => {
  // Smooth scroll function for anchor links
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('#')) {
        const id = target.getAttribute('href')?.substring(1);
        const element = document.getElementById(id || '');
        
        if (element) {
          e.preventDefault();
          
          // Get the navbar height to offset the scroll position
          const navbar = document.querySelector('header');
          const navbarHeight = navbar ? navbar.offsetHeight : 0;
          
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    };
    
    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);

  return (
    <AnimatePresence>
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-grow">
          <Hero />
          <Features />
          <HowItWorks />
          <FactChecker />
        </main>
        <Footer />
      </div>
    </AnimatePresence>
  );
};

export default Index;

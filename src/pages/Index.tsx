
import { useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import HowItWorks from '@/components/HowItWorks';
import FactChecker from '@/components/FactChecker';
import Footer from '@/components/Footer';

const Index = () => {
  const location = useLocation();
  const scrolled = useRef(false);

  // Handle smooth scrolling for anchor links
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('#')) {
        const id = target.getAttribute('href')?.substring(1);
        const element = document.getElementById(id || '');
        
        if (element) {
          e.preventDefault();
          element.scrollIntoView({
            behavior: 'smooth'
          });
        }
      }
    };
    
    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);

  // Handle scrolling to section based on URL hash
  useEffect(() => {
    if (location.hash && !scrolled.current) {
      const id = location.hash.substring(1);
      const element = document.getElementById(id);
      
      if (element) {
        // Add a small delay to ensure the page is fully loaded
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
          scrolled.current = true;
        }, 100);
      }
    }
    
    // Reset the flag when the hash changes
    return () => {
      scrolled.current = false;
    };
  }, [location.hash]);

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


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
  const initialRender = useRef(true);

  // Handle hash navigation when coming from another page
  useEffect(() => {
    // Check if there's a hash in the URL
    if (location.hash) {
      // Small delay to ensure components are rendered
      setTimeout(() => {
        const id = location.hash.substring(1);
        const element = document.getElementById(id);
        
        if (element) {
          const navbar = document.querySelector('header');
          const navbarHeight = navbar ? navbar.offsetHeight : 0;
          const extraPadding = 50;
          
          const offsetPosition = element.offsetTop - navbarHeight - extraPadding;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 300); // Increased timeout for better reliability
    } else if (initialRender.current) {
      // No hash, scroll to top on initial render
      window.scrollTo(0, 0);
      initialRender.current = false;
    }
  }, [location.hash]);

  // Smooth scroll function for anchor links
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Check if clicked element is an anchor or has an anchor parent
      const anchor = target.tagName === 'A' ? target : target.closest('a');
      
      if (anchor && anchor.getAttribute('href')?.startsWith('#')) {
        const id = anchor.getAttribute('href')?.substring(1);
        const element = document.getElementById(id || '');
        
        if (element) {
          e.preventDefault();
          
          // Get the navbar height to offset the scroll position
          const navbar = document.querySelector('header');
          const navbarHeight = navbar ? navbar.offsetHeight : 0;
          
          // Add extra padding to ensure content isn't hidden directly under the navbar
          const extraPadding = 50; // Increased padding for better visibility
          
          const offsetPosition = element.offsetTop - navbarHeight - extraPadding;
          
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

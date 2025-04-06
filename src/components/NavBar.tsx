
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import ThemeToggle from './ThemeToggle';
import LanguageSelector from './LanguageSelector';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function NavBar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const navLinks = [
    { name: t('home'), href: isHomePage ? '#' : '/' },
    { name: t('features'), href: isHomePage ? '#features' : '/#features' },
    { name: t('howItWorks'), href: isHomePage ? '#how-it-works' : '/#how-it-works' },
    { name: t('tryIt'), href: isHomePage ? '#fact-checker' : '/#fact-checker' },
  ];

  const handleGetStarted = () => {
    // If we're on the home page, scroll to the fact-checker section
    if (isHomePage) {
      const factCheckerSection = document.getElementById('fact-checker');
      if (factCheckerSection) {
        factCheckerSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // If not on home page, navigate to the pricing page
      navigate('/pricing');
    }
  };
  
  const handleNavLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    
    if (href === '#') {
      // Handle home link on home page
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (href.startsWith('/#')) {
      // Handle anchor links from other pages to home page sections
      navigate('/');
      // Need to wait for navigation to complete before scrolling
      setTimeout(() => {
        const id = href.substring(2); // Remove the "/#"
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
      }, 100);
    } else if (href.startsWith('#')) {
      // Handle anchor links within same page
      const id = href.substring(1);
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
    } else {
      // Regular link to another page
      navigate(href);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    // Close mobile menu if open
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };
  
  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 px-6 md:px-10',
        isScrolled 
          ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-md' 
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <motion.a 
          href="/"
          onClick={(e) => {
            e.preventDefault();
            navigate('/');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2"
        >
          <Shield className="h-8 w-8 text-primary" />
          <span className="font-bold text-xl">TruthGuard</span>
        </motion.a>
        
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link, i) => (
            <motion.a
              key={link.name}
              href={link.href}
              onClick={(e) => handleNavLinkClick(e, link.href)}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * i }}
              className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
            >
              {link.name}
            </motion.a>
          ))}
        </nav>
        
        <div className="flex items-center gap-2">
          <LanguageSelector />
          <ThemeToggle />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="ml-2"
          >
            <Button
              variant="default"
              size="sm"
              className="hidden md:flex"
              onClick={handleGetStarted}
            >
              {t('getStarted')}
            </Button>
          </motion.div>
          
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="md:hidden text-gray-700 dark:text-gray-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </motion.button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white dark:bg-gray-900 overflow-hidden"
          >
            <div className="px-6 py-4 space-y-4 flex flex-col">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary py-2 transition-colors"
                  onClick={(e) => handleNavLinkClick(e, link.href)}
                >
                  {link.name}
                </a>
              ))}
              <Button 
                variant="default" 
                size="sm" 
                className="mt-2 w-full"
                onClick={() => {
                  handleGetStarted();
                  setMobileMenuOpen(false);
                }}
              >
                {t('getStarted')}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

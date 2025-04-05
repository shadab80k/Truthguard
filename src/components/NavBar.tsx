import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Menu, X, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import LanguageSelector from '@/components/LanguageSelector';
import { useLanguage } from '@/contexts/LanguageContext';

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleNavigation = (sectionId) => {
    setIsMenuOpen(false);
    
    if (isHomePage) {
      // If already on home page, scroll to the section
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const navItems = [
    { name: t('home'), path: '/' },
    { name: t('howItWorks'), path: isHomePage ? '#how-it-works' : '/#how-it-works' },
    { name: t('factChecker'), path: isHomePage ? '#fact-checker' : '/#fact-checker' },
    { name: t('pricing'), path: '/pricing' },
    { name: t('documentation'), path: '/documentation' },
    { name: t('about'), path: '/about' },
    { name: t('faq'), path: '/faq' }
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full py-4 px-6 transition-all duration-300 z-50 ${scrolled ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-md' : 'bg-transparent'}`}>
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="flex items-center text-xl font-semibold">
            <img src="/logo.svg" alt="TruthGuard Logo" className="h-8 w-auto mr-2" />
            TruthGuard
          </Link>
        </div>

        <div className="hidden lg:flex items-center space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors duration-200"
              onClick={() => handleNavigation(item.path.startsWith('#') ? item.path.substring(1) : '')}
            >
              {item.name}
            </Link>
          ))}
          <LanguageSelector />
          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200">
            {isDarkMode ? <Sun className="h-5 w-5 text-gray-700 dark:text-gray-300" /> : <Moon className="h-5 w-5 text-gray-700 dark:text-gray-300" />}
          </button>
        </div>

        <div className="lg:hidden">
          <button onClick={toggleMenu} className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors duration-200">
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden fixed top-0 right-0 w-64 h-full bg-white dark:bg-gray-900 shadow-xl transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out z-50`}>
        <div className="flex items-center justify-between p-4">
          <Link to="/" className="flex items-center text-lg font-semibold">
            <img src="/logo.svg" alt="TruthGuard Logo" className="h-6 w-auto mr-2" />
            TruthGuard
          </Link>
          <button onClick={toggleMenu} className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors duration-200">
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="flex flex-col p-4 space-y-4">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="block text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors duration-200 py-2"
              onClick={() => {
                handleNavigation(item.path.startsWith('#') ? item.path.substring(1) : '');
                toggleMenu(); // Close the menu after navigation
              }}
            >
              {item.name}
            </Link>
          ))}
          <LanguageSelector />
          <button onClick={toggleTheme} className="flex items-center justify-center p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200">
            {isDarkMode ? <Sun className="h-5 w-5 text-gray-700 dark:text-gray-300" /> : <Moon className="h-5 w-5 text-gray-700 dark:text-gray-300" />}
            <span className="ml-2">{isDarkMode ? t('lightMode') : t('darkMode')}</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;


import { Shield, Twitter, Github, Linkedin, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

export default function Footer() {
  const navigate = useNavigate();
  
  const footerLinks = [
    {
      title: "Product",
      links: [
        { name: "Features", href: "#features" },
        { name: "How It Works", href: "#how-it-works" },
        { name: "Try It", href: "#fact-checker" },
        { name: "Pricing", href: "/pricing" },
      ]
    },
    {
      title: "Resources",
      links: [
        { name: "Documentation", href: "/documentation" },
        { name: "API", href: "/api" },
        { name: "Blog", href: "/blog" },
        { name: "FAQs", href: "/faqs" },
      ]
    },
    {
      title: "Company",
      links: [
        { name: "About", href: "/about" },
        { name: "Careers", href: "/careers" },
        { name: "Privacy", href: "/privacy" },
        { name: "Terms", href: "/terms" },
      ]
    }
  ];

  const socialLinks = [
    { icon: <Twitter className="h-5 w-5" />, href: "https://twitter.com", label: "Twitter" },
    { icon: <Github className="h-5 w-5" />, href: "https://github.com", label: "GitHub" },
    { icon: <Linkedin className="h-5 w-5" />, href: "https://linkedin.com", label: "LinkedIn" },
    { icon: <Mail className="h-5 w-5" />, href: "mailto:contact@truthguard.com", label: "Email" },
  ];

  // Helper function to determine if a link is internal or external
  const isInternalLink = (href: string) => {
    return href.startsWith('#') || href.startsWith('/');
  };
  
  // Handle navigation and smooth scrolling
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      // Handle anchor links within the same page
      e.preventDefault();
      const id = href.substring(1);
      const element = document.getElementById(id);
      
      if (element) {
        const navbar = document.querySelector('header');
        const navbarHeight = navbar ? navbar.offsetHeight : 0;
        const extraPadding = 50;
        
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - navbarHeight - extraPadding;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    } else if (href.startsWith('/')) {
      // Handle navigation to other pages
      e.preventDefault();
      navigate(href);
      // Scroll to top after navigation
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  return (
    <footer className="bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="flex items-center gap-2 mb-4"
            >
              <Shield className="h-8 w-8 text-primary" />
              <span className="font-bold text-xl">TruthGuard</span>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-muted-foreground mb-6 max-w-md"
            >
              TruthGuard uses advanced AI to detect misinformation and provide credible, verified information in real-time.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex gap-4"
            >
              {socialLinks.map((link, i) => (
                <a
                  key={i}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className="h-10 w-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-primary hover:text-white transition-colors"
                >
                  {link.icon}
                </a>
              ))}
            </motion.div>
          </div>
          
          {footerLinks.map((group, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * (i + 2) }}
              viewport={{ once: true }}
            >
              <h3 className="font-medium text-lg mb-4">{group.title}</h3>
              <ul className="space-y-3">
                {group.links.map((link, j) => (
                  <li key={j}>
                    {isInternalLink(link.href) ? (
                      <a 
                        href={link.href} 
                        className="text-muted-foreground hover:text-primary transition-colors"
                        onClick={(e) => handleLinkClick(e, link.href)}
                      >
                        {link.name}
                      </a>
                    ) : (
                      <a 
                        href={link.href} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        {link.name}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          viewport={{ once: true }}
          className="pt-8 mt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center"
        >
          <p className="text-sm text-muted-foreground mb-4 md:mb-0">
            © {new Date().getFullYear()} TruthGuard. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a 
              href="/privacy" 
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
              onClick={(e) => handleLinkClick(e, '/privacy')}
            >
              Privacy Policy
            </a>
            <a 
              href="/terms" 
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
              onClick={(e) => handleLinkClick(e, '/terms')}
            >
              Terms of Service
            </a>
            <a 
              href="/cookie-policy" 
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
              onClick={(e) => handleLinkClick(e, '/cookie-policy')}
            >
              Cookie Policy
            </a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}

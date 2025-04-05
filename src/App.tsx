
import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { Toaster } from './components/ui/toaster';
import { Toaster as SonnerToaster } from './components/ui/sonner';
import Index from './pages/Index';
import Pricing from './pages/Pricing';
import Documentation from './pages/Documentation';
import About from './pages/About';
import Blog from './pages/Blog';
import FAQ from './pages/FAQ';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Careers from './pages/Careers';
import NotFound from './pages/NotFound';
import './App.css';

function App() {
  useEffect(() => {
    // Parse query parameters for any UTM tags or referral codes
    const queryParams = new URLSearchParams(window.location.search);
    const utmSource = queryParams.get('utm_source');
    const utmMedium = queryParams.get('utm_medium');
    const utmCampaign = queryParams.get('utm_campaign');
    const referralCode = queryParams.get('ref');
    
    // Log or store UTM parameters if present
    if (utmSource || utmMedium || utmCampaign || referralCode) {
      console.log('Marketing params:', { utmSource, utmMedium, utmCampaign, referralCode });
      // Store in localStorage or analytics system
      localStorage.setItem('marketing_data', JSON.stringify({ 
        utmSource, utmMedium, utmCampaign, referralCode, 
        timestamp: new Date().toISOString() 
      }));
    }
  }, []);

  return (
    <ThemeProvider>
      <LanguageProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/documentation" element={<Documentation />} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
          <SonnerToaster position="top-right" />
        </Router>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;

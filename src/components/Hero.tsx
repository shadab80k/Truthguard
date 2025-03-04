
import { motion } from 'framer-motion';
import { Shield, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function Hero() {
  const backgroundVariants = {
    initial: {
      backgroundPosition: '0% 50%',
    },
    animate: {
      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
      transition: {
        duration: 20,
        ease: 'linear',
        repeat: Infinity,
      },
    },
  };

  const fadeInUpVariants = {
    initial: { opacity: 0, y: 20 },
    animate: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: 0.2 + index * 0.1,
      },
    }),
  };

  const features = [
    { 
      icon: <Shield className="h-5 w-5" />, 
      text: "AI-powered fact checking" 
    },
    { 
      icon: <CheckCircle2 className="h-5 w-5" />, 
      text: "Real-time verification" 
    },
    { 
      icon: <AlertCircle className="h-5 w-5" />, 
      text: "Multi-source validation" 
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Abstract background */}
      <motion.div
        variants={backgroundVariants}
        initial="initial"
        animate="animate"
        className="absolute inset-0 bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-gray-900"
      />
      
      {/* Dot pattern overlay */}
      <div className="absolute inset-0 bg-dot-pattern opacity-[0.15]" />
      
      {/* Hero content */}
      <div className="relative max-w-7xl mx-auto px-6 pt-32 pb-24 md:pt-40 md:pb-32">
        <div className="grid md:grid-cols-2 gap-12 md:gap-6 lg:gap-12 items-center">
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium"
            >
              AI-Powered Fake News Detection
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
            >
              Guard the truth in <br className="hidden md:inline" />
              <span className="text-primary">an era of misinformation</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-gray-600 dark:text-gray-300 max-w-lg"
            >
              TruthGuard uses advanced AI to detect fake news in real-time, providing you with credible information and detailed analysis.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button 
                className="px-8 py-6 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                onClick={() => document.getElementById('fact-checker')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Try It Now
              </Button>
              
              <Button 
                variant="outline" 
                className="px-8 py-6 text-base font-medium border-2 hover:-translate-y-1 transition-all duration-300"
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Learn More
              </Button>
            </motion.div>
            
            <div className="flex flex-wrap gap-6 pt-4">
              {features.map((feature, i) => (
                <motion.div
                  key={i}
                  custom={i}
                  variants={fadeInUpVariants}
                  initial="initial"
                  animate="animate"
                  className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300"
                >
                  <div className={cn(
                    "flex items-center justify-center h-8 w-8 rounded-full",
                    "bg-primary/10 text-primary"
                  )}>
                    {feature.icon}
                  </div>
                  <span>{feature.text}</span>
                </motion.div>
              ))}
            </div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex justify-center md:justify-end"
          >
            <div className="relative w-full max-w-md">
              {/* Main illustration or mockup */}
              <div className="relative z-10 glass-card rounded-2xl shadow-soft overflow-hidden">
                <div className="w-full h-[400px] md:h-[500px] bg-gradient-to-b from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
                  <Shield className="w-32 h-32 text-primary animate-pulse-slow" />
                </div>
                
                {/* Floating elements */}
                <div className="absolute top-10 left-10 glass-card rounded-lg p-4 shadow-soft animate-float">
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full bg-truth-green"></div>
                    <span className="text-sm font-medium">Verified Content</span>
                  </div>
                </div>
                
                <div className="absolute bottom-16 right-10 glass-card rounded-lg p-4 shadow-soft animate-float" style={{animationDelay: '1s'}}>
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full bg-truth-red"></div>
                    <span className="text-sm font-medium">Fake Content Detected</span>
                  </div>
                </div>
                
                <div className="absolute bottom-40 left-12 glass-card rounded-lg p-4 shadow-soft animate-float" style={{animationDelay: '2s'}}>
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full bg-truth-yellow"></div>
                    <span className="text-sm font-medium">Questionable Content</span>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-primary/20 blur-xl"></div>
              <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-primary/20 blur-xl"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}


import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { CircleCheck, Sparkles, Search, FileCheck } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      icon: <Search className="h-10 w-10" />,
      title: "Input Content",
      description: "Paste a news article, social media post, or any statement that you want to verify."
    },
    {
      icon: <Sparkles className="h-10 w-10" />,
      title: "AI Analysis",
      description: "Our advanced AI models analyze the content by checking against reliable sources and identifying patterns of misinformation."
    },
    {
      icon: <FileCheck className="h-10 w-10" />,
      title: "Detailed Report",
      description: "Receive a comprehensive report with credibility score, identified claims, and source verification."
    },
    {
      icon: <CircleCheck className="h-10 w-10" />,
      title: "Make Informed Decisions",
      description: "Use the analysis to determine the reliability of information and share factual content confidently."
    }
  ];

  return (
    <section id="how-it-works" className="py-20 px-6 bg-white dark:bg-gray-950 mt-16">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 pt-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Badge variant="outline" className="mb-4 px-3 py-1 text-primary">
              How It Works
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Simple steps to verify information
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our fact-checking process is designed to be simple and efficient, providing you with reliable results in seconds.
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center"
            >
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mb-4">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute right-0 top-1/2 transform -translate-y-1/2 -translate-x-1/2">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.90997 19.92L15.43 13.4C16.2 12.63 16.2 11.37 15.43 10.6L8.90997 4.08" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </motion.div>
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <button 
            className="px-8 py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors shadow-md hover:shadow-lg"
            onClick={() => document.getElementById('fact-checker')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
          >
            Try It Now
          </button>
        </motion.div>
      </div>
    </section>
  );
}

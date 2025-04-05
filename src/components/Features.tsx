import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Shield, Newspaper, Database, MoveUpRight, Brain, Lock } from 'lucide-react';
import InfoCard from '@/components/InfoCard';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Features() {
  const { t } = useLanguage();
  
  const features = [
    {
      icon: <Shield className="h-6 w-6" />,
      title: t('accurateAnalysis'),
      description: t('accurateAnalysisDesc')
    },
    {
      icon: <Newspaper className="h-6 w-6" />,
      title: t('sourceValidation'),
      description: t('sourceValidationDesc')
    },
    {
      icon: <Database className="h-6 w-6" />,
      title: t('comprehensiveDatabase'),
      description: t('comprehensiveDatabaseDesc')
    },
    {
      icon: <MoveUpRight className="h-6 w-6" />,
      title: t('realTimeMonitoring'),
      description: t('realTimeMonitoringDesc')
    },
    {
      icon: <Brain className="h-6 w-6" />,
      title: t('advancedAI'),
      description: t('advancedAIDesc')
    },
    {
      icon: <Lock className="h-6 w-6" />,
      title: t('secureTrustworthy'),
      description: t('secureTrustworthyDesc')
    }
  ];

  return (
    <section id="features" className="py-20 px-6 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Badge variant="outline" className="mb-4 px-3 py-1 text-primary">
              Features
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Cutting-edge technology to combat misinformation
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              TruthGuard combines advanced AI models, real-time verification, and user-friendly interfaces to help you separate fact from fiction.
            </p>
          </motion.div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <InfoCard
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              delay={0.1 * index}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 p-8 rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/10 text-center"
        >
          <h3 className="text-2xl font-semibold mb-3">Ready to fight misinformation?</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            Try TruthGuard today and join the global community committed to promoting truth and credible information online.
          </p>
          <button 
            className="px-8 py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors shadow-md hover:shadow-lg"
            onClick={() => document.getElementById('fact-checker')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Try It Now
          </button>
        </motion.div>
      </div>
    </section>
  );
}

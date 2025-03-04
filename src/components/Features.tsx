
import { motion } from 'framer-motion';
import { 
  ShieldCheck, Zap, Globe, Cpu, Lightbulb, BarChart4, RefreshCw, Trophy 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import InfoCard from './InfoCard';

export default function Features() {
  const features = [
    {
      icon: <ShieldCheck className="h-6 w-6" />,
      title: "AI-Powered Detection",
      description: "Advanced AI models analyze news content and detect misinformation patterns in real-time."
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "5-Second Verification",
      description: "Get instant results in under 5 seconds, allowing you to quickly identify fake news."
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Multi-Source Validation",
      description: "Cross-references information with trusted fact-checking sources and databases."
    },
    {
      icon: <Cpu className="h-6 w-6" />,
      title: "Autonomous AI Agents",
      description: "LangChain agents autonomously research, verify facts, and generate detailed reports."
    },
    {
      icon: <Lightbulb className="h-6 w-6" />,
      title: "Explainable Results",
      description: "Transparent reasoning that explains why content was flagged as true, questionable, or fake."
    },
    {
      icon: <BarChart4 className="h-6 w-6" />,
      title: "Analytics Dashboard",
      description: "Visual breakdown of credibility scores, keywords, and source reliability metrics."
    },
    {
      icon: <RefreshCw className="h-6 w-6" />,
      title: "Continuous Learning",
      description: "System improves over time with user feedback and new verified information sources."
    },
    {
      icon: <Trophy className="h-6 w-6" />,
      title: "Truth Points System",
      description: "Earn rewards for reporting and correctly identifying misinformation in the wild."
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

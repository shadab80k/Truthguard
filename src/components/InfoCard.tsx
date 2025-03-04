
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface InfoCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  delay?: number;
  className?: string;
}

export default function InfoCard({ 
  title, 
  description, 
  icon, 
  delay = 0,
  className 
}: InfoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true, margin: "-100px" }}
      className={cn(
        "rounded-xl p-6 shadow-soft bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700",
        "hover:shadow-xl hover:-translate-y-1 transition-all duration-300",
        className
      )}
    >
      <div className="mb-4 p-3 inline-flex items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </motion.div>
  );
}


import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

export default function LoadingIndicator() {
  const { t } = useLanguage();

  return (
    <motion.div 
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className="mt-6 flex flex-col items-center py-10"
    >
      <div className="flex justify-center space-x-2 mb-4">
        <div className="w-3 h-3 rounded-full bg-primary loading-dot"></div>
        <div className="w-3 h-3 rounded-full bg-primary loading-dot"></div>
        <div className="w-3 h-3 rounded-full bg-primary loading-dot"></div>
      </div>
      <p className="text-muted-foreground text-sm animate-pulse">
        {t("analyzing")}...
      </p>
    </motion.div>
  );
}

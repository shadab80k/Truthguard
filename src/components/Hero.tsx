import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Hero() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const isHomePage = window.location.pathname === '/';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      console.log('Email submitted:', email);
      navigate('/pricing', { state: { email } });
    }
  };

  const handleTryItNow = () => {
    if (isHomePage) {
      const element = document.getElementById('fact-checker');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate('/#fact-checker');
    }
  };

  const steps = [
    {
      icon: <Check className="h-6 w-6" />,
      title: t('step1Title'),
      description: t('step1Desc')
    },
    {
      icon: <Check className="h-6 w-6" />,
      title: t('step2Title'),
      description: t('step2Desc')
    },
    {
      icon: <Check className="h-6 w-6" />,
      title: t('step3Title'),
      description: t('step3Desc')
    },
    {
      icon: <Check className="h-6 w-6" />,
      title: t('step4Title'),
      description: t('step4Desc')
    }
  ];

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-md text-center mb-8 lg:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Badge variant="outline" className="mb-4 px-3 py-1 text-primary">
              {t('heroBadge')}
            </Badge>
            <h2 className="mb-4 text-3xl tracking-tight font-extrabold text-gray-900 dark:text-white">
              {t('heroTitle')}
            </h2>
            <p className="font-light text-gray-500 dark:text-gray-400 sm:text-xl">
              {t('heroDescription')}
            </p>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-col space-y-4 sm:gap-4 sm:space-y-0 sm:flex-row justify-center"
        >
          <form className="w-full max-w-md" onSubmit={handleSubmit}>
            <label htmlFor="email" className="sr-only">
              {t('emailAddress')}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 16">
                  <path d="m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.488l9.395 7.79zm-.457 1.134L1.324 1.82C1.058 1.546.776 1.299.5 1.079v11.641a1.979 1.979 0 0 0 1.388.878l9.549 7.907c.326.26.686.461 1.054.615a1.94 1.94 0 0 0 2.234 0c.368-.153.728-.354 1.054-.615l9.548-7.907a1.977 1.977 0 0 0 1.387-.878V1.079c-.276.22-.558.467-.824.741L10.479 9.412z" />
                </svg>
              </div>
              <input
                className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-primary-300 focus:border-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-primary-300 dark:focus:border-primary-300"
                placeholder={t('emailAddress')}
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button
                type="submit"
                className="text-white absolute end-2.5 bottom-2.5 bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                {t('subscribe')}
              </button>
            </div>
          </form>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mx-auto max-w-screen-md text-center mt-8 lg:mt-12"
        >
          <p className="font-light text-gray-500 dark:text-gray-400 sm:text-xl">
            {t('heroSteps')}
          </p>
        </motion.div>
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
          {isHomePage ? (
            <button 
              className="px-8 py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors shadow-md hover:shadow-lg"
              onClick={handleTryItNow}
            >
              {t('tryItNow')}
            </button>
          ) : (
            <Link 
              to="/#fact-checker"
              className="inline-block px-8 py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors shadow-md hover:shadow-lg"
            >
              {t('tryItNow')}
            </Link>
          )}
        </motion.div>
      </div>
    </section>
  );
}

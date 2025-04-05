
import { motion } from 'framer-motion';
import { Plus, Minus, HelpCircle } from 'lucide-react';
import { useState } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  
  const faqs = [
    {
      question: "What is TruthGuard and how does it work?",
      answer: "TruthGuard is an AI-powered fact-checking platform that analyzes text content to detect misinformation. It works by comparing statements against verified sources, analyzing context, and providing a credibility assessment along with sources."
    },
    {
      question: "How accurate is TruthGuard's analysis?",
      answer: "TruthGuard achieves a high level of accuracy by cross-referencing multiple reliable sources and using advanced AI algorithms. However, like any fact-checking system, it's not infallible. We constantly improve our algorithms and expand our source database to increase accuracy."
    },
    {
      question: "Can TruthGuard analyze content in languages other than English?",
      answer: "Currently, TruthGuard primarily supports English content, with limited support for other major languages. We're actively working on expanding our multilingual capabilities."
    },
    {
      question: "How does TruthGuard determine if a source is credible?",
      answer: "We evaluate sources based on multiple factors including their track record of accuracy, journalistic standards, transparency, expertise, and recognition by established press associations. Our source credibility system is regularly reviewed and updated."
    },
    {
      question: "Is my data secure when using TruthGuard?",
      answer: "Yes, we take data security seriously. The content you submit for fact-checking is processed securely, and we don't store personal data beyond what's necessary to provide our service. Please refer to our Privacy Policy for detailed information."
    },
    {
      question: "Can I use TruthGuard for commercial purposes?",
      answer: "Yes, we offer commercial plans that allow integration with your systems via our API. These plans come with additional features suited for businesses and organizations. Check our Pricing page for details."
    },
    {
      question: "How often is TruthGuard's database updated?",
      answer: "Our database of verified information and sources is updated continuously. We monitor breaking news and emerging topics to ensure our system has the most current information available."
    },
    {
      question: "What if I disagree with TruthGuard's assessment?",
      answer: "We understand that context and interpretation can vary. If you believe our assessment is incorrect, you can submit feedback through the feedback form. Our team reviews feedback regularly to improve our system."
    }
  ];

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow">
        <section className="py-16 px-4 md:py-24 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <div className="flex justify-center mb-4">
                <HelpCircle className="h-12 w-12 text-primary" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Find answers to common questions about TruthGuard.
              </p>
            </motion.div>
          </div>
        </section>
        
        <section className="py-12 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="space-y-6">
              {faqs.map((faq, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                  className="border rounded-lg overflow-hidden dark:border-gray-700"
                >
                  <button
                    onClick={() => toggleFaq(i)}
                    className="flex justify-between items-center w-full p-4 text-left font-medium focus:outline-none"
                  >
                    <span>{faq.question}</span>
                    {openIndex === i ? (
                      <Minus className="h-5 w-5 text-primary flex-shrink-0" />
                    ) : (
                      <Plus className="h-5 w-5 text-primary flex-shrink-0" />
                    )}
                  </button>
                  {openIndex === i && (
                    <div className="p-4 pt-0 border-t dark:border-gray-700">
                      <p className="text-muted-foreground">{faq.answer}</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-12 p-6 border rounded-lg text-center dark:border-gray-700"
            >
              <h2 className="text-xl font-bold mb-2">Still have questions?</h2>
              <p className="text-muted-foreground mb-4">If you couldn't find the answer you were looking for, please contact our support team.</p>
              <button className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition-colors">
                Contact Support
              </button>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default FAQPage;

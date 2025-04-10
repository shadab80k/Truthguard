
import { motion } from 'framer-motion';
import { Plus, Minus, HelpCircle, Mail, MessageCircle, MapPin, Clock } from 'lucide-react';
import { useState } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
        <section className="py-16 px-4 md:py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
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
            <Accordion type="single" collapsible className="w-full space-y-4">
              {faqs.map((faq, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                >
                  <AccordionItem value={`item-${i}`} className="border rounded-lg overflow-hidden dark:border-gray-700">
                    <AccordionTrigger className="px-4 py-3 hover:no-underline focus:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="px-4 text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-16 p-8 border rounded-lg dark:border-gray-700 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 shadow-sm"
            >
              <h2 className="text-2xl font-bold mb-4 text-center">Still have questions?</h2>
              <p className="text-muted-foreground mb-8 text-center max-w-xl mx-auto">
                We're here to help! Choose the best way to get in touch with our support team.
              </p>
              
              <Tabs defaultValue="contact-form" className="w-full max-w-xl mx-auto">
                <TabsList className="grid grid-cols-3 mb-6">
                  <TabsTrigger value="contact-form">Contact Form</TabsTrigger>
                  <TabsTrigger value="support-channels">Support Channels</TabsTrigger>
                  <TabsTrigger value="help-center">Help Center</TabsTrigger>
                </TabsList>
                
                <TabsContent value="contact-form" className="p-6 border rounded-lg dark:border-gray-700">
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
                        <input 
                          type="text" 
                          id="name" 
                          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:border-gray-700" 
                          placeholder="Your name" 
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                        <input 
                          type="email" 
                          id="email" 
                          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:border-gray-700" 
                          placeholder="Your email" 
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium mb-1">Subject</label>
                      <input 
                        type="text" 
                        id="subject" 
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:border-gray-700" 
                        placeholder="How can we help?" 
                      />
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
                      <textarea 
                        id="message" 
                        rows={4} 
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:border-gray-700" 
                        placeholder="Please describe your issue or question in detail"
                      ></textarea>
                    </div>
                    <div className="pt-2">
                      <button 
                        type="submit" 
                        className="w-full bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
                      >
                        Send Message
                      </button>
                    </div>
                  </form>
                </TabsContent>
                
                <TabsContent value="support-channels" className="p-6 border rounded-lg space-y-6 dark:border-gray-700">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 flex items-center justify-center rounded-full bg-primary/10 text-primary flex-shrink-0">
                      <MessageCircle size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-1">Live Chat</h3>
                      <p className="text-muted-foreground mb-2">Available Monday to Friday, 9am-5pm EST</p>
                      <button className="text-primary font-medium hover:underline">Start Chat</button>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 flex items-center justify-center rounded-full bg-primary/10 text-primary flex-shrink-0">
                      <Mail size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-1">Email Support</h3>
                      <p className="text-muted-foreground mb-2">We'll respond within 24-48 hours</p>
                      <a href="mailto:support@truthguard.com" className="text-primary font-medium hover:underline">
                        support@truthguard.com
                      </a>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="help-center" className="p-6 border rounded-lg space-y-6 dark:border-gray-700">
                  <div className="flex flex-col items-center text-center">
                    <div className="h-16 w-16 flex items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                      <MapPin size={24} />
                    </div>
                    <h3 className="text-lg font-medium mb-2">Knowledge Base</h3>
                    <p className="text-muted-foreground mb-4 max-w-md">
                      Explore our detailed guides, tutorials, and troubleshooting articles to find quick answers.
                    </p>
                    <button className="bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-medium">
                      Visit Knowledge Base
                    </button>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="mt-8 pt-6 border-t dark:border-gray-800 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="p-4">
                  <Clock className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <h3 className="font-medium mb-1">Support Hours</h3>
                  <p className="text-sm text-muted-foreground">Mon-Fri, 9am-5pm EST</p>
                </div>
                <div className="p-4">
                  <MessageCircle className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <h3 className="font-medium mb-1">Response Time</h3>
                  <p className="text-sm text-muted-foreground">Within 24-48 hours</p>
                </div>
                <div className="p-4">
                  <Mail className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <h3 className="font-medium mb-1">Technical Support</h3>
                  <p className="text-sm text-muted-foreground">Priority for paid plans</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default FAQPage;

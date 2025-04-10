
import { motion } from 'framer-motion';
import { Lock, FileText, Database, Share2, Globe, CheckSquare, MailOpen, RefreshCw } from 'lucide-react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';

const PrivacyPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow pt-24">
        <section className="py-12 px-4 md:py-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-10"
            >
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-primary/10 rounded-full">
                  <Lock className="h-12 w-12 text-primary" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Effective Date: 10 Apr 2025
              </p>
            </motion.div>
          </div>
        </section>
        
        <section className="py-12 px-4 md:px-8 lg:px-12">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="prose dark:prose-invert max-w-none"
            >
              <Card className="mb-10 shadow-sm border-gray-200 dark:border-gray-800">
                <CardContent className="p-6">
                  <p className="text-lg leading-relaxed">
                    At TruthGuard, we value your privacy and are committed to protecting your personal information. This Privacy Policy outlines how we collect, use, store, and protect your data when you use our platform.
                  </p>
                </CardContent>
              </Card>
              
              <div className="space-y-12">
                <PolicySection 
                  icon={<FileText className="h-8 w-8" />}
                  emoji="🔍"
                  number="1"
                  title="Information We Collect"
                  content={
                    <>
                      <p className="mb-4">
                        We may collect the following types of information when you interact with TruthGuard:
                      </p>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <span className="font-medium mr-2">Personal Information:</span> 
                          <span>Name, email address, and optional profile details (only if you create an account).</span>
                        </li>
                        <li className="flex items-start">
                          <span className="font-medium mr-2">Usage Data:</span>
                          <span>Log data, IP address, browser type, and activity on the platform.</span>
                        </li>
                        <li className="flex items-start">
                          <span className="font-medium mr-2">Fact-Check Inputs:</span>
                          <span>Claims or links you submit for verification.</span>
                        </li>
                        <li className="flex items-start">
                          <span className="font-medium mr-2">Feedback & Preferences:</span>
                          <span>Responses to surveys, user preferences, and custom settings.</span>
                        </li>
                      </ul>
                    </>
                  }
                />
                
                <PolicySection 
                  icon={<Database className="h-8 w-8" />}
                  emoji="🤖"
                  number="2"
                  title="How We Use Your Data"
                  content={
                    <>
                      <p className="mb-4">We use your data to:</p>
                      <ul className="space-y-3">
                        <li className="flex items-start gap-2">
                          <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <div className="h-2 w-2 rounded-full bg-primary"></div>
                          </div>
                          <span>Process and verify fact-check requests using AI.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <div className="h-2 w-2 rounded-full bg-primary"></div>
                          </div>
                          <span>Improve accuracy through analysis of usage trends.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <div className="h-2 w-2 rounded-full bg-primary"></div>
                          </div>
                          <span>Personalize your experience (e.g., language preferences).</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <div className="h-2 w-2 rounded-full bg-primary"></div>
                          </div>
                          <span>Provide customer support and respond to inquiries.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <div className="h-2 w-2 rounded-full bg-primary"></div>
                          </div>
                          <span>Enhance platform performance, security, and usability.</span>
                        </li>
                      </ul>
                    </>
                  }
                />
                
                <PolicySection 
                  icon={<Lock className="h-8 w-8" />}
                  emoji="🛡️"
                  number="3"
                  title="Data Security"
                  content={
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2">
                        <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="h-2 w-2 rounded-full bg-primary"></div>
                        </div>
                        <span>All user data is securely stored and encrypted using industry-standard protocols.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="h-2 w-2 rounded-full bg-primary"></div>
                        </div>
                        <span>We use Supabase for data handling with built-in privacy and access control.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="h-2 w-2 rounded-full bg-primary"></div>
                        </div>
                        <span>Access to your data is strictly limited to authorized personnel only.</span>
                      </li>
                    </ul>
                  }
                />
                
                <PolicySection 
                  icon={<Share2 className="h-8 w-8" />}
                  emoji="🔁"
                  number="4"
                  title="Data Sharing & Third Parties"
                  content={
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2">
                        <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="h-2 w-2 rounded-full bg-primary"></div>
                        </div>
                        <span>We do not sell or rent your personal information to any third party.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="h-2 w-2 rounded-full bg-primary"></div>
                        </div>
                        <span>We may share limited, anonymized data with trusted services (e.g., Google Gemini AI) only to improve fact-checking accuracy.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="h-2 w-2 rounded-full bg-primary"></div>
                        </div>
                        <span>Legal compliance: We may disclose data if required by law or to protect TruthGuard's rights and integrity.</span>
                      </li>
                    </ul>
                  }
                />
                
                <PolicySection 
                  icon={<Globe className="h-8 w-8" />}
                  emoji="🌐"
                  number="5"
                  title="Multilingual & Global Use"
                  content={
                    <p>
                      TruthGuard is used globally. By using our platform, you consent to the transfer and processing of your data in accordance with this policy, wherever our servers or services are located.
                    </p>
                  }
                />
                
                <PolicySection 
                  icon={<CheckSquare className="h-8 w-8" />}
                  emoji="✅"
                  number="6"
                  title="Your Rights"
                  content={
                    <>
                      <p className="mb-4">As a user, you have the right to:</p>
                      <ul className="space-y-3">
                        <li className="flex items-start gap-2">
                          <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <div className="h-2 w-2 rounded-full bg-primary"></div>
                          </div>
                          <span>Access, update, or delete your personal information.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <div className="h-2 w-2 rounded-full bg-primary"></div>
                          </div>
                          <span>Opt-out of non-essential communications.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <div className="h-2 w-2 rounded-full bg-primary"></div>
                          </div>
                          <span>Request a copy of the data we have on you.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <div className="h-2 w-2 rounded-full bg-primary"></div>
                          </div>
                          <span>Deactivate or permanently delete your account.</span>
                        </li>
                      </ul>
                    </>
                  }
                />
                
                <PolicySection 
                  icon={<MailOpen className="h-8 w-8" />}
                  emoji="📬"
                  number="7"
                  title="Contact Us"
                  content={
                    <>
                      <p className="mb-4">
                        Have questions about your privacy?<br />
                        Reach out to us at: <a href="mailto:mohdshadab4549@gmail.com" className="text-primary hover:underline">mohdshadab4549@gmail.com</a> or via the in-app support chat.
                      </p>
                    </>
                  }
                />
                
                <PolicySection 
                  icon={<RefreshCw className="h-8 w-8" />}
                  emoji="🔄"
                  number="8"
                  title="Updates to This Policy"
                  content={
                    <p>
                      We may update this Privacy Policy from time to time. When we do, we'll notify users via email or app notifications. Continued use of TruthGuard after changes implies agreement with the updated terms.
                    </p>
                  }
                />
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

const PolicySection = ({ 
  icon, 
  emoji, 
  number, 
  title, 
  content 
}: { 
  icon: React.ReactNode; 
  emoji: string; 
  number: string; 
  title: string; 
  content: React.ReactNode; 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="pb-8"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-primary/10 rounded-lg">
          {icon}
        </div>
        <h2 className="text-2xl font-bold">
          <span className="mr-2">{emoji}</span>
          <span>{number}. {title}</span>
        </h2>
      </div>
      <Separator className="mb-6" />
      <div className="pl-4 border-l-2 border-primary/20">
        {content}
      </div>
    </motion.div>
  );
};

export default PrivacyPage;

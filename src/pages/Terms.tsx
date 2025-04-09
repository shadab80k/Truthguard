
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

const TermsPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow pt-24">
        <section className="py-12 px-4 md:py-16 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-6"
            >
              <div className="flex justify-center mb-4">
                <FileText className="h-12 w-12 text-primary" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">📜 Terms of Use – TruthGuard</h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Effective Date: 10 Apr 2025
              </p>
            </motion.div>
          </div>
        </section>
        
        <section className="py-8 px-4 md:px-8 lg:px-12">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="prose dark:prose-invert max-w-none"
            >
              <p>
                By accessing or using TruthGuard, you agree to be bound by these Terms of Use. If you do not agree with any part of these terms, please do not use our services.
              </p>
              
              <h2 className="flex items-center gap-2">
                <span>🔹</span> 1. Overview
              </h2>
              <p>
                TruthGuard is an AI-powered fact-verification platform that allows users to analyze and verify the authenticity of digital content, claims, and media using advanced AI tools such as Google Gemini.
              </p>
              
              <h2 className="flex items-center gap-2">
                <span>✅</span> 2. Eligibility
              </h2>
              <p>To use TruthGuard, you must:</p>
              <ul>
                <li>Be at least 10 years old (or the minimum legal age in your country).</li>
                <li>Agree to these Terms of Use and our Privacy Policy.</li>
              </ul>
              <p>
                If you're using the platform on behalf of an organization, you confirm that you have the authority to bind the organization to these terms.
              </p>
              
              <h2 className="flex items-center gap-2">
                <span>🧠</span> 3. User Responsibilities
              </h2>
              <p>By using TruthGuard, you agree to:</p>
              <ul>
                <li>Provide truthful and lawful content for verification.</li>
                <li>Avoid submitting malicious, offensive, or illegal claims or links.</li>
                <li>Not attempt to reverse-engineer, scrape, or misuse the platform or its AI services.</li>
                <li>Respect intellectual property, including our proprietary algorithms, designs, and data structures.</li>
              </ul>
              
              <h2 className="flex items-center gap-2">
                <span>⚙️</span> 4. Use of AI & Platform Services
              </h2>
              <ul>
                <li>All verification and analysis are conducted using AI algorithms and third-party APIs (e.g., Google Gemini).</li>
                <li>TruthGuard provides probabilistic assessments based on available data. Final decisions or judgments based on our analysis are at the user's discretion.</li>
                <li>We do not guarantee 100% accuracy and are not liable for decisions made based on the platform's output.</li>
              </ul>
              
              <h2 className="flex items-center gap-2">
                <span>💼</span> 5. Account & Access
              </h2>
              <ul>
                <li>Some features may require account registration.</li>
                <li>You are responsible for maintaining the confidentiality of your login credentials.</li>
                <li>We reserve the right to suspend or terminate accounts for violating these terms or engaging in suspicious activity.</li>
              </ul>
              
              <h2 className="flex items-center gap-2">
                <span>💬</span> 6. Community Contributions (Beta)
              </h2>
              <p>If you contribute to our upcoming community verification features (e.g., suggesting sources or flagging misinformation), you agree that:</p>
              <ul>
                <li>Your contributions may be moderated or removed.</li>
                <li>You grant us the right to use submitted data to improve platform accuracy.</li>
              </ul>
              
              <h2 className="flex items-center gap-2">
                <span>🛡️</span> 7. Limitation of Liability
              </h2>
              <p>TruthGuard is not responsible for:</p>
              <ul>
                <li>Misinformation missed by the platform.</li>
                <li>Damages caused by reliance on AI-generated analysis.</li>
                <li>Third-party content or websites linked within the platform.</li>
              </ul>
              
              <h2 className="flex items-center gap-2">
                <span>🚫</span> 8. Prohibited Activities
              </h2>
              <p>You agree not to:</p>
              <ul>
                <li>Upload harmful code, malware, or spam.</li>
                <li>Use bots, automation, or scripts to abuse the platform.</li>
                <li>Harass, impersonate, or exploit other users.</li>
                <li>Violate any local, national, or international law.</li>
              </ul>
              
              <h2 className="flex items-center gap-2">
                <span>🔁</span> 9. Changes to These Terms
              </h2>
              <p>
                We may update these Terms of Use periodically. Any major changes will be communicated via email or platform notification. Continued use of TruthGuard after updates implies acceptance.
              </p>
              
              <h2 className="flex items-center gap-2">
                <span>📩</span> 10. Contact
              </h2>
              <p>
                Questions or concerns? Reach out to: <a href="mailto:mohdshadab4549@gmail.com">mohdshadab4549@gmail.com</a><br />
                Address: Kanpur Uttar Pradesh, India<br />
                We're here to help.
              </p>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default TermsPage;

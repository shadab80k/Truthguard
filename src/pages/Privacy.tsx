
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

const PrivacyPage = () => {
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
                <Lock className="h-12 w-12 text-primary" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
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
              <p className="text-lg">
                At TruthGuard, we value your privacy and are committed to protecting your personal information. This Privacy Policy outlines how we collect, use, store, and protect your data when you use our platform.
              </p>
              
              <h2 className="flex items-center gap-2">
                <span>🔍</span> 1. Information We Collect
              </h2>
              <p>
                We may collect the following types of information when you interact with TruthGuard:
              </p>
              <ul>
                <li><strong>Personal Information:</strong> Name, email address, and optional profile details (only if you create an account).</li>
                <li><strong>Usage Data:</strong> Log data, IP address, browser type, and activity on the platform.</li>
                <li><strong>Fact-Check Inputs:</strong> Claims or links you submit for verification.</li>
                <li><strong>Feedback & Preferences:</strong> Responses to surveys, user preferences, and custom settings.</li>
              </ul>
              
              <h2 className="flex items-center gap-2">
                <span>🤖</span> 2. How We Use Your Data
              </h2>
              <p>We use your data to:</p>
              <ul>
                <li>Process and verify fact-check requests using AI.</li>
                <li>Improve accuracy through analysis of usage trends.</li>
                <li>Personalize your experience (e.g., language preferences).</li>
                <li>Provide customer support and respond to inquiries.</li>
                <li>Enhance platform performance, security, and usability.</li>
              </ul>
              
              <h2 className="flex items-center gap-2">
                <span>🛡️</span> 3. Data Security
              </h2>
              <ul>
                <li>All user data is securely stored and encrypted using industry-standard protocols.</li>
                <li>We use Supabase for data handling with built-in privacy and access control.</li>
                <li>Access to your data is strictly limited to authorized personnel only.</li>
              </ul>
              
              <h2 className="flex items-center gap-2">
                <span>🔁</span> 4. Data Sharing & Third Parties
              </h2>
              <ul>
                <li>We do not sell or rent your personal information to any third party.</li>
                <li>We may share limited, anonymized data with trusted services (e.g., Google Gemini AI) only to improve fact-checking accuracy.</li>
                <li>Legal compliance: We may disclose data if required by law or to protect TruthGuard's rights and integrity.</li>
              </ul>
              
              <h2 className="flex items-center gap-2">
                <span>🌐</span> 5. Multilingual & Global Use
              </h2>
              <p>
                TruthGuard is used globally. By using our platform, you consent to the transfer and processing of your data in accordance with this policy, wherever our servers or services are located.
              </p>
              
              <h2 className="flex items-center gap-2">
                <span>✅</span> 6. Your Rights
              </h2>
              <p>As a user, you have the right to:</p>
              <ul>
                <li>Access, update, or delete your personal information.</li>
                <li>Opt-out of non-essential communications.</li>
                <li>Request a copy of the data we have on you.</li>
                <li>Deactivate or permanently delete your account.</li>
              </ul>
              
              <h2 className="flex items-center gap-2">
                <span>📬</span> 7. Contact Us
              </h2>
              <p>
                Have questions about your privacy?<br />
                Reach out to us at: <a href="mailto:mohdshadab4549@gmail.com">mohdshadab4549@gmail.com</a> or via the in-app support chat.
              </p>
              
              <h2 className="flex items-center gap-2">
                <span>🔄</span> 8. Updates to This Policy
              </h2>
              <p>
                We may update this Privacy Policy from time to time. When we do, we'll notify users via email or app notifications. Continued use of TruthGuard after changes implies agreement with the updated terms.
              </p>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPage;


import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

const TermsPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow">
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
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Last updated: April 1, 2025
              </p>
            </motion.div>
          </div>
        </section>
        
        <section className="py-8 px-4">
          <div className="max-w-3xl mx-auto prose dark:prose-invert">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h2>Introduction</h2>
              <p>
                Welcome to TruthGuard. Please read these Terms of Service ("Terms") carefully as they contain important information about your legal rights, remedies, and obligations. By accessing or using TruthGuard's website or services, you agree to comply with and be bound by these Terms.
              </p>
              
              <h2>Acceptance of Terms</h2>
              <p>
                By accessing or using our services, you agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, you may not access or use our services.
              </p>
              
              <h2>Description of Service</h2>
              <p>
                TruthGuard provides fact-checking services that analyze content against verified sources to determine its accuracy. Our service uses artificial intelligence and a database of verified information to assess the credibility of statements and content.
              </p>
              
              <h2>User Accounts</h2>
              <p>
                Some features of our service may require you to create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
              </p>
              
              <h2>User Conduct</h2>
              <p>You agree not to use our service to:</p>
              <ul>
                <li>Violate any applicable law or regulation</li>
                <li>Infringe upon any third-party rights, including intellectual property rights</li>
                <li>Distribute malware or other harmful code</li>
                <li>Engage in activities that could disable, overburden, or impair our servers or networks</li>
                <li>Attempt to gain unauthorized access to our systems or user accounts</li>
              </ul>
              
              <h2>Content Submission</h2>
              <p>
                When you submit content for analysis, you grant us the right to process and analyze that content for the purpose of providing our fact-checking service. You represent and warrant that you have all necessary rights to submit such content and that the content does not violate any third-party rights.
              </p>
              
              <h2>Intellectual Property</h2>
              <p>
                Our service, including its content, features, and functionality, are owned by TruthGuard and are protected by copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, modify, create derivative works of, publicly display, or exploit any portion of our service without our prior written consent.
              </p>
              
              <h2>Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, TruthGuard and its officers, directors, employees, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or use, arising out of or in connection with these Terms or the use or inability to use our service.
              </p>
              
              <h2>Disclaimer of Warranties</h2>
              <p>
                Our service is provided "as is" and "as available" without warranties of any kind, either express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement. We do not warrant that our service will be uninterrupted, secure, or error-free.
              </p>
              
              <h2>Indemnification</h2>
              <p>
                You agree to defend, indemnify, and hold harmless TruthGuard and its officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses arising out of or in any way connected with your use of our service or violation of these Terms.
              </p>
              
              <h2>Modifications to Terms</h2>
              <p>
                We reserve the right to modify these Terms at any time. We will notify you of significant changes by posting a notice on our website or sending you an email. Your continued use of our service after such modifications constitutes your acceptance of the modified Terms.
              </p>
              
              <h2>Termination</h2>
              <p>
                We may terminate or suspend your access to our service immediately, without prior notice or liability, for any reason, including if you breach these Terms. Upon termination, your right to use our service will cease immediately.
              </p>
              
              <h2>Governing Law</h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law principles. Any disputes arising out of or relating to these Terms or our service shall be subject to the exclusive jurisdiction of the courts located in San Francisco, California.
              </p>
              
              <h2>Contact Information</h2>
              <p>
                If you have any questions about these Terms, please contact us at:
              </p>
              <p>
                Email: legal@truthguard.com<br />
                Address: 123 Truth Avenue, San Francisco, CA 94105
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

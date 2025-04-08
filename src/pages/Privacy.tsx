
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
                Last updated: April 1, 2025
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
              <h2>Introduction</h2>
              <p>
                TruthGuard ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.
              </p>
              <p>
                Please read this Privacy Policy carefully. By accessing or using our service, you acknowledge that you have read, understood, and agree to be bound by all the terms of this Privacy Policy.
              </p>
              
              <h2>Information We Collect</h2>
              <h3>Personal Information</h3>
              <p>
                We may collect certain personally identifiable information that can be used to contact or identify you, including but not limited to:
              </p>
              <ul>
                <li>Name</li>
                <li>Email address</li>
                <li>IP address</li>
                <li>Usage data and analytics</li>
              </ul>
              
              <h3>Content You Provide</h3>
              <p>
                When you use our fact-checking service, we collect and process the content you submit for analysis. This may include texts, statements, articles, or other content you want us to verify.
              </p>
              
              <h2>How We Use Your Information</h2>
              <p>We use the information we collect for various purposes, including to:</p>
              <ul>
                <li>Provide, maintain, and improve our services</li>
                <li>Process and analyze the content you submit</li>
                <li>Communicate with you about our service</li>
                <li>Respond to your inquiries and provide customer support</li>
                <li>Monitor usage patterns and perform analytics</li>
                <li>Protect against unauthorized access and legal liability</li>
              </ul>
              
              <h2>Data Retention</h2>
              <p>
                We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy. We will retain and use your information to the extent necessary to comply with our legal obligations, resolve disputes, and enforce our agreements.
              </p>
              
              <h2>Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
              </p>
              
              <h2>Third-Party Services</h2>
              <p>
                We may employ third-party companies and individuals to facilitate our service, provide the service on our behalf, perform service-related tasks, or assist us in analyzing how our service is used. These third parties have access to your personal information only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.
              </p>
              
              <h2>Children's Privacy</h2>
              <p>
                Our service is not intended for use by children under the age of 13. We do not knowingly collect personally identifiable information from children under 13. If we become aware that we have collected personal information from a child under 13, we will take steps to remove that information.
              </p>
              
              <h2>Your Rights</h2>
              <p>Depending on your location, you may have certain rights regarding your personal information, including:</p>
              <ul>
                <li>The right to access the personal information we have about you</li>
                <li>The right to request correction of inaccurate data</li>
                <li>The right to request deletion of your data</li>
                <li>The right to restrict or object to our processing of your data</li>
                <li>The right to data portability</li>
              </ul>
              
              <h2>Changes to This Privacy Policy</h2>
              <p>
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically for any changes.
              </p>
              
              <h2>Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <p>
                Email: privacy@truthguard.com<br />
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

export default PrivacyPage;


import { motion } from 'framer-motion';
import { FileText, Bookmark, Search, BookOpen, Code, HelpCircle } from 'lucide-react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

const DocumentationPage = () => {
  const categories = [
    {
      title: 'Getting Started',
      icon: <BookOpen className="h-6 w-6" />,
      description: 'Introduction to TruthGuard and basic concepts',
      links: [
        { title: 'Introduction', href: '#introduction' },
        { title: 'Quick Start Guide', href: '#quick-start' },
        { title: 'Core Concepts', href: '#core-concepts' }
      ]
    },
    {
      title: 'User Guides',
      icon: <FileText className="h-6 w-6" />,
      description: 'Step-by-step guides for common tasks',
      links: [
        { title: 'Fact Checking', href: '#fact-checking' },
        { title: 'Source Verification', href: '#source-verification' },
        { title: 'Managing Results', href: '#managing-results' }
      ]
    },
    {
      title: 'API Reference',
      icon: <Code className="h-6 w-6" />,
      description: 'Technical documentation for developers',
      links: [
        { title: 'Authentication', href: '#api-auth' },
        { title: 'Endpoints', href: '#api-endpoints' },
        { title: 'Rate Limits', href: '#api-limits' }
      ]
    },
    {
      title: 'Resources',
      icon: <Bookmark className="h-6 w-6" />,
      description: 'Additional resources and materials',
      links: [
        { title: 'Best Practices', href: '#best-practices' },
        { title: 'Examples', href: '#examples' },
        { title: 'Case Studies', href: '#case-studies' }
      ]
    }
  ];

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
              className="text-center mb-12"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Documentation</h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Everything you need to know about using TruthGuard effectively.
              </p>
            </motion.div>
            
            <div className="mt-8 max-w-3xl mx-auto">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-800 dark:border-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition duration-150 ease-in-out sm:text-sm"
                  placeholder="Search documentation..."
                />
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid gap-8 md:grid-cols-2">
              {categories.map((category, i) => (
                <motion.div
                  key={category.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="border rounded-lg p-6 dark:border-gray-700"
                >
                  <div className="flex items-center mb-4">
                    <div className="mr-3 text-primary">{category.icon}</div>
                    <h2 className="text-xl font-bold">{category.title}</h2>
                  </div>
                  <p className="mb-4 text-muted-foreground">{category.description}</p>
                  <ul className="space-y-2">
                    {category.links.map((link, j) => (
                      <li key={j}>
                        <a 
                          href={link.href} 
                          className="text-primary hover:underline flex items-center"
                        >
                          <span>{link.title}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-12 p-6 border rounded-lg text-center dark:border-gray-700">
              <div className="flex justify-center mb-4">
                <HelpCircle className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Need more help?</h2>
              <p className="text-muted-foreground mb-4">Our support team is here to assist you with any questions.</p>
              <button className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition-colors">
                Contact Support
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default DocumentationPage;

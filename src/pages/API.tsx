
import { motion } from 'framer-motion';
import { Code, Terminal, Lock, Database, Server, Cpu } from 'lucide-react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';

const APIPage = () => {
  const endpoints = [
    {
      method: 'POST',
      path: '/api/fact-check',
      description: 'Submit text for fact checking analysis',
      authentication: 'API Key'
    },
    {
      method: 'GET',
      path: '/api/results/{id}',
      description: 'Retrieve a specific fact check result',
      authentication: 'API Key'
    },
    {
      method: 'GET',
      path: '/api/sources',
      description: 'Get a list of verified sources',
      authentication: 'API Key'
    }
  ];

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
                <Code className="h-12 w-12 text-primary" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">TruthGuard API</h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Integrate our powerful fact-checking capabilities directly into your applications.
              </p>
              
              <div className="mt-8 flex justify-center gap-4">
                <Button size="lg">Get API Key</Button>
                <Button variant="outline" size="lg">View Documentation</Button>
              </div>
            </motion.div>
          </div>
        </section>
        
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Key Features</h2>
              <div className="grid gap-8 md:grid-cols-3">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="p-6 border rounded-lg dark:border-gray-700"
                >
                  <div className="mb-4 text-primary">
                    <Terminal className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">RESTful Endpoints</h3>
                  <p className="text-muted-foreground">Simple and intuitive API designed for developers with clear request and response formats.</p>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="p-6 border rounded-lg dark:border-gray-700"
                >
                  <div className="mb-4 text-primary">
                    <Server className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Comprehensive Analysis</h3>
                  <p className="text-muted-foreground">Access the same powerful analysis engine that powers our web interface.</p>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="p-6 border rounded-lg dark:border-gray-700"
                >
                  <div className="mb-4 text-primary">
                    <Lock className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Secure Authentication</h3>
                  <p className="text-muted-foreground">Industry-standard security with API keys and optional OAuth2 integration.</p>
                </motion.div>
              </div>
            </div>
            
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-6">API Reference</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-800">
                      <th className="px-4 py-3 text-left">Method</th>
                      <th className="px-4 py-3 text-left">Endpoint</th>
                      <th className="px-4 py-3 text-left">Description</th>
                      <th className="px-4 py-3 text-left">Auth</th>
                    </tr>
                  </thead>
                  <tbody>
                    {endpoints.map((endpoint, i) => (
                      <tr key={i} className="border-t dark:border-gray-700">
                        <td className="px-4 py-3 font-mono text-sm">
                          <span className={`inline-block px-2 py-1 rounded ${
                            endpoint.method === 'GET' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                            endpoint.method === 'POST' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                            'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                          }`}>
                            {endpoint.method}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-mono text-sm">{endpoint.path}</td>
                        <td className="px-4 py-3">{endpoint.description}</td>
                        <td className="px-4 py-3">{endpoint.authentication}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div>
              <h2 className="text-3xl font-bold mb-6">Code Example</h2>
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-green-400 font-mono text-sm">
{`// Example API request using fetch
const checkFact = async (text) => {
  const response = await fetch('https://api.truthguard.com/api/fact-check', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_API_KEY'
    },
    body: JSON.stringify({ text })
  });
  
  const result = await response.json();
  console.log(result);
  return result;
}`}
                </pre>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default APIPage;

import { motion, useScroll } from 'framer-motion';
import { Briefcase, Award, Users, Coffee, MapPin, Clock, Zap, Heart } from 'lucide-react';
import { useEffect } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';

const CareersPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const openPositions = [
    {
      title: "Senior Machine Learning Engineer",
      department: "Engineering",
      location: "San Francisco, CA",
      type: "Full-time"
    },
    {
      title: "Product Manager",
      department: "Product",
      location: "Remote",
      type: "Full-time"
    },
    {
      title: "Frontend Developer",
      department: "Engineering",
      location: "New York, NY",
      type: "Full-time"
    },
    {
      title: "Content Verification Specialist",
      department: "Operations",
      location: "Remote",
      type: "Full-time"
    },
    {
      title: "UX/UI Designer",
      department: "Design",
      location: "San Francisco, CA",
      type: "Full-time"
    },
    {
      title: "Marketing Specialist",
      department: "Marketing",
      location: "Remote",
      type: "Full-time"
    }
  ];

  const benefits = [
    {
      icon: <Heart className="h-6 w-6" />,
      title: "Comprehensive Healthcare",
      description: "Medical, dental, and vision coverage for you and your dependents."
    },
    {
      icon: <Coffee className="h-6 w-6" />,
      title: "Work-Life Balance",
      description: "Flexible working hours and generous PTO policy."
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Professional Growth",
      description: "Learning stipend and development opportunities."
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Collaborative Culture",
      description: "Work with talented people who share your passion."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow pt-20">
        <section className="py-16 px-4 md:py-24 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <div className="flex justify-center mb-4">
                <Briefcase className="h-12 w-12 text-primary" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Join Our Team</h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Help us build a more trustworthy information ecosystem.
              </p>
              <div className="mt-8">
                <Button size="lg">View Open Positions</Button>
              </div>
            </motion.div>
          </div>
        </section>
        
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-3xl font-bold mb-4">Why Work With Us</h2>
                <p className="text-muted-foreground mb-4">
                  At TruthGuard, we're on a mission to make verified information accessible to everyone. We're building cutting-edge technology to identify misinformation and promote factual content.
                </p>
                <p className="text-muted-foreground mb-4">
                  Our diverse team brings together experts in artificial intelligence, journalism, and product development. We value collaboration, innovation, and integrity in everything we do.
                </p>
                <p className="text-muted-foreground">
                  If you're passionate about combating misinformation and building technology that makes a positive impact, we'd love to hear from you.
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="rounded-lg overflow-hidden shadow-lg"
              >
                <img 
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                  alt="TruthGuard team collaborating" 
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </div>
          </div>
        </section>
        
        <section className="py-12 px-4 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold mb-4">Benefits & Perks</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We take care of our team so they can focus on making an impact.
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, i) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm"
                >
                  <div className="text-primary mb-4">{benefit.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-12"
            >
              <h2 className="text-3xl font-bold mb-4">Open Positions</h2>
              <p className="text-muted-foreground">
                Join our team and help make a difference. We're always looking for talented individuals to join our mission.
              </p>
            </motion.div>
            
            <div className="space-y-4">
              {openPositions.map((position, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="border rounded-lg p-6 hover:border-primary transition-colors dark:border-gray-700"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold">{position.title}</h3>
                      <p className="text-primary mb-2">{position.department}</p>
                      <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {position.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {position.type}
                        </div>
                      </div>
                    </div>
                    <Button className="mt-4 md:mt-0">Apply Now</Button>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-12 p-6 border rounded-lg text-center dark:border-gray-700"
            >
              <h3 className="text-xl font-bold mb-2">Don't see a position that fits?</h3>
              <p className="text-muted-foreground mb-4">We're always interested in meeting talented people. Send us your resume and tell us how you can contribute.</p>
              <Button variant="outline">Send General Application</Button>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CareersPage;

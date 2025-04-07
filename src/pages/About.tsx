
import { motion } from 'framer-motion';
import { Shield, Users, Award, Target, Clock, Check } from 'lucide-react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const AboutPage = () => {
  const team = [
    {
      name: "Mohd Shadab",
      role: "UI/UX Designer",
      bio: "Generative & Agentic AI Enthusiast | Expert in Digital Design | Student at IIT Madras BS Degree",
      description: "Passionate about creating intuitive user experiences that bridge technology and human needs. Specializes in crafting digital interfaces that enhance information accessibility while maintaining visual appeal. Brings innovative design thinking to combat misinformation through thoughtful UX/UI solutions.",
      image: "/lovable-uploads/dd93cde0-897e-45dc-802d-74e7cff9db5b.png"
    }
  ];

  const values = [
    {
      icon: <Check className="h-6 w-6" />,
      title: "Accuracy",
      description: "We prioritize factual correctness above all, thoroughly verifying information before sharing."
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Transparency",
      description: "We're open about our methods, sources, and limitations to build trust with our users."
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: "Independence",
      description: "We maintain neutrality and are not influenced by political or commercial interests."
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: "Accessibility",
      description: "We make fact-checking tools available to everyone, regardless of technical knowledge."
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
                <Shield className="h-12 w-12 text-primary" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">About TruthGuard</h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Empowering people with reliable information in a world of misinformation.
              </p>
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
                <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
                <p className="text-muted-foreground mb-4">
                  At TruthGuard, we're committed to combating the spread of misinformation by providing powerful, accessible fact-checking tools that help people make informed decisions based on accurate information.
                </p>
                <p className="text-muted-foreground mb-4">
                  Founded in 2023, our team of journalists, data scientists, and technologists work together to develop cutting-edge AI that can analyze and verify information against trusted sources.
                </p>
                <p className="text-muted-foreground">
                  We believe that access to reliable information is essential for healthy public discourse and a functioning democracy. Our vision is a world where everyone can easily distinguish fact from fiction.
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="rounded-lg overflow-hidden shadow-lg"
              >
                <img 
                  src="https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                  alt="TruthGuard team at work" 
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
              <h2 className="text-3xl font-bold mb-4">Our Values</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                These principles guide everything we do at TruthGuard.
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, i) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm"
                >
                  <div className="text-primary mb-4">{value.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
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
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold mb-4">Behind TruthGuard</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Meet the passionate people behind TruthGuard.
              </p>
            </motion.div>
            
            <div className="flex justify-center">
              {team.map((member, i) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="text-center max-w-md"
                >
                  <div className="mb-4 flex justify-center">
                    <Avatar className="w-32 h-32">
                      <AvatarImage src={member.image} alt={member.name} className="object-cover" />
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </div>
                  <h3 className="text-xl font-bold">{member.name}</h3>
                  <p className="text-primary font-medium mb-2">{member.role}</p>
                  <p className="text-muted-foreground">{member.bio}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        <section className="py-12 px-4 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="order-2 md:order-1"
              >
                <h2 className="text-3xl font-bold mb-4">Our Technology</h2>
                <p className="text-muted-foreground mb-4">
                  TruthGuard combines natural language processing, machine learning, and a comprehensive database of verified sources to analyze and fact-check content with high accuracy.
                </p>
                <p className="text-muted-foreground mb-4">
                  Our proprietary algorithms can detect subtle indicators of misinformation, compare statements against verified facts, and provide clear, contextual results that explain our assessment.
                </p>
                <p className="text-muted-foreground">
                  We're continually improving our technology through research and user feedback to stay ahead of evolving misinformation tactics.
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="order-1 md:order-2"
              >
                <div className="rounded-lg overflow-hidden shadow-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1581089778245-3ce67677f718?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                    alt="TruthGuard technology visualization" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;

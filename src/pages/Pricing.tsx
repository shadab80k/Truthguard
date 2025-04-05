
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

const PricingPage = () => {
  const pricingTiers = [
    {
      name: 'Free',
      price: '$0',
      description: 'Basic fact-checking for individuals',
      features: [
        '10 fact checks per day',
        'Basic analysis',
        'Email support',
        'Community access'
      ],
      cta: 'Start Free',
      popular: false
    },
    {
      name: 'Pro',
      price: '$12',
      period: '/month',
      description: 'Advanced tools for professionals',
      features: [
        'Unlimited fact checks',
        'Priority analysis',
        'Advanced source validation',
        'API access',
        'Priority support'
      ],
      cta: 'Get Started',
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'Full suite for organizations',
      features: [
        'Unlimited fact checks',
        'Custom integrations',
        'Dedicated account manager',
        'Analytics dashboard',
        'SLA & training'
      ],
      cta: 'Contact Sales',
      popular: false
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow">
        <section className="py-16 px-4 md:py-24">
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
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Simple, Transparent Pricing</h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Choose the plan that's right for you and start combating misinformation today.
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-3 gap-8 mt-16">
              {pricingTiers.map((tier, i) => (
                <motion.div
                  key={tier.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <Card className={`h-full flex flex-col ${tier.popular ? 'border-primary shadow-lg' : ''}`}>
                    {tier.popular && (
                      <div className="bg-primary text-primary-foreground text-center text-sm py-1 rounded-t-lg">
                        Most Popular
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle>{tier.name}</CardTitle>
                      <div className="mt-4 flex items-baseline">
                        <span className="text-3xl font-bold">{tier.price}</span>
                        {tier.period && <span className="ml-1 text-muted-foreground">{tier.period}</span>}
                      </div>
                      <CardDescription className="mt-2">{tier.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <ul className="space-y-3">
                        {tier.features.map((feature, i) => (
                          <li key={i} className="flex items-center">
                            <Check className="h-4 w-4 text-primary mr-2" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant={tier.popular ? "default" : "outline"} 
                        className="w-full"
                      >
                        {tier.cta}
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default PricingPage;

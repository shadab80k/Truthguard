
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight, Tag } from 'lucide-react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';

const BlogPage = () => {
  const blogPosts = [
    {
      id: 1,
      title: "The Growing Challenge of Deep Fakes in News Media",
      excerpt: "How artificial intelligence is making it harder than ever to distinguish between real and fake news content.",
      category: "Technology",
      date: "April 3, 2025",
      author: "Emma Johnson",
      image: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 2,
      title: "Verified Sources: The Backbone of Digital Trust",
      excerpt: "Why establishing the credibility of information sources is critical in the age of misinformation.",
      category: "Research",
      date: "March 28, 2025",
      author: "David Chen",
      image: "https://images.unsplash.com/photo-1590283603385-c5e24a6751fc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 3,
      title: "Social Media Platforms and Their Role in Information Integrity",
      excerpt: "Examining how major social networks are combating the spread of false information.",
      category: "Social Media",
      date: "March 15, 2025",
      author: "Sophia Williams",
      image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 4,
      title: "Educational Approaches to Building Digital Literacy",
      excerpt: "How schools and educators are teaching students to critically evaluate online information.",
      category: "Education",
      date: "March 5, 2025",
      author: "Michael Brown",
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    }
  ];

  const categories = [
    "Technology", "Research", "Social Media", "Education", "Politics", "Media", "AI"
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
              <h1 className="text-4xl md:text-5xl font-bold mb-4">TruthGuard Blog</h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Insights and analysis on misinformation, fact-checking, and digital literacy.
              </p>
            </motion.div>
          </div>
        </section>
        
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="grid gap-8 md:grid-cols-2">
                  {blogPosts.map((post, i) => (
                    <motion.article 
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                      className="border rounded-lg overflow-hidden dark:border-gray-700"
                    >
                      <img 
                        src={post.image} 
                        alt={post.title} 
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-6">
                        <div className="flex items-center mb-3">
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                            {post.category}
                          </span>
                          <div className="text-xs text-muted-foreground ml-auto flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {post.date}
                          </div>
                        </div>
                        <h2 className="text-xl font-bold mb-2">{post.title}</h2>
                        <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">{post.author}</span>
                          </div>
                          <Button variant="ghost" size="sm" className="flex items-center gap-1">
                            Read more <ArrowRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </div>
                
                <div className="mt-12 flex justify-center">
                  <Button>Load More Articles</Button>
                </div>
              </div>
              
              <div className="space-y-8">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="border rounded-lg p-6 dark:border-gray-700"
                >
                  <h3 className="text-lg font-bold mb-4">Search</h3>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search articles..."
                      className="w-full border rounded px-4 py-2 dark:bg-gray-800 dark:border-gray-700"
                    />
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="border rounded-lg p-6 dark:border-gray-700"
                >
                  <h3 className="text-lg font-bold mb-4">Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category, i) => (
                      <div 
                        key={category}
                        className="flex items-center text-sm px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full"
                      >
                        <Tag className="h-3 w-3 mr-1" />
                        {category}
                      </div>
                    ))}
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="border rounded-lg p-6 dark:border-gray-700"
                >
                  <h3 className="text-lg font-bold mb-4">Subscribe</h3>
                  <p className="text-muted-foreground mb-4">Get the latest articles delivered straight to your inbox.</p>
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="w-full border rounded px-4 py-2 mb-4 dark:bg-gray-800 dark:border-gray-700"
                  />
                  <Button className="w-full">Subscribe</Button>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPage;

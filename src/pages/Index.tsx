
import Dashboard from '@/components/dashboard/Dashboard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, BarChart3, Bell } from 'lucide-react';
import { Card } from '@/components/ui/card';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero section */}
        <section className="relative bg-gradient-to-b from-white to-brand-50 dark:from-gray-900 dark:to-gray-800 pt-16 pb-24 px-4 md:px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                  Make <span className="gradient-text">smarter</span> product decisions
                </h1>
                <p className="text-xl text-muted-foreground">
                  Compare products, find the perfect match for your needs, and stay updated on the latest releases - all powered by AI.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild size="lg" className="font-medium">
                    <Link to="/compare">Compare Products</Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="font-medium">
                    <Link to="/finder">Find Products</Link>
                  </Button>
                </div>
              </div>
              
              <div className="relative md:h-[500px] p-4">
                <div className="relative z-10 transform translate-x-4 -rotate-3">
                  <Card className="overflow-hidden shadow-2xl">
                    <img
                      src="https://placehold.co/600x400/e6f2ff/0284c7?text=Product+Comparison"
                      alt="Product Comparison"
                      className="w-full"
                    />
                  </Card>
                </div>
                <div className="absolute z-0 top-12 right-4 transform rotate-3">
                  <Card className="overflow-hidden shadow-xl">
                    <img
                      src="https://placehold.co/600x400/e6f2ff/0284c7?text=Product+Details"
                      alt="Product Details"
                      className="w-full"
                    />
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features section without Product Updates */}
        <section className="py-16 px-4 md:px-6 bg-white dark:bg-gray-900">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="heading-2 mb-4">Powerful Features</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Our AI-powered tools help you research, compare, and find the best products for your needs.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-8">
              <div className="p-6 border rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow">
                <div className="h-12 w-12 rounded-full bg-brand-100 dark:bg-brand-900 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <h3 className="heading-3 mb-2">Product Comparison</h3>
                <p className="text-muted-foreground mb-4">
                  Compare products side-by-side with detailed analysis of features, specifications, and user experiences.
                </p>
                <Link to="/compare" className="text-brand-600 hover:text-brand-700 font-medium flex items-center">
                  Compare Now <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
              <div className="p-6 border rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow">
                <div className="h-12 w-12 rounded-full bg-brand-100 dark:bg-brand-900 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-4">
                  <Search className="h-6 w-6" />
                </div>
                <h3 className="heading-3 mb-2">Product Finder</h3>
                <p className="text-muted-foreground mb-4">
                  Discover products that match your specific criteria, preferences, and budget requirements.
                </p>
                <Link to="/finder" className="text-brand-600 hover:text-brand-700 font-medium flex items-center">
                  Find Products <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
              {/* Removed Product Updates feature card */}
            </div>
          </div>
        </section>
        
        {/* CTA section */}
        <section className="py-16 px-4 md:px-6 bg-brand-50 dark:bg-gray-800">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col items-center text-center">
              <h2 className="heading-2 mb-4">Ready to make smarter product decisions?</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-3xl">
                Sign up now to save your comparisons, set product update alerts, and personalize your experience.
              </p>
              <Button asChild size="lg">
                <Link to="/login?signup=true">Create Free Account</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;

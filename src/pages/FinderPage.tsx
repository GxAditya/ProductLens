
import ProductFinder from '@/components/finder/ProductFinder';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const FinderPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-12 px-4 container max-w-6xl">
        <div className="space-y-4 mb-8">
          <h1 className="heading-1 gradient-text">Product Finder</h1>
          <p className="text-muted-foreground">
            Find products that match your preferences and requirements. Enter your search criteria below.
          </p>
        </div>
        
        <ProductFinder />
      </main>
      
      <Footer />
    </div>
  );
};

export default FinderPage;

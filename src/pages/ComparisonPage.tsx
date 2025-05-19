
import ComparisonTool from '@/components/comparison/ComparisonTool';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const ComparisonPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-12 px-4 container max-w-6xl">
        <div className="space-y-4 mb-8">
          <h1 className="heading-1 gradient-text">Product Comparison</h1>
          <p className="text-muted-foreground">
            Compare products side-by-side to make an informed purchasing decision. Enter the products you want to compare below.
          </p>
        </div>
        
        <ComparisonTool />
      </main>
      
      <Footer />
    </div>
  );
};

export default ComparisonPage;

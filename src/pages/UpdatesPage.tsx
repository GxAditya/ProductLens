
import ProductUpdates from '@/components/updates/ProductUpdates';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const UpdatesPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-12 px-4 container max-w-6xl">
        <div className="space-y-4 mb-8">
          <h1 className="heading-1 gradient-text">Product Updates</h1>
          <p className="text-muted-foreground">
            Stay informed about the latest product releases, updates, and announcements in your favorite categories.
          </p>
        </div>
        
        <ProductUpdates />
      </main>
      
      <Footer />
    </div>
  );
};

export default UpdatesPage;

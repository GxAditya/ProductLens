
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, ArrowRight, Settings } from 'lucide-react';
import ProductCard from '@/components/ui/ProductCard';
import productApiService, { Product } from '@/utils/productApiService';

const Dashboard = () => {
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [recentUpdates, setRecentUpdates] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingUpdates, setLoadingUpdates] = useState(true);
  const [errorProducts, setErrorProducts] = useState<string | null>(null);
  const [errorUpdates, setErrorUpdates] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecentProducts = async () => {
      try {
        setLoadingProducts(true);
        const products = await productApiService.findProducts('recent products'); // Using a generic criteria
        setRecentProducts(products.slice(0, 3)); // Limit to 3 as before
      } catch (error) {
        console.error('Error fetching recent products:', error);
        setErrorProducts('Failed to load recent products.');
      } finally {
        setLoadingProducts(false);
      }
    };

    const fetchRecentUpdates = async () => {
      try {
        setLoadingUpdates(true);
        const updates = await productApiService.getProductUpdates('Technology'); // Using a default category
        setRecentUpdates(updates.slice(0, 2)); // Limit to 2 as before
      } catch (error) {
        console.error('Error fetching recent updates:', error);
        setErrorUpdates('Failed to load recent updates.');
      } finally {
        setLoadingUpdates(false);
      }
    };

    fetchRecentProducts();
    fetchRecentUpdates();
  }, []);

  // Mock data
  const savedComparisons = [
    {
      id: 1,
      product1: 'iPhone 13 Pro',
      product2: 'Samsung Galaxy S21',
      date: '2025-05-15',
    },
    {
      id: 2,
      product1: 'Sony WH-1000XM4',
      product2: 'Bose QuietComfort 45',
      date: '2025-05-10',
    },
  ];

  // Mock data for recent products and updates
  // const recentProducts = productApiService.getMockProductFinderResults('').slice(0, 3);
  // const recentUpdates = productApiService.getMockProductFinderResults('').slice(0, 2);



  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="heading-1 gradient-text">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your product research.
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Quick Actions</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-base">Compare Products</CardTitle>
                <CardDescription>
                  Compare features, prices, and reviews between two products
                </CardDescription>
              </CardHeader>
              <CardFooter className="p-4 pt-2">
                <Button asChild>
                  <Link to="/compare">
                    <Search className="mr-2 h-4 w-4" />
                    Start Comparison
                  </Link>
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-base">Find Products</CardTitle>
                <CardDescription>
                  Search for products based on your preferences
                </CardDescription>
              </CardHeader>
              <CardFooter className="p-4 pt-2">
                <Button asChild>
                  <Link to="/finder">
                    <Search className="mr-2 h-4 w-4" />
                    Find Products
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recommended Products</CardTitle>
            <CardDescription>
              Products matching your preferences and search history
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingProducts ? (
              <p className="text-sm text-muted-foreground">Loading products...</p>
            ) : errorProducts ? (
              <p className="text-sm text-red-500">{errorProducts}</p>
            ) : recentProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {recentProducts.map((product) => (
                  <ProductCard key={product.id} product={product} className="h-full" />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No recommended products found.</p>
            )}
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link to="/finder">Find More Products</Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Comparisons</CardTitle>
            <CardDescription>
              Your recently compared products
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {savedComparisons.length > 0 ? (
                savedComparisons.map((comparison) => (
                  <Card key={comparison.id} className="p-3">
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-muted-foreground">
                          {formatDate(comparison.date)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 font-medium truncate">
                          {comparison.product1}
                        </div>
                        <div className="text-muted-foreground">vs</div>
                        <div className="flex-1 font-medium truncate text-right">
                          {comparison.product2}
                        </div>
                      </div>
                      <div className="pt-2">
                        <Button 
                          asChild
                          variant="outline" 
                          size="sm" 
                          className="w-full text-xs"
                        >
                          <Link to={`/compare?product1=${encodeURIComponent(comparison.product1)}&product2=${encodeURIComponent(comparison.product2)}`}>
                            View Comparison
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No recent comparisons found
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link to="/compare">View All Comparisons</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

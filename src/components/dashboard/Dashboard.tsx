
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, ArrowRight, Settings } from 'lucide-react';
import ProductCard from '@/components/ui/ProductCard';
import perplexityService from '@/utils/perplexityService';

const Dashboard = () => {
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [apiKeySet, setApiKeySet] = useState(!!localStorage.getItem('perplexity_api_key'));
  
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
  
  const recentProducts = perplexityService.getMockProductFinderResults('').slice(0, 3);
  const recentUpdates = perplexityService.getMockProductUpdates('').slice(0, 2);

  const handleSetApiKey = () => {
    if (apiKeyInput.trim()) {
      perplexityService.setApiKey(apiKeyInput.trim());
      setApiKeySet(true);
    }
  };

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
        
        {!apiKeySet && (
          <Card className="mt-4 md:mt-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Set Perplexity API Key</CardTitle>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex gap-2">
                <input
                  type="password"
                  placeholder="API Key"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  className="flex-1 py-1 px-2 text-sm border rounded"
                />
                <Button size="sm" onClick={handleSetApiKey}>Save</Button>
              </div>
            </CardContent>
          </Card>
        )}
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
            <CardTitle>Recent Updates</CardTitle>
            <CardDescription>
              Latest product releases and updates
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentUpdates.map((update) => (
              <div key={update.id} className="border-b pb-4 last:border-0 last:pb-0">
                <div className="flex justify-between items-start mb-1">
                  <p className="font-medium">{update.productName}</p>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(update.date)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                  {update.description}
                </p>
                <Link to="/updates" className="text-xs text-brand-600 hover:underline flex items-center">
                  Read more <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link to="/updates">View All Updates</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Recommended Products</CardTitle>
            <CardDescription>
              Products matching your preferences and search history
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {recentProducts.map((product) => (
                <ProductCard key={product.id} product={product} className="h-full" />
              ))}
            </div>
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
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link to="/compare">Compare Products</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;


import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import perplexityService from '@/utils/perplexityService';
import { Search } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

const ComparisonTool = () => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  const [product1, setProduct1] = useState(searchParams.get('product1') || '');
  const [product2, setProduct2] = useState(searchParams.get('product2') || '');
  const [isLoading, setIsLoading] = useState(false);
  const [comparisonData, setComparisonData] = useState<any>(null);
  const [apiKeySet, setApiKeySet] = useState(false);
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    const storedApiKey = localStorage.getItem('perplexity_api_key');
    if (storedApiKey) {
      setApiKeySet(true);
    }
    
    // If both products are in URL params, auto-compare
    if (searchParams.get('product1') && searchParams.get('product2')) {
      handleCompare();
    }
  }, []);

  const handleSetApiKey = () => {
    if (apiKey.trim()) {
      perplexityService.setApiKey(apiKey.trim());
      setApiKeySet(true);
      toast({
        title: "API Key Saved",
        description: "Your Perplexity API key has been saved."
      });
    }
  };

  const handleCompare = async () => {
    if (!product1 || !product2) {
      toast({
        title: "Missing Products",
        description: "Please enter both products to compare.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In production, this would use the actual API
      // For now, we'll use mock data
      const result = perplexityService.getMockComparisonData(product1, product2);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setComparisonData(result);
    } catch (error) {
      console.error(error);
      toast({
        title: "Comparison Failed",
        description: "Failed to compare products. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const MetricBar = ({ name, score1, score2 }: { name: string, score1: number, score2: number }) => {
    const max = Math.max(score1, score2);
    const product1Percent = (score1 / 10) * 100;
    const product2Percent = (score2 / 10) * 100;
    
    return (
      <div className="space-y-1">
        <div className="flex justify-between text-sm">
          <span>{name}</span>
          <div className="flex gap-4">
            <span className="text-brand-600">{score1}/10</span>
            <span className="text-brand-800">{score2}/10</span>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <div className="h-2 flex-1 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-brand-600 rounded-full" 
              style={{ width: `${product1Percent}%` }}
            />
          </div>
          <div className="h-2 flex-1 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-brand-800 rounded-full" 
              style={{ width: `${product2Percent}%` }}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {!apiKeySet && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Set Your Perplexity API Key</CardTitle>
            <CardDescription>
              A Perplexity API key is required to use the comparison tool. You can get one from the Perplexity website.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                type="password"
                placeholder="Enter your Perplexity API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleSetApiKey}>Save Key</Button>
            </div>
            <p className="text-sm text-muted-foreground">
              For demo purposes, you can continue without an API key. Mock data will be used instead.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={() => setApiKeySet(true)}>
              Continue with Mock Data
            </Button>
          </CardFooter>
        </Card>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>Compare Products</CardTitle>
          <CardDescription>
            Enter two products to see a detailed comparison of their features, specifications, and user experiences.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="product1" className="text-sm font-medium">
                First Product
              </label>
              <div className="flex gap-2">
                <Input
                  id="product1"
                  placeholder="e.g., iPhone 13 Pro"
                  value={product1}
                  onChange={(e) => setProduct1(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="product2" className="text-sm font-medium">
                Second Product
              </label>
              <div className="flex gap-2">
                <Input
                  id="product2"
                  placeholder="e.g., Samsung Galaxy S21"
                  value={product2}
                  onChange={(e) => setProduct2(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleCompare}
            disabled={isLoading || !product1 || !product2}
            className="w-full"
          >
            {isLoading ? (
              <>
                <span className="mr-2">Comparing Products...</span>
                <Progress value={65} className="w-16 h-2" />
              </>
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                Compare Products
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
      
      {comparisonData && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Comparison Results</h2>
            <Button variant="outline" size="sm" onClick={() => setComparisonData(null)}>
              Reset
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product 1 Card */}
            <Card>
              <CardHeader className="pb-2">
                <div className="aspect-video w-full bg-muted rounded-md overflow-hidden">
                  <img 
                    src={comparisonData.product1.imageUrl}
                    alt={comparisonData.product1.name}
                    className="h-full w-full object-contain"
                  />
                </div>
                <CardTitle className="mt-4">{comparisonData.product1.name}</CardTitle>
                <CardDescription className="text-lg font-medium text-brand-600">
                  {comparisonData.product1.price}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="features" className="w-full">
                  <TabsList className="w-full grid grid-cols-3">
                    <TabsTrigger value="features">Features</TabsTrigger>
                    <TabsTrigger value="pros">Pros</TabsTrigger>
                    <TabsTrigger value="cons">Cons</TabsTrigger>
                  </TabsList>
                  <TabsContent value="features" className="space-y-2 mt-4">
                    <ul className="space-y-2">
                      {comparisonData.product1.keyFeatures.map((feature: string, index: number) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-brand-600" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </TabsContent>
                  <TabsContent value="pros" className="space-y-2 mt-4">
                    <ul className="space-y-2">
                      {comparisonData.product1.pros.map((pro: string, index: number) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </TabsContent>
                  <TabsContent value="cons" className="space-y-2 mt-4">
                    <ul className="space-y-2">
                      {comparisonData.product1.cons.map((con: string, index: number) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                          {con}
                        </li>
                      ))}
                    </ul>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">Ideal for:</span> {comparisonData.product1.idealFor}
                </p>
              </CardFooter>
            </Card>
            
            {/* Product 2 Card */}
            <Card>
              <CardHeader className="pb-2">
                <div className="aspect-video w-full bg-muted rounded-md overflow-hidden">
                  <img 
                    src={comparisonData.product2.imageUrl}
                    alt={comparisonData.product2.name}
                    className="h-full w-full object-contain"
                  />
                </div>
                <CardTitle className="mt-4">{comparisonData.product2.name}</CardTitle>
                <CardDescription className="text-lg font-medium text-brand-800">
                  {comparisonData.product2.price}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="features" className="w-full">
                  <TabsList className="w-full grid grid-cols-3">
                    <TabsTrigger value="features">Features</TabsTrigger>
                    <TabsTrigger value="pros">Pros</TabsTrigger>
                    <TabsTrigger value="cons">Cons</TabsTrigger>
                  </TabsList>
                  <TabsContent value="features" className="space-y-2 mt-4">
                    <ul className="space-y-2">
                      {comparisonData.product2.keyFeatures.map((feature: string, index: number) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-brand-800" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </TabsContent>
                  <TabsContent value="pros" className="space-y-2 mt-4">
                    <ul className="space-y-2">
                      {comparisonData.product2.pros.map((pro: string, index: number) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </TabsContent>
                  <TabsContent value="cons" className="space-y-2 mt-4">
                    <ul className="space-y-2">
                      {comparisonData.product2.cons.map((con: string, index: number) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                          {con}
                        </li>
                      ))}
                    </ul>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">Ideal for:</span> {comparisonData.product2.idealFor}
                </p>
              </CardFooter>
            </Card>
          </div>
          
          {/* Metrics Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Comparison</CardTitle>
              <CardDescription>Side-by-side comparison of key metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <Badge 
                  variant="outline" 
                  className="border-brand-600 text-brand-600 font-medium"
                >
                  {comparisonData.product1.name}
                </Badge>
                <Badge 
                  variant="outline" 
                  className="border-brand-800 text-brand-800 font-medium"
                >
                  {comparisonData.product2.name}
                </Badge>
              </div>
              <div className="space-y-3">
                {comparisonData.comparisonMetrics.map((metric: any, index: number) => (
                  <MetricBar 
                    key={index}
                    name={metric.name}
                    score1={metric.product1Score}
                    score2={metric.product2Score}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ComparisonTool;

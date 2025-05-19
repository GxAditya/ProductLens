
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import productApiService from '@/utils/productApiService';
import { Search } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

const ComparisonTool = () => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  const [product1, setProduct1] = useState(searchParams.get('product1') || '');
  const [product2, setProduct2] = useState(searchParams.get('product2') || '');
  const [isLoading, setIsLoading] = useState(false);
  const [comparisonData, setComparisonData] = useState<any>(null);

  useEffect(() => {
    // If both products are in URL params, auto-compare
    if (searchParams.get('product1') && searchParams.get('product2')) {
      handleCompare();
    }
  }, []);



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
      // Use our backend API service
      const result = await productApiService.compareProducts(product1, product2);
      
      setComparisonData(result);
    } catch (error) {
      console.error(error);
      toast({
        title: "Comparison Failed",
        description: error instanceof Error ? error.message : "Failed to compare products. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const MetricBar = ({ name, score1, score2 }: { name: string, score1: number, score2: number }) => {
    const max = Math.max(score1, score2, 1); // Avoid division by zero
    const product1Percent = (score1 / max) * 100;
    const product2Percent = (score2 / max) * 100;
    return (
      <div className="space-y-1">
        <div className="flex justify-between text-sm">
          <span>{name}</span>
        </div>
        <div className="flex gap-2 items-end">
          <div className="flex flex-col items-center flex-1">
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden mb-1">
              <div 
                className="h-full bg-brand-600 rounded-full" 
                style={{ width: `${product1Percent}%` }}
              />
            </div>
            <span className="text-brand-600 text-xs mt-1">{score1}</span>
          </div>
          <div className="flex flex-col items-center flex-1">
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden mb-1">
              <div 
                className="h-full bg-brand-800 rounded-full" 
                style={{ width: `${product2Percent}%` }}
              />
            </div>
            <span className="text-brand-800 text-xs mt-1">{score2}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
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
      
      {comparisonData && comparisonData.product1 && comparisonData.product2 ? (
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
                <CardTitle className="mt-4">{comparisonData?.product1?.name || "N/A"}</CardTitle>
                <CardDescription className="text-lg font-medium text-brand-600">
                  {comparisonData?.product1?.price || "N/A"}
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
                      {comparisonData?.product1?.keyFeatures?.length ? comparisonData.product1.keyFeatures.map((feature: string, index: number) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-brand-600" />
                          {feature}
                        </li>
                      )) : <li className="text-muted-foreground">No features available</li>}
                    </ul>
                  </TabsContent>
                  <TabsContent value="pros" className="space-y-2 mt-4">
                    <ul className="space-y-2">
                      {comparisonData?.product1?.pros?.length ? comparisonData.product1.pros.map((pro: string, index: number) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                          {pro}
                        </li>
                      )) : <li className="text-muted-foreground">No pros available</li>}
                    </ul>
                  </TabsContent>
                  <TabsContent value="cons" className="space-y-2 mt-4">
                    <ul className="space-y-2">
                      {comparisonData?.product1?.cons?.length ? comparisonData.product1.cons.map((con: string, index: number) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                          {con}
                        </li>
                      )) : <li className="text-muted-foreground">No cons available</li>}
                    </ul>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">Ideal for:</span> {comparisonData?.product1?.idealFor || "N/A"}
                </p>
              </CardFooter>
            </Card>
            {/* Product 2 Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="mt-4">{comparisonData?.product2?.name || "N/A"}</CardTitle>
                <CardDescription className="text-lg font-medium text-brand-800">
                  {comparisonData?.product2?.price || "N/A"}
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
                      {comparisonData?.product2?.keyFeatures?.length ? comparisonData.product2.keyFeatures.map((feature: string, index: number) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-brand-800" />
                          {feature}
                        </li>
                      )) : <li className="text-muted-foreground">No features available</li>}
                    </ul>
                  </TabsContent>
                  <TabsContent value="pros" className="space-y-2 mt-4">
                    <ul className="space-y-2">
                      {comparisonData?.product2?.pros?.length ? comparisonData.product2.pros.map((pro: string, index: number) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                          {pro}
                        </li>
                      )) : <li className="text-muted-foreground">No pros available</li>}
                    </ul>
                  </TabsContent>
                  <TabsContent value="cons" className="space-y-2 mt-4">
                    <ul className="space-y-2">
                      {comparisonData?.product2?.cons?.length ? comparisonData.product2.cons.map((con: string, index: number) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                          {con}
                        </li>
                      )) : <li className="text-muted-foreground">No cons available</li>}
                    </ul>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">Ideal for:</span> {comparisonData?.product2?.idealFor || "N/A"}
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
                  {comparisonData?.product1?.name || "Product 1"}
                </Badge>
                <Badge 
                  variant="outline" 
                  className="border-brand-800 text-brand-800 font-medium"
                >
                  {comparisonData?.product2?.name || "Product 2"}
                </Badge>
              </div>
              <div className="space-y-3">
                {comparisonData?.comparisonMetrics?.length ? comparisonData.comparisonMetrics.map((metric: any, index: number) => (
                  <MetricBar 
                    key={index}
                    name={metric.name}
                    score1={metric.product1Score}
                    score2={metric.product2Score}
                  />
                )) : <div className="text-muted-foreground">No metrics available</div>}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  );
};

export default ComparisonTool;

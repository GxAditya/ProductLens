
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import perplexityService from '@/utils/perplexityService';
import { toast } from 'sonner';
import { Calendar, Filter, Bell } from 'lucide-react';

const ProductUpdates = () => {
  const categories = ["Smartphones", "Laptops", "Audio", "Wearables", "Gaming", "Photography"];

  const [selectedCategory, setSelectedCategory] = useState("Smartphones");
  const [updates, setUpdates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [subscribed, setSubscribed] = useState<string[]>([]);
  const [apiKeySet, setApiKeySet] = useState(false);
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    const storedApiKey = localStorage.getItem('perplexity_api_key');
    if (storedApiKey) {
      setApiKeySet(true);
    }
    
    // Load initial updates
    loadUpdates(selectedCategory);
    
    // Load subscribed categories from localStorage
    const savedSubscriptions = localStorage.getItem('subscribed_categories');
    if (savedSubscriptions) {
      setSubscribed(JSON.parse(savedSubscriptions));
    }
  }, []);

  const handleSetApiKey = () => {
    if (apiKey.trim()) {
      perplexityService.setApiKey(apiKey.trim());
      setApiKeySet(true);
      toast.success("API Key Saved");
    }
  };

  const loadUpdates = async (category: string) => {
    setIsLoading(true);
    
    try {
      // In production, this would use the actual API
      // For now, we'll use mock data
      const updates = perplexityService.getMockProductUpdates(category);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUpdates(updates);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load updates. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    loadUpdates(category);
  };

  const toggleSubscription = (category: string) => {
    let newSubscribed;
    
    if (subscribed.includes(category)) {
      newSubscribed = subscribed.filter(c => c !== category);
      toast.success(`Unsubscribed from ${category} updates`);
    } else {
      newSubscribed = [...subscribed, category];
      toast.success(`Subscribed to ${category} updates`);
    }
    
    setSubscribed(newSubscribed);
    localStorage.setItem('subscribed_categories', JSON.stringify(newSubscribed));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-6">
      {!apiKeySet && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Set Your Perplexity API Key</CardTitle>
            <CardDescription>
              A Perplexity API key is required to use the product updates feature. You can get one from the Perplexity website.
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
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-3/4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Product Updates</CardTitle>
                  <CardDescription>
                    Latest product releases and updates in the {selectedCategory} category
                  </CardDescription>
                </div>
                <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse space-y-3">
                      <div className="h-2.5 bg-muted rounded-full w-48"></div>
                      <div className="h-2 bg-muted rounded-full w-full max-w-[480px]"></div>
                      <div className="h-2 bg-muted rounded-full max-w-[440px]"></div>
                      <div className="h-2 bg-muted rounded-full max-w-[460px]"></div>
                      <div className="flex items-center pt-2">
                        <div className="h-2.5 bg-muted rounded-full w-32"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : updates.length > 0 ? (
                <div className="space-y-6">
                  {updates.map((update) => (
                    <Card key={update.id} className="overflow-hidden">
                      <div className="md:flex">
                        <div className="md:w-1/3 bg-muted">
                          <img
                            src={update.imageUrl}
                            alt={update.productName}
                            className="w-full h-full object-cover aspect-square md:aspect-auto"
                          />
                        </div>
                        <div className="p-4 md:p-6 md:w-2/3">
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant={update.updateType === "New Release" ? "default" : "outline"}>
                              {update.updateType}
                            </Badge>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Calendar className="h-3 w-3 mr-1" />
                              {formatDate(update.date)}
                            </div>
                          </div>
                          <h3 className="text-xl font-bold mb-2">{update.productName}</h3>
                          <p className="text-muted-foreground mb-4">
                            {update.description}
                          </p>
                          <h4 className="font-medium mb-2">Highlights:</h4>
                          <ul className="space-y-1 mb-4">
                            {update.highlights.map((highlight: string, index: number) => (
                              <li key={index} className="flex items-center gap-2 text-sm">
                                <div className="w-1.5 h-1.5 rounded-full bg-brand-600" />
                                {highlight}
                              </li>
                            ))}
                          </ul>
                          <div className="flex justify-end">
                            <Button variant="outline" size="sm">
                              Read More
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium mb-2">No updates found</h3>
                  <p className="text-muted-foreground">
                    There are no recent updates for the {selectedCategory} category
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="w-full md:w-1/4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Bell className="h-4 w-4" />
                My Subscriptions
              </CardTitle>
              <CardDescription>
                Get notified about updates in these categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {categories.map((category) => {
                  const isSubscribed = subscribed.includes(category);
                  
                  return (
                    <Button
                      key={category}
                      variant={isSubscribed ? "default" : "outline"}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => toggleSubscription(category)}
                    >
                      {category}
                      <span className="ml-auto">
                        {isSubscribed ? "✓" : "+"}
                      </span>
                    </Button>
                  );
                })}
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-xs text-muted-foreground">
                You'll receive notifications for your subscribed categories when signed in
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductUpdates;

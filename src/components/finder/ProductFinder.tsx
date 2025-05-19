
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Search, Filter } from 'lucide-react';
import ProductCard from '@/components/ui/ProductCard';
import perplexityService, { Product } from '@/utils/perplexityService';
import { toast } from 'sonner';

const ProductFinder = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [sort, setSort] = useState('relevance');
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [apiKeySet, setApiKeySet] = useState(false);
  const [apiKey, setApiKey] = useState('');

  // Mock categories and brands
  const categories = ['Electronics', 'Audio', 'Wearables', 'Computers', 'Photography'];
  const brands = ['TechBrand', 'CompuTech', 'SoundMax', 'FitTech', 'PhotoPro'];

  useEffect(() => {
    const storedApiKey = localStorage.getItem('perplexity_api_key');
    if (storedApiKey) {
      setApiKeySet(true);
    }
  }, []);

  const handleSetApiKey = () => {
    if (apiKey.trim()) {
      perplexityService.setApiKey(apiKey.trim());
      setApiKeySet(true);
      toast.success("API Key Saved");
    }
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand)
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };

  const handleSearch = async () => {
    if (!searchQuery) {
      toast.error("Please enter a search query");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In production, this would use the actual API
      // For now, we'll use mock data
      const results = perplexityService.getMockProductFinderResults(searchQuery);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Apply filters
      let filteredResults = results;
      
      if (selectedCategories.length > 0) {
        filteredResults = filteredResults.filter(product => 
          selectedCategories.includes(product.category)
        );
      }
      
      if (selectedBrands.length > 0) {
        filteredResults = filteredResults.filter(product => 
          selectedBrands.includes(product.brand)
        );
      }
      
      // Apply price filter - assuming price is a string like "$100-$200"
      filteredResults = filteredResults.filter(product => {
        const priceMatch = product.price.match(/\$(\d+)(?:-\$(\d+))?/);
        if (priceMatch) {
          const minPrice = parseInt(priceMatch[1], 10);
          const maxPrice = priceMatch[2] ? parseInt(priceMatch[2], 10) : minPrice;
          return maxPrice >= priceRange[0] && minPrice <= priceRange[1];
        }
        return true;
      });
      
      // Apply sorting
      if (sort === 'price-low') {
        filteredResults.sort((a, b) => {
          const aPrice = parseInt(a.price.replace(/[^\d]/g, ''), 10);
          const bPrice = parseInt(b.price.replace(/[^\d]/g, ''), 10);
          return aPrice - bPrice;
        });
      } else if (sort === 'price-high') {
        filteredResults.sort((a, b) => {
          const aPrice = parseInt(a.price.replace(/[^\d]/g, ''), 10);
          const bPrice = parseInt(b.price.replace(/[^\d]/g, ''), 10);
          return bPrice - aPrice;
        });
      } else if (sort === 'rating') {
        filteredResults.sort((a, b) => b.rating - a.rating);
      }
      
      setResults(filteredResults);
    } catch (error) {
      console.error(error);
      toast.error("Failed to search products. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {!apiKeySet && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Set Your Perplexity API Key</CardTitle>
            <CardDescription>
              A Perplexity API key is required to use the product finder. You can get one from the Perplexity website.
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
          <CardTitle>Find Products</CardTitle>
          <CardDescription>
            Search for products that match your preferences and requirements.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="What are you looking for? (e.g., laptop with long battery life under $1000)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button variant="outline" onClick={() => setFiltersVisible(!filtersVisible)}>
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
            <Button onClick={handleSearch} disabled={isLoading}>
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
          
          {filtersVisible && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4 animate-fade-in">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Price Range</h3>
                  <div className="flex justify-between mb-2 text-sm">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                  <Slider
                    defaultValue={priceRange}
                    max={2000}
                    step={100}
                    onValueChange={(value) => setPriceRange(value as [number, number])}
                  />
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Sort By</h3>
                  <Select value={sort} onValueChange={setSort}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">Relevance</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="rating">Customer Rating</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Categories</h3>
                <div className="space-y-2">
                  {categories.map(category => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`category-${category}`}
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={() => toggleCategory(category)}
                      />
                      <Label htmlFor={`category-${category}`}>{category}</Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Brands</h3>
                <div className="space-y-2">
                  {brands.map(brand => (
                    <div key={brand} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`brand-${brand}`}
                        checked={selectedBrands.includes(brand)}
                        onCheckedChange={() => toggleBrand(brand)}
                      />
                      <Label htmlFor={`brand-${brand}`}>{brand}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          {selectedCategories.length > 0 || selectedBrands.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {selectedCategories.map(category => (
                <Badge key={category} variant="outline" className="flex items-center gap-1">
                  {category}
                  <button
                    onClick={() => toggleCategory(category)}
                    className="ml-1 rounded-full hover:bg-muted p-0.5"
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Remove {category} filter</span>
                  </button>
                </Badge>
              ))}
              {selectedBrands.map(brand => (
                <Badge key={brand} variant="outline" className="flex items-center gap-1">
                  {brand}
                  <button
                    onClick={() => toggleBrand(brand)}
                    className="ml-1 rounded-full hover:bg-muted p-0.5"
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Remove {brand} filter</span>
                  </button>
                </Badge>
              ))}
              <Button
                variant="link"
                size="sm"
                className="h-auto p-0 text-xs"
                onClick={() => {
                  setSelectedCategories([]);
                  setSelectedBrands([]);
                }}
              >
                Clear All
              </Button>
            </div>
          ) : null}
        </CardFooter>
      </Card>
      
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center space-y-4">
            <div className="animate-pulse flex space-x-4">
              <div className="flex-1 space-y-6 py-1">
                <div className="h-2 bg-muted rounded"></div>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="h-2 bg-muted rounded col-span-2"></div>
                    <div className="h-2 bg-muted rounded col-span-1"></div>
                  </div>
                  <div className="h-2 bg-muted rounded"></div>
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Searching for products...</p>
          </div>
        </div>
      )}
      
      {results.length > 0 && !isLoading && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Search Results</h2>
            <p className="text-sm text-muted-foreground">{results.length} products found</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
      
      {!isLoading && results.length === 0 && searchQuery && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">No products found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};

export default ProductFinder;

// Import needed components
import { X } from 'lucide-react';

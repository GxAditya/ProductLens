
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
import productApiService, { Product } from '@/utils/productApiService';
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

  // Mock categories and brands
  const categories = ['Electronics', 'Audio', 'Wearables', 'Computers', 'Photography'];
  const brands = ['TechBrand', 'CompuTech', 'SoundMax', 'FitTech', 'PhotoPro'];




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
      // Build search criteria string including filters
      let criteriaString = searchQuery;
      
      // Add price range to criteria
      if (priceRange[0] > 0 || priceRange[1] < 2000) {
        criteriaString += ` with price range $${priceRange[0]}-$${priceRange[1]}`;
      }
      
      // Add categories to criteria
      if (selectedCategories.length > 0) {
        criteriaString += ` in categories: ${selectedCategories.join(', ')}`;
      }
      
      // Add brands to criteria
      if (selectedBrands.length > 0) {
        criteriaString += ` from brands: ${selectedBrands.join(', ')}`;
      }
      
      // Use our backend API service
      const results = await productApiService.findProducts(criteriaString);
      
      // Apply additional client-side filtering if needed
      let filteredResults = results;
      
      // Apply price filter for any results that might not match the API filtering
      filteredResults = filteredResults.filter(product => {
        const priceMatch = product.price.match(/\$(\d+)(?:-\$(\d+))?/);
        if (priceMatch) {
          const minPrice = parseInt(priceMatch[1], 10);
          const maxPrice = priceMatch[2] ? parseInt(priceMatch[2], 10) : minPrice;
          
          return maxPrice >= priceRange[0] && minPrice <= priceRange[1];
        }
        return true;
      });
      
      // Sort results based on selected sort option
      if (sort === 'price-low') {
        filteredResults.sort((a, b) => {
          const aPrice = parseInt(a.price.match(/\$(\d+)/)?.[1] || '0', 10);
          const bPrice = parseInt(b.price.match(/\$(\d+)/)?.[1] || '0', 10);
          return aPrice - bPrice;
        });
      } else if (sort === 'price-high') {
        filteredResults.sort((a, b) => {
          const aPrice = parseInt(a.price.match(/\$(\d+)/)?.[1] || '0', 10);
          const bPrice = parseInt(b.price.match(/\$(\d+)/)?.[1] || '0', 10);
          return bPrice - aPrice;
        });
      } else if (sort === 'rating') {
        filteredResults.sort((a, b) => b.rating - a.rating);
      } else if (sort === 'relevance') {
        // No client-side sorting for relevance, rely on API
      }
      
      // Add placeholder images if not provided by API
      filteredResults = filteredResults.map(product => {
        if (!product.imageUrl || product.imageUrl === '/placeholder.svg') { // Also check for default placeholder
          return {
            ...product,
            imageUrl: `https://placehold.co/300x300/e6f2ff/0284c7?text=${encodeURIComponent(product.name)}`
          };
        }
        return product;
      });
      
      setResults(filteredResults);
    } catch (error) {
      console.error(error);
      toast.error("Failed to find products. Please try again.");
      
      // Fall back to mock data in development
      // if (process.env.NODE_ENV === 'development') {
      //   const mockResults = perplexityService.getMockProductFinderResults(searchQuery);
      //   setResults(mockResults);
      // }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
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

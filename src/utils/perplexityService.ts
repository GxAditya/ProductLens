
import { toast } from "sonner";

interface PerplexityConfig {
  apiKey: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  features: string[];
  category: string;
  brand: string;
  rating: number;
  releaseDate: string;
  imageUrl: string;
}

const DEFAULT_CONFIG: PerplexityConfig = {
  apiKey: '', // In production, should be stored securely
  model: 'llama-3.1-sonar-small-128k-online',
  temperature: 0.2,
  maxTokens: 1000,
};

class PerplexityService {
  private config: PerplexityConfig;
  
  constructor(config: Partial<PerplexityConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }
  
  setApiKey(apiKey: string) {
    this.config.apiKey = apiKey;
    localStorage.setItem('perplexity_api_key', apiKey);
  }
  
  getApiKey(): string {
    if (this.config.apiKey) {
      return this.config.apiKey;
    }
    
    const storedKey = localStorage.getItem('perplexity_api_key');
    if (storedKey) {
      this.config.apiKey = storedKey;
      return storedKey;
    }
    
    return '';
  }
  
  async queryPerplexity(message: string): Promise<any> {
    const apiKey = this.getApiKey();
    
    if (!apiKey) {
      toast.error("API key not found. Please set your Perplexity API key first.");
      throw new Error("API key not found");
    }
    
    try {
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.config.model,
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant that provides detailed, accurate information about products. Return structured data in a consistent format.'
            },
            {
              role: 'user',
              content: message
            }
          ],
          temperature: this.config.temperature,
          max_tokens: this.config.maxTokens,
          return_images: false,
          return_related_questions: false,
          search_domain_filter: ['perplexity.ai'],
          search_recency_filter: 'month',
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to query Perplexity API');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error querying Perplexity API:', error);
      throw error;
    }
  }
  
  async compareProducts(product1: string, product2: string): Promise<any> {
    const prompt = `Compare these products in detail: "${product1}" and "${product2}". Include: price ranges, key features, performance metrics, pros and cons, and which types of users each product is best for. Format the response as structured data that can be easily parsed.`;
    
    return this.queryPerplexity(prompt);
  }
  
  async findProducts(criteria: string): Promise<any> {
    const prompt = `Find products that match these criteria: ${criteria}. For each product, provide the name, a brief description, key features, approximate price range, and pros/cons. Limit to 5 best matches. Format the response as structured data that can be easily parsed.`;
    
    return this.queryPerplexity(prompt);
  }
  
  async getProductUpdates(category: string): Promise<any> {
    const prompt = `What are the latest product releases, updates, or announcements in the ${category} category in the last 3 months? For each, include the product name, release/update date, key new features or changes, and who this product is ideal for. Format the response as structured data that can be easily parsed.`;
    
    return this.queryPerplexity(prompt);
  }
  
  // Mock methods for development before API key is available
  getMockComparisonData(product1: string, product2: string): any {
    return {
      product1: {
        name: product1,
        price: "$899-$1099",
        rating: 4.5,
        keyFeatures: [
          "6.1 inch OLED display",
          "Dual camera system",
          "All-day battery life",
          "Water resistant"
        ],
        pros: [
          "Excellent camera quality",
          "Fast performance",
          "Premium build quality"
        ],
        cons: [
          "Expensive",
          "No headphone jack",
          "Charger sold separately"
        ],
        idealFor: "Users who want a premium smartphone experience and are invested in the ecosystem",
        imageUrl: "https://placehold.co/300x300/e6f2ff/0284c7?text=" + encodeURIComponent(product1)
      },
      product2: {
        name: product2,
        price: "$799-$999",
        rating: 4.3,
        keyFeatures: [
          "6.4 inch AMOLED display",
          "Triple camera system",
          "Fast charging",
          "Customizable interface"
        ],
        pros: [
          "Large, vibrant display",
          "Excellent value",
          "Expandable storage"
        ],
        cons: [
          "Camera quality inconsistent",
          "Software updates can be slow",
          "Average battery life"
        ],
        idealFor: "Users who want more customization options and features at a slightly lower price point",
        imageUrl: "https://placehold.co/300x300/e6f2ff/0284c7?text=" + encodeURIComponent(product2)
      },
      comparisonMetrics: [
        {
          name: "Display Quality",
          product1Score: 9,
          product2Score: 8
        },
        {
          name: "Camera",
          product1Score: 9,
          product2Score: 7
        },
        {
          name: "Battery Life",
          product1Score: 8,
          product2Score: 7
        },
        {
          name: "Performance",
          product1Score: 9,
          product2Score: 8
        },
        {
          name: "Value",
          product1Score: 7,
          product2Score: 9
        }
      ]
    };
  }
  
  getMockProductFinderResults(criteria: string): Product[] {
    return [
      {
        id: "1",
        name: "Premium Smartphone X",
        description: "The latest flagship smartphone with cutting-edge features",
        price: "$899-$1099",
        features: ["6.1 inch OLED", "Triple camera system", "5G capable", "All-day battery"],
        category: "Electronics",
        brand: "TechBrand",
        rating: 4.5,
        releaseDate: "2025-01-15",
        imageUrl: "https://placehold.co/300x300/e6f2ff/0284c7?text=Smartphone+X"
      },
      {
        id: "2",
        name: "UltraBook Pro",
        description: "Lightweight laptop with powerful performance",
        price: "$1299-$1899",
        features: ["13.3 inch Retina display", "16GB RAM", "512GB SSD", "10-hour battery life"],
        category: "Electronics",
        brand: "CompuTech",
        rating: 4.7,
        releaseDate: "2025-02-10",
        imageUrl: "https://placehold.co/300x300/e6f2ff/0284c7?text=UltraBook+Pro"
      },
      {
        id: "3",
        name: "SoundMax Wireless Headphones",
        description: "Premium noise-cancelling wireless headphones",
        price: "$249-$299",
        features: ["Active noise cancellation", "30-hour battery", "Premium sound quality", "Comfortable fit"],
        category: "Audio",
        brand: "SoundMax",
        rating: 4.4,
        releaseDate: "2025-03-01",
        imageUrl: "https://placehold.co/300x300/e6f2ff/0284c7?text=SoundMax"
      },
      {
        id: "4",
        name: "FitTrack Smart Watch",
        description: "Advanced fitness tracking with smartwatch capabilities",
        price: "$199-$249",
        features: ["Heart rate monitoring", "Sleep tracking", "GPS", "5-day battery life"],
        category: "Wearables",
        brand: "FitTech",
        rating: 4.2,
        releaseDate: "2025-01-20",
        imageUrl: "https://placehold.co/300x300/e6f2ff/0284c7?text=FitTrack"
      }
    ];
  }
  
  getMockProductUpdates(category: string): any[] {
    return [
      {
        id: "update1",
        productName: "Premium Smartphone X Pro",
        updateType: "New Release",
        date: "2025-04-10",
        description: "The latest flagship smartphone with improved camera system and faster processor",
        highlights: [
          "Enhanced triple camera with 108MP main sensor",
          "Next-gen processor with improved AI capabilities",
          "Increased battery capacity of 4500mAh",
          "New titanium frame design"
        ],
        category: "Smartphones",
        imageUrl: "https://placehold.co/300x300/e6f2ff/0284c7?text=Smartphone+X+Pro"
      },
      {
        id: "update2",
        productName: "UltraBook Pro",
        updateType: "Major Update",
        date: "2025-03-25",
        description: "Spring update adds new features and performance improvements",
        highlights: [
          "New AI-powered productivity tools",
          "Improved battery efficiency",
          "Enhanced security features",
          "New color options available"
        ],
        category: "Laptops",
        imageUrl: "https://placehold.co/300x300/e6f2ff/0284c7?text=UltraBook+Pro"
      },
      {
        id: "update3",
        productName: "SoundMax Wireless Headphones 2",
        updateType: "New Release",
        date: "2025-04-01",
        description: "Next generation of premium noise-cancelling headphones",
        highlights: [
          "Improved noise cancellation algorithm",
          "Extended battery life up to 40 hours",
          "New transparency mode for ambient awareness",
          "Enhanced comfort with redesigned ear cups"
        ],
        category: "Audio",
        imageUrl: "https://placehold.co/300x300/e6f2ff/0284c7?text=SoundMax+2"
      }
    ];
  }
}

// Create a singleton instance
const perplexityService = new PerplexityService();

export default perplexityService;

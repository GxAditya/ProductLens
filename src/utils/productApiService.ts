/**
 * Product API Service
 * 
 * This service handles communication with the backend API for product analysis features.
 * It replaces the direct Perplexity API integration with our FastAPI backend.
 */

import { toast } from "sonner";

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

class ProductApiService {
  private baseUrl: string;
  
  constructor() {
    // In production, this would be configured based on environment
    this.baseUrl = 'http://localhost:8000/api';
  }
  
  async compareProducts(product1: string, product2: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/compare`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ product1, product2 }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.detail || 'Failed to compare products');
        throw new Error(errorData.detail || 'Failed to compare products');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error comparing products:', error);
      toast.error(error instanceof Error ? error.message : 'Unknown error occurred');
      
      throw error;
    }
  }
  
  async findProducts(criteria: string): Promise<Product[]> {
    try {
      const response = await fetch(`${this.baseUrl}/find`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ criteria }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.detail || 'Failed to find products');
        throw new Error(errorData.detail || 'Failed to find products');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error finding products:', error);
      toast.error(error instanceof Error ? error.message : 'Unknown error occurred');
      
      throw error;
    }
  }
  
  async getProductUpdates(category: string): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseUrl}/updates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ category }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.detail || 'Failed to get product updates');
        throw new Error(errorData.detail || 'Failed to get product updates');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error getting product updates:', error);
      toast.error(error instanceof Error ? error.message : 'Unknown error occurred');
      
      throw error;
    }
  }

  // Mock data methods for development/testing
}

const productApiService = new ProductApiService();
export default productApiService;
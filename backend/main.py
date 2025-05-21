from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import httpx
import os
from dotenv import load_dotenv
import json
from functools import lru_cache

# Load environment variables
load_dotenv()

# Get API key from environment variable
API_KEY = os.getenv("PERPLEXITY_API_KEY")
if not API_KEY:
    raise ValueError("PERPLEXITY_API_KEY environment variable is not set")

app = FastAPI(title="Product Analyzer API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class ProductComparisonRequest(BaseModel):
    product1: str
    product2: str

class ProductFinderRequest(BaseModel):
    criteria: str

class ProductUpdatesRequest(BaseModel):
    category: str

class Product(BaseModel):
    id: str
    name: str
    description: str
    price: str
    features: List[str]
    category: str
    brand: str
    rating: float
    releaseDate: str
    imageUrl: str

class ProductUpdate(BaseModel):
    id: str
    title: str
    description: str
    date: str
    category: str
    imageUrl: str
    source: str
    url: str

# Perplexity API client
class PerplexityClient:
    def __init__(self):
        self.api_key = API_KEY
        self.base_url = "https://api.perplexity.ai/chat/completions"
        self.model = "sonar"
        self.temperature = 0.2
        self.max_tokens = 1000
        self.search_recency_filter = "month"
    
    async def query_perplexity(self, message: str, system_prompt: str):
        async with httpx.AsyncClient() as client:
            response = await client.post(
                self.base_url,
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": self.model,
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": message}
                    ],
                    "temperature": self.temperature,
                    "max_tokens": self.max_tokens,
                    "search_recency_filter": self.search_recency_filter,
                },
                timeout=30.0  # Increased timeout for complex queries
            )
            
            if response.status_code != 200:
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"Perplexity API error: {response.text}"
                )
            
            return response.json()
    
    @lru_cache(maxsize=100)
    async def compare_products(self, product1: str, product2: str):
        prompt = f"Compare these products in detail: \"{product1}\" and \"{product2}\". Include: price ranges, key features, performance metrics, pros and cons, and which types of users each product is best for. Format the response as JSON with the following structure: {{ \"product1\": {{ \"name\", \"price\", \"rating\", \"keyFeatures\", \"pros\", \"cons\", \"idealFor\" }}, \"product2\": {{ same structure }}, \"comparisonMetrics\": [{{ \"name\", \"product1Score\", \"product2Score\" }}] }}"
        
        system_prompt = "You are a product comparison expert. Provide detailed, accurate comparisons between products in a structured JSON format. Include specific metrics, pros/cons, and target user information."
        
        response = await self.query_perplexity(prompt, system_prompt)
        content = response["choices"][0]["message"]["content"]
        
        # Try to extract JSON from the content
        try:
            return json.loads(content)
        except json.JSONDecodeError:
            # Try to extract JSON from markdown code blocks or plain text
            json_match = None
            if "```json" in content:
                json_match = content.split("```json")[1].split("```")[0].strip()
            elif "```" in content:
                json_match = content.split("```")[1].split("```")[0].strip()
            elif "{" in content and "}" in content:
                json_match = content[content.find("{"):content.rfind("}")+1]
            
            if json_match:
                try:
                    return json.loads(json_match)
                except json.JSONDecodeError:
                    pass
            
            # If all extraction attempts fail, return the raw content
            return {"rawContent": content, "error": "Could not parse structured data"}
    
    @lru_cache(maxsize=100)
    async def find_products(self, criteria: str) -> List[Product]:
        prompt = f"Find products that match these criteria: {criteria}. For each product, provide the name, a brief description, key features, approximate price range, brand, category, rating (1-5), release date, and pros/cons. Limit to 5 best matches. Format the response as a JSON array with objects having the following properties: id, name, description, price, features (array), category, brand, rating, releaseDate, imageUrl."
        
        system_prompt = "You are a product recommendation expert. Find and recommend products based on user criteria. Return results in a structured JSON array format with detailed product information."
        
        response = await self.query_perplexity(prompt, system_prompt)
        content = response["choices"][0]["message"]["content"]
        
        # Try to extract JSON from the content
        try:
            parsed_data = json.loads(content)
            # Ensure all product IDs are strings
            if isinstance(parsed_data, list):
                for product in parsed_data:
                    if "id" in product:
                        product["id"] = str(product["id"])
                return parsed_data
            elif isinstance(parsed_data, dict):
                if "id" in parsed_data:
                    parsed_data["id"] = str(parsed_data["id"])
                return [parsed_data]
            else:
                return [parsed_data]
        except json.JSONDecodeError:
            # Try to extract JSON from markdown code blocks or plain text
            json_match = None
            if "```json" in content:
                json_match = content.split("```json")[1].split("```")[0].strip()
            elif "```" in content:
                json_match = content.split("```")[1].split("```")[0].strip()
            elif "[" in content and "]" in content:
                json_match = content[content.find("["):content.rfind("]")+1]
            
            if json_match:
                try:
                    parsed_products = json.loads(json_match)
                    # Ensure all product IDs are strings in the extracted JSON as well
                    if isinstance(parsed_products, list):
                        for product in parsed_products:
                            if "id" in product:
                                product["id"] = str(product["id"])
                        return parsed_products
                    elif isinstance(parsed_products, dict):
                        if "id" in parsed_products:
                            parsed_products["id"] = str(parsed_products["id"])
                        return [parsed_products]
                    else:
                        return [parsed_products]
                except json.JSONDecodeError:
                    pass
            
            # If all extraction attempts fail, return an empty list
            raise HTTPException(status_code=422, detail="Failed to parse product data from API response")
    
    @lru_cache(maxsize=100)
    async def get_product_updates(self, category: str) -> List[Dict[str, Any]]:
        prompt = f"Find the latest product updates, news, and trends for the {category} category. Include new releases, price changes, comparison studies, and buying guides. For each update, provide a title, brief description, date, category, image URL, source, and link. Format the response as a JSON array with objects having the following properties: id, title, description, date, category, imageUrl, source, url."
        
        system_prompt = "You are a product news and updates expert. Provide the latest information about products in a specific category. Return results in a structured JSON array format."
        
        response = await self.query_perplexity(prompt, system_prompt)
        content = response["choices"][0]["message"]["content"]
        
        # Try to extract JSON from the content
        try:
            parsed_data = json.loads(content)
            # Ensure all update IDs are strings
            if isinstance(parsed_data, list):
                for update in parsed_data:
                    if "id" in update:
                        update["id"] = str(update["id"])
                return parsed_data
            elif isinstance(parsed_data, dict):
                if "id" in parsed_data:
                    parsed_data["id"] = str(parsed_data["id"])
                return [parsed_data]
            else:
                return [parsed_data]
        except json.JSONDecodeError:
            # Try to extract JSON from markdown code blocks or plain text
            json_match = None
            if "```json" in content:
                json_match = content.split("```json")[1].split("```")[0].strip()
            elif "```" in content:
                json_match = content.split("```")[1].split("```")[0].strip()
            elif "[" in content and "]" in content:
                json_match = content[content.find("["):content.rfind("]")+1]
            
            if json_match:
                try:
                    parsed_updates = json.loads(json_match)
                    # Ensure all update IDs are strings in the extracted JSON as well
                    if isinstance(parsed_updates, list):
                        for update in parsed_updates:
                            if "id" in update:
                                update["id"] = str(update["id"])
                        return parsed_updates
                    elif isinstance(parsed_updates, dict):
                        if "id" in parsed_updates:
                            parsed_updates["id"] = str(parsed_updates["id"])
                        return [parsed_updates]
                    else:
                        return [parsed_updates]
                except json.JSONDecodeError:
                    pass
            
            # If all extraction attempts fail, return an empty list
            raise HTTPException(status_code=422, detail="Failed to parse product updates from API response")

# Dependency to get the Perplexity client
@lru_cache()
def get_perplexity_client():
    return PerplexityClient()

# API endpoints
@app.get("/")
async def read_root():
    return {"message": "Product Analyzer API is running"}

@app.post("/api/compare", response_model=Dict[str, Any])
async def compare_products(
    request: ProductComparisonRequest,
    client: PerplexityClient = Depends(get_perplexity_client)
):
    result = await client.compare_products(request.product1, request.product2)
    return result

@app.post("/api/find", response_model=List[Product])
async def find_products(
    request: ProductFinderRequest,
    client: PerplexityClient = Depends(get_perplexity_client)
):
    products = await client.find_products(request.criteria)
    return products

@app.post("/api/updates", response_model=List[ProductUpdate])
async def get_product_updates(
    request: ProductUpdatesRequest,
    client: PerplexityClient = Depends(get_perplexity_client)
):
    updates = await client.get_product_updates(request.category)
    return updates

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
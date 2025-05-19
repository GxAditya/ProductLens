# Product Analyzer Backend

This is the FastAPI backend for the Product Analyzer application. It handles communication with the Perplexity Sonar API and provides endpoints for product comparison and finding.

## Setup

### Prerequisites

- Python 3.8 or higher
- Perplexity API key

### Installation

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install the required dependencies:
   ```
   pip install -r requirements.txt
   ```

3. Create a `.env` file in the backend directory with your Perplexity API key:
   ```
   PERPLEXITY_API_KEY=your_perplexity_api_key_here
   ```
   You can copy the `.env.example` file and replace the placeholder with your actual API key. The API key is only needed on the backend and is not exposed to frontend users.

### Running the Server

Start the FastAPI server with:
```
python main.py
```

The server will run at `http://localhost:8000`.

## API Endpoints

### GET /

Returns a simple message indicating the API is running.

### POST /api/compare

Compares two products and returns detailed comparison information.

**Request Body:**
```json
{
  "product1": "Product Name 1",
  "product2": "Product Name 2"
}
```

### POST /api/find

Finds products matching the given criteria.

**Request Body:**
```json
{
  "criteria": "Search criteria including preferences, features, etc."
}
```

### POST /api/updates

Returns the latest product updates, news, and trends for a specific category.

**Request Body:**
```json
{
  "category": "Category name (e.g., Smartphones, Laptops, etc.)"
}
```

## Features

- Caching to minimize redundant API calls
- Structured response parsing
- Error handling
- CORS support for frontend integration
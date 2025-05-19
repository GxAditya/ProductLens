## Data Processing Requirements
- Extract and normalize data from different product categories
- Create a unified schema for storing product information across product types
- Implement fuzzy matching for product names and features
- Develop intelligent product attribute extraction from Perplexity Sonar API responses
- Handle varied product metrics based on category (e.g., battery life for electronics, fabric quality for clothing)
- Create standardized comparison metrics for universal application# Product Analyzer with Perplexity Sonar API - Development Prompt

## Project Overview
Create a web application that leverages the Perplexity Sonar API to gather, analyze, and present product information to users. The application should help users make informed purchase decisions by comparing products, finding products based on preferences, and staying updated on product releases and updates. The application should be universal, capable of analyzing any type of product from basic necessities to electronics and beyond.

## Core Features

### 1. Product Comparison Tool
- Allow users to input two products to compare side-by-side
- Enable comparison based on:
  - User-defined metrics (e.g., price, performance, battery life)
  - Auto-detected metrics that the analyzer finds from the API data
- Present comparison results in a clear, visually appealing format (tables, charts)
- Include option to save comparisons for future reference

### 2. Product Finder
- Accept user preferences as input parameters (budget range, must-have features, brand preferences, etc.)
- Query the Perplexity Sonar API to find products matching these criteria
- Rank results based on how closely they match user preferences
- Allow filtering and sorting of results
- Provide detailed information about each recommended product

### 3. Product Updates Section
- Allow users to set preferences for product categories they want to monitor
- Regularly query the API for new product releases or updates in those categories
- Display a feed of product updates, sorted by relevance to user preferences
- Implement notification system for important updates (optional)

## Technical Requirements

### Frontend
- Use React with Vite for frontend development
- Responsive design that works on desktop and mobile devices
- Clean, intuitive user interface with easy navigation between features
- Interactive elements for product comparison and preference selection
- Dashboard for user to view saved comparisons and updates

### Backend
- Use FastAPI for the backend implementation
- Integration with Perplexity Sonar API (access already available)
- Caching system to minimize redundant API calls
- User account system to save preferences and comparisons
- Scheduled tasks for fetching product updates

### API Integration
- Implement robust error handling for API requests
- Create structured data models for different product categories
- Design flexible query system to extract specific product information
- Implement rate limiting and API key management

## User Account & Data Management
- Implement secure user authentication with JWT tokens
- Store user preferences for product categories and features
- Save comparison history for logged-in users
- Enable users to set up notification preferences
- Use database to store user data and cached product information
- Implement proper data validation and sanitization

## App Structure & Pages

The application will consist of the following sections/pages:

### 1. Authentication Pages
- Sign Up Page: For new user registration with email verification
- Login Page: For existing users to access their accounts
- Password Reset Page: For users who forgot their password

### 2. Main Dashboard
- Overview of saved comparisons
- Latest product updates in preferred categories
- Quick access to product finder and comparison tools

### 3. Product Comparison Section
- Search interface to select products for comparison
- Comparison visualization with tables/charts
- Option to save comparison results
- History of previous comparisons

### 4. Product Finder Section
- Preference input form
- Results display with filtering options
- Detailed product information view
- Option to compare selected products directly

### 5. Updates Section
- Feed of new product releases and updates
- Filter by product categories
- Notification settings

### 6. User Profile Section
- Account management
- Preference settings
- Saved comparisons
- Category subscriptions for updates

### 7. Admin Panel (optional)
- User management
- Analytics dashboard
- API usage monitoring

## Deployment & Scalability
- Design with scalability in mind to handle increasing user base and product data
- Implement caching to reduce API calls and improve performance

## Deliverables
1. Complete source code with documentation
2. Setup instructions for local development environment
3. API integration documentation
4. User guide explaining how to use all features

## Additional Features
- Implement analytics to track most compared products and popular features
- Add social sharing functionality for product comparisons
- Enable export of comparison results (PDF, CSV)
- Implement smart product categorization to handle universal product types
- Add product image and review aggregation
- Provide price history tracking when available through the API
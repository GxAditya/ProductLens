# Item Discovery Hub

A modern product discovery and comparison web app powered by React, FastAPI, and the Perplexity Sonar API.

## Tech Stack

**Frontend:**
- [Vite](https://vitejs.dev/) (React + TypeScript)
- [React 18](https://react.dev/)
- [shadcn/ui](https://ui.shadcn.com/) (Radix UI)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Router](https://reactrouter.com/)
- [sonner](https://sonner.emilkowal.ski/) (toasts)

**Backend:**
- [FastAPI](https://fastapi.tiangolo.com/)
- [Uvicorn](https://www.uvicorn.org/) (ASGI server)
- [httpx](https://www.python-httpx.org/) (async HTTP client)
- [python-dotenv](https://pypi.org/project/python-dotenv/)
- [Pydantic](https://docs.pydantic.dev/)

---

## Features
- Product search and filtering
- Product comparison
- Product details modal (with caching to avoid repeated API calls)
- Latest product updates/news
- Responsive, modern UI

---

## Getting Started

### 1. Clone the repository
```sh
git clone https://github.com/GxAditya/item-discovery-hub.git
cd item-discovery-hub
```

### 2. Install Frontend Dependencies
```sh
npm install
```

### 3. Install Backend Dependencies
```sh
cd backend
pip install -r requirements.txt
```

### 4. Set Up Environment Variables (Backend)
Create a `.env` file in the `backend/` directory:
```
PERPLEXITY_API_KEY=your_perplexity_api_key_here
```

### 5. Run the Backend
From the `backend/` directory:
```sh
uvicorn main:app --reload --log-level debug
```
The backend will be available at [http://localhost:8000](http://localhost:8000)

### 6. Run the Frontend
From the project root:
```sh
npm run dev
```
The frontend will be available at [http://localhost:5173](http://localhost:5173) (or as shown in your terminal)

---

## Usage Notes
- The frontend and backend must both be running for full functionality.
- Product details are cached in memory on the frontend to avoid repeated API calls for the same product.
- The details modal is scrollable and fits the viewport for large content.
- You can customize the Perplexity API prompt/logic in `backend/main.py`.

---

## Project Structure

```
item-discovery-hub/
├── backend/           # FastAPI backend
│   ├── main.py
│   ├── requirements.txt
│   └── ...
├── src/               # Frontend source code
│   ├── components/
│   ├── utils/
│   └── ...
├── package.json
├── tailwind.config.ts
├── vite.config.ts
└── ...
```

---

## Contributing
Pull requests and issues are welcome! Please open an issue to discuss your idea or bug before submitting a PR.

---

# Future Improvements 

- Add Ethical Products Search Functionality 
- Add Product purchase link providing functionality 
- Add More Filters to provide user with a better product search experience 
- Add thumbnails for prodcuts (maybe web scrap?)

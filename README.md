# Inventory Management App

Full-stack inventory management app built with React, Redux, Material UI, Node.js, Express, TypeScript, and MongoDB.

## Features

- Signup and login
- Category management
- Inventory item creation
- Search, category filter, and pagination
- Backend API test file: `server/inventory-api.http`

## Run locally

```bash
cd server
npm install
npm run dev
```

```bash
cd client
npm install
npm run dev
```

## Environment

- Backend example env: `server/.env.example`
- Frontend example env: `client/.env.example`

## Deploy on Render

1. Push this project to a GitHub repository.
2. In Render, create a new Blueprint service and select this repository.
3. Render will read `render.yaml` and create:
   - `inventory-management-api`
   - `inventory-management-web`
4. Set `MONGODB_URI` for the backend.
5. After the backend gets a URL like `https://inventory-management-api.onrender.com`, set `VITE_API_URL` to that URL and redeploy the frontend.
6. Open the frontend Render URL. That is your hosted link.

## Notes

- Frontend env can be either `https://your-api.onrender.com` or `https://your-api.onrender.com/api`
- Health check: `/api/health`
- API testing file: `server/inventory-api.http`

# Airbnb Capstone

An Airbnb-inspired accommodation booking application with a React frontend and an Express/MongoDB API. Guests can browse listings and manage trips; hosts can manage their listings and reservations.

## Features

- Browse and search accommodation listings.
- Register and sign in as a guest or host.
- View listing details and make reservations.
- View and cancel your reservations.
- Host dashboard for creating, editing, and deleting listings, and managing reservations.
- Upload listing photos through the host listing forms.
- JWT-based authentication and role-protected host routes.

## Tech stack

- **Frontend:** React, Vite, React Router
- **Backend:** Node.js, Express
- **Database:** MongoDB with Mongoose
- **Authentication:** JSON Web Tokens

## Requirements

- Node.js 24.x and npm
- MongoDB, either running locally or available through MongoDB Atlas

## Setup

The frontend and backend are separate npm projects, so install their dependencies independently.

### 1. Configure the backend

In a terminal, from the repository root:

```powershell
cd backend
npm install
```

Create `backend/.env` with your MongoDB connection string and a private JWT secret:

```dotenv
MONGO_URI=mongodb://127.0.0.1:27017/airbnb-capstone
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d
PORT=5000
CLIENT_ORIGINS=http://localhost:5173
NODE_ENV=development
```

Replace the example `MONGO_URI` if you use MongoDB Atlas. Choose a long, unique `JWT_SECRET`; do not commit `.env` files or share their values. `PORT` defaults to `5000`, and `JWT_EXPIRES_IN` defaults to `7d`.

### 2. Configure the frontend

The frontend defaults to `http://localhost:5000/api`, so no frontend environment file is needed for local development. If your backend uses a different URL, create `frontend/.env`:

```dotenv
VITE_API_URL=http://localhost:5000/api
```

For deployments, set `VITE_API_URL` to the public backend API URL, including its `/api` path, and set the backend's `CLIENT_ORIGINS` to the frontend origin.

### 3. Start the application

Keep the backend and frontend running in separate terminals.

Backend:

```powershell
cd backend
npm run dev
```

Frontend:

```powershell
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite (by default, `http://localhost:5173`). The backend health endpoint is `http://localhost:5000/api/health`.

## Accounts and pages

- Visit `/login` to sign in or create an account. During sign-up, choose **Host** to create an account for the host dashboard.
- Visit `/admin/login` to sign in as a host.
- The host dashboard is available at `/admin/listings`; host reservations are at `/admin/reservations`.
- Guest trips are available at `/reservations`.

There are no default login credentials; create an account through the app.

## API overview

The API is served under `/api`.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/users/register` | Register a guest or host |
| `POST` | `/users/login` | Sign in and receive an auth token |
| `GET` | `/users/me` | Get the current authenticated user |
| `GET` | `/accommodations` | Browse listings |
| `GET` | `/accommodations/:id` | Get listing details |
| `POST` | `/accommodations` | Create a host listing |
| `PUT` / `DELETE` | `/accommodations/:id` | Update or delete a host listing |
| `POST` | `/reservations` | Create a reservation |
| `GET` | `/reservations/user` | List the signed-in guest's reservations |
| `GET` | `/reservations/host` | List reservations for the signed-in host |
| `DELETE` | `/reservations/:id` | Cancel a reservation |

Protected endpoints require an `Authorization: Bearer <token>` header. Listing create/update endpoints accept multipart form data for photo uploads.

## Useful commands

Run these from the relevant project directory:

| Directory | Command | Description |
| --- | --- | --- |
| `backend` | `npm run dev` | Start the API with automatic restarts |
| `backend` | `npm start` | Start the API |
| `frontend` | `npm run dev` | Start the Vite development server |
| `frontend` | `npm run build` | Create a production build in `frontend/dist` |
| `frontend` | `npm run lint` | Run ESLint |

Uploaded photos are stored in `backend/uploads`; deployments should provide persistent storage for that directory.

# FreelanceHub - Setup and Running Guide

## Overview
A freelancer-client management system built with Angular (frontend) and Express.js + MongoDB (backend).

## Prerequisites
- Node.js (v18 or higher)
- MongoDB (running locally or connection string to remote MongoDB)
- npm or yarn

## Backend Setup

### 1. Install MongoDB
Make sure MongoDB is installed and running on your system. If not installed:
- **Mac**: `brew install mongodb-community`
- **Linux**: Follow official MongoDB installation guide
- **Windows**: Download from MongoDB website

### 2. Start MongoDB
```bash
# Mac/Linux
mongod --dbpath=/path/to/data/directory

# Or use default path
mongod
```

### 3. Configure Backend
Navigate to backend directory:
```bash
cd backend
```

Install dependencies:
```bash
npm install
```

Update `.env` file with your MongoDB connection string if needed:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/freelance_hub
JWT_SECRET=your_jwt_secret_key_here_change_in_production
JWT_EXPIRE=7d
```

### 4. Start Backend Server
```bash
npm start
```

The backend API will run on `http://localhost:5000`

## Frontend Setup

### 1. Install Dependencies
From project root directory:
```bash
npm install
```

### 2. Start Angular Development Server
```bash
npm start
```

The frontend will run on `http://localhost:4200`

## Usage Flow

### 1. Landing Page
Navigate to `http://localhost:4200` to see the landing page.

### 2. Signup
Click on "Sign Up" and create an account:
- Choose user type: **Freelancer** or **Client**
- Fill in first name, last name, email, and password
- Submit the form

### 3. Automatic Redirect
After signup, you'll be automatically redirected to:
- **Freelancer Dashboard** (`/dashboard/home`) if you signed up as a freelancer
- **Client Dashboard** (`/client/home`) if you signed up as a client

## Features

### Freelancer Dashboard
- **Home**: View dashboard statistics, browse recent gigs, and send requests
- **Orders**: Track pending requests, active projects, and completed work
- **Profile**: Update freelancer profile information

### Client Dashboard
- **Home**: View statistics, manage posted gigs, and create new gigs
- **Orders**: Review freelancer requests and manage active projects
- **Profile**: Update client profile information

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Freelancer Routes (Protected - Freelancer Only)
- `GET /api/freelancer/dashboard` - Get dashboard stats
- `GET /api/freelancer/gigs` - Get available gigs
- `POST /api/freelancer/request` - Send gig request
- `GET /api/freelancer/orders` - Get all orders
- `GET /api/freelancer/profile` - Get profile
- `PUT /api/freelancer/profile` - Update profile

### Client Routes (Protected - Client Only)
- `GET /api/client/dashboard` - Get dashboard stats
- `GET /api/client/gigs` - Get all posted gigs
- `POST /api/client/gigs` - Create new gig
- `GET /api/client/requests` - Get pending requests
- `PATCH /api/client/requests/:id/accept` - Accept request
- `GET /api/client/projects` - Get all projects
- `GET /api/client/profile` - Get profile
- `PUT /api/client/profile` - Update profile

## Database Collections

- **users** - User authentication and basic info
- **freelancerprofiles** - Freelancer-specific profile data
- **clientprofiles** - Client-specific profile data
- **gigs** - Job postings created by clients
- **requests** - Freelancer requests for gigs
- **projects** - Active/completed projects

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod`
- Check connection string in `backend/.env`
- Verify firewall settings

### Port Already in Use
- Backend: Change `PORT` in `backend/.env`
- Frontend: Angular CLI will prompt for alternative port

### CORS Issues
- Backend already configured for CORS with `cors` middleware
- Frontend API calls use `http://localhost:5000`

## Notes
- This is a college project demonstration
- The messaging feature is intentionally left out and can be implemented later
- Authentication uses JWT tokens stored in localStorage
- Role-based guards protect routes (freelancer vs client)

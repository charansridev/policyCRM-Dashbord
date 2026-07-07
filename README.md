# PolicyPay CRM – Daily Payment Tracker

A full-stack CRM for insurance agents to track daily policy payments.

## Tech Stack
- **Frontend**: React 19, Vite, Tailwind CSS v4
- **Backend**: Node.js, Express 5, Mongoose
- **Database**: MongoDB

## Project Structure
```
elegant-mendel/
├── backend/
│   ├── models/Policy.js
│   ├── routes/policyRoutes.js
│   ├── server.js
│   ├── .env
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Dashboard.jsx
    │   │   └── AddPolicyModal.jsx
    │   ├── App.jsx
    │   ├── api.js
    │   └── index.css
    ├── index.html
    └── package.json
```

## Prerequisites
- Node.js (v18+)
- MongoDB running locally on port `27017`

## Running the App

### 1. Start MongoDB
Make sure your local MongoDB service is running.

### 2. Start the Backend
```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

### 3. Start the Frontend
```bash
cd frontend
npm run dev
# App runs on http://localhost:5173
```

## API Endpoints
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/policies?date=YYYY-MM-DD` | Get pending policies for a date |
| POST | `/api/policies` | Create a new policy |
| PUT | `/api/policies/:id/done` | Mark done / advance monthly date |
| PUT | `/api/policies/:id/forward` | Forward to a new date |

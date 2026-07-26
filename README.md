# 🛡️ PolicyPay CRM – Life Insurance Daily Payment Tracker

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-brightgreen?style=for-the-badge&logo=vercel)](https://policy-crm-dashbord-hazel.vercel.app/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen.svg?style=for-the-badge)](https://github.com/charansridev/policyCRM-Dashbord/pulls)

An open-source, full-stack CRM built specifically to solve daily workflow pain points for life insurance agents. Track customer policy payments daily, send WhatsApp reminders with one click, handle monthly/yearly recurring renewals, forward deferred payments, and view real-time payment collection statistics.

🚀 **[View Live Demo](https://policy-crm-dashbord-hazel.vercel.app/)**

---

## 📌 Problem Statement & Mission

Life insurance agents handle dozens of active policies every month. Traditional spreadsheets or generic CRM tools often lack quick daily tracking, making it hard to:
1. **Track Due Payments Daily**: Missing premium renewal dates leads to policy lapse for clients and lost commission for agents.
2. **Follow Up Effortlessly**: Agents lose time copying numbers, typing standard messages, and manually texting clients on WhatsApp.
3. **Handle Recurring vs. Deferred Payments**: Monthly or annual premium renewals require constant date adjustments and renewal tracking.
4. **Collect Quick Metrics**: Knowing daily total collected amounts and pending collections at a glance is vital for field management.

**PolicyPay CRM** provides an open-source, streamlined, agent-focused dashboard designed to make daily premium tracking fast, visual, and hassle-free.

---

## ✨ Features

- 📅 **Daily Due Tracker**: Filter and view policies due on any selected calendar date.
- 📱 **One-Click WhatsApp Reminders**: Direct integration to launch WhatsApp web/app with pre-filled payment reminder messages.
- 🔄 **Smart Recurring Handling**: Automatic rollover for monthly or annual recurring premium renewals when marked as "Done".
- ⏩ **Forward Due Dates**: Easily defer payment follow-ups to a future date when clients request an extension.
- 📊 **Real-time Analytics Dashboard**: Instant summary of total collected amount, total pending amount, and payment counts for any selected day.
- 📜 **Payment History Log**: Complete audit record of past collected payments per date.
- 👥 **All Policies Directory**: Searchable list of all registered clients and policy records.
- 🎨 **Modern & Premium UI**: Crafted with React 19, Tailwind CSS v4, Lucide icons, glassmorphism card styling, and dark mode design principles.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS v4, Lucide React, Axios, date-fns
- **Backend**: Node.js, Express 5, Mongoose (MongoDB ODM), dotenv, CORS
- **Database**: MongoDB (Local or MongoDB Atlas)
- **Deployment**: Vercel / Serverless cloud architecture

---

## 📁 Repository Structure

```
policyCRM-Dashbord/
├── backend/
│   ├── models/
│   │   ├── Policy.js          # Mongoose Schema for client policies
│   │   └── Payment.js         # Mongoose Schema for logged payment transactions
│   ├── routes/
│   │   ├── policyRoutes.js    # API endpoints for policy CRUD & status updates
│   │   └── paymentRoutes.js   # API endpoints for fetching payment history logs
│   ├── seed.js                # Database seeder script with test data
│   ├── server.js              # Express app entry point
│   ├── .env                   # Environment variable configuration
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Dashboard.jsx        # Main daily dashboard with metrics & policy tables
    │   │   ├── AddPolicyModal.jsx   # Modal form for registering new policies
    │   │   ├── AllPolicies.jsx      # Comprehensive list of all client policies
    │   │   └── PaymentHistory.jsx   # Daily collected payments log view
    │   ├── App.jsx                  # Main layout and tab navigation
    │   ├── api.js                   # Centralized API service methods
    │   └── index.css                # Global Tailwind CSS styles
    ├── index.html
    └── package.json
```

---

## ⚡ Getting Started

Follow these steps to run the project locally on your machine.

### Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) or `yarn`
- [MongoDB](https://www.mongodb.com/try/download/community) running locally on port `27017` (or a MongoDB Atlas connection URI)

---

### 1. Clone the Repository

```bash
git clone https://github.com/charansridev/policyCRM-Dashbord.git
cd policyCRM-Dashbord
```

---

### 2. Backend Setup

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the `backend` folder (or edit existing):
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/crm_db
   ```

4. *(Optional)* **Seed Sample Data**:
   Populate your database with mock clients and policies to quickly test the dashboard:
   ```bash
   node seed.js
   ```

5. **Start the Backend Server**:
   ```bash
   npm run dev
   ```
   *The server will start at `http://localhost:5000`.*

---

### 3. Frontend Setup

1. **Open a new terminal window and navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the `frontend` folder (if targeting a custom backend host):
   ```env
   VITE_API_URL=http://localhost:5000
   ```

4. **Start the Vite Development Server**:
   ```bash
   npm run dev
   ```
   *The app will be available at `http://localhost:5173`.*

---

## 🔌 API Reference

### Policy Routes (`/api/policies`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/policies?date=YYYY-MM-DD` | Get pending policies due on a specific date |
| `GET` | `/api/policies/all` | Fetch all registered client policies |
| `POST` | `/api/policies` | Add a new policy |
| `PUT` | `/api/policies/:id/done` | Mark policy as paid (or advance date for recurring policies & log payment) |
| `PUT` | `/api/policies/:id/forward` | Forward due date of a policy to a new date |

### Payment History Routes (`/api/payments`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/payments?date=YYYY-MM-DD` | Fetch all payments collected on a specific date |

---

## 🤝 Contributing

Contributions make the open-source community an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 👨‍💻 Maintainer & Acknowledgments

Developed with ❤️ for insurance professionals worldwide. 

- **Live App**: [Policy CRM Dashboard](https://policy-crm-dashbord-hazel.vercel.app/)
- **GitHub Repository**: [charansridev/policyCRM-Dashbord](https://github.com/charansridev/policyCRM-Dashbord)

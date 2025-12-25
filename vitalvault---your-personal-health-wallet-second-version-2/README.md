  VitalVault 2.0 – Personal Health Wallet
VitalVault 2.0 is a full-stack personal health wallet that allows users to securely store medical reports, extract vitals using AI, visualize health trends, and share reports with trusted viewers such as doctors or family members.
The system is built with a React + Vite frontend, a Node.js backend, JWT-based authentication, and a modular service architecture.
  Features
Secure user authentication (Register / Login)
JWT-based session management
Upload medical reports (PDF / Image)
AI-powered extraction of medical vitals
Persistent storage of reports and vitals
Interactive vitals charts (BP, Sugar, Heart Rate)
Report sharing with viewer accounts
Clean dashboard and modular UI
Fully local development setup
  Tech Stack
Frontend
React (TypeScript)
Vite
Tailwind CSS
Recharts (for vitals visualization)
Backend
Node.js
Express.js
SQLite
JWT Authentication
Multer (file uploads)
AI
Google Gemini API (medical report parsing)
  Project Structure
vitalvault---your-personal-health-wallet-second-version-2/
│
├── backend/
│   ├── middleware/
│   │   └── auth.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── reports.routes.js
│   │   └── vitals.routes.js
│   ├── uploads/
│   │   └── reports/
│   ├── db.js
│   ├── initDb.js
│   ├── server.js
│   ├── healthwallet.db
│   └── package.json
│
├── components/
│   ├── ArchitectureView.tsx
│   ├── Layout.tsx
│   ├── Login.tsx
│   ├── ReportsList.tsx
│   ├── UploadReport.tsx
│   ├── VitalsCharts.tsx
│   └── VitalsDashboard.tsx
│
├── services/
│   ├── api.ts          # frontend API facade
│   ├── httpApi.ts      # real HTTP backend calls
│   ├── database.ts
│   ├── geminiService.ts
│   ├── reports.ts
│   └── vitals.ts
│
├── App.tsx
├── index.tsx
├── index.html
├── types.ts
├── vite.config.ts
├── package.json
└── README.md
  Environment Setup
1️ Backend Environment
Navigate to backend:
cd backend
Install dependencies:
npm install
Initialize database (first time only):
node initDb.js
Start backend server:
node server.js
Backend runs on:
http://localhost:5001
2️  Frontend Environment
From project root:
npm install
npm run dev
Frontend runs on:
http://localhost:5173
  Authentication Flow
User registers or logs in
Backend returns a JWT token
Token is stored in sessionStorage
Token is sent with every protected API request
Backend middleware validates the token
  AI Report Processing
Users upload a medical report (image or PDF)
File is converted to base64
Sent to Gemini AI
AI extracts:
Title
Category
Date
Vitals (BP, Sugar, Heart Rate, etc.)
Extracted vitals are stored and visualized
  Vitals Visualization
Vitals are displayed using interactive charts:
Blood Pressure trends
Blood Sugar levels
Heart Rate stability
Charts update automatically after new uploads.
  Report Sharing
Owner can share reports with viewer users
Viewers can see shared reports but cannot modify them
Access control enforced at backend level

#  VitalVault 2.0 – Personal Health Wallet

VitalVault 2.0 is a full-stack personal health wallet that allows users to securely store medical reports, extract medical vitals using AI, visualize health trends, and share reports with trusted viewers such as doctors or family members.

The project is built using a React + Vite frontend, a Node.js backend, JWT-based authentication, and a modular service architecture.

---

##  Features

- User registration and login
- JWT-based authentication and session handling
- Upload medical reports (PDF / Image)
- AI-powered extraction of medical vitals
- Persistent storage of reports and vitals
- Interactive vitals charts (BP, Sugar, Heart Rate)
- Secure report sharing with viewer accounts
- Modular and clean UI dashboard

---

##  Tech Stack

### Frontend
- React (TypeScript)
- Vite
- Tailwind CSS
- Recharts

### Backend
- Node.js
- Express.js
- SQLite
- JWT Authentication
- Multer (file uploads)

### AI
- Google Gemini API

---

##  Project Structure
vitalvault---your-personal-health-wallet-second-version-2/
│
├── backend/
│ ├── middleware/
│ │ └── auth.js
│ ├── routes/
│ │ ├── auth.routes.js
│ │ ├── reports.routes.js
│ │ └── vitals.routes.js
│ ├── uploads/
│ │ └── reports/
│ ├── db.js
│ ├── initDb.js
│ ├── server.js
│ ├── healthwallet.db
│ └── package.json
│
├── components/
│ ├── ArchitectureView.tsx
│ ├── Layout.tsx
│ ├── Login.tsx
│ ├── ReportsList.tsx
│ ├── UploadReport.tsx
│ ├── VitalsCharts.tsx
│ └── VitalsDashboard.tsx
│
├── services/
│ ├── api.ts
│ ├── httpApi.ts
│ ├── database.ts
│ ├── geminiService.ts
│ ├── reports.ts
│ └── vitals.ts
│
├── App.tsx
├── index.tsx
├── index.html
├── types.ts
├── vite.config.ts
├── package.json
└── README.md

---
## Authentication Flow

  User registers or logs in
  Backend returns a JWT token
  Token is stored in sessionStorage
  Token is sent with every protected API request
  Backend validates token using middleware
  
## AI Medical Report Processing

  User uploads a medical report
  File is converted to base64
  Data is sent to Gemini AI
  
## Vitals Visualization

  Blood Pressure history
  Blood Sugar trends
  Heart Rate stability
  Charts update dynamically when new reports are added.
  
## Report Sharing

  Owners can share reports with viewers
  Viewers have read-only access
  Access control enforced on the backe


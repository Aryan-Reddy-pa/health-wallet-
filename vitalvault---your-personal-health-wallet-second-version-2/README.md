
# VitalVault - Your Secure Health Wallet

VitalVault is a high-performance personal health record (PHR) management system. It allows users to track vitals, upload medical reports, and securely share data with healthcare providers.

## 🛠️ Tech Stack

- **Frontend:** ReactJS (v19) with Tailwind CSS for high-fidelity UI/UX.
- **Visuals:** Recharts for interactive vitals trend analysis.
- **AI Engine:** Google Gemini API (gemini-3-flash) for automated report parsing and data extraction.
- **Backend & Storage:** Node.js logic implemented via a Service Pattern.
- **Database:** SQLite simulation via `localStorage` for rapid prototyping and offline-first capabilities.

## 🚀 Setup Instructions

Follow these steps to run the application on your local machine:

1. **Prerequisites**: Ensure you have [Node.js](https://nodejs.org/) installed (v18 or higher recommended).
2. **Create Project Folder**:
   ```bash
   mkdir vital-vault && cd vital-vault
   ```
3. **Copy Files**: Place all the project files (`index.html`, `App.tsx`, `index.tsx`, `package.json`, etc.) into this folder.
4. **Install Dependencies**:
   ```bash
   npm install
   ```
5. **Set API Key**:
   The application requires a Google Gemini API Key for the medical report parsing feature.
   ```bash
   # On macOS/Linux
   export API_KEY='your_api_key_here'
   # On Windows (PowerShell)
   $env:API_KEY='your_api_key_here'
   ```
6. **Start Development Server**:
   ```bash
   npm run dev
   ```
7. **Access the App**: Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 System Architecture

### Frontend (ReactJS)
- **UI Components**: Modular design using Tailwind CSS.
- **State Management**: Centralized React State for user session and health data.
- **API Integration**: Native Fetch and `@google/genai` SDK.

### Data Model (SQLite/Mock)
- **Users**: Owner (John Doe), Viewer (Dr. Smith, Jane Doe).
- **Reports**: Stores document metadata and Gemini-extracted insights.
- **Vitals**: Time-series data points for BP, Sugar, Heart Rate.

## 🔐 Security & Privacy
- **RBAC**: Strict separation between Owners and Viewers.
- **Data Protection**: All medical reports are processed using secure AI models.
- **Granular Sharing**: Owners must explicitly grant access to individual reports.

---
*Note: This prototype uses localStorage to simulate the SQLite database for zero-config demonstration. In production, the DB service would interface with a real SQLite/Node.js backend.*

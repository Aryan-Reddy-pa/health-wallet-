
import React from 'react';

const ArchitectureView: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Production-Ready Architecture</h2>
        <p className="text-slate-600 mb-8">
          A truly decoupled health stack utilizing modern browser APIs to simulate a production environment.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-indigo-50 border border-indigo-100">
            <h3 className="font-bold text-indigo-900 mb-3 flex items-center gap-2">
              <span>🏗️</span> Virtual Backend
            </h3>
            <ul className="text-xs text-indigo-800 space-y-2 leading-relaxed">
              <li>• <strong>Middleware</strong>: JWT token verification and RBAC enforcement.</li>
              <li>• <strong>Service Layer</strong>: Business logic separation from UI.</li>
              <li>• <strong>Security</strong>: SHA-256 password hashing.</li>
              <li>• <strong>File Ingestion</strong>: AI-driven OCR processing.</li>
            </ul>
          </div>

          <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-100">
            <h3 className="font-bold text-emerald-900 mb-3 flex items-center gap-2">
              <span>💾</span> IndexedDB Engine
            </h3>
            <ul className="text-xs text-emerald-800 space-y-2 leading-relaxed">
              <li>• <strong>Relational</strong>: Cross-referenced table structures.</li>
              <li>• <strong>Persistence</strong>: High-volume binary storage (Reports).</li>
              <li>• <strong>Indexing</strong>: High-speed queries on Date/UserID.</li>
              <li>• <strong>Reliability</strong>: Transactional integrity for health data.</li>
            </ul>
          </div>

          <div className="p-6 rounded-2xl bg-amber-50 border border-amber-100">
            <h3 className="font-bold text-amber-900 mb-3 flex items-center gap-2">
              <span>🛡️</span> Security Model
            </h3>
            <ul className="text-xs text-amber-800 space-y-2 leading-relaxed">
              <li>• <strong>JWT</strong>: Token-based stateful sessions.</li>
              <li>• <strong>Data Isolation</strong>: Strict record-level separation.</li>
              <li>• <strong>Access Control</strong>: Dynamic permission grants.</li>
              <li>• <strong>Safe Processing</strong>: Private key handling for AI.</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <h4 className="font-bold text-slate-800 mb-4">Database Schema Implementation</h4>
          <div className="space-y-3 font-mono text-[10px] text-slate-500">
             <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-indigo-600 font-bold">TABLE users</span> (id PRIMARY, email UNIQUE, pass_hash, role)
             </div>
             <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-indigo-600 font-bold">TABLE reports</span> (id PRIMARY, userId FK, blob, vitals_json)
             </div>
             <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-indigo-600 font-bold">TABLE access_control</span> (id, reportId FK, viewerId FK)
             </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <h4 className="font-bold text-slate-800 mb-4">Security Protocol</h4>
          <p className="text-xs text-slate-500 leading-loose">
            Every "API" call to the Virtual Backend checks the `Authorization` header. If a Viewer attempts to access a report not explicitly shared with them in the `access_control` table, the backend returns a **403 Forbidden** status, logged in the console below.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ArchitectureView;

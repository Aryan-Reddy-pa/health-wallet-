
import React, { useState, useEffect } from 'react';
import { User, UserRole, HealthReport, VitalRecord, BackendLog } from './types';
import { db } from './services/database';
import { api } from './services/api';
import { parseMedicalReport } from './services/geminiService';
import Layout from './components/Layout';
import VitalsCharts from './components/VitalsCharts';
import ArchitectureView from './components/ArchitectureView';

const App: React.FC = () => {
  const [user, setUser] = useState<Omit<User, 'passwordHash'> | null>(null);
  const [token, setToken] = useState<string | null>(sessionStorage.getItem('vv_token'));
  const [isRegistering, setIsRegistering] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [reports, setReports] = useState<HealthReport[]>([]);
  const [vitals, setVitals] = useState<VitalRecord[]>([]);
  const [allUsers, setAllUsers] = useState<Omit<User, 'passwordHash'>[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDbReady, setIsDbReady] = useState(false);
  const [authData, setAuthData] = useState({ email: '', password: '', name: '', role: UserRole.OWNER });
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  useEffect(() => {
    const initApp = async () => {
      try {
        await db.init();
        setIsDbReady(true);
        const storedToken = sessionStorage.getItem('vv_token');
        const storedUser = localStorage.getItem('vv_user');
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.error("Critical: Failed to initialize database", err);
      }
    };
    initApp();
  }, []);

  useEffect(() => {
    if (token && isDbReady) loadData();
  }, [token, isDbReady]);

  const loadData = async () => {
    if (!token) return;
    try {
      const [r, v, u] = await Promise.all([
        api.getReports(token),
        api.getVitals(token),
        api.getUsers(token)
      ]);
      setReports(r);
      setVitals(v);
      setAllUsers(u);
    } catch (err) {
      console.error("Load Data Error:", err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await api.login(authData.email, authData.password);
      setUser(res.user);
      setToken(res.token);
      sessionStorage.setItem('vv_token', res.token);
      localStorage.setItem('vv_user', JSON.stringify(res.user));
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await api.register(authData.name, authData.email, authData.password, authData.role);
      setUser(res.user);
      setToken(res.token);
      sessionStorage.setItem('vv_token', res.token);
      localStorage.setItem('vv_user', JSON.stringify(res.user));
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    sessionStorage.removeItem('vv_token');
    localStorage.removeItem('vv_user');
  };

  const processReport = async (base64: string, fileName: string, fileType: string) => {
    setIsLoading(true);
    setUploadStatus("AI Ingestion Engine: Parsing Report...");

    try {
      const extracted = await parseMedicalReport(base64);
      
      const newReport = await api.saveReport(token!, {
        title: extracted?.title || fileName,
        category: extracted?.category || 'General Health',
        date: extracted?.date || new Date().toISOString().split('T')[0],
        fileBlob: base64,
        mimeType: fileType,
        vitalsExtracted: extracted?.vitals || {},
      });

      if (extracted?.vitals) {
        for (const [type, value] of Object.entries(extracted.vitals)) {
          if (typeof value === 'number') {
            await api.saveVital(token!, {
              userId: user!.id,
              date: newReport.date,
              type: type as any,
              value: value,
              unit: type === 'BP' ? 'mmHg' : type === 'Sugar' ? 'mg/dL' : 'bpm'
            });
          }
        }
      }
      await loadData();
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setIsLoading(false);
      setUploadStatus(null);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !token || !user) return;
    const reader = new FileReader();
    reader.onloadend = () => processReport(reader.result as string, file.name, file.type);
    reader.readAsDataURL(file);
  };

  const simulateSample = (type: 'blood' | 'heart') => {
    // These are actual tiny base64 encoded transparent pixels just to satisfy the MIME requirement
    const mockBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==";
    const name = type === 'blood' ? "Diagnostic_Blood_Panel.pdf" : "Cardio_Stress_Test.jpg";
    processReport(mockBase64, name, type === 'blood' ? "application/pdf" : "image/jpeg");
  };

  if (!isDbReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-indigo-300 font-medium animate-pulse">Initializing Secure Vault...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    const inputClasses = "w-full p-4 rounded-xl bg-slate-900 !text-white placeholder-slate-300 border border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all caret-white";
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-950 font-sans">
        <div className="bg-white w-full max-w-md p-10 rounded-3xl shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 z-0"></div>
          <div className="relative z-10">
            <div className="mb-8 text-center">
              <div className="w-16 h-16 bg-indigo-600 rounded-2xl mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-indigo-200">V</div>
              <h1 className="text-3xl font-bold text-slate-800">VitalVault 2.0</h1>
              <p className="text-slate-500 mt-2">{isRegistering ? 'Create your health wallet' : 'Secure Medical Portal'}</p>
            </div>
            <form onSubmit={isRegistering ? handleRegister : handleLogin} className="space-y-4">
              {isRegistering && (
                <>
                  <input type="text" placeholder="Full Name" className={inputClasses} value={authData.name} onChange={e => setAuthData({...authData, name: e.target.value})} required />
                  <select className="w-full p-4 rounded-xl bg-slate-900 !text-white border border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all cursor-pointer" value={authData.role} onChange={e => setAuthData({...authData, role: e.target.value as UserRole})}>
                    <option value={UserRole.OWNER}>I am a Patient (Owner)</option>
                    <option value={UserRole.VIEWER}>I am a Doctor/Family (Viewer)</option>
                  </select>
                </>
              )}
              <input type="email" placeholder="Email Address" className={inputClasses} value={authData.email} onChange={e => setAuthData({...authData, email: e.target.value})} required />
              <input type="password" placeholder="Password" className={inputClasses} value={authData.password} onChange={e => setAuthData({...authData, password: e.target.value})} required />
              <button type="submit" disabled={isLoading} className="w-full bg-indigo-600 text-white p-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg disabled:opacity-50 mt-2">
                {isLoading ? 'Processing...' : isRegistering ? 'Sign Up' : 'Sign In'}
              </button>
            </form>
            <div className="mt-8 text-center text-sm text-slate-500">
              {isRegistering ? 'Already have an account?' : "Don't have an account?"}
              <button onClick={() => setIsRegistering(!isRegistering)} className="ml-2 text-indigo-600 font-bold hover:underline">
                {isRegistering ? 'Login here' : 'Register here'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Layout user={user as User} onLogout={handleLogout} activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'dashboard' && (
        <div className="space-y-8 animate-in fade-in duration-500">
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Patient Dashboard</h1>
              <p className="text-slate-500">Securely viewing your health trends.</p>
            </div>
            {user.role === UserRole.OWNER && (
              <div className="flex gap-2">
                <label className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold cursor-pointer hover:bg-indigo-700 transition-all shadow-lg flex items-center gap-2">
                  <span>📤</span>
                  <span>Upload Report</span>
                  <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*,application/pdf" />
                </label>
              </div>
            )}
          </header>

          <section className="bg-slate-900 rounded-3xl p-6 text-white border border-slate-800 shadow-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 opacity-10 pointer-events-none text-9xl">🔬</div>
            <h2 className="text-lg font-bold mb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full"></span> 
              Test Lab: Immediate Verification
            </h2>
            <p className="text-slate-400 text-sm mb-6 max-w-lg">Don't have a medical report image handy? Click a button below to simulate an AI-powered ingestion of sample data.</p>
            <div className="flex flex-wrap gap-4">
              <button onClick={() => simulateSample('blood')} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-bold transition-all">
                Simulate: Blood Test (Sugar Trend)
              </button>
              <button onClick={() => simulateSample('heart')} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-bold transition-all">
                Simulate: ECG/Heart Report (BP Trend)
              </button>
            </div>
          </section>

          {uploadStatus && (
            <div className="bg-indigo-600 text-white p-4 rounded-xl flex items-center gap-4 animate-pulse">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              {uploadStatus}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <VitalsCharts data={vitals} type="BP" color="#6366f1" title="Blood Pressure History" />
            <VitalsCharts data={vitals} type="Sugar" color="#f59e0b" title="Glucose Levels (mg/dL)" />
          </div>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <span>🗂️</span> Recent Records
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {reports.slice(0, 3).reverse().map(report => (
                <div key={report.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:translate-y-[-4px] transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-bold uppercase">{report.category}</span>
                    <span className="text-[10px] text-slate-400">{report.date}</span>
                  </div>
                  <h3 className="font-bold text-slate-800 mb-4 truncate">{report.title}</h3>
                  <div className="flex gap-2">
                    {Object.keys(report.vitalsExtracted).map(v => (
                      <span key={v} className="text-[9px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full font-bold">{v} EXTRACTED</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
          <h1 className="text-2xl font-bold text-slate-800">Wallet Contents</h1>
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b">
                <tr>
                  <th className="px-6 py-4">Document</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Security</th>
                  <th className="px-6 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-sm">
                {reports.map(r => (
                  <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-700">{r.title}</td>
                    <td className="px-6 py-4">{r.category}</td>
                    <td className="px-6 py-4 text-slate-500">{r.date}</td>
                    <td className="px-6 py-4">
                       {r.userId === user.id ? <span className="text-indigo-500 bg-indigo-50 px-2 py-1 rounded text-[10px] font-bold">OWNER</span> : <span className="text-amber-500 bg-amber-50 px-2 py-1 rounded text-[10px] font-bold">SHARED</span>}
                    </td>
                    <td className="px-6 py-4">
                      <button onClick={() => {
                        const dr = allUsers.find(u => u.role === UserRole.VIEWER);
                        if (dr) api.shareReport(token!, r.id, dr.id).then(() => { alert('Shared with ' + dr.name); loadData(); });
                      }} className="text-indigo-600 font-bold hover:underline">Share with Dr.</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'vitals' && (
        <div className="space-y-8">
          <h1 className="text-2xl font-bold text-slate-800">Relational Vitals View</h1>
          <div className="grid grid-cols-1 gap-8">
            <VitalsCharts data={vitals} type="BP" color="#6366f1" title="Blood Pressure Monitoring" />
            <VitalsCharts data={vitals} type="Sugar" color="#f59e0b" title="Blood Glucose Trends" />
            <VitalsCharts data={vitals} type="HeartRate" color="#ef4444" title="Heart Rate Stability" />
          </div>
        </div>
      )}

      {activeTab === 'share' && (
        <div className="space-y-8 animate-in fade-in duration-500">
           <h1 className="text-2xl font-bold text-slate-800">Access Control Management</h1>
           <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800 mb-6">Trusted Viewers</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {allUsers.filter(u => u.role === UserRole.VIEWER).map(v => (
                   <div key={v.id} className="flex items-center gap-4 p-4 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors">
                      <img src={v.avatar} className="w-12 h-12 rounded-full" />
                      <div>
                        <p className="font-bold text-slate-800">{v.name}</p>
                        <p className="text-xs text-slate-500">{v.email}</p>
                      </div>
                      <button className="ml-auto text-xs font-bold text-indigo-600">MANAGE ACCESS</button>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      )}

      {activeTab === 'arch' && <ArchitectureView />}
    </Layout>
  );
};

export default App;

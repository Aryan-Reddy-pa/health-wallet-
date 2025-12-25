
import { User, UserRole, HealthReport, VitalRecord } from '../types';

// Mocking the Backend/SQLite behavior using LocalStorage
const STORAGE_KEYS = {
  USERS: 'vv_users',
  REPORTS: 'vv_reports',
  VITALS: 'vv_vitals',
  CURRENT_USER: 'vv_current_user'
};

export const DB = {
  getUsers: (): User[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]'),
  
  getReports: (userId: string): HealthReport[] => {
    const reports: HealthReport[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.REPORTS) || '[]');
    
    // Logic: User can see their own reports OR reports shared with them
    // Fix: Access sharedWith property which now exists on the interface
    return reports.filter(r => r.userId === userId || (r.sharedWith && r.sharedWith.includes(userId)));
  },

  getVitals: (userId: string): VitalRecord[] => {
    const vitals: VitalRecord[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.VITALS) || '[]');
    return vitals.filter(v => v.userId === userId);
  },

  saveReport: (report: HealthReport) => {
    const reports = JSON.parse(localStorage.getItem(STORAGE_KEYS.REPORTS) || '[]');
    reports.push(report);
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
  },

  saveVital: (vital: VitalRecord) => {
    const vitals = JSON.parse(localStorage.getItem(STORAGE_KEYS.VITALS) || '[]');
    vitals.push(vital);
    localStorage.setItem(STORAGE_KEYS.VITALS, JSON.stringify(vitals));
  },

  updateReportSharing: (reportId: string, shareWithUserId: string) => {
    const reports: HealthReport[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.REPORTS) || '[]');
    const idx = reports.findIndex(r => r.id === reportId);
    if (idx !== -1) {
      // Fix: Initialize and push to sharedWith array
      if (!reports[idx].sharedWith) reports[idx].sharedWith = [];
      if (!reports[idx].sharedWith.includes(shareWithUserId)) {
        reports[idx].sharedWith.push(shareWithUserId);
        localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
      }
    }
  },

  getCurrentUser: (): User | null => {
    const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return user ? JSON.parse(user) : null;
  },

  setCurrentUser: (user: User | null) => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  },

  seed: () => {
    if (DB.getUsers().length === 0) {
      // Fix: Added missing passwordHash and createdAt properties to mock data
      const mockUsers: User[] = [
        { id: 'u1', name: 'John Doe', email: 'john@example.com', role: UserRole.OWNER, avatar: 'https://picsum.photos/seed/john/100', passwordHash: 'mock_hash', createdAt: new Date().toISOString() },
        { id: 'u2', name: 'Dr. Smith', email: 'smith@clinic.com', role: UserRole.VIEWER, avatar: 'https://picsum.photos/seed/doctor/100', passwordHash: 'mock_hash', createdAt: new Date().toISOString() },
        { id: 'u3', name: 'Jane Doe', email: 'jane@family.com', role: UserRole.VIEWER, avatar: 'https://picsum.photos/seed/jane/100', passwordHash: 'mock_hash', createdAt: new Date().toISOString() },
      ];
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(mockUsers));
      
      const mockVitals: VitalRecord[] = [
        { id: 'v1', userId: 'u1', date: '2024-05-01', type: 'BP', value: 120, unit: 'mmHg' },
        { id: 'v2', userId: 'u1', date: '2024-05-05', type: 'BP', value: 125, unit: 'mmHg' },
        { id: 'v3', userId: 'u1', date: '2024-05-10', type: 'BP', value: 118, unit: 'mmHg' },
        { id: 'v4', userId: 'u1', date: '2024-05-15', type: 'BP', value: 122, unit: 'mmHg' },
        { id: 'v5', userId: 'u1', date: '2024-05-01', type: 'Sugar', value: 95, unit: 'mg/dL' },
        { id: 'v6', userId: 'u1', date: '2024-05-10', type: 'Sugar', value: 105, unit: 'mg/dL' },
      ];
      localStorage.setItem(STORAGE_KEYS.VITALS, JSON.stringify(mockVitals));
    }
  }
};
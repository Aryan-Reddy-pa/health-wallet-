
import { db } from './database';
import { User, UserRole, AuthResponse, BackendLog, VitalRecord, HealthReport, AccessControl } from '../types';

// Mock JWT secret
const SECRET = 'vitalvault-2024-secure-key';

export class VirtualBackend {
  private logs: BackendLog[] = [];

  private log(method: any, path: string, status: number, message: string) {
    this.logs.unshift({ timestamp: new Date().toLocaleTimeString(), method, path, status, message });
    console.log(`[BACKEND] ${method} ${path} - ${status}: ${message}`);
  }

  getLogs() { return this.logs; }

  // Security Middleware
  private async verifyToken(token: string): Promise<string | null> {
    try {
      if (!token.startsWith('Bearer ')) return null;
      const t = token.split(' ')[1];
      const [userId, sig] = t.split('.');
      if (sig !== btoa(SECRET)) return null;
      return userId;
    } catch { return null; }
  }

  private async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // AUTH ROUTES
  async register(name: string, email: string, password: string, role: UserRole): Promise<AuthResponse> {
    const existing = (await db.getAll<User>('users')).find(u => u.email === email);
    if (existing) {
      this.log('POST', '/auth/register', 400, 'User already exists');
      throw new Error("User already exists");
    }

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name, email,
      passwordHash: await this.hashPassword(password),
      role,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      createdAt: new Date().toISOString()
    };

    await db.add('users', newUser);
    const token = `Bearer ${newUser.id}.${btoa(SECRET)}`;
    this.log('POST', '/auth/register', 201, `User ${name} created`);
    
    const { passwordHash, ...userWithoutPass } = newUser;
    return { user: userWithoutPass, token };
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const hash = await this.hashPassword(password);
    const user = (await db.getAll<User>('users')).find(u => u.email === email && u.passwordHash === hash);

    if (!user) {
      this.log('POST', '/auth/login', 401, 'Invalid credentials');
      throw new Error("Invalid credentials");
    }

    const token = `Bearer ${user.id}.${btoa(SECRET)}`;
    this.log('POST', '/auth/login', 200, `Login successful for ${user.name}`);
    
    const { passwordHash, ...userWithoutPass } = user;
    return { user: userWithoutPass, token };
  }

  // DATA ROUTES
  async getReports(token: string): Promise<HealthReport[]> {
    const userId = await this.verifyToken(token);
    if (!userId) throw new Error("Unauthorized");

    const allReports = await db.getAll<HealthReport>('reports');
    const myReports = allReports.filter(r => r.userId === userId);
    
    // Get shared reports
    const shares = await db.getAll<AccessControl>('access_control');
    const sharedWithMeIds = shares.filter(s => s.viewerId === userId).map(s => s.reportId);
    const sharedReports = allReports.filter(r => sharedWithMeIds.includes(r.id));

    this.log('GET', '/reports', 200, `Retrieved ${myReports.length + sharedReports.length} reports`);
    return [...myReports, ...sharedReports];
  }

  // Fix: Updated signature to omit internal fields (userId, sharedWith) derived by the server
  async saveReport(token: string, report: Omit<HealthReport, 'id' | 'userId' | 'sharedWith'>): Promise<HealthReport> {
    const userId = await this.verifyToken(token);
    if (!userId) throw new Error("Unauthorized");

    const newReport: HealthReport = { 
      ...report, 
      id: Math.random().toString(36).substr(2, 9), 
      userId,
      sharedWith: [] 
    };
    await db.add('reports', newReport);
    this.log('POST', '/reports', 201, `Report saved: ${report.title}`);
    return newReport;
  }

  async shareReport(token: string, reportId: string, viewerId: string): Promise<void> {
    const userId = await this.verifyToken(token);
    if (!userId) throw new Error("Unauthorized");

    const share: AccessControl = {
      id: Math.random().toString(36).substr(2, 9),
      reportId, ownerId: userId, viewerId,
      grantedAt: new Date().toISOString()
    };

    await db.add('access_control', share);
    this.log('POST', '/reports/share', 200, `Report shared with user ${viewerId}`);
  }

  async getVitals(token: string): Promise<VitalRecord[]> {
    const userId = await this.verifyToken(token);
    if (!userId) throw new Error("Unauthorized");

    const all = await db.getAll<VitalRecord>('vitals');
    const myVitals = all.filter(v => v.userId === userId);
    this.log('GET', '/vitals', 200, `Retrieved ${myVitals.length} vitals`);
    return myVitals;
  }

  async saveVital(token: string, vital: Omit<VitalRecord, 'id'>): Promise<void> {
    const userId = await this.verifyToken(token);
    if (!userId) throw new Error("Unauthorized");

    const newVital = { ...vital, id: Math.random().toString(36).substr(2, 9), userId };
    await db.add('vitals', newVital);
    this.log('POST', '/vitals', 201, `Vital recorded: ${vital.type}`);
  }

  async getUsers(token: string): Promise<Omit<User, 'passwordHash'>[]> {
    const userId = await this.verifyToken(token);
    if (!userId) throw new Error("Unauthorized");
    const all = await db.getAll<User>('users');
    return all.map(({ passwordHash, ...rest }) => rest);
  }
}

export const api = new VirtualBackend();
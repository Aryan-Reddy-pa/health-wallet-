
export enum UserRole {
  OWNER = 'OWNER',
  VIEWER = 'VIEWER' // Doctor/Family
}

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  avatar: string;
  createdAt: string;
}

export interface AuthResponse {
  user: Omit<User, 'passwordHash'>;
  token: string;
}

export interface VitalRecord {
  id: string;
  userId: string;
  date: string;
  type: 'BP' | 'Sugar' | 'HeartRate' | 'SpO2' | 'Weight';
  value: number;
  unit: string;
}

export interface HealthReport {
  id: string;
  userId: string;
  title: string;
  category: string;
  date: string;
  fileBlob: string; // Base64
  mimeType: string;
  vitalsExtracted: Partial<Record<VitalRecord['type'], number>>;
  // Added sharedWith property to fix errors in services/db.ts
  sharedWith: string[];
}

export interface AccessControl {
  id: string;
  reportId: string;
  ownerId: string;
  viewerId: string;
  grantedAt: string;
}

export interface BackendLog {
  timestamp: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  status: number;
  message: string;
}
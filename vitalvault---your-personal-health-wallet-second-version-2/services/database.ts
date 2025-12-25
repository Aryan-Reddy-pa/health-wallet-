
import { User, VitalRecord, HealthReport, AccessControl } from '../types';

const DB_NAME = 'VitalVaultDB';
const DB_VERSION = 1;

export class Database {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        if (!db.objectStoreNames.contains('users')) {
          db.createObjectStore('users', { keyPath: 'id' }).createIndex('email', 'email', { unique: true });
        }
        if (!db.objectStoreNames.contains('vitals')) {
          db.createObjectStore('vitals', { keyPath: 'id' }).createIndex('userId', 'userId');
        }
        if (!db.objectStoreNames.contains('reports')) {
          db.createObjectStore('reports', { keyPath: 'id' }).createIndex('userId', 'userId');
        }
        if (!db.objectStoreNames.contains('access_control')) {
          db.createObjectStore('access_control', { keyPath: 'id' }).createIndex('viewerId', 'viewerId');
        }
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      request.onerror = () => reject(request.error);
    });
  }

  private getStore(name: string, mode: IDBTransactionMode = 'readonly') {
    if (!this.db) throw new Error("DB not initialized");
    return this.db.transaction(name, mode).objectStore(name);
  }

  // Generic CRUD
  async add<T>(storeName: string, data: T): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = this.getStore(storeName, 'readwrite').add(data);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getAll<T>(storeName: string): Promise<T[]> {
    return new Promise((resolve, reject) => {
      const request = this.getStore(storeName).getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getById<T>(storeName: string, id: string): Promise<T | null> {
    return new Promise((resolve, reject) => {
      const request = this.getStore(storeName).get(id);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async delete(storeName: string, id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = this.getStore(storeName, 'readwrite').delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}

export const db = new Database();

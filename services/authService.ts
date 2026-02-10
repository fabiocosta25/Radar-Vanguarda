
import { User, UserRole } from '../types';

const DB_STORAGE_KEY = 'radar_sqlite_db';
const SESSION_KEY = 'radar_session';

let db: any = null;

// Função de Hash simples para o protótipo (sal e b64)
const simpleHash = (text: string) => {
  return btoa(`salt_radar_${text}_security`);
};

const uint8ToBase64 = (u8Arr: Uint8Array) => {
  let b64 = "";
  for (let i = 0; i < u8Arr.byteLength; i++) {
    b64 += String.fromCharCode(u8Arr[i]);
  }
  return btoa(b64);
};

const base64ToUint8 = (base64: string) => {
  const binary = atob(base64);
  const u8Arr = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    u8Arr[i] = binary.charCodeAt(i);
  }
  return u8Arr;
};

export const authService = {
  initialize: async () => {
    if (db) return;

    // @ts-ignore
    const SQL = await window.initSqlJs({
      locateFile: (file: string) => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.12.0/${file}`
    });

    const savedDb = localStorage.getItem(DB_STORAGE_KEY);
    
    if (savedDb) {
      db = new SQL.Database(base64ToUint8(savedDb));
    } else {
      db = new SQL.Database();
      db.run(`
        CREATE TABLE users (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          role TEXT NOT NULL
        )
      `);

      const insert = db.prepare("INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)");
      insert.run(['1', 'Diretor Editorial', 'admin@radar.ia', simpleHash('admin123'), 'admin']);
      insert.run(['2', 'Editor de SJC', 'editor@radar.ia', simpleHash('editor123'), 'editor']);
      insert.free();
      
      authService.saveToLocalStorage();
    }
  },

  saveToLocalStorage: () => {
    if (db) {
      const data = db.export();
      localStorage.setItem(DB_STORAGE_KEY, uint8ToBase64(data));
    }
  },

  login: (email: string, password: string): User | null => {
    if (!db) return null;

    const hashedPassword = simpleHash(password);
    const stmt = db.prepare("SELECT id, name, email, role FROM users WHERE email = ? AND password = ?");
    stmt.bind([email, hashedPassword]);
    
    if (stmt.step()) {
      const row = stmt.getAsObject();
      const user: User = {
        id: row.id as string,
        name: row.name as string,
        email: row.email as string,
        role: row.role as UserRole
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
      stmt.free();
      return user;
    }
    
    stmt.free();
    return null;
  },

  register: (name: string, email: string, password: string, role: UserRole): User | null => {
    if (!db) return null;

    try {
      const id = Math.random().toString(36).substr(2, 9);
      const hashedPassword = simpleHash(password);
      
      const stmt = db.prepare("INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)");
      stmt.run([id, name, email, hashedPassword, role]);
      stmt.free();

      const newUser: User = { id, name, email, role };
      authService.saveToLocalStorage();
      localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
      return newUser;
    } catch (e) {
      console.error("Erro ao registrar no SQLite:", e);
      return null;
    }
  },

  logout: () => {
    localStorage.removeItem(SESSION_KEY);
  },

  getCurrentUser: (): User | null => {
    const session = localStorage.getItem(SESSION_KEY);
    return session ? JSON.parse(session) : null;
  },

  getUsers: (): User[] => {
    if (!db) return [];
    const users: User[] = [];
    const stmt = db.prepare("SELECT id, name, email, role FROM users");
    while (stmt.step()) {
      const row = stmt.getAsObject();
      users.push({
        id: row.id as string,
        name: row.name as string,
        email: row.email as string,
        role: row.role as UserRole
      });
    }
    stmt.free();
    return users;
  }
};

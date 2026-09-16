import { hashPassword, generateSecureToken, RateLimiter, SessionManager, AuditLogger } from './security';

export type UserRole = 'admin' | 'manager' | 'agent' | 'viewer';

export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  active: boolean;
  createdAt: string;
  lastLogin?: string;
  failedAttempts: number;
  lockedUntil?: number;
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
}

export interface Session {
  id: string;
  userId: string;
  token: string;
  createdAt: number;
  expiresAt: number;
  ipAddress?: string;
  userAgent?: string;
}

export interface Permission {
  module: string;
  actions: ('read' | 'write' | 'delete' | 'admin')[];
}

// Role-based permissions
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: [
    { module: '*', actions: ['read', 'write', 'delete', 'admin'] }
  ],
  manager: [
    { module: 'contacts', actions: ['read', 'write', 'delete'] },
    { module: 'quotations', actions: ['read', 'write', 'delete'] },
    { module: 'orders', actions: ['read', 'write', 'delete'] },
    { module: 'invoices', actions: ['read', 'write'] },
    { module: 'inventory', actions: ['read', 'write'] },
    { module: 'reports', actions: ['read'] }
  ],
  agent: [
    { module: 'contacts', actions: ['read', 'write'] },
    { module: 'quotations', actions: ['read', 'write'] },
    { module: 'orders', actions: ['read', 'write'] },
    { module: 'invoices', actions: ['read'] },
    { module: 'inventory', actions: ['read'] }
  ],
  viewer: [
    { module: 'contacts', actions: ['read'] },
    { module: 'quotations', actions: ['read'] },
    { module: 'orders', actions: ['read'] },
    { module: 'invoices', actions: ['read'] }
  ]
};

// Initial admin user (password: Admin@2026!)
export const initialUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@openerp-canarias.es',
    passwordHash: '', // Will be set on first run
    role: 'admin',
    active: true,
    createdAt: new Date().toISOString(),
    failedAttempts: 0,
    twoFactorEnabled: false
  }
];

export class AuthService {
  private users: User[] = [...initialUsers];
  private sessions: Map<string, Session> = new Map();
  private rateLimiter = new RateLimiter(5, 15 * 60 * 1000); // 5 attempts, 15 min window
  private sessionManager = new SessionManager();
  private auditLogger = new AuditLogger();
  private initialized = false;

  async initialize(): Promise<void> {
    if (this.initialized) return;
    
    // Hash admin password on first run
    const adminUser = this.users.find(u => u.username === 'admin');
    if (adminUser && !adminUser.passwordHash) {
      adminUser.passwordHash = await hashPassword('Admin@2026!');
    }
    
    this.initialized = true;
  }

  async login(
    username: string,
    password: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<{ success: boolean; session?: Session; error?: string }> {
    await this.initialize();

    // Rate limiting
    if (!this.rateLimiter.canAttempt(username)) {
      const lockoutTime = this.rateLimiter.getLockoutTime(username);
      const remainingMinutes = lockoutTime ? Math.ceil((lockoutTime - Date.now()) / 60000) : 15;
      
      this.auditLogger.log(
        username,
        'LOGIN_RATE_LIMITED',
        'auth',
        `Too many attempts`,
        ipAddress,
        userAgent
      );
      
      return {
        success: false,
        error: `Account bloccato. Riprova tra ${remainingMinutes} minuti.`
      };
    }

    const user = this.users.find(u => u.username === username && u.active);
    if (!user) {
      this.rateLimiter.recordAttempt(username);
      this.auditLogger.log(
        username,
        'LOGIN_FAILED',
        'auth',
        'User not found',
        ipAddress,
        userAgent
      );
      return { success: false, error: 'Credenziali non valide' };
    }

    // Check if account is locked
    if (user.lockedUntil && user.lockedUntil > Date.now()) {
      const remainingMinutes = Math.ceil((user.lockedUntil - Date.now()) / 60000);
      return {
        success: false,
        error: `Account bloccato. Riprova tra ${remainingMinutes} minuti.`
      };
    }

    // Verify password
    const passwordHash = await hashPassword(password);
    if (passwordHash !== user.passwordHash) {
      this.rateLimiter.recordAttempt(username);
      user.failedAttempts++;
      
      // Lock account after 5 failed attempts
      if (user.failedAttempts >= 5) {
        user.lockedUntil = Date.now() + 30 * 60 * 1000; // 30 minutes
        this.auditLogger.log(
          username,
          'ACCOUNT_LOCKED',
          'auth',
          'Too many failed attempts',
          ipAddress,
          userAgent
        );
      }
      
      this.auditLogger.log(
        username,
        'LOGIN_FAILED',
        'auth',
        'Invalid password',
        ipAddress,
        userAgent
      );
      
      return {
        success: false,
        error: `Credenziali non valide. Tentativi rimanenti: ${this.rateLimiter.getRemainingAttempts(username)}`
      };
    }

    // Successful login
    user.failedAttempts = 0;
    user.lockedUntil = undefined;
    user.lastLogin = new Date().toISOString();

    // Create session
    const session: Session = {
      id: generateSecureToken(16),
      userId: user.id,
      token: generateSecureToken(32),
      createdAt: Date.now(),
      expiresAt: Date.now() + 8 * 60 * 60 * 1000, // 8 hours
      ipAddress,
      userAgent
    };

    this.sessions.set(session.token, session);
    this.rateLimiter.attempts.delete(username); // Clear rate limiter on success
    
    this.auditLogger.log(
      user.id,
      'LOGIN_SUCCESS',
      'auth',
      `User ${username} logged in`,
      ipAddress,
      userAgent
    );

    return { success: true, session };
  }

  logout(token: string): void {
    const session = this.sessions.get(token);
    if (session) {
      this.auditLogger.log(
        session.userId,
        'LOGOUT',
        'auth',
        'User logged out'
      );
      this.sessions.delete(token);
    }
  }

  validateSession(token: string): { valid: boolean; user?: User; session?: Session } {
    const session = this.sessions.get(token);
    if (!session) {
      return { valid: false };
    }

    // Check expiration
    if (Date.now() > session.expiresAt) {
      this.sessions.delete(token);
      return { valid: false };
    }

    // Check session timeout
    if (!this.sessionManager.isSessionValid()) {
      this.sessions.delete(token);
      return { valid: false };
    }

    const user = this.users.find(u => u.id === session.userId && u.active);
    if (!user) {
      this.sessions.delete(token);
      return { valid: false };
    }

    // Update activity
    this.sessionManager.updateActivity();

    return { valid: true, user, session };
  }

  hasPermission(userId: string, module: string, action: 'read' | 'write' | 'delete' | 'admin'): boolean {
    const user = this.users.find(u => u.id === userId);
    if (!user || !user.active) return false;

    const permissions = ROLE_PERMISSIONS[user.role];
    return permissions.some(perm => {
      if (perm.module === '*') return true;
      return perm.module === module && perm.actions.includes(action);
    });
  }

  getUser(userId: string): User | undefined {
    return this.users.find(u => u.id === userId);
  }

  getUsers(): User[] {
    return this.users.map(u => ({ ...u, passwordHash: '***' })); // Never expose password hashes
  }

  async createUser(
    username: string,
    email: string,
    password: string,
    role: UserRole,
    createdBy: string
  ): Promise<{ success: boolean; user?: User; error?: string }> {
    // Check if username exists
    if (this.users.some(u => u.username === username)) {
      return { success: false, error: 'Username già esistente' };
    }

    // Check if email exists
    if (this.users.some(u => u.email === email)) {
      return { success: false, error: 'Email già registrata' };
    }

    const passwordHash = await hashPassword(password);
    const newUser: User = {
      id: generateSecureToken(8),
      username,
      email,
      passwordHash,
      role,
      active: true,
      createdAt: new Date().toISOString(),
      failedAttempts: 0,
      twoFactorEnabled: false
    };

    this.users.push(newUser);
    
    this.auditLogger.log(
      createdBy,
      'USER_CREATED',
      'users',
      `Created user ${username} with role ${role}`
    );

    return { success: true, user: { ...newUser, passwordHash: '***' } };
  }

  updateUser(userId: string, updates: Partial<User>, updatedBy: string): boolean {
    const user = this.users.find(u => u.id === userId);
    if (!user) return false;

    Object.assign(user, updates);
    
    this.auditLogger.log(
      updatedBy,
      'USER_UPDATED',
      'users',
      `Updated user ${user.username}: ${Object.keys(updates).join(', ')}`
    );

    return true;
  }

  deactivateUser(userId: string, deactivatedBy: string): boolean {
    const user = this.users.find(u => u.id === userId);
    if (!user) return false;

    user.active = false;
    
    // Invalidate all sessions for this user
    for (const [token, session] of this.sessions.entries()) {
      if (session.userId === userId) {
        this.sessions.delete(token);
      }
    }

    this.auditLogger.log(
      deactivatedBy,
      'USER_DEACTIVATED',
      'users',
      `Deactivated user ${user.username}`
    );

    return true;
  }

  getAuditLogs() {
    return this.auditLogger.getLogs();
  }

  getAuditLogsByUser(userId: string) {
    return this.auditLogger.getLogsByUser(userId);
  }

  changePassword(userId: string, oldPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
    return (async () => {
      const user = this.users.find(u => u.id === userId);
      if (!user) return { success: false, error: 'Utente non trovato' };

      const oldHash = await hashPassword(oldPassword);
      if (oldHash !== user.passwordHash) {
        return { success: false, error: 'Password attuale non corretta' };
      }

      user.passwordHash = await hashPassword(newPassword);
      
      this.auditLogger.log(
        userId,
        'PASSWORD_CHANGED',
        'auth',
        'Password changed successfully'
      );

      return { success: true };
    })();
  }
}

// Singleton instance
export const authService = new AuthService();
// Security utilities - Updated 2026

/**
 * Sanitize user input to prevent XSS attacks
 */
export function sanitizeInput(input: string): string {
  if (!input) return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number (Spanish/International format)
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;
  return phoneRegex.test(phone);
}

/**
 * Generate secure random token
 */
export function generateSecureToken(length: number = 32): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Hash password (client-side simulation - real hashing should be server-side)
 */
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Validate password strength (2026 standards)
 */
export function validatePasswordStrength(password: string): {
  valid: boolean;
  score: number;
  feedback: string[];
} {
  const feedback: string[] = [];
  let score = 0;

  if (password.length >= 12) score += 2;
  else if (password.length >= 8) score += 1;
  else feedback.push('Minimo 8 caratteri');

  if (/[a-z]/.test(password)) score += 1;
  else feedback.push('Aggiungi lettere minuscole');

  if (/[A-Z]/.test(password)) score += 1;
  else feedback.push('Aggiungi lettere maiuscole');

  if (/[0-9]/.test(password)) score += 1;
  else feedback.push('Aggiungi numeri');

  if (/[^A-Za-z0-9]/.test(password)) score += 2;
  else feedback.push('Aggiungi caratteri speciali');

  // Check for common patterns
  const commonPatterns = ['password', '123456', 'qwerty', 'admin'];
  if (commonPatterns.some(pattern => password.toLowerCase().includes(pattern))) {
    score -= 2;
    feedback.push('Evita pattern comuni');
  }

  return {
    valid: score >= 5,
    score: Math.max(0, Math.min(7, score)),
    feedback
  };
}

/**
 * Rate limiter for login attempts
 */
export class RateLimiter {
  public attempts: Map<string, { count: number; lastAttempt: number }> = new Map();
  private maxAttempts: number;
  private windowMs: number;

  constructor(maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  canAttempt(key: string): boolean {
    const now = Date.now();
    const record = this.attempts.get(key);

    if (!record) return true;

    if (now - record.lastAttempt > this.windowMs) {
      this.attempts.delete(key);
      return true;
    }

    return record.count < this.maxAttempts;
  }

  recordAttempt(key: string): void {
    const now = Date.now();
    const record = this.attempts.get(key);

    if (!record || now - record.lastAttempt > this.windowMs) {
      this.attempts.set(key, { count: 1, lastAttempt: now });
    } else {
      record.count++;
      record.lastAttempt = now;
    }
  }

  getRemainingAttempts(key: string): number {
    const record = this.attempts.get(key);
    if (!record) return this.maxAttempts;
    return Math.max(0, this.maxAttempts - record.count);
  }

  getLockoutTime(key: string): number | null {
    const record = this.attempts.get(key);
    if (!record || record.count < this.maxAttempts) return null;
    return record.lastAttempt + this.windowMs;
  }
}

/**
 * Session manager with timeout
 */
export class SessionManager {
  private sessionTimeout: number = 30 * 60 * 1000; // 30 minutes
  private lastActivity: number = Date.now();

  setSessionTimeout(minutes: number): void {
    this.sessionTimeout = minutes * 60 * 1000;
  }

  updateActivity(): void {
    this.lastActivity = Date.now();
  }

  isSessionValid(): boolean {
    return Date.now() - this.lastActivity < this.sessionTimeout;
  }

  getTimeRemaining(): number {
    const elapsed = Date.now() - this.lastActivity;
    return Math.max(0, this.sessionTimeout - elapsed);
  }

  invalidate(): void {
    this.lastActivity = 0;
  }
}

/**
 * Content Security Policy helper
 */
export const CSP_HEADERS = {
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self'  https:",
    "connect-src 'self'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; '),
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
};

/**
 * Audit logger
 */
export class AuditLogger {
  private logs: Array<{
    timestamp: string;
    userId: string;
    action: string;
    resource: string;
    details: string;
    ipAddress?: string;
    userAgent?: string;
  }> = [];

  log(
    userId: string,
    action: string,
    resource: string,
    details: string = '',
    ipAddress?: string,
    userAgent?: string
  ): void {
    this.logs.push({
      timestamp: new Date().toISOString(),
      userId,
      action,
      resource,
      details,
      ipAddress,
      userAgent
    });

    // Keep only last 1000 entries in memory
    if (this.logs.length > 1000) {
      this.logs = this.logs.slice(-1000);
    }
  }

  getLogs(): typeof this.logs {
    return [...this.logs];
  }

  getLogsByUser(userId: string): typeof this.logs {
    return this.logs.filter(log => log.userId === userId);
  }

  getLogsByAction(action: string): typeof this.logs {
    return this.logs.filter(log => log.action === action);
  }

  clear(): void {
    this.logs = [];
  }
}

/**
 * Input validator
 */
export class InputValidator {
  static validateNIF(nif: string): boolean {
    const nifRegex = /^[A-Z0-9]{8,9}$/;
    return nifRegex.test(nif.toUpperCase());
  }

  static validateIBAN(iban: string): boolean {
    const ibanRegex = /^[A-Z]{2}\d{2}[A-Z0-9]{4}\d{7}[A-Z0-9]{0,16}$/;
    return ibanRegex.test(iban.toUpperCase().replace(/\s/g, ''));
  }

  static sanitizeHTML(html: string): string {
    return sanitizeInput(html);
  }

  static validateDate(date: string): boolean {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) return false;
    const d = new Date(date);
    return d instanceof Date && !isNaN(d.getTime());
  }

  static validateAmount(amount: number): boolean {
    return !isNaN(amount) && isFinite(amount) && amount >= 0;
  }
}

/**
 * Encryption utilities (for sensitive data at rest)
 */
export class EncryptionUtils {
  private static async getKey(): Promise<CryptoKey> {
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode('openerp-canarias-2026-secret-key'),
      { name: 'PBKDF2' },
      false,
      ['deriveBits', 'deriveKey']
    );

    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: new TextEncoder().encode('openerp-salt'),
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }

  static async encrypt(data: string): Promise<string> {
    const key = await this.getKey();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encoded = new TextEncoder().encode(data);

    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      encoded
    );

    const combined = new Uint8Array(iv.length + new Uint8Array(encrypted).length);
    combined.set(iv);
    combined.set(new Uint8Array(encrypted), iv.length);

    return btoa(String.fromCharCode(...combined));
  }

  static async decrypt(encryptedData: string): Promise<string> {
    const key = await this.getKey();
    const combined = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));

    const iv = combined.slice(0, 12);
    const data = combined.slice(12);

    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      data
    );

    return new TextDecoder().decode(decrypted);
  }
}

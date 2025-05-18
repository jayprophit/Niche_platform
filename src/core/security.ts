/**
 * Security Service
 * Handles authentication, authorization, and security features for the platform
 */
import { injectable } from 'inversify';
import 'reflect-metadata';
import { hash, compare } from 'bcryptjs';
import { sign, verify } from 'jsonwebtoken';

export interface SecurityConfig {
  jwt: {
    secret: string;
    expiresIn: string | number;
    refreshExpiresIn: string | number;
  };
  password: {
    saltRounds: number;
    minLength: number;
    requireSpecialChar: boolean;
    requireNumber: boolean;
    requireUppercase: boolean;
    requireLowercase: boolean;
  };
  ageRestriction: {
    defaultMinimumAge: number;
    chatMinimumAge: number;
    purchaseMinimumAge: number;
  };
  rateLimiting: {
    enabled: boolean;
    maxRequests: number;
    windowMs: number;
  };
}

export interface TokenPayload {
  userId: string;
  username: string;
  email: string;
  role: string;
  isVerified: boolean;
  dateOfBirth?: string;
  [key: string]: any;
}

export interface AuthResult {
  success: boolean;
  token?: string;
  refreshToken?: string;
  user?: any;
  message?: string;
}

@injectable()
export class SecurityService {
  private initialized: boolean = false;
  
  constructor(private readonly config: SecurityConfig) {}

  async initialize(): Promise<void> {
    if (this.initialized) {
      console.warn('Security service already initialized');
      return;
    }

    // Validate configuration
    this.validateConfig();
    
    this.initialized = true;
    console.log('Security service initialized');
  }

  private validateConfig(): void {
    if (!this.config.jwt.secret || this.config.jwt.secret.length < 32) {
      console.warn('JWT secret should be at least 32 characters long for security');
    }
    
    if (!this.config.password.minLength || this.config.password.minLength < 8) {
      console.warn('Password minimum length should be at least 8 characters');
    }
  }

  // Authentication methods
  async hashPassword(password: string): Promise<string> {
    return hash(password, this.config.password.saltRounds);
  }

  async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return compare(password, hashedPassword);
  }

  generateToken(payload: TokenPayload): string {
    return sign(payload, this.config.jwt.secret, {
      expiresIn: this.config.jwt.expiresIn
    });
  }

  generateRefreshToken(payload: Pick<TokenPayload, 'userId'>): string {
    return sign(payload, this.config.jwt.secret, {
      expiresIn: this.config.jwt.refreshExpiresIn
    });
  }

  verifyToken(token: string): TokenPayload | null {
    try {
      return verify(token, this.config.jwt.secret) as TokenPayload;
    } catch (error) {
      return null;
    }
  }

  // Password validation
  validatePassword(password: string): { isValid: boolean; message?: string } {
    if (password.length < this.config.password.minLength) {
      return {
        isValid: false,
        message: `Password must be at least ${this.config.password.minLength} characters long`
      };
    }

    if (this.config.password.requireSpecialChar && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return {
        isValid: false,
        message: 'Password must contain at least one special character'
      };
    }

    if (this.config.password.requireNumber && !/\d/.test(password)) {
      return {
        isValid: false,
        message: 'Password must contain at least one number'
      };
    }

    if (this.config.password.requireUppercase && !/[A-Z]/.test(password)) {
      return {
        isValid: false,
        message: 'Password must contain at least one uppercase letter'
      };
    }

    if (this.config.password.requireLowercase && !/[a-z]/.test(password)) {
      return {
        isValid: false,
        message: 'Password must contain at least one lowercase letter'
      };
    }

    return { isValid: true };
  }

  // Age verification
  verifyAge(dateOfBirth: Date, requiredAge: number = this.config.ageRestriction.defaultMinimumAge): boolean {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age >= requiredAge;
  }

  canAccessChat(dateOfBirth: Date): boolean {
    return this.verifyAge(dateOfBirth, this.config.ageRestriction.chatMinimumAge);
  }

  canMakePurchase(dateOfBirth: Date): boolean {
    return this.verifyAge(dateOfBirth, this.config.ageRestriction.purchaseMinimumAge);
  }

  // Role-based authorization
  hasPermission(userRole: string, requiredRoles: string[]): boolean {
    // Define role hierarchy
    const roleHierarchy: Record<string, number> = {
      'admin': 100,
      'moderator': 80,
      'business': 60,
      'premium': 40,
      'user': 20,
      'guest': 10
    };
    
    const userRoleValue = roleHierarchy[userRole] || 0;
    
    // Check if user role is in required roles or has a higher role
    return requiredRoles.some(role => {
      const requiredRoleValue = roleHierarchy[role] || 0;
      return userRole === role || userRoleValue >= requiredRoleValue;
    });
  }

  // Health check
  async healthCheck() {
    return {
      status: this.initialized ? 'healthy' : 'unhealthy',
      details: {
        initialized: this.initialized,
        ageRestrictions: {
          defaultMinimumAge: this.config.ageRestriction.defaultMinimumAge,
          chatMinimumAge: this.config.ageRestriction.chatMinimumAge,
          purchaseMinimumAge: this.config.ageRestriction.purchaseMinimumAge
        },
        rateLimiting: {
          enabled: this.config.rateLimiting.enabled,
          maxRequests: this.config.rateLimiting.maxRequests,
          windowMs: this.config.rateLimiting.windowMs
        }
      }
    };
  }

  // Cleanup
  async shutdown(): Promise<void> {
    this.initialized = false;
    console.log('Security service shutdown complete');
  }
}

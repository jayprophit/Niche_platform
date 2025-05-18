/**
 * Core Platform Service
 * Manages initialization and coordination between all platform modules
 */
import { injectable, inject } from 'inversify';
import 'reflect-metadata';
import { DatabaseService } from './database';
import { SecurityService } from './security';
import { MessagingService } from './messaging';
import { MonitoringService } from './monitoring';
import { EventBusService } from './eventBus';
import { CacheService } from './cache';

// Module interfaces
import { SocialModule } from '../modules/social/socialModule';
import { EcommerceModule } from '../modules/ecommerce/ecommerceModule';
import { ElearningModule } from '../modules/elearning/elearningModule';
import { JobsModule } from '../modules/jobs/jobsModule';
import { BlogModule } from '../modules/blog/blogModule';
import { BlockchainModule } from '../modules/blockchain/blockchainModule';
import { AIModule } from '../modules/ai/aiModule';

export interface PlatformConfig {
  environment: 'development' | 'staging' | 'production';
  modules: {
    social: boolean;
    ecommerce: boolean;
    elearning: boolean;
    jobs: boolean;
    blog: boolean;
    blockchain: boolean;
    ai: boolean;
  };
  services: {
    database: any;
    security: any;
    messaging: any;
    monitoring: any;
    eventBus: any;
    cache: any;
  };
}

export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  modules: {
    [key: string]: {
      status: 'healthy' | 'degraded' | 'unhealthy';
      message?: string;
    };
  };
  services: {
    [key: string]: {
      status: 'healthy' | 'degraded' | 'unhealthy';
      message?: string;
    };
  };
}

@injectable()
export class PlatformCore {
  private readonly modules: Map<string, any>;
  private readonly services: Map<string, any>;
  private initialized: boolean = false;

  constructor(private readonly config: PlatformConfig) {
    this.modules = new Map();
    this.services = new Map();
  }

  async initialize(): Promise<void> {
    if (this.initialized) {
      console.warn('Platform already initialized');
      return;
    }

    try {
      console.log(`Initializing platform in ${this.config.environment} mode`);
      
      // Initialize core services
      await this.initializeServices();
      
      // Initialize business modules
      await this.initializeModules();
      
      // Setup cross-module communication
      const eventBus = this.services.get('eventBus');
      await eventBus.connectModules(Array.from(this.modules.values()));
      
      // Start monitoring
      const monitoring = this.services.get('monitoring');
      await monitoring.start({
        modules: this.modules,
        services: this.services
      });
      
      this.initialized = true;
      console.log('Platform initialization complete');
    } catch (error) {
      console.error('Platform initialization failed:', error);
      throw error;
    }
  }

  private async initializeServices(): Promise<void> {
    // Database service
    const database = new DatabaseService(this.config.services.database);
    await database.initialize();
    this.services.set('database', database);

    // Security service
    const security = new SecurityService(this.config.services.security);
    await security.initialize();
    this.services.set('security', security);

    // Messaging service
    const messaging = new MessagingService(this.config.services.messaging);
    await messaging.initialize();
    this.services.set('messaging', messaging);

    // Event bus service
    const eventBus = new EventBusService(this.config.services.eventBus);
    await eventBus.initialize();
    this.services.set('eventBus', eventBus);

    // Cache service
    const cache = new CacheService(this.config.services.cache);
    await cache.initialize();
    this.services.set('cache', cache);

    // Monitoring service
    const monitoring = new MonitoringService(this.config.services.monitoring);
    await monitoring.initialize();
    this.services.set('monitoring', monitoring);

    console.log('Core services initialized');
  }

  private async initializeModules(): Promise<void> {
    const serviceMap = {
      database: this.services.get('database'),
      security: this.services.get('security'),
      messaging: this.services.get('messaging'),
      eventBus: this.services.get('eventBus'),
      cache: this.services.get('cache')
    };

    // Initialize enabled modules
    if (this.config.modules.social) {
      const socialModule = new SocialModule(serviceMap);
      await socialModule.initialize();
      this.modules.set('social', socialModule);
    }

    if (this.config.modules.ecommerce) {
      const ecommerceModule = new EcommerceModule(serviceMap);
      await ecommerceModule.initialize();
      this.modules.set('ecommerce', ecommerceModule);
    }

    if (this.config.modules.elearning) {
      const elearningModule = new ElearningModule(serviceMap);
      await elearningModule.initialize();
      this.modules.set('elearning', elearningModule);
    }

    if (this.config.modules.jobs) {
      const jobsModule = new JobsModule(serviceMap);
      await jobsModule.initialize();
      this.modules.set('jobs', jobsModule);
    }

    if (this.config.modules.blog) {
      const blogModule = new BlogModule(serviceMap);
      await blogModule.initialize();
      this.modules.set('blog', blogModule);
    }

    if (this.config.modules.blockchain) {
      const blockchainModule = new BlockchainModule(serviceMap);
      await blockchainModule.initialize();
      this.modules.set('blockchain', blockchainModule);
    }

    if (this.config.modules.ai) {
      const aiModule = new AIModule(serviceMap);
      await aiModule.initialize();
      this.modules.set('ai', aiModule);
    }

    console.log('Business modules initialized');
  }

  // Public API methods
  getModule(name: string): any {
    if (!this.initialized) {
      throw new Error('Platform not initialized');
    }
    return this.modules.get(name);
  }

  getService(name: string): any {
    if (!this.initialized) {
      throw new Error('Platform not initialized');
    }
    return this.services.get(name);
  }

  async healthCheck(): Promise<HealthStatus> {
    if (!this.initialized) {
      return {
        status: 'unhealthy',
        modules: {},
        services: {
          platform: {
            status: 'unhealthy',
            message: 'Platform not initialized'
          }
        }
      };
    }

    const moduleHealth: any = {};
    for (const [name, module] of this.modules.entries()) {
      moduleHealth[name] = await module.healthCheck();
    }

    const serviceHealth: any = {};
    for (const [name, service] of this.services.entries()) {
      serviceHealth[name] = await service.healthCheck();
    }

    // Determine overall status
    const allStatuses = [
      ...Object.values(moduleHealth).map((h: any) => h.status),
      ...Object.values(serviceHealth).map((h: any) => h.status)
    ];

    let overallStatus: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
    if (allStatuses.some(s => s === 'unhealthy')) {
      overallStatus = 'unhealthy';
    } else if (allStatuses.some(s => s === 'degraded')) {
      overallStatus = 'degraded';
    }

    return {
      status: overallStatus,
      modules: moduleHealth,
      services: serviceHealth
    };
  }

  async shutdown(): Promise<void> {
    if (!this.initialized) {
      console.warn('Platform not initialized, nothing to shutdown');
      return;
    }

    // Shutdown all modules
    for (const module of this.modules.values()) {
      await module.shutdown();
    }

    // Shutdown all services
    for (const service of this.services.values()) {
      await service.shutdown();
    }

    this.initialized = false;
    console.log('Platform shutdown complete');
  }
}

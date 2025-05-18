import { Container } from 'inversify';
import { PlatformConfig } from './types/config';

export class PlatformCore {
  private readonly container: Container;
  private readonly modules: Map<string, any>;
  private readonly services: Map<string, any>;

  constructor(private readonly config: PlatformConfig) {
    this.container = new Container();
    this.modules = new Map();
    this.services = new Map();
  }

  async initialize(): Promise<void> {
    try {
      // Initialize core services
      await this.initializeServices();
      
      // Initialize business modules
      await this.initializeModules();
      
      // Setup cross-module communication
      await this.setupEventBus();
      
      // Start monitoring
      await this.startMonitoring();
    } catch (error) {
      console.error('Platform initialization failed:', error);
      throw error;
    }
  }

  private async initializeServices(): Promise<void> {
    // Core infrastructure services
    const infrastructure = new InfrastructureService(this.config.infrastructure);
    await infrastructure.initialize();
    this.services.set('infrastructure', infrastructure);

    // Security service
    const security = new SecurityService(this.config.security);
    await security.initialize();
    this.services.set('security', security);

    // Database service
    const database = new DatabaseService(this.config.database);
    await database.initialize();
    this.services.set('database', database);

    // Cache service
    const cache = new CacheService(this.config.cache);
    await cache.initialize();
    this.services.set('cache', cache);

    // Messaging service
    const messaging = new MessagingService(this.config.messaging);
    await messaging.initialize();
    this.services.set('messaging', messaging);
  }

  private async initializeModules(): Promise<void> {
    // Education module
    const education = new EducationModule({
      db: this.services.get('database'),
      cache: this.services.get('cache'),
      messaging: this.services.get('messaging')
    });
    await education.initialize();
    this.modules.set('education', education);

    // Marketplace module
    const marketplace = new MarketplaceModule({
      db: this.services.get('database'),
      cache: this.services.get('cache'),
      messaging: this.services.get('messaging')
    });
    await marketplace.initialize();
    this.modules.set('marketplace', marketplace);

    // Social module
    const social = new SocialModule({
      db: this.services.get('database'),
      cache: this.services.get('cache'),
      messaging: this.services.get('messaging')
    });
    await social.initialize();
    this.modules.set('social', social);

    // Jobs module
    const jobs = new JobsModule({
      db: this.services.get('database'),
      cache: this.services.get('cache'),
      messaging: this.services.get('messaging')
    });
    await jobs.initialize();
    this.modules.set('jobs', jobs);
  }

  private async setupEventBus(): Promise<void> {
    const eventBus = new EventBus({
      modules: Array.from(this.modules.values()),
      services: Array.from(this.services.values())
    });
    await eventBus.initialize();
    this.services.set('eventBus', eventBus);
  }

  private async startMonitoring(): Promise<void> {
    const monitoring = new MonitoringService({
      modules: this.modules,
      services: this.services,
      config: this.config.monitoring
    });
    await monitoring.initialize();
    this.services.set('monitoring', monitoring);
  }

  // Public API methods
  public getModule(name: string): any {
    return this.modules.get(name);
  }

  public getService(name: string): any {
    return this.services.get(name);
  }

  public async healthCheck(): Promise<HealthStatus> {
    const monitoring = this.services.get('monitoring');
    return monitoring.getSystemHealth();
  }

  public async shutdown(): Promise<void> {
    // Graceful shutdown of all services and modules
    for (const service of this.services.values()) {
      await service.shutdown();
    }
    for (const module of this.modules.values()) {
      await module.shutdown();
    }
  }
}
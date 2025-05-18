import { injectable, inject } from 'inversify';
import { ApiGatewayConfig, RouteConfig, ServiceConfig } from './types/config';

@injectable()
class ApiGateway {
  private readonly routes: Map<string, RouteConfig>;
  private readonly services: Map<string, ServiceConfig>;
  private readonly rateLimit: RateLimiter;
  private readonly auth: AuthenticationService;
  private readonly monitor: GatewayMonitor;

  constructor(private readonly config: ApiGatewayConfig) {
    this.routes = new Map();
    this.services = new Map();
    this.rateLimit = new RateLimiter(config.rateLimit);
    this.auth = new AuthenticationService(config.auth);
    this.monitor = new GatewayMonitor(config.monitoring);
  }

  async initialize(): Promise<void> {
    // Initialize core services
    await this.initializeServices();
    
    // Setup routes
    await this.setupRoutes();
    
    // Start monitoring
    await this.monitor.start();
  }

  private async initializeServices(): Promise<void> {
    // Initialize education service
    const educationService = new ServiceProxy({
      name: 'education',
      url: this.config.services.education,
      timeout: 5000
    });
    this.services.set('education', educationService);

    // Initialize marketplace service
    const marketplaceService = new ServiceProxy({
      name: 'marketplace',
      url: this.config.services.marketplace,
      timeout: 5000
    });
    this.services.set('marketplace', marketplaceService);

    // Initialize social service
    const socialService = new ServiceProxy({
      name: 'social',
      url: this.config.services.social,
      timeout: 5000
    });
    this.services.set('social', socialService);
  }

  private async setupRoutes(): Promise<void> {
    // Education routes
    this.routes.set('/api/education', {
      service: 'education',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      auth: true,
      rateLimit: {
        window: '15m',
        max: 100
      }
    });

    // Marketplace routes
    this.routes.set('/api/marketplace', {
      service: 'marketplace',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      auth: true,
      rateLimit: {
        window: '15m',
        max: 200
      }
    });

    // Social routes
    this.routes.set('/api/social', {
      service: 'social',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      auth: true,
      rateLimit: {
        window: '15m',
        max: 300
      }
    });
  }

  async handleRequest(req: Request): Promise<Response> {
    try {
      // Check rate limit
      await this.rateLimit.checkLimit(req);

      // Authenticate request
      if (this.requiresAuth(req)) {
        await this.auth.authenticate(req);
      }

      // Route request
      const route = this.findRoute(req);
      if (!route) {
        throw new RouteNotFoundError();
      }

      // Forward to service
      const service = this.services.get(route.service);
      const response = await service.forward(req);

      // Log metrics
      await this.monitor.logRequest(req, response);

      return response;
    } catch (error) {
      return this.handleError(error);
    }
  }

  private requiresAuth(req: Request): boolean {
    const route = this.findRoute(req);
    return route?.auth ?? false;
  }

  private findRoute(req: Request): RouteConfig | undefined {
    const path = new URL(req.url).pathname;
    return Array.from(this.routes.entries())
      .find(([pattern]) => this.matchRoute(path, pattern))?.[1];
  }

  private matchRoute(path: string, pattern: string): boolean {
    // Implement route pattern matching
    return path.startsWith(pattern);
  }

  private handleError(error: any): Response {
    // Log error
    this.monitor.logError(error);

    // Return appropriate error response
    if (error instanceof RateLimitError) {
      return new Response('Rate limit exceeded', { status: 429 });
    }
    if (error instanceof AuthError) {
      return new Response('Unauthorized', { status: 401 });
    }
    if (error instanceof RouteNotFoundError) {
      return new Response('Not found', { status: 404 });
    }

    return new Response('Internal server error', { status: 500 });
  }

  async healthCheck(): Promise<HealthStatus> {
    const serviceHealth = await Promise.all(
      Array.from(this.services.values()).map(service => service.healthCheck())
    );

    return {
      status: serviceHealth.every(health => health.status === 'healthy')
        ? 'healthy'
        : 'unhealthy',
      services: Object.fromEntries(
        Array.from(this.services.keys()).map((key, index) => [
          key,
          serviceHealth[index]
        ])
      ),
      timestamp: new Date().toISOString()
    };
  }

  async shutdown(): Promise<void> {
    // Stop monitoring
    await this.monitor.stop();

    // Shutdown services
    await Promise.all(
      Array.from(this.services.values()).map(service => service.shutdown())
    );

    // Clear maps
    this.routes.clear();
    this.services.clear();
  }
}

// Error classes
class RouteNotFoundError extends Error {
  constructor() {
    super('Route not found');
    this.name = 'RouteNotFoundError';
  }
}

class RateLimitError extends Error {
  constructor() {
    super('Rate limit exceeded');
    this.name = 'RateLimitError';
  }
}

class AuthError extends Error {
  constructor() {
    super('Authentication failed');
    this.name = 'AuthError';
  }
}

export { ApiGateway, ApiGatewayConfig };
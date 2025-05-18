import { injectable, inject } from 'inversify';
import { ServiceMeshConfig, ServiceConfig, CircuitBreakerConfig } from './types/config';

@injectable()
class ServiceMesh {
  private readonly services: Map<string, ServiceProxy>;
  private readonly circuitBreakers: Map<string, CircuitBreaker>;
  private readonly loadBalancer: LoadBalancer;
  private readonly discovery: ServiceDiscovery;
  private readonly monitor: MeshMonitor;

  constructor(private readonly config: ServiceMeshConfig) {
    this.services = new Map();
    this.circuitBreakers = new Map();
    this.loadBalancer = new LoadBalancer(config.loadBalancing);
    this.discovery = new ServiceDiscovery(config.discovery);
    this.monitor = new MeshMonitor(config.monitoring);
  }

  async initialize(): Promise<void> {
    // Initialize service discovery
    await this.discovery.initialize();
    
    // Setup circuit breakers
    await this.setupCircuitBreakers();
    
    // Start monitoring
    await this.monitor.start();

    // Register services
    await this.registerServices();
  }

  private async setupCircuitBreakers(): Promise<void> {
    const defaultConfig: CircuitBreakerConfig = {
      failureThreshold: 5,
      resetTimeout: 30000,
      requestTimeout: 5000
    };

    // Setup circuit breakers for each service
    for (const [name, config] of Object.entries(this.config.services)) {
      const circuitBreaker = new CircuitBreaker({
        ...defaultConfig,
        ...config.circuitBreaker
      });
      this.circuitBreakers.set(name, circuitBreaker);
    }
  }

  private async registerServices(): Promise<void> {
    // Register education service
    const educationService = new ServiceProxy({
      name: 'education',
      discovery: this.discovery,
      circuitBreaker: this.circuitBreakers.get('education'),
      loadBalancer: this.loadBalancer
    });
    this.services.set('education', educationService);

    // Register marketplace service
    const marketplaceService = new ServiceProxy({
      name: 'marketplace',
      discovery: this.discovery,
      circuitBreaker: this.circuitBreakers.get('marketplace'),
      loadBalancer: this.loadBalancer
    });
    this.services.set('marketplace', marketplaceService);

    // Register social service
    const socialService = new ServiceProxy({
      name: 'social',
      discovery: this.discovery,
      circuitBreaker: this.circuitBreakers.get('social'),
      loadBalancer: this.loadBalancer
    });
    this.services.set('social', socialService);
  }

  async call(service: string, request: ServiceRequest): Promise<ServiceResponse> {
    const serviceProxy = this.services.get(service);
    if (!serviceProxy) {
      throw new ServiceNotFoundError(service);
    }

    try {
      // Get circuit breaker
      const circuitBreaker = this.circuitBreakers.get(service);
      if (!circuitBreaker) {
        throw new CircuitBreakerNotFoundError(service);
      }

      // Check circuit breaker
      if (!circuitBreaker.isAllowed()) {
        throw new CircuitBreakerOpenError(service);
      }

      // Make service call
      const response = await serviceProxy.call(request);

      // Record success
      circuitBreaker.recordSuccess();
      await this.monitor.logSuccess(service, request);

      return response;
    } catch (error) {
      // Record failure
      const circuitBreaker = this.circuitBreakers.get(service);
      circuitBreaker?.recordFailure();

      // Log error
      await this.monitor.logError(service, request, error);

      throw error;
    }
  }

  async broadcast(event: ServiceEvent): Promise<void> {
    try {
      // Get all relevant services
      const services = await this.discovery.findServicesByEvent(event.type);

      // Broadcast to all services
      await Promise.all(
        services.map(service => 
          this.services.get(service)?.handleEvent(event)
        )
      );

      // Log broadcast
      await this.monitor.logBroadcast(event);
    } catch (error) {
      await this.monitor.logBroadcastError(event, error);
      throw error;
    }
  }

  async healthCheck(): Promise<HealthStatus> {
    const serviceHealth = await Promise.all(
      Array.from(this.services.values()).map(service => service.healthCheck())
    );

    const circuitBreakerStatus = Object.fromEntries(
      Array.from(this.circuitBreakers.entries()).map(([name, breaker]) => [
        name,
        breaker.getStatus()
      ])
    );

    return {
      status: this.determineOverallHealth(serviceHealth),
      services: Object.fromEntries(
        Array.from(this.services.keys()).map((key, index) => [
          key,
          serviceHealth[index]
        ])
      ),
      circuitBreakers: circuitBreakerStatus,
      discovery: await this.discovery.getStatus(),
      loadBalancer: await this.loadBalancer.getStatus(),
      timestamp: new Date().toISOString()
    };
  }

  private determineOverallHealth(serviceHealth: HealthStatus[]): 'healthy' | 'unhealthy' {
    return serviceHealth.every(health => health.status === 'healthy')
      ? 'healthy'
      : 'unhealthy';
  }

  async shutdown(): Promise<void> {
    // Stop monitoring
    await this.monitor.stop();

    // Shutdown services
    await Promise.all(
      Array.from(this.services.values()).map(service => service.shutdown())
    );

    // Shutdown discovery
    await this.discovery.shutdown();

    // Clear maps
    this.services.clear();
    this.circuitBreakers.clear();
  }
}

// Error classes
class ServiceNotFoundError extends Error {
  constructor(service: string) {
    super(`Service ${service} not found`);
    this.name = 'ServiceNotFoundError';
  }
}

class CircuitBreakerNotFoundError extends Error {
  constructor(service: string) {
    super(`Circuit breaker for service ${service} not found`);
    this.name = 'CircuitBreakerNotFoundError';
  }
}

class CircuitBreakerOpenError extends Error {
  constructor(service: string) {
    super(`Circuit breaker for service ${service} is open`);
    this.name = 'CircuitBreakerOpenError';
  }
}

export { ServiceMesh, ServiceMeshConfig };
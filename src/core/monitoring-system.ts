import { injectable, inject } from 'inversify';
import { MonitoringConfig, MetricsConfig, TracingConfig } from './types/config';

@injectable()
class MonitoringSystem {
  private readonly metrics: MetricsCollector;
  private readonly tracing: DistributedTracing;
  private readonly alerting: AlertManager;
  private readonly logging: LogAggregator;
  private readonly dashboard: MetricsDashboard;

  constructor(private readonly config: MonitoringConfig) {
    this.metrics = new MetricsCollector(config.metrics);
    this.tracing = new DistributedTracing(config.tracing);
    this.alerting = new AlertManager(config.alerting);
    this.logging = new LogAggregator(config.logging);
    this.dashboard = new MetricsDashboard(config.dashboard);
  }

  async initialize(): Promise<void> {
    // Initialize metrics collection
        try {
      await this.metrics.record(name, value, tags);
      await this.dashboard.updateMetric(name, value, tags);
    } catch (error) {
      await this.logging.logError('metric_recording_failed', {
        name,
        value,
        tags,
        error
      });
      throw new MetricRecordingError(error);
    }
  }

  async startTrace(name: string, context?: Record<string, any>): Promise<TraceContext> {
    try {
      const trace = await this.tracing.startTrace(name, context);
      await this.logging.logTrace('trace_started', { name, context });
      return trace;
    } catch (error) {
      await this.logging.logError('trace_start_failed', { name, context, error });
      throw new TraceStartError(error);
    }
  }

  async endTrace(trace: TraceContext, result?: any): Promise<void> {
    try {
      await this.tracing.endTrace(trace, result);
      await this.logging.logTrace('trace_ended', { trace, result });
    } catch (error) {
      await this.logging.logError('trace_end_failed', { trace, result, error });
      throw new TraceEndError(error);
    }
  }

  async createAlert(
    condition: AlertCondition,
    severity: AlertSeverity,
    context?: Record<string, any>
  ): Promise<void> {
    try {
      await this.alerting.createAlert(condition, severity, context);
      await this.logging.logAlert('alert_created', { condition, severity, context });
    } catch (error) {
      await this.logging.logError('alert_creation_failed', {
        condition,
        severity,
        context,
        error
      });
      throw new AlertCreationError(error);
    }
  }

  async getSystemHealth(): Promise<SystemHealth> {
    const metricsHealth = await this.metrics.healthCheck();
    const tracingHealth = await this.tracing.healthCheck();
    const alertingHealth = await this.alerting.healthCheck();
    const loggingHealth = await this.logging.healthCheck();
    const dashboardHealth = await this.dashboard.healthCheck();

    return {
      status: this.determineOverallHealth([
        metricsHealth,
        tracingHealth,
        alertingHealth,
        loggingHealth,
        dashboardHealth
      ]),
      components: {
        metrics: metricsHealth,
        tracing: tracingHealth,
        alerting: alertingHealth,
        logging: loggingHealth,
        dashboard: dashboardHealth
      },
      timestamp: new Date().toISOString()
    };
  }

  private determineOverallHealth(componentHealth: ComponentHealth[]): HealthStatus {
    return componentHealth.every(health => health.status === 'healthy')
      ? 'healthy'
      : 'unhealthy';
  }

  async getMetrics(timeRange: TimeRange): Promise<SystemMetrics> {
    return {
      metrics: await this.metrics.getMetrics(timeRange),
      traces: await this.tracing.getTraces(timeRange),
      alerts: await this.alerting.getAlerts(timeRange),
      logs: await this.logging.getLogs(timeRange)
    };
  }

  async getDashboardData(timeRange: TimeRange): Promise<DashboardData> {
    return this.dashboard.getData(timeRange);
  }

  async shutdown(): Promise<void> {
    await Promise.all([
      this.metrics.shutdown(),
      this.tracing.shutdown(),
      this.alerting.shutdown(),
      this.logging.shutdown(),
      this.dashboard.shutdown()
    ]);
  }
}

// Error classes
class MonitoringError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MonitoringError';
  }
}

class MetricRecordingError extends MonitoringError {
  constructor(error: any) {
    super(`Failed to record metric: ${error.message}`);
    this.name = 'MetricRecordingError';
  }
}

class TraceStartError extends MonitoringError {
  constructor(error: any) {
    super(`Failed to start trace: ${error.message}`);
    this.name = 'TraceStartError';
  }
}

class TraceEndError extends MonitoringError {
  constructor(error: any) {
    super(`Failed to end trace: ${error.message}`);
    this.name = 'TraceEndError';
  }
}

class AlertCreationError extends MonitoringError {
  constructor(error: any) {
    super(`Failed to create alert: ${error.message}`);
    this.name = 'AlertCreationError';
  }
}

export { 
  MonitoringSystem,
  MonitoringConfig,
  SystemHealth,
  SystemMetrics,
  DashboardData
};.initialize();
    
    // Setup distributed tracing
    await this.tracing.initialize();
    
    // Setup alerting
    await this.alerting.initialize();
    
    // Initialize logging
    await this.logging.initialize();
    
    // Setup dashboard
    await this.dashboard.initialize();
  }

  async recordMetric(name: string, value: number, tags: Record<string, string>): Promise<void> {
    await this.metrics
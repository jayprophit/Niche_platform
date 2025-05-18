import { injectable, inject } from 'inversify';
import { DatabaseConfig, ConnectionOptions, QueryOptions } from './types/database';
import { DataModel, QueryResult, Transaction } from './types/data';

@injectable()
export class DatabaseService {
  private connections: Map<string, any>;
  private readonly adapters: Map<string, DatabaseAdapter>;
  private readonly migrations: MigrationManager;
  private readonly monitoring: DatabaseMonitoring;
  private readonly connectionPool: ConnectionPool;

  constructor(private readonly config: DatabaseConfig) {
    this.connections = new Map();
    this.adapters = new Map();
    this.migrations = new MigrationManager(config.migrations);
    this.monitoring = new DatabaseMonitoring(config.monitoring);
    this.connectionPool = new ConnectionPool(config.pool);
  }

  async initialize(): Promise<void> {
    try {
      // Initialize connection pool
      await this.connectionPool.initialize();
      
      // Initialize connections
      await this.initializeConnections();
      
      // Run migrations
      await this.migrations.runMigrations();
      
      // Start monitoring
      await this.monitoring.start();
    } catch (error) {
      console.error('Database initialization failed:', error);
      throw new DatabaseInitializationError(error);
    }
  }

  private async initializeConnections(): Promise<void> {
    // Initialize SQL databases
    if (this.config.sql) {
      const sqlAdapter = new SQLAdapter(this.config.sql);
      await sqlAdapter.connect();
      this.adapters.set('sql', sqlAdapter);
    }

    // Initialize NoSQL databases
    if (this.config.nosql) {
      const nosqlAdapter = new NoSQLAdapter(this.config.nosql);
      await nosqlAdapter.connect();
      this.adapters.set('nosql', nosqlAdapter);
    }

    // Initialize Graph database
    if (this.config.graph) {
      const graphAdapter = new GraphAdapter(this.config.graph);
      await graphAdapter.connect();
      this.adapters.set('graph', graphAdapter);
    }

    // Initialize Time-series database
    if (this.config.timeseries) {
      const timeseriesAdapter = new TimeSeriesAdapter(this.config.timeseries);
      await timeseriesAdapter.connect();
      this.adapters.set('timeseries', timeseriesAdapter);
    }
  }

  // Transaction Management
  async startTransaction(): Promise<Transaction> {
    const transaction = new DatabaseTransaction(this.adapters);
    await transaction.begin();
    return transaction;
  }

  async commitTransaction(transaction: Transaction): Promise<void> {
    await transaction.commit();
  }

  async rollbackTransaction(transaction: Transaction): Promise<void> {
    await transaction.rollback();
  }

  // CRUD Operations
  async create<T extends DataModel>(
    type: string,
    data: Partial<T>,
    options?: QueryOptions
  ): Promise<T> {
    try {
      const connection = await this.connectionPool.acquire();
      const adapter = this.getAdapter(type);
      const result = await adapter.create(data, { ...options, connection });
      await this.monitoring.logOperation('create', type);
      await this.connectionPool.release(connection);
      return result;
    } catch (error) {
      throw new DatabaseOperationError('create', error);
    }
  }

  async read<T extends DataModel>(
    type: string,
    query: any,
    options?: QueryOptions
  ): Promise<T | null> {
    try {
      const connection = await this.connectionPool.acquire();
      const adapter = this.getAdapter(type);
      const result = await adapter.read(query, { ...options, connection });
      await this.monitoring.logOperation('read', type);
      await this.connectionPool.release(connection);
      return result;
    } catch (error) {
      throw new DatabaseOperationError('read', error);
    }
  }

  async update<T extends DataModel>(
    type: string,
    query: any,
    data: Partial<T>,
    options?: QueryOptions
  ): Promise<T> {
    try {
      const connection = await this.connectionPool.acquire();
      const adapter = this.getAdapter(type);
      const result = await adapter.update(query, data, { ...options, connection });
      await this.monitoring.logOperation('update', type);
      await this.connectionPool.release(connection);
      return result;
    } catch (error) {
      throw new DatabaseOperationError('update', error);
    }
  }

  async delete(
    type: string,
    query: any,
    options?: QueryOptions
  ): Promise<boolean> {
    try {
      const connection = await this.connectionPool.acquire();
      const adapter = this.getAdapter(type);
      const result = await adapter.delete(query, { ...options, connection });
      await this.monitoring.logOperation('delete', type);
      await this.connectionPool.release(connection);
      return result;
    } catch (error) {
      throw new DatabaseOperationError('delete', error);
    }
  }

  // Query Operations
  async query<T>(
    type: string,
    query: any,
    options?: QueryOptions
  ): Promise<QueryResult<T>> {
    try {
      const connection = await this.connectionPool.acquire();
      const adapter = this.getAdapter(type);
      const result = await adapter.query(query, { ...options, connection });
      await this.monitoring.logOperation('query', type);
      await this.connectionPool.release(connection);
      return result;
    } catch (error) {
      throw new DatabaseOperationError('query', error);
    }
  }

  async aggregate(
    type: string,
    pipeline: any[],
    options?: QueryOptions
  ): Promise<any> {
    try {
      const connection = await this.connectionPool.acquire();
      const adapter = this.getAdapter(type);
      const result = await adapter.aggregate(pipeline, { ...options, connection });
      await this.monitoring.logOperation('aggregate', type);
      await this.connectionPool.release(connection);
      return result;
    } catch (error) {
      throw new DatabaseOperationError('aggregate', error);
    }
  }

  // Utility methods
  private getAdapter(type: string): DatabaseAdapter {
    const adapter = this.adapters.get(type);
    if (!adapter) {
      throw new DatabaseAdapterNotFoundError(type);
    }
    return adapter;
  }

  // Health check
  async healthCheck(): Promise<DatabaseHealth> {
    const health = {
      status: 'healthy',
      connections: {},
      poolStatus: await this.connectionPool.getStatus(),
      metrics: await this.monitoring.getMetrics()
    };

    for (const [type, adapter] of this.adapters.entries()) {
      health.connections[type] = await adapter.checkHealth();
    }

    return health;
  }

  // Cleanup
  async shutdown(): Promise<void> {
    await this.monitoring.stop();
    await this.connectionPool.drain();
    
    for (const adapter of this.adapters.values()) {
      await adapter.disconnect();
    }
    
    this.adapters.clear();
    this.connections.clear();
  }
}

// Error Classes
class DatabaseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DatabaseError';
  }
}

class DatabaseInitializationError extends DatabaseError {
  constructor(error: any) {
    super(`Database initialization failed: ${error.message}`);
    this.name = 'DatabaseInitializationError';
  }
}

class DatabaseOperationError extends DatabaseError {
  constructor(operation: string, error: any) {
    super(`Database operation '${operation}' failed: ${error.message}`);
    this.name = 'DatabaseOperationError';
  }
}

class DatabaseAdapterNotFoundError extends DatabaseError {
  constructor(type: string) {
    super(`Database adapter not found for type: ${type}`);
    this.name = 'DatabaseAdapterNotFoundError';
  }
}

export {
  DatabaseService,
  DatabaseError,
  DatabaseInitializationError,
  DatabaseOperationError,
  DatabaseAdapterNotFoundError
};
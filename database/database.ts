/**
 * Database Service
 * Handles database connections and operations for all platform modules
 */
import { injectable } from 'inversify';
import 'reflect-metadata';
import { MongoClient, Db } from 'mongodb';
import { Pool } from 'pg';
import { createClient } from 'redis';

export interface DatabaseConfig {
  mongodb?: {
    uri: string;
    dbName: string;
    options?: any;
  };
  postgres?: {
    host: string;
    port: number;
    database: string;
    user: string;
    password: string;
    ssl?: boolean;
    maxConnections?: number;
  };
  redis?: {
    url: string;
    password?: string;
  };
  connectionPool?: {
    maxSize: number;
    minSize: number;
    idleTimeoutMs: number;
  };
}

export interface QueryOptions {
  transaction?: any;
  timeout?: number;
  readPreference?: string;
  connection?: any;
}

export interface ConnectionPool {
  initialize(): Promise<void>;
  acquire(): Promise<any>;
  release(connection: any): Promise<void>;
  drain(): Promise<void>;
  getStatus(): Promise<any>;
}

class DatabaseConnectionPool implements ConnectionPool {
  private connections: any[] = [];
  private inUse: Set<any> = new Set();
  private config: any;

  constructor(config: any) {
    this.config = config || {
      maxSize: 10,
      minSize: 2,
      idleTimeoutMs: 30000
    };
  }

  async initialize(): Promise<void> {
    // Pre-create minimum connections
    for (let i = 0; i < this.config.minSize; i++) {
      this.connections.push(await this.createConnection());
    }
  }

  async acquire(): Promise<any> {
    // Check if there's an available connection
    if (this.connections.length > 0) {
      const connection = this.connections.pop();
      this.inUse.add(connection);
      return connection;
    }

    // If at capacity, wait for a connection to be released
    if (this.inUse.size >= this.config.maxSize) {
      return new Promise((resolve) => {
        const checkInterval = setInterval(() => {
          if (this.connections.length > 0) {
            clearInterval(checkInterval);
            const connection = this.connections.pop();
            this.inUse.add(connection);
            resolve(connection);
          }
        }, 100);
      });
    }

    // Create a new connection
    const connection = await this.createConnection();
    this.inUse.add(connection);
    return connection;
  }

  async release(connection: any): Promise<void> {
    if (this.inUse.has(connection)) {
      this.inUse.delete(connection);
      this.connections.push(connection);
    }
  }

  async drain(): Promise<void> {
    // Close all idle connections
    for (const connection of this.connections) {
      await this.closeConnection(connection);
    }
    this.connections = [];

    // Wait for in-use connections to be released
    if (this.inUse.size > 0) {
      console.log(`Waiting for ${this.inUse.size} connections to be released...`);
    }
  }

  async getStatus(): Promise<any> {
    return {
      total: this.connections.length + this.inUse.size,
      available: this.connections.length,
      inUse: this.inUse.size,
      maxSize: this.config.maxSize
    };
  }

  private async createConnection(): Promise<any> {
    // This is a placeholder - actual implementation would create real database connections
    return {
      id: Math.random().toString(36).substring(2, 15),
      createdAt: new Date()
    };
  }

  private async closeConnection(connection: any): Promise<void> {
    // This is a placeholder - actual implementation would close real database connections
  }
}

@injectable()
export class DatabaseService {
  private mongoClient: MongoClient | null = null;
  private mongoDB: Db | null = null;
  private pgPool: Pool | null = null;
  private redisClient: any = null;
  private connectionPool: ConnectionPool;
  private initialized: boolean = false;

  constructor(private readonly config: DatabaseConfig) {
    this.connectionPool = new DatabaseConnectionPool(config.connectionPool);
  }

  async initialize(): Promise<void> {
    if (this.initialized) {
      console.warn('Database service already initialized');
      return;
    }

    try {
      // Initialize connection pool
      await this.connectionPool.initialize();

      // Initialize MongoDB if configured
      if (this.config.mongodb) {
        this.mongoClient = new MongoClient(this.config.mongodb.uri, this.config.mongodb.options);
        await this.mongoClient.connect();
        this.mongoDB = this.mongoClient.db(this.config.mongodb.dbName);
        console.log('MongoDB initialized');
      }

      // Initialize PostgreSQL if configured
      if (this.config.postgres) {
        this.pgPool = new Pool({
          host: this.config.postgres.host,
          port: this.config.postgres.port,
          database: this.config.postgres.database,
          user: this.config.postgres.user,
          password: this.config.postgres.password,
          ssl: this.config.postgres.ssl,
          max: this.config.postgres.maxConnections || 20
        });
        // Test the connection
        const client = await this.pgPool.connect();
        client.release();
        console.log('PostgreSQL initialized');
      }

      // Initialize Redis if configured
      if (this.config.redis) {
        this.redisClient = createClient({
          url: this.config.redis.url,
          password: this.config.redis.password
        });
        await this.redisClient.connect();
        console.log('Redis initialized');
      }

      this.initialized = true;
      console.log('Database service initialization complete');
    } catch (error) {
      console.error('Database service initialization failed:', error);
      throw new Error(`Database initialization failed: ${(error as Error).message}`);
    }
  }

  // MongoDB operations
  async getMongoCollection(name: string) {
    if (!this.mongoDB) {
      throw new Error('MongoDB not initialized');
    }
    return this.mongoDB.collection(name);
  }

  async findOne(collection: string, query: any, options?: any) {
    if (!this.mongoDB) {
      throw new Error('MongoDB not initialized');
    }
    return this.mongoDB.collection(collection).findOne(query, options);
  }

  async find(collection: string, query: any, options?: any) {
    if (!this.mongoDB) {
      throw new Error('MongoDB not initialized');
    }
    return this.mongoDB.collection(collection).find(query, options).toArray();
  }

  async insertOne(collection: string, document: any, options?: any) {
    if (!this.mongoDB) {
      throw new Error('MongoDB not initialized');
    }
    return this.mongoDB.collection(collection).insertOne(document, options);
  }

  async updateOne(collection: string, filter: any, update: any, options?: any) {
    if (!this.mongoDB) {
      throw new Error('MongoDB not initialized');
    }
    return this.mongoDB.collection(collection).updateOne(filter, update, options);
  }

  async deleteOne(collection: string, filter: any, options?: any) {
    if (!this.mongoDB) {
      throw new Error('MongoDB not initialized');
    }
    return this.mongoDB.collection(collection).deleteOne(filter, options);
  }

  async aggregate(collection: string, pipeline: any[], options?: any) {
    if (!this.mongoDB) {
      throw new Error('MongoDB not initialized');
    }
    return this.mongoDB.collection(collection).aggregate(pipeline, options).toArray();
  }

  // PostgreSQL operations
  async pgQuery(text: string, params: any[] = []) {
    if (!this.pgPool) {
      throw new Error('PostgreSQL not initialized');
    }
    return this.pgPool.query(text, params);
  }

  async pgTransaction<T>(callback: (client: any) => Promise<T>): Promise<T> {
    if (!this.pgPool) {
      throw new Error('PostgreSQL not initialized');
    }

    const client = await this.pgPool.connect();
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Redis operations
  async cacheGet(key: string) {
    if (!this.redisClient) {
      throw new Error('Redis not initialized');
    }
    return this.redisClient.get(key);
  }

  async cacheSet(key: string, value: string, expireSeconds?: number) {
    if (!this.redisClient) {
      throw new Error('Redis not initialized');
    }
    if (expireSeconds) {
      return this.redisClient.set(key, value, { EX: expireSeconds });
    }
    return this.redisClient.set(key, value);
  }

  async cacheDelete(key: string) {
    if (!this.redisClient) {
      throw new Error('Redis not initialized');
    }
    return this.redisClient.del(key);
  }

  // Health check
  async healthCheck() {
    const status = {
      status: 'healthy',
      mongodb: { status: 'not_configured' },
      postgres: { status: 'not_configured' },
      redis: { status: 'not_configured' },
      connectionPool: await this.connectionPool.getStatus()
    };

    try {
      // Check MongoDB
      if (this.mongoClient && this.mongoDB) {
        const adminDb = this.mongoClient.db('admin');
        const result = await adminDb.command({ ping: 1 });
        status.mongodb = {
          status: result.ok ? 'healthy' : 'unhealthy',
          details: result
        };
      }

      // Check PostgreSQL
      if (this.pgPool) {
        const result = await this.pgPool.query('SELECT NOW()');
        status.postgres = {
          status: result.rows.length > 0 ? 'healthy' : 'unhealthy',
          details: {
            totalCount: this.pgPool.totalCount,
            idleCount: this.pgPool.idleCount,
            waitingCount: this.pgPool.waitingCount
          }
        };
      }

      // Check Redis
      if (this.redisClient) {
        const result = await this.redisClient.ping();
        status.redis = {
          status: result === 'PONG' ? 'healthy' : 'unhealthy',
          details: {
            connected: this.redisClient.isOpen
          }
        };
      }

      return status;
    } catch (error) {
      console.error('Database health check failed:', error);
      return {
        ...status,
        status: 'unhealthy',
        error: (error as Error).message
      };
    }
  }

  // Cleanup
  async shutdown(): Promise<void> {
    // Close MongoDB connection
    if (this.mongoClient) {
      await this.mongoClient.close();
      this.mongoClient = null;
      this.mongoDB = null;
    }

    // Close PostgreSQL connection pool
    if (this.pgPool) {
      await this.pgPool.end();
      this.pgPool = null;
    }

    // Close Redis connection
    if (this.redisClient) {
      await this.redisClient.quit();
      this.redisClient = null;
    }

    // Drain connection pool
    await this.connectionPool.drain();
    
    this.initialized = false;
    console.log('Database service shutdown complete');
  }
}

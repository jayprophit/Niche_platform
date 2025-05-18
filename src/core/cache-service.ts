import { injectable, inject } from 'inversify';
import { CacheConfig, CacheOptions, CacheEntry } from './types/cache';

@injectable()
export class CacheService {
    private stores: Map<string, CacheStore>;
    private readonly strategy: CacheStrategy;
    private readonly monitoring: CacheMonitoring;
    private readonly eventBus: EventEmitter;

    constructor(private readonly config: CacheConfig) {
        this.stores = new Map();
        this.strategy = new CacheStrategy(config.strategy);
        this.monitoring = new CacheMonitoring(config.monitoring);
        this.eventBus = new EventEmitter();
    }

    async initialize(): Promise<void> {
        try {
            // Initialize cache stores
            await this.initializeStores();
            
            // Start monitoring
            await this.monitoring.start();
            
            // Initialize cache strategy
            await this.strategy.initialize();
        } catch (error) {
            throw new CacheInitializationError(error);
        }
    }

    private async initializeStores(): Promise<void> {
        // Initialize memory cache
        if (this.config.memory) {
            const memoryStore = new MemoryCacheStore(this.config.memory);
            await memoryStore.initialize();
            this.stores.set('memory', memoryStore);
        }

        // Initialize Redis cache
        if (this.config.redis) {
            const redisStore = new RedisCacheStore(this.config.redis);
            await redisStore.initialize();
            this.stores.set('redis', redisStore);
        }

        // Initialize distributed cache
        if (this.config.distributed) {
            const distributedStore = new DistributedCacheStore(this.config.distributed);
            await distributedStore.initialize();
            this.stores.set('distributed', distributedStore);
        }
    }

    // Cache Operations
    async get<T>(key: string, options?: CacheOptions): Promise<T | null> {
        try {
            const store = this.getStore(options?.store);
            const result = await store.get<T>(key);
            
            if (result) {
                await this.monitoring.logHit(key);
                return result;
            }

            await this.monitoring.logMiss(key);
            return null;
        } catch (error) {
            throw new CacheOperationError('get', error);
        }
    }

    async set<T>(
        key: string,
        value: T,
        options?: CacheOptions
    ): Promise<void> {
        try {
            const store = this.getStore(options?.store);
            await store.set(key, value, options);
            await this.monitoring.logSet(key);
            this.eventBus.emit('cache:set', { key, store: store.name });
        } catch (error) {
            throw new CacheOperationError('set', error);
        }
    }

    async delete(key: string, options?: CacheOptions): Promise<void> {
        try {
            const store = this.getStore(options?.store);
            await store.delete(key);
            await this.monitoring.logDelete(key);
            this.eventBus.emit('cache:delete', { key, store: store.name });
        } catch (error) {
            throw new CacheOperationError('delete', error);
        }
    }

    async exists(key: string, options?: CacheOptions): Promise<boolean> {
        try {
            const store = this.getStore(options?.store);
            return store.exists(key);
        } catch (error) {
            throw new CacheOperationError('exists', error);
        }
    }

    // Advanced Operations
    async getOrSet<T>(
        key: string,
        factory: () => Promise<T>,
        options?: CacheOptions
    ): Promise<T> {
        const cached = await this.get<T>(key, options);
        if (cached !== null) {
            return cached;
        }

        const value = await factory();
        await this.set(key, value, options);
        return value;
    }

    async mget<T>(
        keys: string[],
        options?: CacheOptions
    ): Promise<(T | null)[]> {
        try {
            const store = this.getStore(options?.store);
            const results = await store.mget<T>(keys);
            await this.monitoring.logBulkOperation('mget', keys);
            return results;
        } catch (error) {
            throw new CacheOperationError('mget', error);
        }
    }

    async mset(
        entries: Array<{ key: string; value: any }>,
        options?: CacheOptions
    ): Promise<void> {
        try {
            const store = this.getStore(options?.store);
            await store.mset(entries, options);
            await this.monitoring.logBulkOperation('mset', entries.map(e => e.key));
        } catch (error) {
            throw new CacheOperationError('mset', error);
        }
    }

    // Pattern Operations
    async deletePattern(pattern: string, options?: CacheOptions): Promise<number> {
        try {
            const store = this.getStore(options?.store);
            const count = await store.deletePattern(pattern);
            await this.monitoring.logPatternOperation('delete', pattern, count);
            return count;
        } catch (error) {
            throw new CacheOperationError('deletePattern', error);
        }
    }

    async keys(pattern: string, options?: CacheOptions): Promise<string[]> {
        try {
            const store = this.getStore(options?.store);
            return store.keys(pattern);
        } catch (error) {
            throw new CacheOperationError('keys', error);
        }
    }

    // Cache Management
    async clear(options?: CacheOptions): Promise<void> {
        try {
            const store = this.getStore(options?.store);
            await store.clear();
            await this.monitoring.logClear(store.name);
            this.eventBus.emit('cache:clear', { store: store.name });
        } catch (error) {
            throw new CacheOperationError('clear', error);
        }
    }

    async cleanup(): Promise<void> {
        try {
            const cleanups = Array.from(this.stores.values()).map(store => 
                store.cleanup()
            );
            await Promise.all(cleanups);
            await this.monitoring.logCleanup();
        } catch (error) {
            throw new CacheOperationError('cleanup', error);
        }
    }

    // Utility Methods
    private getStore(storeName?: string): CacheStore {
        const store = storeName 
            ? this.stores.get(storeName)
            : this.stores.get(this.config.defaultStore);

        if (!store) {
            throw new CacheStoreNotFoundError(storeName || this.config.defaultStore);
        }

        return store;
    }

    // Monitoring
    async getMetrics(): Promise<CacheMetrics> {
        return this.monitoring.getMetrics();
    }

    // Health Check
    async healthCheck(): Promise<CacheHealth> {
        const health = {
            status: 'healthy',
            stores: {},
            metrics: await this.monitoring.getMetrics()
        };

        for (const [name, store] of this.stores.entries()) {
            health.stores[name] = await store.healthCheck();
        }

        return health;
    }

    // Cleanup
    async shutdown(): Promise<void> {
        await this.monitoring.stop();
        
        const shutdowns = Array.from(this.stores.values()).map(store => 
            store.shutdown()
        );
        
        await Promise.all(shutdowns);
        this.stores.clear();
    }
}

// Error Classes
export class CacheError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'CacheError';
    }
}

export class CacheInitializationError extends CacheError {
    constructor(error: any) {
        super(`Cache initialization failed: ${error.message}`);
        this.name = 'CacheInitializationError';
    }
}

export class CacheOperationError extends CacheError {
    constructor(operation: string, error: any) {
        super(`Cache operation '${operation}' failed: ${error.message}`);
        this.name = 'CacheOperationError';
    }
}

export class CacheStoreNotFoundError extends CacheError {
    constructor(storeName: string) {
        super(`Cache store not found: ${storeName}`);
        this.name = 'CacheStoreNotFoundError';
    }
}

export {
    CacheService,
    CacheConfig,
    CacheOptions,
    CacheEntry,
    CacheStore,
    CacheMetrics,
    CacheHealth
};
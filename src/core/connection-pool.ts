    async drain(): Promise<void> {
        // Clear maintenance intervals
        this.clearMaintenanceTasks();

        // Wait for in-use connections
        while (this.inUse.size > 0) {
            await this.delay(100);
        }

        // Close all connections
        await Promise.all(this.pool.map(conn => conn.close()));
        this.pool = [];
        this.inUse.clear();
        this.emit('pool:drained');
    }

    private clearMaintenanceTasks(): void {
        // Implementation to clear all maintenance intervals
    }

    async getStatus(): Promise<PoolStatus> {
        return {
            total: this.totalConnections,
            active: this.inUse.size,
            idle: this.pool.length - this.inUse.size,
            waiting: this.waiting.length,
            config: this.config
        };
    }

    get totalConnections(): number {
        return this.pool.length;
    }

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Error Classes
export class PoolError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'PoolError';
    }
}

export class PoolInitializationError extends PoolError {
    constructor(error: any) {
        super(`Failed to initialize connection pool: ${error.message}`);
        this.name = 'PoolInitializationError';
    }
}

export class ConnectionCreationError extends PoolError {
    constructor(error: any) {
        super(`Failed to create connection: ${error.message}`);
        this.name = 'ConnectionCreationError';
    }
}

export class ConnectionValidationError extends PoolError {
    constructor(error: any) {
        super(`Connection validation failed: ${error.message}`);
        this.name = 'ConnectionValidationError';
    }
}

export class ConnectionAcquisitionTimeoutError extends PoolError {
    constructor() {
        super('Timeout while waiting for connection');
        this.name = 'ConnectionAcquisitionTimeoutError';
    }
}

export class ConnectionNotInUseError extends PoolError {
    constructor() {
        super('Attempting to release connection that is not in use');
        this.name = 'ConnectionNotInUseError';
    }
}

// Types
export interface PoolStatus {
    total: number;
    active: number;
    idle: number;
    waiting: number;
    config: PoolConfig;
}

export {
    ConnectionPool,
    PoolConfig,
    Connection,
    ConnectionStatus
};
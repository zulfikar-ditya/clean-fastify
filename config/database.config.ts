interface IDatabaseConfig {
	url: string;
	pool: {
		min: number;
		max: number;
		idleTimeoutMillis: number;
		connectionTimeoutMillis: number;
	};
}

export const DatabaseConfig: IDatabaseConfig = {
	url:
		process.env.DATABASE_URL || "postgres://user:password@localhost:5432/mydb",
	pool: {
		min: Number(process.env.DB_POOL_MIN) || 2,
		max: Number(process.env.DB_POOL_MAX) || 10,
		idleTimeoutMillis: Number(process.env.DB_IDLE_TIMEOUT) || 30000,
		connectionTimeoutMillis: Number(process.env.DB_CONNECTION_TIMEOUT) || 5000,
	},
};

import fastify from "fastify";
import { AppConfig, RedisConfig } from "@config/app.config";
import { registerRoutes } from "./routes/old";
import fastifyJwt from "@fastify/jwt";
import fastifyRedis from "@fastify/redis";
import corsPlugin from "packages/plugins/cors.plugin";
import authPlugin from "packages/plugins/auth.plugin";
import superuserPlugin from "packages/plugins/superuser.plugin";
import { createLoggerConfig } from "packages/logger/logger";
import { errorHandler } from "@packages/*";

export function createAppInstance() {
	const app = fastify({
		logger: createLoggerConfig(),
	});

	// PLUGIN DECORATOR =====================================================
	app.register(fastifyJwt, {
		secret: AppConfig.APP_JWT_SECRET,
	});

	app.register(corsPlugin);
	app.register(authPlugin);
	app.register(superuserPlugin);

	app.register(fastifyRedis, {
		host: RedisConfig.REDIS_HOST,
		port: RedisConfig.REDIS_PORT,
		password: RedisConfig.REDIS_PASSWORD,
		db: RedisConfig.REDIS_DB,
	});

	registerRoutes(app);

	// Error Handler ==========================================
	app.setErrorHandler(errorHandler);

	return app;
}

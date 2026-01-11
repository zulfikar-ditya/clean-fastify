import fastify from "fastify";
import { AppConfig } from "@config/app.config";
import fastifyJwt from "@fastify/jwt";
import fastifyRedis from "@fastify/redis";
import fastifyAutoload from "@fastify/autoload";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { createLoggerConfig } from "@packages/logger/logger";
import { RedisConfig } from "@config/redis.config";
import {
	serializerCompiler,
	validatorCompiler,
	type ZodTypeProvider,
} from "fastify-type-provider-zod";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function createAppInstance() {
	const app = fastify({
		logger: createLoggerConfig(),
	}).withTypeProvider<ZodTypeProvider>();

	// PLUGIN DECORATOR =====================================================
	app.register(fastifyJwt, {
		secret: AppConfig.APP_JWT_SECRET,
	});

	app.register(fastifyRedis, {
		host: RedisConfig.REDIS_HOST,
		port: RedisConfig.REDIS_PORT,
		password: RedisConfig.REDIS_PASSWORD,
		db: RedisConfig.REDIS_DB,
	});

	app.setValidatorCompiler(validatorCompiler);
	app.setSerializerCompiler(serializerCompiler);

	// autoload plugins =========================
	app.register(fastifyAutoload, {
		dir: join(__dirname, "../../packages/plugins/externals"),
		cascadeHooks: true,
		autoHooks: true,
	});

	app.register(fastifyAutoload, {
		dir: join(__dirname, "../../packages/plugins/app"),
		cascadeHooks: true,
		autoHooks: true,
	});

	// autoload routes ===========================
	app.register(fastifyAutoload, {
		dir: join(__dirname, "./routes"),
		cascadeHooks: true,
		autoHooks: true,
	});

	return app;
}

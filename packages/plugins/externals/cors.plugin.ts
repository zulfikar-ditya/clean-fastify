import fastifyPlugin from "fastify-plugin";
import fastifyCors from "@fastify/cors";
import { FastifyInstance } from "fastify";
import { corsConfig } from "@config";

async function corsPlugin(fastify: FastifyInstance) {
	await fastify.register(fastifyCors, {
		origin: (origin, cb) => {
			if (!origin) return cb(null, true);

			const hostname = new URL(origin).hostname;
			const allowedOrigins = corsConfig.origin;
			if (allowedOrigins.includes(hostname)) {
				cb(null, true);
			} else {
				cb(new Error("Not allowed by CORS"), false);
			}
		},
		methods: corsConfig.methods,
		allowedHeaders: corsConfig.allowedHeaders,
		exposedHeaders: corsConfig.exposedHeaders,
		credentials: corsConfig.credentials,
		maxAge: corsConfig.maxAge,
	});
}

export default fastifyPlugin(corsPlugin);

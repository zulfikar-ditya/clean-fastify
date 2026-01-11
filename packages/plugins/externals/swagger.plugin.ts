import fastifySwagger from "@fastify/swagger";
import fp from "fastify-plugin";
import ScalarApiReference from "@scalar/fastify-api-reference";
import { AppConfig } from "@config/app.config";

export default fp(
	async function (fastify) {
		fastify.register(fastifySwagger, {
			openapi: {
				info: {
					title: AppConfig.APP_NAME,
					version: "1.0.0",
				},
				components: {
					securitySchemes: {
						bearerAuth: {
							type: "http",
							scheme: "bearer",
							bearerFormat: "JWT",
							description:
								"Enter your JWT token in the format **Bearer &lt;token>**",
						},
					},
				},
			},
		});

		await fastify.register(ScalarApiReference, {
			routePrefix: "/docs",
			configuration: {
				title: AppConfig.APP_NAME,
				theme: "fastify",
			},
			logLevel: "silent",
			hooks: {
				onRequest: function (request, reply, done) {
					done();
				},
				preHandler: function (request, reply, done) {
					done();
				},
			},
		});
	},
	{ name: "swagger-plugin" },
);

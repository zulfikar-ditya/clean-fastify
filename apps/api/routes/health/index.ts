import { db } from "@infra/postgres";
import { ResponseToolkit } from "@packages/toolkit";
import { FastifyInstance } from "fastify";

export default function (fastify: FastifyInstance) {
	fastify.get(
		"",
		{
			schema: {
				tags: ["Health"],
				summary: "Health Check",
				description:
					"Checks the health status of the application and its dependencies.",
				response: {
					200: {
						type: "object",
						properties: {
							status: { type: "number" },
							success: { type: "boolean" },
							message: { type: "string" },
							data: {
								type: "object",
								properties: {
									database: {
										type: "object",
										properties: {
											status: { type: "string" },
											responseTime: { type: "number" },
											remarks: { type: "string" },
										},
									},
									cache: {
										type: "object",
										properties: {
											status: { type: "string" },
											responseTime: { type: "number" },
											remarks: { type: "string" },
										},
									},
									redis: {
										type: "object",
										properties: {
											status: { type: "string" },
										},
									},
								},
							},
						},
					},
					503: {
						type: "object",
						properties: {
							database: {
								type: "object",
								properties: {
									status: { type: "string" },
									responseTime: { type: "number" },
									remarks: { type: "string" },
								},
							},
							cache: {
								type: "object",
								properties: {
									status: { type: "string" },
									responseTime: { type: "number" },
									remarks: { type: "string" },
								},
							},
							redis: {
								type: "object",
								properties: {
									status: { type: "string" },
								},
							},
						},
					},
				},
			},
		},
		async (_request, reply) => {
			let serviceStatus = {
				database: {
					status: "healthy",
					responseTime: 0,
					remarks: "",
				},
				cache: {
					status: "healthy",
					responseTime: 0,
					remarks: "",
				},
				redis: {
					status: "healthy",
				},
			};

			try {
				await db.execute("SELECT 1");
			} catch (error) {
				serviceStatus.database = {
					status: "unhealthy",
					responseTime: 0,
					remarks: `${error}`,
				};
			}

			try {
				const start = Date.now();
				await fastify.redis.ping();
				const end = Date.now();
				serviceStatus.redis = {
					status: "healthy",
				};
				serviceStatus.cache = {
					status: "healthy",
					responseTime: end - start,
					remarks: "Redis cache is operational.",
				};
			} catch (error) {
				serviceStatus.cache = {
					status: "unhealthy",
					responseTime: 0,
					remarks: `${error}`,
				};
				serviceStatus.redis = {
					status: "unhealthy",
				};
			}

			const allHealthy = Object.values(serviceStatus).every(
				(service) => service.status === "healthy",
			);

			if (!allHealthy) {
				return ResponseToolkit.error(
					reply,
					"One or more services are unhealthy",
					503,
					serviceStatus,
				);
			}

			return ResponseToolkit.success(
				reply,
				serviceStatus,
				"Service is healthy",
			);
		},
	);
}

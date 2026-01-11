import { AppConfig } from "@config/app.config";
import { DateToolkit, ResponseToolkit } from "@packages/toolkit";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export default function (fastify: FastifyInstance) {
	fastify.get(
		"/",
		{
			schema: {
				tags: ["Index"],
				description: "Returns a welcome message indicating the API is running.",
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
									AppName: { type: "string" },
									AppTimezone: { type: "string" },
									AppEnvironment: { type: "string" },
									CurrentTime: { type: "string" },
								},
							},
						},
					},
					500: {
						type: "object",
						properties: {
							error: { type: "string" },
							message: { type: "string" },
							statusCode: { type: "number" },
						},
					},
				},
			},
		},
		async (_request: FastifyRequest, reply: FastifyReply) => {
			return ResponseToolkit.success<{
				AppName: string;
				AppTimezone: string;
				AppEnvironment: string;
				CurrentTime: string;
			}>(
				reply,
				{
					AppName: AppConfig.APP_NAME,
					AppTimezone: AppConfig.APP_TIMEZONE,
					AppEnvironment: AppConfig.APP_ENV,
					CurrentTime: DateToolkit.getDateTimeInformativeWithTimezone(
						DateToolkit.now(),
					),
				},
				"API is running successfully.",
				200,
			);
		},
	);
}

import { FastifyInstance } from "fastify";
import { LoginBodySchema } from "./schema";
import { z } from "zod";
import { AuthService } from "@app/api/services/auth.service";

export default function (fastify: FastifyInstance) {
	// ======================
	// POST: /auth/login
	// ======================
	fastify.post(
		"/login",
		{
			schema: {
				tags: ["Auth"],
				description: "User login endpoint.",
				body: LoginBodySchema,
				response: {
					200: z.object({
						status: z.number().default(200).describe("HTTP status code"),
						success: z.boolean().default(true).describe("Request success"),
						message: z.string().describe("Success message"),
						data: z.object({
							token: z.string().describe("JWT token"),
							user: z.object({
								id: z.string().describe("User ID"),
								email: z.string().describe("User email"),
								name: z.string().describe("User name"),
								roles: z.array(z.string()).describe("User roles"),
								permissions: z.array(z.any()).describe("User permissions"),
							}),
						}),
					}),
					422: z.object({
						status: z.number().default(422).describe("HTTP status code"),
						success: z.boolean().default(false).describe("Request success"),
						message: z.string().describe("Error message"),
						errors: z
							.array(
								z.record(
									z.string().describe("Field name"),
									z.string().describe("Error message"),
								),
							)
							.describe("Validation errors"),
					}),
				},
			},
		},
		async (request, reply) => {
			// Resolve AuthService from DI container
			const authService = fastify.di.resolve(AuthService);

			const { email, password } = request.body as {
				email: string;
				password: string;
			};

			const userInfo = await authService.login(email, password);

			const token = await reply.jwtSign({
				id: userInfo.id,
			});

			return reply.send({
				status: 200,
				success: true,
				message: "Login successful",
				data: {
					token,
					user: userInfo,
				},
			});
		},
	);
}

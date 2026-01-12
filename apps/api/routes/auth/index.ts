import { FastifyInstance } from "fastify";
import {
	LoginBodySchema,
	RegisterBodySchema,
	ResendVerificationBodySchema,
	VerifyEmailBodySchema,
	ForgotPasswordBodySchema,
	ResetPasswordBodySchema,
	LoginResponseSchema,
	SuccessResponseSchema,
	UnauthorizedResponseSchema,
	ValidationErrorResponseSchema,
	ServerErrorResponseSchema,
} from "./schema";
import { AuthService } from "@app/api/services/auth.service";
import { ResponseToolkit } from "@packages/toolkit";
import { UserInformation } from "@packages/index";

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
					200: LoginResponseSchema,
					401: UnauthorizedResponseSchema,
					422: ValidationErrorResponseSchema,
					500: ServerErrorResponseSchema,
				},
			},
		},
		async (request, reply) => {
			const authService = fastify.di.resolve(AuthService);
			const { email, password } = request.body as {
				email: string;
				password: string;
			};

			const userInfo = await authService.login(email, password);
			const token = await reply.jwtSign({
				id: userInfo.id,
			});

			return ResponseToolkit.success<{
				token: string;
				user: UserInformation;
			}>(
				reply,
				{
					token,
					user: userInfo,
				},
				"Login successful",
				200,
			);
		},
	);

	// ======================
	// POST: /auth/register
	// ======================
	fastify.post(
		"/register",
		{
			schema: {
				tags: ["Auth"],
				description: "User registration endpoint.",
				body: RegisterBodySchema,
				response: {
					201: SuccessResponseSchema,
					422: ValidationErrorResponseSchema,
					500: ServerErrorResponseSchema,
				},
			},
		},
		async (request, reply) => {
			const authService = fastify.di.resolve(AuthService);
			const { name, email, password } = request.body as {
				name: string;
				email: string;
				password: string;
			};

			await authService.register({ name, email, password });

			return ResponseToolkit.success(reply, {}, "Registration successful", 201);
		},
	);

	// ======================
	// POST: /auth/resend-verification
	// ======================
	fastify.post(
		"/resend-verification",
		{
			schema: {
				tags: ["Auth"],
				description: "Resend email verification endpoint.",
				body: ResendVerificationBodySchema,
				response: {
					200: SuccessResponseSchema,
					422: ValidationErrorResponseSchema,
					500: ServerErrorResponseSchema,
				},
			},
		},
		async (request, reply) => {
			const service = fastify.di.resolve(AuthService);
			const { email } = request.body as { email: string };
			await service.resendVerification({ email });

			return ResponseToolkit.success(
				reply,
				{},
				"Verification email resent successfully",
				200,
			);
		},
	);

	// ======================
	// POST: /auth/verify-email
	// ======================
	fastify.post(
		"/verify-email",
		{
			schema: {
				tags: ["Auth"],
				description: "Email verification endpoint.",
				body: VerifyEmailBodySchema,
				response: {
					200: SuccessResponseSchema,
					422: ValidationErrorResponseSchema,
					500: ServerErrorResponseSchema,
				},
			},
		},
		async (request, reply) => {
			const service = fastify.di.resolve(AuthService);
			const { token } = request.body as { token: string };
			await service.verifyEmail({ token });

			return ResponseToolkit.success(
				reply,
				{},
				"Email verified successfully",
				200,
			);
		},
	);

	// ======================
	// POST: /auth/forgot-password
	// ======================
	fastify.post(
		"/forgot-password",
		{
			schema: {
				tags: ["Auth"],
				description: "Forgot password endpoint.",
				body: ForgotPasswordBodySchema,
				response: {
					200: SuccessResponseSchema,
					422: ValidationErrorResponseSchema,
					500: ServerErrorResponseSchema,
				},
			},
		},
		async (request, reply) => {
			const service = fastify.di.resolve(AuthService);
			const { email } = request.body as { email: string };
			await service.forgotPassword(email);

			return ResponseToolkit.success(
				reply,
				{},
				"Password reset email sent successfully",
				200,
			);
		},
	);

	// ======================
	// POST: /auth/reset-password
	// ======================
	fastify.post(
		"/reset-password",
		{
			schema: {
				tags: ["Auth"],
				description: "Reset password endpoint.",
				body: ResetPasswordBodySchema,
				response: {
					200: SuccessResponseSchema,
					422: ValidationErrorResponseSchema,
					500: ServerErrorResponseSchema,
				},
			},
		},
		async (request, reply) => {
			const service = fastify.di.resolve(AuthService);
			const { token, newPassword } = request.body as {
				token: string;
				newPassword: string;
			};
			await service.resetPassword(token, newPassword);

			return ResponseToolkit.success(
				reply,
				{},
				"Password reset successfully",
				200,
			);
		},
	);
}

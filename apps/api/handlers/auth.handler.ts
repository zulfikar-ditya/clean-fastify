import { StrongPassword } from "@default/strong-password";
import { ResponseToolkit } from "@toolkit/response";
import vine from "@vinejs/vine";
import { FastifyReply, FastifyRequest } from "fastify";
import { AuthService } from "../services";

const AuthSchema = {
	LoginSchema: vine.object({
		email: vine.string().email().normalizeEmail(),
		password: vine.string().minLength(1),
	}),

	RegisterSchema: vine.object({
		email: vine.string().email().normalizeEmail().maxLength(255),
		name: vine.string().trim().minLength(1).maxLength(255),
		password: vine.string().regex(StrongPassword),
	}),

	VerifyEmailSchema: vine.object({
		token: vine.string().trim().minLength(1).maxLength(255),
	}),

	ResentVerificationEmailSchema: vine.object({
		email: vine.string().email().normalizeEmail().maxLength(255),
	}),

	ForgotPasswordSchema: vine.object({
		email: vine.string().email().normalizeEmail().maxLength(255),
	}),

	ResetPasswordSchema: vine.object({
		token: vine.string().trim().minLength(1).maxLength(255),
		password: vine.string().regex(StrongPassword).confirmed(),
	}),
};

export const AuthHandler = {
	login: async (_request: FastifyRequest, _reply: FastifyReply) => {
		const payload = _request.body;
		const validation = await vine.validate({
			schema: AuthSchema.LoginSchema,
			data: payload,
		});

		const service = await AuthService.login(
			validation.email,
			validation.password,
		);
		const token = await _reply.jwtSign({
			id: service[0].id,
		});

		return ResponseToolkit.success(_reply, {
			message: "Login successful",
			data: { token, user: service[0] },
		});
	},
};

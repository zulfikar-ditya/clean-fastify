import { UserService } from "@app/api/services/settings/user.service";
import { StrongPassword } from "@default/strong-password";
import { DatatableToolkit } from "@toolkit/datatable";
import { ResponseToolkit } from "@toolkit/response";
import vine from "@vinejs/vine";
import { FastifyReply, FastifyRequest } from "fastify";

const UserSchema = {
	createSchema: vine.object({
		name: vine.string().minLength(1).maxLength(255),
		email: vine.string().email().normalizeEmail().maxLength(255),
		password: vine.string().regex(StrongPassword).confirmed(),
		roleIds: vine.array(vine.string().uuid()).minLength(1),
	}),

	updateSchema: vine.object({
		name: vine.string().minLength(1).maxLength(255),
		email: vine.string().email().normalizeEmail().maxLength(255),
		roleIds: vine.array(vine.string().uuid()).minLength(1),
	}),

	resetPasswordSchema: vine.object({
		password: vine.string().regex(StrongPassword).confirmed(),
	}),
};

export const UserHandler = {
	findAll: async (request: FastifyRequest, reply: FastifyReply) => {
		const datatableToolkit = DatatableToolkit.parseFilter(request);
		const data = await UserService.findAll(datatableToolkit);

		return ResponseToolkit.success(
			reply,
			data,
			"Users fetched successfully",
			200,
		);
	},

	create: async (request: FastifyRequest, reply: FastifyReply) => {
		const payload = request.body;
		const validation = await vine.validate({
			schema: UserSchema.createSchema,
			data: payload,
		});

		const user = await UserService.create(validation);

		return ResponseToolkit.success(
			reply,
			user,
			"User created successfully",
			201,
		);
	},

	detail: async (request: FastifyRequest, reply: FastifyReply) => {
		const { userId } = request.params as { userId: string };
		const data = await UserService.detail(userId);

		return ResponseToolkit.success(
			reply,
			data,
			"User detail fetched successfully",
			200,
		);
	},

	update: async (request: FastifyRequest, reply: FastifyReply) => {
		const { userId } = request.params as { userId: string };
		const payload = request.body;
		const validation = await vine.validate({
			schema: UserSchema.updateSchema,
			data: payload,
		});

		const user = await UserService.update(userId, validation);

		return ResponseToolkit.success(
			reply,
			user,
			"User updated successfully",
			200,
		);
	},

	delete: async (request: FastifyRequest, reply: FastifyReply) => {
		const { userId } = request.params as { userId: string };
		await UserService.delete(userId);

		return ResponseToolkit.success(
			reply,
			null,
			"User deleted successfully",
			200,
		);
	},

	resetPassword: async (request: FastifyRequest, reply: FastifyReply) => {
		const { userId } = request.params as { userId: string };
		const payload = request.body;
		const validation = await vine.validate({
			schema: UserSchema.resetPasswordSchema,
			data: payload,
		});

		await UserService.resetPassword(userId, validation);

		return ResponseToolkit.success(
			reply,
			null,
			"User password reset successfully",
			200,
		);
	},
};

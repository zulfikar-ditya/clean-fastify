import { RoleService } from "@app/api/services/settings/role.service";
import { DatatableToolkit } from "@toolkit/datatable";
import { ResponseToolkit } from "@toolkit/response";
import vine from "@vinejs/vine";
import { FastifyReply, FastifyRequest } from "fastify";

const RoleSchema = {
	createSchema: vine.object({
		name: vine.string().minLength(1),
		permissionIds: vine.array(vine.string().uuid()).minLength(1),
	}),

	updateSchema: vine.object({
		name: vine.string().minLength(1).optional(),
		permissionIds: vine.array(vine.string().uuid()).minLength(1).optional(),
	}),
};

export const RoleHandler = {
	findAll: async (_request: FastifyRequest, _reply: FastifyReply) => {
		const datatableQueryParam = DatatableToolkit.parseFilter(_request);
		const data = await RoleService.findAll(datatableQueryParam);

		return ResponseToolkit.success(_reply, data, "Roles fetched successfully.");
	},

	create: async (_request: FastifyRequest, _reply: FastifyReply) => {
		const payload = _request.body;
		const validation = await vine.validate({
			schema: RoleSchema.createSchema,
			data: payload,
		});

		await RoleService.create({
			name: validation.name,
			permissionIds: validation.permissionIds,
		});

		return ResponseToolkit.success(
			_reply,
			null,
			"Role created successfully.",
			201,
		);
	},

	detail: async (_request: FastifyRequest, _reply: FastifyReply) => {
		const { roleId } = _request.params as { roleId: string };
		const data = await RoleService.detail(roleId);

		return ResponseToolkit.success(
			_reply,
			data,
			"Role detail fetched successfully.",
		);
	},

	update: async (_request: FastifyRequest, _reply: FastifyReply) => {
		const { roleId } = _request.params as { roleId: string };
		const payload = _request.body;
		const validation = await vine.validate({
			schema: RoleSchema.updateSchema,
			data: payload,
		});

		await RoleService.update(roleId, {
			name: validation.name!,
			permissionIds: validation.permissionIds!,
		});

		return ResponseToolkit.success(_reply, null, "Role updated successfully.");
	},

	delete: async (_request: FastifyRequest, _reply: FastifyReply) => {
		const { roleId } = _request.params as { roleId: string };
		await RoleService.delete(roleId);

		return ResponseToolkit.success(_reply, null, "Role deleted successfully.");
	},
};

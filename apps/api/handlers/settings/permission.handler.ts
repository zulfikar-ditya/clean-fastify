import { PermissionService } from "@app/api/services/settings/permission.service";
import { DatatableToolkit } from "@toolkit/datatable";
import { ResponseToolkit } from "@toolkit/response";
import vine from "@vinejs/vine";
import { FastifyReply, FastifyRequest } from "fastify";

const PermissionSchema = {
	createSchema: vine.object({
		group: vine.string().minLength(1),
		names: vine.array(vine.string().minLength(1)).minLength(1),
	}),

	updateSchema: vine.object({
		name: vine.string().minLength(1).optional(),
		group: vine.string().minLength(1).optional(),
	}),
};

export const PermissionHandler = {
	findAll: async (_request: FastifyRequest, _reply: FastifyReply) => {
		const datatableQueryParam = DatatableToolkit.parseFilter(_request);
		const data = await PermissionService.findAll(datatableQueryParam);

		return ResponseToolkit.success(
			_reply,
			data,
			"Permissions fetched successfully.",
		);
	},

	create: async (_request: FastifyRequest, _reply: FastifyReply) => {
		const payload = _request.body;
		const validation = await vine.validate({
			schema: PermissionSchema.createSchema,
			data: payload,
		});

		await PermissionService.create({
			group: validation.group,
			name: validation.names,
		});

		return ResponseToolkit.success(
			_reply,
			null,
			"Permissions created successfully.",
			201,
		);
	},

	detail: async (_request: FastifyRequest, _reply: FastifyReply) => {
		const { permissionId } = _request.params as { permissionId: string };
		const data = await PermissionService.detail(permissionId);

		return ResponseToolkit.success(
			_reply,
			data,
			"Permission detail fetched successfully.",
		);
	},

	update: async (_request: FastifyRequest, _reply: FastifyReply) => {
		const { permissionId } = _request.params as { permissionId: string };
		const payload = _request.body;
		const validation = await vine.validate({
			schema: PermissionSchema.updateSchema,
			data: payload,
		});

		await PermissionService.update(permissionId, {
			name: validation.name!,
			group: validation.group!,
		});

		return ResponseToolkit.success(
			_reply,
			null,
			"Permission updated successfully.",
		);
	},

	delete: async (_request: FastifyRequest, _reply: FastifyReply) => {
		const { permissionId } = _request.params as { permissionId: string };
		await PermissionService.delete(permissionId);

		return ResponseToolkit.success(
			_reply,
			null,
			"Permission deleted successfully.",
		);
	},
};

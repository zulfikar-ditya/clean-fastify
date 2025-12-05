import { PermissionRepository } from "@app/api/repositories";
import { RoleRepository } from "@app/api/repositories/role.repository";
import { ResponseToolkit } from "@toolkit/response";
import { FastifyReply, FastifyRequest } from "fastify";

export const SelectHandler = {
	selectPermissions: async (_request: FastifyRequest, _reply: FastifyReply) => {
		const data = await PermissionRepository().selectOptions();
		return ResponseToolkit.success(
			_reply,
			data,
			"Permission select options fetched successfully.",
		);
	},

	selectRoles: async (_request: FastifyRequest, _reply: FastifyReply) => {
		const data = await RoleRepository().selectOptions();
		return ResponseToolkit.success(
			_reply,
			data,
			"Role select options fetched successfully.",
		);
	},
};

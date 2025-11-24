import {
	RoleDetail,
	RoleList,
	RoleRepository,
} from "@app/api/repositories/role.repository";
import { DatatableType } from "@app/api/types/datatable";
import { PaginationResponse } from "@app/api/types/pagination";
import { db } from "@postgres/index";

export const RoleService = {
	findAll: async (
		queryParam: DatatableType,
	): Promise<PaginationResponse<RoleList>> => {
		return await RoleRepository().findAll(queryParam);
	},

	create: async (data: {
		name: string;
		permissionIds: string[];
	}): Promise<void> => {
		await db.transaction(async (tx) => {
			await RoleRepository().create(data, tx);
		});
	},

	detail: async (roleId: string): Promise<RoleDetail> => {
		return await RoleRepository().getDetail(roleId);
	},

	update: async (
		id: string,
		data: { name: string; permissionIds: string[] },
	): Promise<void> => {
		await db.transaction(async (tx) => {
			await RoleRepository().update(id, data, tx);
		});
	},

	delete: async (roleId: string): Promise<void> => {
		await db.transaction(async (tx) => {
			await RoleRepository().delete(roleId, tx);
		});
	},
};

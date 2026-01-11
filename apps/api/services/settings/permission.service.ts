import {
	PermissionList,
	PermissionRepository,
} from "@infra/postgres/repositories";
import { DatatableType } from "packages/types/datatable";
import { PaginationResponse } from "packages/types/pagination";

export const PermissionService = {
	findAll: async (
		queryParams: DatatableType,
	): Promise<PaginationResponse<PermissionList>> => {
		return await PermissionRepository().findAll(queryParams);
	},

	create: async (data: { group: string; name: string[] }): Promise<void> => {
		await PermissionRepository().create(data);
	},

	detail: async (permissionId: string): Promise<PermissionList> => {
		return await PermissionRepository().getDetail(permissionId);
	},

	update: async (
		permissionId: string,
		data: { name: string; group: string },
	): Promise<void> => {
		await PermissionRepository().update(permissionId, data);
	},

	delete: async (permissionId: string): Promise<void> => {
		await PermissionRepository().delete(permissionId);
	},
};

import { UnprocessableEntityError } from "packages/error/custom.errors";
import {
	RoleDetail,
	RoleList,
	RoleRepository,
} from "@app/api/repositories/role.repository";
import { DatatableType } from "@app/api/types/datatable";
import { PaginationResponse } from "@app/api/types/pagination";
import { db, permissionsTable } from "@postgres/index";
import { inArray } from "drizzle-orm";

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
		// validate the permissions ids
		const validPermissions = await db
			.select()
			.from(permissionsTable)
			.where(inArray(permissionsTable.id, data.permissionIds));

		if (validPermissions.length !== data.permissionIds.length) {
			throw new UnprocessableEntityError("Validation error", [
				{
					field: "permissionIds",
					message: "One or more permissions are invalid",
				},
			]);
		}

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
		// validate the permissions ids
		const validPermissions = await db
			.select()
			.from(permissionsTable)
			.where(inArray(permissionsTable.id, data.permissionIds));

		if (validPermissions.length !== data.permissionIds.length) {
			throw new UnprocessableEntityError("Validation error", [
				{
					field: "permissionIds",
					message: "One or more permissions are invalid",
				},
			]);
		}

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

import { UnprocessableEntityError } from "@app/api/error/custom.errors";
import { UserDetail, UserList, UserRepository } from "@app/api/repositories";
import { DatatableType } from "@app/api/types/datatable";
import { PaginationResponse } from "@app/api/types/pagination";
import { db, rolesTable } from "@postgres/index";
import { and, eq, inArray, isNull, not } from "drizzle-orm";
import { usersTable } from "../../../../infra/postgres/user";
import { Hash } from "@security/hash";

export const UserService = {
	findAll: async (
		queryParam: DatatableType,
	): Promise<PaginationResponse<UserList>> => {
		return await UserRepository().findAll(queryParam);
	},

	create: async (data: {
		name: string;
		email: string;
		password: string;
		roleIds: string[];
	}): Promise<void> => {
		const isEmailExists = await db.query.users.findFirst({
			where: and(
				eq(usersTable.email, data.email),
				isNull(usersTable.deleted_at),
			),
			columns: {
				id: true,
			},
		});

		if (isEmailExists) {
			throw new UnprocessableEntityError("Validation error", [
				{
					field: "email",
					message: "Email already exists",
				},
			]);
		}

		// validate the user roles
		const validRoles = await db
			.select()
			.from(rolesTable)
			.where(inArray(rolesTable.id, data.roleIds));

		if (validRoles.length !== data.roleIds.length) {
			throw new UnprocessableEntityError("Validation error", [
				{
					field: "roleIds",
					message: "One or more roles are invalid",
				},
			]);
		}

		await db.transaction(async (tx) => {
			await UserRepository().create(data, tx);
		});
	},

	detail: async (userId: string): Promise<UserDetail> => {
		return await UserRepository().getDetail(userId);
	},

	update: async (
		id: string,
		data: { name: string; email: string; roleIds: string[] },
	): Promise<void> => {
		const isEmailExists = await UserRepository().db.query.users.findFirst({
			where: and(
				eq(usersTable.email, data.email),
				isNull(usersTable.deleted_at),
				not(eq(usersTable.id, id)),
			),
		});
		if (isEmailExists) {
			throw new UnprocessableEntityError("Validation error", [
				{
					field: "email",
					message: "Email already exists",
				},
			]);
		}

		// validate the user roles
		const validRoles = await db
			.select()
			.from(rolesTable)
			.where(inArray(rolesTable.id, data.roleIds));

		if (validRoles.length !== data.roleIds.length) {
			throw new UnprocessableEntityError("Validation error", [
				{
					field: "roleIds",
					message: "One or more roles are invalid",
				},
			]);
		}

		await db.transaction(async (tx) => {
			await UserRepository().update(id, data, tx);
		});
	},

	delete: async (userId: string): Promise<void> => {
		await db.transaction(async (tx) => {
			await UserRepository().delete(userId, tx);
		});
	},

	resetPassword: async (
		userId: string,
		data: { password: string },
	): Promise<void> => {
		await db.transaction(async (tx) => {
			await tx
				.update(usersTable)
				.set({
					password: await Hash.generateHash(data.password),
				})
				.where(eq(usersTable.id, userId));
		});
	},
};

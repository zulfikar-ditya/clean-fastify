import { and, eq, isNull } from "drizzle-orm";
import { Hash } from "@security/hash";

import { UserRepository } from "@infra/postgres/repositories";
import { usersTable } from "@infra/postgres";
import {
	UnauthorizedError,
	UnprocessableEntityError,
} from "@packages/error/custom.errors";
import { UserInformation } from "@packages/index";

export const ProfileService = {
	updateProfile: async (
		userId: string,
		data: { name: string; email: string },
	): Promise<UserInformation> => {
		const user = await UserRepository().db.query.users.findFirst({
			where: and(eq(usersTable.id, userId), isNull(usersTable.deleted_at)),
		});

		if (!user) {
			throw new UnauthorizedError("User not found");
		}

		await UserRepository()
			.db.update(usersTable)
			.set({
				name: data.name,
				email: data.email,
				updated_at: new Date(),
			})
			.where(eq(usersTable.id, userId));

		return await UserRepository().UserInformation(userId);
	},

	updatePassword: async (
		userId: string,
		data: {
			password: string;
			currentPassword: string;
		},
	): Promise<void> => {
		const user = await UserRepository().db.query.users.findFirst({
			where: and(eq(usersTable.id, userId), isNull(usersTable.deleted_at)),
		});

		if (!user) {
			throw new UnauthorizedError("User not found");
		}

		const isPasswordValid = await Hash.compareHash(
			data.currentPassword,
			user.password,
		);

		if (!isPasswordValid) {
			throw new UnprocessableEntityError("Validation error", [
				{
					field: "currentPassword",
					message: "Current password is incorrect",
				},
			]);
		}

		const hashedPassword = await Hash.generateHash(data.password);
		await UserRepository()
			.db.update(usersTable)
			.set({
				password: hashedPassword,
				updated_at: new Date(),
			})
			.where(eq(usersTable.id, userId));
	},
};

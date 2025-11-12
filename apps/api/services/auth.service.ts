import { Hash } from "@security/hash";
import { UnprocessableEntityError } from "../error/custom.errors";
import { UserRepository } from "../repositories";

export const AuthService = {
	login: async (email: string, password: string) => {
		const user = await UserRepository().findByEmail(email);

		if (user.email_verified_at === null) {
			// await userActivitiesService.trackActivity({
			// 	user_id: user.id,
			// 	action: "failed_login",
			// 	resource: "auth/login",
			// 	ip_address: ipAddress,
			// 	metadata: { reason: "email not verified" },
			// 	user_agent: userAgent,
			// });

			throw new UnprocessableEntityError("Validation error", [
				{
					field: "email",
					message: "Email not verified",
				},
			]);
		}

		if (user.status !== "active") {
			// await userActivitiesService.trackActivity({
			// 	user_id: user.id,
			// 	action: "failed_login",
			// 	resource: "auth/login",
			// 	ip_address: ipAddress,
			// 	metadata: { reason: "account not active" },
			// 	user_agent: userAgent,
			// });

			throw new UnprocessableEntityError("Validation error", [
				{
					field: "email",
					message: "Your account is not active. Please contact administrator.",
				},
			]);
		}

		const isPasswordValid = await Hash.compareHash(password, user.password);
		if (!isPasswordValid) {
			// await userActivitiesService.trackActivity({
			// 	user_id: user.id,
			// 	action: "failed_login",
			// 	resource: "auth/login",
			// 	ip_address: ipAddress,
			// 	metadata: { reason: "invalid password" },
			// 	user_agent: userAgent,
			// });

			throw new UnprocessableEntityError("Validation error", [
				{
					field: "email",
					message: "Invalid email or password",
				},
			]);
		}

		// // Track successful login
		// await userActivitiesService.trackActivity({
		// 	user_id: user.id,
		// 	action: "login",
		// 	resource: "auth/login",
		// 	ip_address: ipAddress,
		// 	metadata: { status: "success" },
		// 	user_agent: userAgent,
		// });

		return await UserRepository().UserInformation(user.id);
	},
};

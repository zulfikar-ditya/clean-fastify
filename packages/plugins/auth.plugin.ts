import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import fastifyPlugin from "fastify-plugin";
import { and, eq, isNotNull } from "drizzle-orm";
import { db, usersTable } from "@postgres/index";
import { ResponseToolkit } from "@toolkit/response";
import { UserInformationCacheKey } from "@cache/*";

// eslint-disable-next-line @typescript-eslint/require-await
async function authPlugin(fastify: FastifyInstance) {
	fastify.decorate(
		"authenticate",
		async function (req: FastifyRequest, reply: FastifyReply) {
			try {
				await req.jwtVerify();
				const userJwt = req.user as { id: string };

				const cacheKey = UserInformationCacheKey(userJwt.id);
				const cacheUser = await this.redis.get(cacheKey);

				if (!cacheUser) {
					const userData = await db
						.select({
							id: usersTable.id,
							name: usersTable.name,
							email: usersTable.email,
						})
						.from(usersTable)
						.where(
							and(
								eq(usersTable.id, userJwt.id),
								isNotNull(usersTable.email_verified_at),
							),
						)
						.limit(1);

					if (userData.length === 0) {
						ResponseToolkit.unauthorized(
							reply,
							"User not found or email not verified",
						);
						return;
					}

					await this.redis.set(
						cacheKey,
						JSON.stringify(userData[0]),
						"EX",
						3600 * 24,
					);
					req.user = userData[0];
				} else {
					req.user = JSON.parse(cacheUser);
				}
			} catch (err) {
				reply.send(err);
			}
		},
	);
}

export default fastifyPlugin(authPlugin);

import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import fastifyPlugin from "fastify-plugin";
import { ResponseToolkit } from "@toolkit/response";
import { UserInformation } from "@app/api/types/UserInformation";

// eslint-disable-next-line @typescript-eslint/require-await
async function superuserPlugin(fastify: FastifyInstance) {
	fastify.decorate(
		"requireSuperuser",
		// eslint-disable-next-line
		async function (req: FastifyRequest, reply: FastifyReply) {
			const user = req.user as UserInformation;

			if (!user) {
				ResponseToolkit.error(reply, "Unauthorized", 401);
				return;
			}

			// Check if user has superuser role (adjust the property name based on your user structure)
			if (!user.roles.some((role) => role === "superuser")) {
				ResponseToolkit.error(
					reply,
					"Access denied. Superuser role required.",
					403,
				);
				return;
			}
		},
	);
}

export default fastifyPlugin(superuserPlugin);

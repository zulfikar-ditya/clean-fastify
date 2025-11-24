import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import fastifyPlugin from "fastify-plugin";
import { ResponseToolkit } from "@toolkit/response";

// eslint-disable-next-line @typescript-eslint/require-await
async function superuserPlugin(fastify: FastifyInstance) {
	fastify.decorate(
		"requireSuperuser",
		// eslint-disable-next-line
		async function (req: FastifyRequest, reply: FastifyReply) {
			const user = req.user as {
				id: string;
				role?: string;
				isSuperuser?: boolean;
			};

			// Check if user has superuser role (adjust the property name based on your user structure)
			if (!user.isSuperuser && user.role !== "superuser") {
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

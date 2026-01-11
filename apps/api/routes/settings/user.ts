import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export default function (fastify: FastifyInstance) {
	fastify.get(
		"",
		{
			schema: {
				tags: ["Settings", "User"],
				response: {},
			},
		},
		async (_request: FastifyRequest, _reply: FastifyReply) => {
			//
		},
	);
}

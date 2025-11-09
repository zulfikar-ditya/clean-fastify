import { FastifyRequest, FastifyReply } from "fastify";

export const HomeHandler = {
	home: async (_request: FastifyRequest, reply: FastifyReply) => {
		return reply.send({ status: "ok" });
	},
	health: async (_request: FastifyRequest, reply: FastifyReply) => {
		return reply.send({ status: "ok" });
	},
};

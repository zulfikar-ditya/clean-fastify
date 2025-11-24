/* eslint-disable */
import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";

declare module "fastify" {
	interface FastifyInstance {
		authenticate: (
			request: FastifyRequest,
			reply: FastifyReply,
		) => Promise<void>;
		requireSuperuser: (
			request: FastifyRequest,
			reply: FastifyReply,
		) => Promise<void>;
		clearUserCache: (userId: string) => Promise<void>;
	}
}

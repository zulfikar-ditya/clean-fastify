import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { container } from "@packages/di";

declare module "fastify" {
	interface FastifyInstance {
		di: typeof container;
	}
}

export default fp(
	async function (fastify: FastifyInstance) {
		// Decorate Fastify instance with DI container
		fastify.decorate("di", container);

		// Helper method to resolve dependencies
		fastify.decorate("resolve", <T>(token: any): T => {
			return container.resolve<T>(token);
		});
	},
	{ name: "di-plugin" },
);

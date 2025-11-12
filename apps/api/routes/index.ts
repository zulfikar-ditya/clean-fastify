import { FastifyInstance } from "fastify";
import { HomeHandler } from "../handlers/home.handler";

export const registerRoutes = (app: FastifyInstance) => {
	app.get("/", HomeHandler.home);
	app.get("/health", HomeHandler.health);
};

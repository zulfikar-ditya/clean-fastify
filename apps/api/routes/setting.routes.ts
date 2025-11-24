import { FastifyInstance } from "fastify";
import { SelectHandler } from "../handlers/settings/select.handler";
import { PermissionHandler } from "../handlers/settings/permission.handler";
import { RoleHandler } from "../handlers/settings/role.handler";
import { UserHandler } from "../handlers/settings/user.handler";

export const registerSettingRoutes = (app: FastifyInstance) => {
	app.register(
		(instance) => {
			// All routes in this group will require authentication
			instance.addHook("onRequest", instance.authenticate);
			// Require superuser role for all setting routes
			instance.addHook("onRequest", instance.requireSuperuser);
			// Define setting-related routes here

			instance.get("/select/permissions", SelectHandler.selectPermissions);
			instance.get("/select/roles", SelectHandler.selectRoles);

			instance.get("/permissions", PermissionHandler.findAll);
			instance.post("/permissions", PermissionHandler.create);
			instance.get("/permissions/:permissionId", PermissionHandler.detail);
			instance.put("/permissions/:permissionId", PermissionHandler.update);
			instance.delete("/permissions/:permissionId", PermissionHandler.delete);

			instance.get("/roles", RoleHandler.findAll);
			instance.post("/roles", RoleHandler.create);
			instance.get("/roles/:roleId", RoleHandler.detail);
			instance.put("/roles/:roleId", RoleHandler.update);
			instance.delete("/roles/:roleId", RoleHandler.delete);

			instance.get("/users", UserHandler.findAll);
			instance.post("/users", UserHandler.create);
			instance.get("/users/:userId", UserHandler.detail);
			instance.put("/users/:userId", UserHandler.update);
			instance.delete("/users/:userId", UserHandler.delete);
			instance.post("/users/:userId/reset-password", UserHandler.resetPassword);
		},
		{ prefix: "/settings" },
	);
};

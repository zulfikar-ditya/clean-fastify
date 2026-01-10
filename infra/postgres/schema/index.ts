import {
	email_verificationsTable,
	password_reset_tokensTable,
	permissionsTable,
	role_permissionsTable,
	rolesTable,
	user_rolesTable,
	usersTable,
} from "..";
import { email_verificationsRelations } from "./email_verification";
import { password_reset_tokensRelations } from "./password_reset_token";
import {
	permissionsRelations,
	role_permissionsRelations,
	rolesRelations,
	user_rolesRelations,
} from "./rbac";
import { usersRelations } from "./user";

export const schema = {
	// Tables
	users: usersTable,
	roles: rolesTable,
	permissions: permissionsTable,
	role_permissions: role_permissionsTable,
	user_roles: user_rolesTable,
	email_verifications: email_verificationsTable,
	password_reset_tokens: password_reset_tokensTable,

	// Relations
	usersRelations,
	rolesRelations,
	permissionsRelations,
	role_permissionsRelations,
	user_rolesRelations,
	email_verificationsRelations,
	password_reset_tokensRelations,
};

export * from "./email_verification";
export * from "./password_reset_token";
export * from "./rbac";
export * from "./user";

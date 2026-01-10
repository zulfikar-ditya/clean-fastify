import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { DatabaseConfig } from "config/database.config";
import { usersTable } from "./schema/user";
import {
	rolesTable,
	permissionsTable,
	role_permissionsTable,
	user_rolesTable,
} from "./schema/rbac";
import { email_verificationsTable } from "./schema/email_verification";
import { password_reset_tokensTable } from "./schema/password_reset_token";
import { schema } from "./schema/index";

const connectionString = DatabaseConfig.url;
const client = new Pool({ connectionString });

const db = drizzle(client, { schema });

export {
	db,
	usersTable,
	rolesTable,
	permissionsTable,
	role_permissionsTable,
	user_rolesTable,
	email_verificationsTable,
	password_reset_tokensTable,
};

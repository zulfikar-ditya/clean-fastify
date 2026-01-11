import { z } from "zod";

export const LoginBodySchema = z.object({
	email: z.email().describe("User's email address"),
	password: z.string().describe("User's password"),
});

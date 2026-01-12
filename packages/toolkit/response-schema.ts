import { z, ZodTypeAny } from "zod";

/**
 * Creates a success response schema with custom data type
 * @param dataSchema - Zod schema for the data field
 * @param statusCode - HTTP status code (default: 200)
 */
export function createSuccessResponseSchema<T extends ZodTypeAny>(
	dataSchema: T,
	statusCode: number = 200,
) {
	return z.object({
		status: z.number().default(statusCode).describe("HTTP status code"),
		success: z.boolean().default(true).describe("Request success"),
		message: z.string().describe("Success message"),
		data: dataSchema,
	});
}

/**
 * Creates an error response schema
 * @param statusCode - HTTP status code
 */
export function createErrorResponseSchema(statusCode: number) {
	return z.object({
		status: z.number().default(statusCode).describe("HTTP status code"),
		success: z.boolean().default(false).describe("Request success"),
		message: z.string().describe("Error message"),
	});
}

/**
 * Creates a validation error response schema (422)
 */
export function createValidationErrorResponseSchema() {
	return z.object({
		status: z.number().default(422).describe("HTTP status code"),
		success: z.boolean().default(false).describe("Request success"),
		message: z.string().describe("Error message"),
		errors: z
			.array(
				z.record(
					z.string().describe("Field name"),
					z.string().describe("Error message"),
				),
			)
			.describe("Validation errors"),
	});
}

// Pre-built common response schemas
export const UnauthorizedResponseSchema = createErrorResponseSchema(401);
export const ForbiddenResponseSchema = createErrorResponseSchema(403);
export const NotFoundResponseSchema = createErrorResponseSchema(404);
export const ValidationErrorResponseSchema =
	createValidationErrorResponseSchema();
export const ServerErrorResponseSchema = createErrorResponseSchema(500);
export const BadRequestResponseSchema = createErrorResponseSchema(400);

// Empty data success response helper
export const EmptySuccessResponseSchema = createSuccessResponseSchema(
	z.object({}),
);

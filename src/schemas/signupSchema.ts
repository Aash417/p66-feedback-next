import { z } from 'zod';

export const usernameSchema = z
	.string()
	.min(2, 'username must be atleast 2 character')
	.max(20, 'username must be less than 20 character')
	.regex(/^[a-zA-Z0-9]+$/, 'username must not contain any special character');

export const signupSchema = z.object({
	username: usernameSchema,
	email: z.string().email({ message: 'Invalid email address' }),
	password: z.string(),
});

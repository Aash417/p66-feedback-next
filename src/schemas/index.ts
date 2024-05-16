import { z } from 'zod';

export const acceptMessageSchema = z.object({
	acceptMessage: z.boolean(),
});

export const messageSchema = z.object({
	content: z
		.string()
		.min(10, 'Content must be at least 10 character')
		.max(300, 'Content must not be longer than 300 character'),
});

export const signinSchema = z.object({
	identifier: z.string(),
	password: z.string(),
});

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

export const verifySchema = z.object({
	code: z.string().length(6, 'Verification code must be 6 character'),
});

import { z } from 'zod';

export const messageSchema = z.object({
	content: z
		.string()
		.min(10, 'Content must be at least 10 character')
		.max(300, 'Content must not be longer than 300 character'),
});

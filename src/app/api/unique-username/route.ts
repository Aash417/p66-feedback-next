import { db } from '@/db';
import { usernameSchema } from '@/schemas';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const UsernameQuerySchema = z.object({
	username: usernameSchema,
});

export async function GET(req: Request) {
	try {
		const { searchParams } = new URL(req.url);
		const queryParam = { username: searchParams.get('username') };

		//validate with zod
		const result = UsernameQuerySchema.safeParse(queryParam);
		console.log(result);
		if (!result.success) {
			const usernameError = result.error.format().username?._errors || [];
			return NextResponse.json({
				success: false,
				message:
					usernameError?.length > 0
						? usernameError?.join(', ')
						: 'invalid query parameters',
			});
		}

		const { username } = result.data;
		const existingVerifiedUser = await db.user.findFirst({
			where: {
				username,
				isVerified: true,
			},
		});
		if (existingVerifiedUser) {
			return NextResponse.json(
				{
					success: false,
					message: 'Username is already taken',
				},
				{ status: 400 }
			);
		}
		return NextResponse.json(
			{
				success: true,
				message: 'Username is unique',
			},
			{ status: 200 }
		);
	} catch (error) {
		console.log('Error checking username : ', error);
		return NextResponse.json(
			{
				success: false,
				message: 'Error checking username',
			},
			{ status: 500 }
		);
	}
}

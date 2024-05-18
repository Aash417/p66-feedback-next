import { db } from '@/db';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
	try {
		const { username, code } = await req.json();
		const decodedUsername = decodeURIComponent(username);
		const user = await db.user.findFirst({
			where: {
				username: decodedUsername,
			},
		});
		if (!user) {
			return NextResponse.json(
				{ success: false, message: 'User not found' },
				{ status: 500 }
			);
		}

		const isCodeValid = user.verifyCode === code;
		const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();
		if (isCodeValid && isCodeNotExpired) {
			await db.user.update({
				where: { username: decodedUsername },
				data: { isVerified: true },
			});

			return NextResponse.json(
				{
					success: true,
					message: 'Account verified successful',
				},
				{ status: 200 }
			);
		} else if (!isCodeNotExpired) {
			return NextResponse.json(
				{
					success: false,
					message: 'Verification code has expired',
				},
				{ status: 400 }
			);
		} else {
			return NextResponse.json(
				{
					success: false,
					message: 'Incorrect verification code',
				},
				{ status: 400 }
			);
		}
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

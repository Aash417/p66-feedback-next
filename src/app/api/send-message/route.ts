import { db } from '@/db';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
	const { username, content } = await req.json();

	try {
		const user = await db.user.findFirst({
			where: { username },
		});

		if (!user)
			return NextResponse.json(
				{ success: false, message: 'User not found' },
				{ status: 404 }
			);

		if (!user.isAcceptingMessage)
			return NextResponse.json(
				{ success: false, message: 'User is not accepting the messages' },
				{ status: 403 }
			);

		await db.message.create({
			data: {
				content,
				createdAt: new Date(),
			},
		});
		return NextResponse.json(
			{ success: true, message: 'message sent successfully' },
			{ status: 401 }
		);
	} catch (error) {
		console.log('error in send message', error);

		return NextResponse.json(
			{ success: false, message: 'Internal server error' },
			{ status: 500 }
		);
	}
}

import { db } from '@/db';
import { getServerSession, User } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '../auth/[...nextauth]/options';

export async function GET(req: Request) {
	const session = await getServerSession(authOptions);
	const user: User = session?.user as User;

	if (!session || session.user)
		return NextResponse.json({ success: false, message: 'Not Authenticated' }, { status: 401 });

	const userId = user.id;

	try {
		const user = await db.user.findUnique({
			where: { id: userId },
			select: {
				id: true,
				messages: {
					orderBy: {
						createdAt: 'desc',
					},
				},
			},
		});

		if (!user)
			return NextResponse.json(
				{ success: false, message: 'User not found' },
				{ status: 401 }
			);

		return NextResponse.json({ success: true, messages: user.messages }, { status: 401 });
	} catch (error) {}
}

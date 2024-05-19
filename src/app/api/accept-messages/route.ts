import { db } from '@/db';
import { User, getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../auth/[...nextauth]/options';

export async function POST(req: Request) {
	const session = await getServerSession(authOptions);
	const user: User = session?.user as User;

	if (!session || session.user)
		return NextResponse.json({ success: false, message: 'Not Authenticated' }, { status: 401 });

	const userId = user.id;
	const { acceptMessages } = await req.json();

	try {
		const updatedUser = await db.user.update({
			where: { id: userId },
			data: { isAcceptingMessage: acceptMessages },
		});

		if (!updatedUser)
			return NextResponse.json(
				{ success: false, message: 'Not Authenticated' },
				{ status: 401 }
			);
		else
			return NextResponse.json(
				{ success: true, message: 'Message acceptance status updated successfully' },
				{ status: 200 }
			);
	} catch (error) {
		console.log('error in accept message');

		return NextResponse.json(
			{ success: false, message: 'failed to accept user status to accept message' },
			{ status: 401 }
		);
	}
}

export async function GET(req: NextRequest) {
	const session = await getServerSession(authOptions);
	const user: User = session?.user as User;

	if (!session || session.user)
		return NextResponse.json({ success: false, message: 'Not Authenticated' }, { status: 401 });

	const userId = user.id;
	try {
		const foundUser = await db.user.findFirst({
			where: { id: userId },
		});

		if (!foundUser)
			return NextResponse.json(
				{ success: false, message: 'Not Authenticated' },
				{ status: 404 }
			);

		return NextResponse.json(
			{ success: true, isAcceptingMessage: foundUser.isAcceptingMessage },
			{ status: 200 }
		);
	} catch (error) {
		console.log('failed to accept user status to accept message');

		return NextResponse.json(
			{ success: false, message: 'Error in getting message acceptance status' },
			{ status: 401 }
		);
	}
}

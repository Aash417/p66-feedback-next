import { db } from '@/db';
import { sendVerificationEmail } from '@/lib/resend';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
	try {
		const { username, email, password } = await req.json();

		const existingUserVerifiedByUsername = await db.user.findFirst({
			where: { username, isVerified: true },
		});

		if (existingUserVerifiedByUsername)
			return NextResponse.json(
				{ success: false, message: 'Username is already taken' },
				{ status: 400 }
			);

		const existingUserByEmail = await db.user.findFirst({
			where: { email },
		});
		const verifyCode = Math.floor(10000 + Math.random() * 900000).toString();

		if (existingUserByEmail) {
			if (existingUserByEmail.isVerified)
				return NextResponse.json(
					{ success: false, message: 'user already exists with this email.' },
					{ status: 400 }
				);
			else {
				const hashedPassword = await bcrypt.hash(password, 10);
				existingUserByEmail.password = hashedPassword;
				existingUserByEmail.verifyCode = verifyCode;
				existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 360000);
			}
		} else {
			const hashedPassword = await bcrypt.hash(password, 10);
			const expiryDate = new Date();
			expiryDate.setHours(expiryDate.getHours() + 1);

			const newUser = await db.user.create({
				data: {
					username,
					email,
					password: hashedPassword,
					verifyCode,
					verifyCodeExpiry: expiryDate,
				},
			});

			const emailResponse = await sendVerificationEmail(email, username, verifyCode);
			if (!emailResponse.success)
				return NextResponse.json(
					{ success: false, message: 'Username is already taken' },
					{ status: 400 }
				);

			return NextResponse.json(
				{
					success: true,
					message: 'User registered successfully, Please verify your email.',
				},
				{ status: 201 }
			);
		}
	} catch (error) {
		console.error('Error registering user', error);
		return NextResponse.json(
			{ success: false, message: 'Error registering user' },
			{ status: 500 }
		);
	}
}

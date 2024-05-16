import VerificationEmail from '@/emails/Verification';
import { Resend } from 'resend';
import { ApiResponse } from './../types/ApiResponse';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(
	email: string,
	username: string,
	verifyCode: string
): Promise<ApiResponse> {
	try {
		const { data, error } = await resend.emails.send({
			from: 'nextFeed <onboarding@resend.dev>',
			to: [email],
			subject: 'Hello world',
			react: VerificationEmail({ username, otp: verifyCode }),
		});

		return { success: true, message: 'Verification email send successfully' };
	} catch (error) {
		console.error('Error in sending verification email: ', error);
		return { success: false, message: 'fail to send verification email' };
	}
}

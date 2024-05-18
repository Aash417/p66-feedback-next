import { db } from '@/db';
import bcrypt from 'bcryptjs';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
	providers: [
		CredentialsProvider({
			id: 'Credentials',
			name: 'Credentials',
			credentials: {
				email: { label: 'Email', type: 'email' },
				password: { label: 'Password', type: 'password' },
			},
			async authorize(credentials, req): Promise<any> {
				try {
					const user = await db.user.findFirst({
						where: {
							OR: [
								{ email: credentials?.email },
								{ password: credentials?.password },
							],
						},
					});

					if (!user) throw new Error('No user find with this email');
					if (!user.isVerified) throw new Error('Please verify your account first');

					const isPasswordCorrect = await bcrypt.compare(
						credentials!.password,
						user.password
					);

					if (isPasswordCorrect) return user;
					else throw new Error('Incorrect Password');
				} catch (error: any) {
					throw new Error(error);
				}
			},
		}),
	],

	pages: {
		signIn: '/signin',
	},
	session: {
		strategy: 'jwt',
	},
	secret: process.env.NEXTAUTH_URL,

	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.id = user?.id.toString();
				token.isVerified = user.isVerified;
				token.isAcceptingMessage = user.isAcceptingMessage;
				token.username = user.username;
			}

			return token;
		},

		async session({ session, token }) {
			if (token) {
				session.user.id = token.id!;
				session.user.isVerified = token.isVerified;
				session.user.isAcceptingMessage = token.isAcceptingMessage;
				session.user.username = token.username;
			}

			return session;
		},
	},
};

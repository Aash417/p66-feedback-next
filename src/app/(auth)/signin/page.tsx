'use client';

import { signIn } from 'next-auth/react';

export default function Page() {
	return (
		<>
			<button className='' onClick={() => signIn()}>
				sign in
			</button>
		</>
	);
}

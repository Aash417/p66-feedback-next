import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

import { signupSchema, verifySchema } from '@/schemas';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@react-email/components';
import axios, { AxiosError } from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export default function VerifyAccount() {
	const router = useRouter();
	const param = useParams<{ username: string }>();
	const { toast } = useToast();

	const form = useForm<z.infer<typeof verifySchema>>({
		resolver: zodResolver(signupSchema),
	});

	const onSubmit = async (data: z.infer<typeof verifySchema>) => {
		try {
			const response = await axios.post(`/api/verify-code`, {
				username: param.username,
				code: data.code,
			});

			router.replace('signin');
		} catch (error) {
			const axiosError = error as AxiosError<ApiResponse>;
			let errorMsg = axiosError.response?.data.message;
			toast({
				title: 'signup failed',
				description: errorMsg,
				variant: 'destructive',
			});
		}
	};

	return (
		<div className='flex justify-center items-center min-h-screen bg-gray-100'>
			<div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
				<div className='text-center'>
					<h1 className='text-4xl font-extrabold tracking-tight lg:text-5xl mb-6'>
						Verify Your Account
					</h1>
					<p className='mb-4'>Enter the verification code sent to your email</p>
				</div>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
						<FormField
							name='code'
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Verification Code</FormLabel>
									<Input {...field} />
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type='submit'>Verify</Button>
					</form>
				</Form>
			</div>
		</div>
	);
}
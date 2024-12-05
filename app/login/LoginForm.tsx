'use client';

import { useEffect, useState } from 'react';
import Heading from '@/app/components/Heading';
import Input from '@/app/components/inputs/Input';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import Button from '@/app/components/Button';
import Link from 'next/link';
import { AiOutlineGoogle } from 'react-icons/ai';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { SafeUser } from '@/types';

interface LoginFormProps {
	currentUser: SafeUser | null;
}

const LoginForm: React.FC<LoginFormProps> = ({ currentUser }) => {
	const [isLoading, setIsLoading] = useState(false);
	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<FieldValues>({
		defaultValues: { email: '', password: '' }
	});

	const router = useRouter();

	useEffect(() => {
		if (currentUser) {
			router.push('/cart');
			router.refresh();
		}
	}, []);

	const onSubmit: SubmitHandler<FieldValues> = async (data) => {
		setIsLoading(true);
		signIn('credentials', { ...data, redirect: false }).then((response) => {
			setIsLoading(false);
			if (response?.ok) {
				router.push('/cart');
				router.refresh();
				toast.success('Logged in');
			}
			if (response?.error) {
				toast.error(response.error);
			}
		});
	};

	if (currentUser) {
		return <p className='text-center'>Logged in. Redirecting...</p>;
	}
	return (
		<>
			<Heading title='Sign in to E~Shop' />
			<Button
				outline
				label='Continue with Google'
				icon={AiOutlineGoogle}
				onClick={() => {
					signIn('google');
				}}
			/>
			<div className='relative flex items-center w-full'>
				<div className='flex-grow border-t border-slate-300'></div>
				<span className='flex-shrink mx-4 text-slate-500'>OR</span>
				<div className='flex-grow border-t border-slate-300'></div>
			</div>
			<Input
				id='email'
				label='Email'
				disabled={isLoading}
				register={register}
				errors={errors}
				required
			/>
			<Input
				id='password'
				label='Password'
				disabled={isLoading}
				register={register}
				errors={errors}
				required
				type='password'
			/>
			<Button
				label={isLoading ? 'Loading...' : 'Sign in'}
				disabled={isLoading}
				onClick={handleSubmit(onSubmit)}
			/>
			<p className='text-sm'>
				Do not have an account?{' '}
				<Link className='underline' href='/register'>
					Sign up
				</Link>
			</p>
		</>
	);
};
export default LoginForm;

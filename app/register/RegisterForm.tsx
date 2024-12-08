'use client';

import { useState, useEffect } from 'react';
import Heading from '@/app/components/Heading';
import Input from '@/app/components/inputs/Input';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import Button from '@/app/components/Button';
import Link from 'next/link';
import { AiOutlineGoogle } from 'react-icons/ai';
import toast from 'react-hot-toast';
import axios from 'axios';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { SafeUser } from '@/types';

interface RegisterFormProps {
	currentUser: SafeUser | null;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ currentUser }) => {
	const [isLoading, setIsLoading] = useState(false);
	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<FieldValues>({
		defaultValues: { first_name: '', last_name: '', email: '', password: '' }
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
		axios
			.post('/api/register', data)
			.then(() => {
				toast.success('Account created successfully');
				signIn('credentials', {
					email: data.email,
					password: data.password,
					redirect: false
				}).then((callback) => {
					if (callback?.ok) {
						router.push('/cart');
						router.refresh();
						toast.success('Logged in');
					}
					if (callback?.error) {
						toast.error(callback.error);
					}
				});
			})
			.catch(() => {
				toast.error('Something went wrong. Please try again.');
			})
			.finally(() => {
				setIsLoading(false);
			});
	};

	if (currentUser) {
		return <p className='text-center'>Logged in. Redirecting...</p>;
	}

	return (
		<>
			<Heading title='Sign up for E~Shop' />
			<Button
				outline
				label='Sign up with Google'
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
				id='first_name'
				label='First Name'
				disabled={isLoading}
				register={register}
				errors={errors}
				required
			/>
			<Input
				id='last_name'
				label='Last Name'
				disabled={isLoading}
				register={register}
				errors={errors}
				required
			/>
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
				label={isLoading ? 'Loading...' : 'Sign up'}
				disabled={isLoading}
				onClick={handleSubmit(onSubmit)}
			/>
			<p className='text-sm'>
				Already have an account?{' '}
				<Link className='underline' href='/login'>
					Log in
				</Link>
			</p>
		</>
	);
};
export default RegisterForm;

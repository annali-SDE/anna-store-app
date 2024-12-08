'use client';

import { adminNavLinks } from '@/lib/constants';
import {
	SignedIn,
	SignedOut,
	SignInButton,
	UserButton,
	useUser
} from '@clerk/clerk-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CircleUserRound } from 'lucide-react';

const AdminLeftSideBar = () => {
	const pathname = usePathname();
	console.log(pathname);
	const { user } = useUser();
	console.log('user', user?.id);
	return (
		<div className='h-screen left-0 top-0 sticky p-10 flex flex-col gap-16 bg-blue-2'>
			<Image src='/logo.png' alt='logo' width={150} height={70} priority />
			<div className='flex flex-col gap-12'>
				{adminNavLinks.map((link) => (
					<Link
						key={link.label}
						href={link.url}
						className={`flex gap-4 text-body-medium ${
							pathname === link.url ? 'text-blue-1' : 'text-gray-1'
						}`}>
						{link.icon}
						<p>{link.label}</p>
					</Link>
				))}
				<div className='flex gap-4 text-body-medium'>
					<SignedIn>
						<div className='flex gap-4'>
							<UserButton />
							<p>Edit Profile</p>
						</div>
					</SignedIn>
					<SignedOut>
						<div className='flex gap-4'>
							<CircleUserRound />
							<SignInButton />
						</div>
					</SignedOut>
				</div>
			</div>
		</div>
	);
};
export default AdminLeftSideBar;

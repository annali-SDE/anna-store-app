'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import {
	SignedIn,
	SignedOut,
	SignInButton,
	UserButton
} from '@clerk/clerk-react';
import { CircleUserRound } from 'lucide-react';

import { adminNavLinks } from '@/lib/constants';

const AdminNav = () => {
	const [dropdownMenu, setDropdownMenu] = useState(false);
	const pathname = usePathname();
	const divRef = useRef(null);

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				divRef.current &&
				!(divRef.current as HTMLElement).contains(event.target as Node)
			) {
				setDropdownMenu(false);
			}
		}
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);
	return (
		<div className='flex flex-1'>
			<div className='sticky top-0 z-20 w-full flex justify-between items-center px-8 py-4 bg-violet-200'>
				<Image
					src='/logo4.png'
					alt='logo'
					width={65}
					height={65}
					className='max-h-[100px] max-w-[100px]'
				/>
				<div className='flex gap-8 max-md:hidden'>
					{adminNavLinks.map((link) => (
						<Link
							href={link.url}
							key={link.label}
							className={`flex gap-4 text-body-medium ${
								pathname === link.url
									? 'text-blue-1 underline underline-offset-8'
									: 'text-gray-1'
							}`}>
							<p>{link.label}</p>
						</Link>
					))}
				</div>
				<div className='relative flex gap-4 items-center'>
					<Menu
						className='cursor-pointer md:hidden'
						onClick={() => setDropdownMenu(!dropdownMenu)}
					/>
					{dropdownMenu && (
						<div
							ref={divRef}
							className='absolute top-10 right-6 flex flex-col gap-8 p-5 bg-white shadow-xl rounded-lg'>
							{adminNavLinks.map((link) => (
								<Link
									href={link.url}
									key={link.label}
									className={`flex gap-4 text-body-medium ${
										pathname === link.url
											? 'text-blue-1 underline underline-offset-8'
											: 'text-gray-1'
									}`}>
									{link.icon} <p>{link.label}</p>
								</Link>
							))}
						</div>
					)}
					<div className='flex gap-4 text-body-medium'>
						<SignedIn>
							<div className='flex gap-4'>
								<UserButton />
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
		</div>
	);
};
export default AdminNav;

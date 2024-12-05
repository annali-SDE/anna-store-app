'use client';

import Avatar from '@/app/components/Avatar';
import Link from 'next/link';
import { useCallback, useState } from 'react';
import { AiFillCaretDown } from 'react-icons/ai';
import MenuItem from './MenuItem';
import { signOut } from 'next-auth/react';
import BackDrop from './BackDrop';
import { User } from '@prisma/client';
import { SafeUser } from '@/types/index';

interface UserMenuProps {
	currentUser: SafeUser | null;
}

const UserMenu: React.FC<UserMenuProps> = ({ currentUser }) => {
	const [isOpen, setIsOpen] = useState(false);
	const toggleMenu = useCallback(() => {
		setIsOpen((prev) => !prev);
	}, []);
	return (
		<>
			<div className='relative z-30'>
				<div
					onClick={toggleMenu}
					className='p-2 flex items-center gap-1 rounded-full cursor-pointer hover:shaodow-md transition text-slate-700'>
					<Avatar src={currentUser?.image} />
					<AiFillCaretDown />
				</div>
				{isOpen && (
					<div className='absolute rounded-md shadow-md w-[170px] bg-white overflow-hidden right-0 top-12 text-sm flex flex-col cursor-pointer'>
						{currentUser ? (
							<div>
								<Link href='/orders'>
									<MenuItem onClick={toggleMenu}>Your Orders</MenuItem>
								</Link>
								<Link href='/admin'>
									<MenuItem onClick={toggleMenu}>Admin Dashboard</MenuItem>
								</Link>
								<hr />
								<MenuItem
									onClick={() => {
										toggleMenu();
										signOut();
									}}>
									Logout
								</MenuItem>
							</div>
						) : (
							<div>
								<Link href='/login'>
									<MenuItem onClick={toggleMenu}>Login</MenuItem>
								</Link>
								<Link href='/register'>
									<MenuItem onClick={toggleMenu}>Register</MenuItem>
								</Link>
							</div>
						)}
					</div>
				)}
			</div>
			{isOpen ? <BackDrop onClick={toggleMenu} /> : null}
		</>
	);
};
export default UserMenu;

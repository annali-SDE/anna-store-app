'use client';

import { navLinks } from '@/lib/constants';
// import { UserButton } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import UserMenu from '../nav/UserMenu';
import { SafeUser } from '@/types';

const AdminLeftSideBar = ({ currentUser }: SafeUser) => {
	const pathname = usePathname();
	console.log(pathname);
	// const currentUser = await getCurrentUser();
	return (
		<div className='h-screen left-0 top-0 sticky p-10 flex flex-col gap-16 bg-blue-2 shadow-xl max-lg:hidden'>
			<Image src='/logo.png' alt='logo' width={150} height={70} priority />
			<div className='flex flex-col gap-12'>
				{navLinks.map((link) => (
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
			</div>
			<div className='flex gap-4 text-body-medium items-center'>
				{/* <UserButton />
				<p>Edit Profile</p> */}
				<UserMenu currentUser={currentUser} />
			</div>
		</div>
	);
};
export default AdminLeftSideBar;
// const AdminLeftSideBar = () => {
// 	return <div>AdminLeftSideBar</div>;
// };
// export default AdminLeftSideBar;

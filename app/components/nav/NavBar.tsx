'use client';

import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import ClientNav from './ClientNav';
import AdminNav from '../admin/AdminNav';
import { useUser } from '@clerk/clerk-react';

const NavBar = () => {
	const [isAdminNav, setIsAdminNav] = useState(false);
	const pathname = usePathname();

	useEffect(() => {
		if (pathname && pathname.includes('/admin')) {
			setIsAdminNav(true);
		}
	}, [pathname]);

	return (
		<div className='sticky top-0 w-full bg-slate-200 z-30 shadow-sm'>
			{isAdminNav ? <AdminNav /> : <ClientNav />}
		</div>
	);
};
export default NavBar;

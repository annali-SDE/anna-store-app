import type { Metadata } from 'next';
import { auth } from '@clerk/nextjs/server';
import { getUserRole } from '@/actions/users';
import NullData from '@/app/components/NullData';

export const metadata: Metadata = {
	title: 'AnnaShop Admin',
	description: 'Anna-Shop Admin Dashboard'
};

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
	const user = await auth();
	if (!user || !user.userId) {
		return <NullData title='You are not authorized to view this page' />;
	}
	const role = await getUserRole(user.userId);
	if (!role || role !== 'ADMIN') {
		return <NullData title='You are not authorized to view this page' />;
	}
	return (
		<div className='flex max-lg:flex-col text-gray-1'>
			<div className='flex-1'>{children}</div>
		</div>
	);
};
export default AdminLayout;

import type { Metadata } from 'next';
import { getCurrentUser } from '@/actions/getCurrentUser';

export const metadata: Metadata = {
	title: 'AnnaShop Admin',
	description: 'E-Shop Admin Dashboard'
};

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
	const currentUser = await getCurrentUser();
	return (
		<div className='flex max-lg:flex-col text-gray-1'>
			<div className='flex-1'>{children}</div>
		</div>
	);
};
export default AdminLayout;

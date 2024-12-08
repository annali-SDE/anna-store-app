import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'AnnaShop Admin',
	description: 'E-Shop Admin Dashboard'
};

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
	return (
		<div className='flex max-lg:flex-col text-gray-1'>
			<div className='flex-1'>{children}</div>
		</div>
	);
};
export default AdminLayout;

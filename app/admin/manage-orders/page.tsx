export const dynamic = 'force-dynamic';

import ManageOrdersClient from './ManageOrdersClient';
import Container from '@/app/components/Container';
import getOrders from '@/actions/getOrders';
import { getCurrentUser } from '@/actions/getCurrentUser';
import NullData from '@/app/components/NullData';

const ManageOrders = async () => {
	const orders = await getOrders();
	const currentUser = await getCurrentUser();
	if (!currentUser || currentUser.role !== 'ADMIN') {
		return <NullData title='You are not authorized to view this page' />;
	}
	return (
		<div className='pt-8'>
			<Container>
				<ManageOrdersClient orders={orders} />
			</Container>
		</div>
	);
};
export default ManageOrders;

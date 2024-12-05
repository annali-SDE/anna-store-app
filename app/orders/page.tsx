export const dynamic = 'force-dynamic';
import Container from '@/app/components/Container';
import { getCurrentUser } from '@/actions/getCurrentUser';
import NullData from '@/app/components/NullData';
import getOrderByUserId from '@/actions/getOrderByUserId';
import OrdersClient from './OrdersClient';

const Orders = async () => {
	const currentUser = await getCurrentUser();
	if (!currentUser) {
		return <NullData title='You are not authorized, please login or signup' />;
	}
	const orders = await getOrderByUserId({ userId: currentUser.id });
	if (!orders) {
		return <NullData title='Orders are not found' />;
	}
	return (
		<div className='pt-8'>
			<Container>
				<OrdersClient orders={orders} />
			</Container>
		</div>
	);
};
export default Orders;

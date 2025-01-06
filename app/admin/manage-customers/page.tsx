export const dynamic = 'force-dynamic';
import Container from '@/app/components/Container';
import getUsers from '@/actions/getUsers';
import ManageCustomers from './ManageCustomers';

const ManageProducts = async () => {
	const users = await getUsers();

	return (
		<div className='pt-8'>
			<Container>
				<ManageCustomers users={users} />
			</Container>
		</div>
	);
};
export default ManageProducts;

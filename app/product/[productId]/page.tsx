import ProductDetail from './ProductDetail';
import Container from '@/app/components/Container';
import ListRating from './ListRating';
import getProductById from '@/actions/getProductById';
import NullData from '@/app/components/NullData';
import AddRating from './AddRating';
import { getCurrentUser } from '@/actions/getCurrentUser';

interface IPrams {
	productId?: string;
}

const Product = async ({ params }: { params: IPrams }) => {
	const currentUser = await getCurrentUser();
	const product = await getProductById({ productId: params.productId });

	if (!product) {
		return <NullData title='No product found' />;
	}

	return (
		<div className='p-8'>
			<Container>
				<ProductDetail product={product} />
				<div className='flex flex-col mt-20 gap-4'>
					<AddRating product={product} user={currentUser} />
					<ListRating product={product} />
				</div>
			</Container>
		</div>
	);
};
export default Product;

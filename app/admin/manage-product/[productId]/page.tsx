export const dynamic = 'force-dynamic';

import FormWrap from '@/app/components/FormWrap';
import EditProductForm from './EditProductForm';
import getProductById from '@/actions/getProductById';
import NullData from '@/app/components/NullData';
import { Product } from '.prisma/client';

interface IPrams {
	productId?: string;
}

const ManageProduct = async ({ params }: { params: IPrams }) => {
	const product: Product | null = await getProductById({
		productId: params.productId
	});
	if (!product) {
		return <NullData title='No product found' />;
	}

	return (
		<div className='flex flex-col justify-center item-center'>
			<FormWrap>
				<EditProductForm product={product} />
			</FormWrap>
		</div>
	);
};
export default ManageProduct;

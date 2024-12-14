export const dynamic = 'force-dynamic';
import FormWrap from '@/app/components/FormWrap';
import AddProductForm from './AddProductForm';

const AddProduct = async () => {
	return (
		<div>
			<FormWrap>
				<AddProductForm />
			</FormWrap>
		</div>
	);
};
export default AddProduct;

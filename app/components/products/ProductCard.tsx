'use client';

import Image from 'next/image';
import { truncateText } from '../../utils/truncateText';
import { formatPrice } from '../../utils/formatPrice';
import { Rating } from '@mui/material';
import { useRouter } from 'next/navigation';

interface ProductCardProps {
	data: any;
}

const ProductCard: React.FC<ProductCardProps> = ({ data }) => {
	const router = useRouter();
	const productReating =
		data.reviews.reduce((acc: number, review: any) => acc + review.rating, 0) /
		data.reviews.length;
	return (
		<div
			className='col-span-1 cursor-pointer border-[1.2px] border-slate-200 bg-slate-50 rounded-sm p-2 transition hover:scale-105 text-center text-sm'
			onClick={() => router.push(`/product/${data.id}`)}>
			<div className='flex flex-col items-center w-full gap-2'>
				<div className='aspect-square overflow-hidden relative w-full'>
					<Image
						fill
						sizes='100%'
						src={data.images[0].image}
						alt={data.name}
						className='w-full h-full object-contain'
					/>
				</div>
				<div className='mt-4'>{truncateText(data.name)}</div>
				<div>
					<Rating value={productReating} readOnly />
				</div>
				<div>{data.reviews.length} reviews</div>
				<div className='font-semibold'>{formatPrice(data.prices[0].price)}</div>
			</div>
		</div>
	);
};
export default ProductCard;

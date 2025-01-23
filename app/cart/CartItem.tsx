'use client';

import Link from 'next/link';
import { formatPrice } from '../utils/formatPrice';
import { truncateText } from '../utils/truncateText';
import Image from 'next/image';
import { MinusCircle, PlusCircle } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { CartProductType } from '../product/[productId]/ProductDetail';

interface CartItemProps {
	cartProduct: CartProductType;
}

const CartItem: React.FC<CartItemProps> = ({ cartProduct }) => {
	const cart = useCart();

	return (
		<div className='grid grid-cols-5 text-xs md:text-sm gap-4 border-t-[1.5px] border-slate-200 py-4 items-center'>
			<div className='justify-self-start flex gap-2 md:gap-4'>
				<Link href={`/product/${cartProduct.id}`}>
					<div className='relative w-[70px] aspect-square'>
						<Image
							src={cartProduct.selectedImg.image}
							alt={cartProduct.name}
							fill
							sizes='100%'
							className='object-contain'
						/>
					</div>
				</Link>
				<div className='flex flex-col justify-between'>
					<Link href={`/product/${cartProduct.id}`}>
						{truncateText(cartProduct.name)}
					</Link>
					<div>{cartProduct.selectedImg.color}</div>
					<div className='w-[70px]'>
						<button
							className='text-slate-500 underline'
							onClick={() => cart.removeItem(cartProduct)}>
							Remove
						</button>
					</div>
				</div>
			</div>
			<div className='justify-self-center'>
				{formatPrice(cartProduct.price.price)}
			</div>
			<div className='justify-self-center'>{cartProduct.price.unit}</div>
			<div className='justify-self-center'>
				<div className='flex gap-2 items-center'>
					<div className='flex gap-4 items-center'>
						<MinusCircle
							className='hover:text-red-1 cursor-pointer'
							onClick={() => cart.decreaseQuantity(cartProduct)}
						/>
						<p>{cartProduct.quantity}</p>
						<PlusCircle
							className='hover:text-red-1 cursor-pointer'
							onClick={() => cart.increaseQuantity(cartProduct)}
						/>
					</div>
				</div>
			</div>
			<div className='justify-self-end font-semibold'>
				{formatPrice(cartProduct.price.price * cartProduct.quantity)}{' '}
			</div>
		</div>
	);
};
export default CartItem;

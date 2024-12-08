'use client';

import { useCart } from '@/hooks/useCart';
import { useRouter } from 'next/navigation';
import { ShoppingCart } from 'lucide-react';

const CartCount = () => {
	const { cartTotalQty } = useCart();
	const router = useRouter();

	return (
		<div
			className='relative cursor-pointer'
			onClick={() => router.push('/cart')}>
			<div className='text-4xl'>
				<ShoppingCart />
			</div>
			<span className='absolute top-[-10px] right-[-10px] bg-slate-700 text-white h-5 w-5 rounded-full flex items-center justify-center text-sm'>
				{cartTotalQty}
			</span>
		</div>
	);
};
export default CartCount;

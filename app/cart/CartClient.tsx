'use client';

import Link from 'next/link';
import { MdArrowBack } from 'react-icons/md';
import Heading from '../components/Heading';
import { Button } from '@mui/material';
import CartItem from './CartItem';
import { formatPrice } from '../utils/formatPrice';
import { SafeUser } from '@/types';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';

interface CartClientProps {
	currentUser: SafeUser | null;
}

const CartClient: React.FC<CartClientProps> = ({ currentUser }) => {
	const router = useRouter();
	const cart = useCart();

	if (
		!cart.cartItems ||
		cart.cartItems.length === 0 ||
		cart.cartTotalQty === 0
	) {
		return (
			<div className='flex flex-col items-center'>
				<div className='text-2xl'>Your Cart is empty</div>
				<div>
					<Link
						href='/'
						className='text-slate-500 flex items-center gap-1 mt-2'>
						<MdArrowBack />
						<span>Start Shopping</span>
					</Link>
				</div>
			</div>
		);
	}
	return (
		<div>
			<Heading title='Shopping Cart' center />
			<div className='grid grid-cols-5 text-xs gap-4 pb-2 items-center mt-12 '>
				<div className='justify-self-start'>Product</div>
				<div className='justify-self-center'>Price</div>
				<div className='justify-self-center'>Unit</div>
				<div className='justify-self-center'>Quantity</div>
				<div className='justify-self-end font-semibold'>Total</div>
			</div>
			<div>
				{cart.cartItems.map((item, index) => {
					return <CartItem key={index} cartProduct={item} />;
				})}
			</div>
			<div className='border-t-[1.5px] border-slate-200 py-4 flex justify-between gap-4'>
				<div>
					<Button
						variant='contained'
						onClick={() => cart.clearCart()}
						size='small'
						color='error'>
						Clear Cart
					</Button>
				</div>
				<div className='text-sm flex flex-col gap-1 items-start'>
					<div>
						<div className='flex justify-between w-full text-base font-semibold'>
							<span>Subtotal</span>
							<span>{formatPrice(cart.cartTotalAmount)}</span>
						</div>

						<p className='text-slate-500'>
							Taxes and shipping calculate at checkout
						</p>
						<Button
							variant={currentUser ? 'contained' : 'outlined'}
							sx={{ backgroundColor: '#8B5CF6' }}
							onClick={() => {
								currentUser ? router.push('/checkout') : router.push('/login');
							}}>
							{currentUser ? 'Checkout' : 'Login To Checkout'}
						</Button>

						<Link
							href='/'
							className='text-slate-500 flex items-center gap-1 mt-2'>
							<MdArrowBack />
							<span>Continue Shopping</span>
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};
export default CartClient;

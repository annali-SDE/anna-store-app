'use cleint';
import { useCart } from '@/hooks/useCart';
import {
	useElements,
	useStripe,
	PaymentElement,
	AddressElement
} from '@stripe/react-stripe-js';
import { useEffect, useState } from 'react';
import { formatPrice } from '../utils/formatPrice';
import toast from 'react-hot-toast';
import Heading from '../components/Heading';
import Button from '../components/Button';

interface CheckoutFormProps {
	clientSecret: string;
	handleSetPaymentSuccess: (val: boolean) => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({
	clientSecret,
	handleSetPaymentSuccess
}) => {
	const { cartTotalAmount, handleClearCart, handleSetPaymentIntent } =
		useCart();
	const stripe = useStripe();
	const elements = useElements();
	const [isLoading, setIsLoading] = useState(false);
	const formattedPrice = formatPrice(cartTotalAmount);

	useEffect(() => {
		if (!stripe || !clientSecret) return;
		handleSetPaymentSuccess(false);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [stripe]);

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		if (!stripe || !elements) return;
		setIsLoading(true);
		stripe
			.confirmPayment({
				elements,
				redirect: 'if_required'
			})
			.then((result) => {
				if (!result.error) {
					toast.success('Checkout successful');
					handleClearCart();
					handleSetPaymentSuccess(true);
					handleSetPaymentIntent(null);
				}
			});
		setIsLoading(false);
	};

	return (
		<form
			onSubmit={handleSubmit}
			id='payment-form'
			className='flex flex-col gap-4'>
			<div className='mt-6'>
				<Heading title='Enter your details to complete checkout' />
			</div>
			<h2 className='font-semibold mt-4 mb-2'>Address Information</h2>
			<AddressElement
				id='address-element'
				options={{ mode: 'shipping', allowedCountries: ['US'] }}
			/>
			<h2 className='font-semibold mt-4 mb-2'>Payment Information</h2>
			<PaymentElement id='payment-element' options={{ layout: 'tabs' }} />
			<div className='py-4 text-center text-slate-700 text-large font-bold'>
				Total: {formattedPrice}
			</div>
			<Button
				label={isLoading ? 'Processing...' : 'Pay Now'}
        disabled={ isLoading || !stripe || !elements }
        onClick={() => {}}
			/>
		</form>
	);
};
export default CheckoutForm;

'use client';

import { Product, Review, Order } from '@prisma/client';
import { SafeUser } from '@/types';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FieldValues, useForm, SubmitHandler, set } from 'react-hook-form';
import Heading from '@/app/components/Heading';
import { Rating } from '@mui/material';
import Input from '@/app/components/inputs/Input';
import Button from '@/app/components/Button';
import toast from 'react-hot-toast';
import axios from 'axios';

interface AddRatingProps {
	product: Product & {
		reviews: Review[];
	};
	user:
		| (SafeUser & {
				orders: Order[];
		  })
		| null;
}

const AddRating: React.FC<AddRatingProps> = ({ product, user }) => {
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const {
		register,
		handleSubmit,
		setValue,
		reset,
		formState: { errors }
	} = useForm<FieldValues>({
		defaultValues: {
			rating: 0,
			comment: ''
		}
	});
	const setCustomeValue = (id: string, value: any) => {
		setValue(id, value, {
			shouldTouch: true,
			shouldValidate: true,
			shouldDirty: true
		});
	};

	const onSubmit: SubmitHandler<FieldValues> = async (data) => {
		setIsLoading(true);
		if (data.rating === 0) {
			setIsLoading(false);
			return toast.error('No rating selected');
		}
		const reviewData = { ...data, product: product, userId: user?.id };
		axios
			.post('/api/reviews', reviewData)
			.then(() => {
				router.refresh();
				toast.success('Review submitted successfully');
				reset();
			})
			.catch((error) => {
				toast.error('Failed to submit review');
			})
			.finally(() => {
				setIsLoading(false);
			});
	};
	if (!user || !product) {
		return null;
	}
	const deliveredOrder = user?.orders.some(
		(order) =>
			order.products.find((item) => item.id === product.id) &&
			order.deliveryStatus === 'delivered'
	);
	const userReviews = product?.reviews.find((review: Review) => {
		return review.userId === user.id;
	});
	if (userReviews || !deliveredOrder) {
		return null;
	}
	return (
		<div className='flex flex-col gap-2 max-w-[500px]'>
			<Heading title='Rate this product' />
			<Rating
				name='rating'
				onChange={(event, newValue) => {
					setCustomeValue('rating', newValue);
				}}
			/>
			<Input
				id='comment'
				label='Comment'
				disabled={isLoading}
				register={register}
				errors={errors}
				required
			/>
			<Button
				label={isLoading ? 'Loading...' : 'Rate Product'}
				onClick={handleSubmit(onSubmit)}
			/>
		</div>
	);
};
export default AddRating;

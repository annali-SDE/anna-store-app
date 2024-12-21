'use client';

import React, { useEffect, useCallback, useState } from 'react';
import { Rating } from '@mui/material';
import SetColor from '@/app/components/products/SetColor';
import SetQuantity from '@/app/components/products/SetQuantity';
import { Button } from '@mui/material';
import ProductImage from '@/app/components/products/ProductImage';
import { useCart } from '@/hooks/useCart';
import { MdCheckCircle } from 'react-icons/md';
import { useRouter } from 'next/navigation';
import { Product } from '@prisma/client';

interface ProductDetailProps {
	product: any;
}

export type CartProductType = {
	id: string;
	name: string;
	description: string;
	category: string;
	selectedImg: SelectedImgType;
	quantity: number;
	price: PriceType;
};

export type PriceType = {
	price: number;
	quantity: number;
	unit: string;
};

export type SelectedImgType = {
	color: string;
	colorCode: string;
	image: string;
};

const Horizontal = () => {
	return <hr className='w-[30%] my-2' />;
};

const ProductDetail: React.FC<ProductDetailProps> = ({ product }) => {
	const { handleAddProductToCart, cartProducts } = useCart();
	const [isProductInCart, setIsProductInCart] = useState(false);
	const [currentPrice, setCurrentPrice] = useState<number>(
		product.prices[0].price
	);
	const [cartProduct, setCartProduct] = useState<CartProductType>({
		id: product.id,
		name: product.name,
		description: product.description,
		category: product.category,
		selectedImg: { ...product.images[0] },
		quantity: 1,
		price: product.price
	});

	const router = useRouter();

	useEffect(() => {
		setIsProductInCart(false);
		if (cartProducts) {
			const existingIndex = cartProducts.findIndex(
				(item) => item.id === product.id
			);
			if (existingIndex > -1) {
				setIsProductInCart(true);
			}
		}
	}, [cartProducts, product.id]);

	const productReating =
		product.reviews.reduce(
			(acc: number, review: any) => acc + review.rating,
			0
		) / product.reviews.length;

	const handleColorSelect = useCallback((value: SelectedImgType) => {
		setCartProduct((prev) => {
			return { ...prev, selectedImg: value };
		});
	}, []);

	const handleQuantityIncrease = useCallback(() => {
		setCartProduct((prev) => {
			return { ...prev, quantity: prev.quantity + 1 };
		});
	}, []);

	const handleQuantityDecrease = useCallback(() => {
		setCartProduct((prev) => {
			return { ...prev, quantity: prev.quantity - 1 };
		});
	}, []);

	const handlePriceSelect = useCallback((price: number) => {
		setCurrentPrice(price);
	}, []);

	return (
		<div className='grid grid-cols-1 md:grid-cols-2 gap-12'>
			<ProductImage
				cartProduct={cartProduct}
				product={product}
				handleColorSelect={handleColorSelect}
			/>
			<div className='flex flex-col gap-1 text-slate-500 text-sm'>
				<h2 className='text-3xl font-medium text-slate-700'>{product.name}</h2>
				<div className='flex item-center gap-2'>
					<Rating value={productReating} readOnly />
					<div>{product.reviews.length} reviews</div>
				</div>
				<Horizontal />
				<div className='text-justify'>{product.description}</div>
				<Horizontal />
				<div className='font-semibold'>
					<span>Category: </span>
					{product.category}
				</div>
				<Horizontal />
				<div className={product.inStock ? 'text-teal-400' : 'text-rose-400'}>
					{product.inStock ? 'In stock' : 'Out of stock'}
				</div>
				<Horizontal />
				{isProductInCart ? (
					<>
						<p className='mb-2 text-slate-500 flex items-center gap-1'>
							<MdCheckCircle className='text-teal-400' size={20} />
						</p>
						<div className='max-w-[300px]'>
							<Button
								variant='contained'
								sx={{ backgroundColor: '#8B5CF6' }}
								onClick={() => {
									router.push('/cart');
								}}>
								View Cart
							</Button>
						</div>
					</>
				) : (
					<>
						<div>
							<SetColor
								images={product.images}
								cartProduct={cartProduct}
								handleColorSelect={handleColorSelect}
							/>
						</div>
						<Horizontal />
						<div>
							<div className='flex flex-row gap-4'>
								<p className='font-semibold'>Price: </p>
								<div>
									<div className='grid grid-cols-4 gap-2'>
										{cartProduct.prices &&
											cartProduct.prices.map((price, index) => (
												<Button
													key={index}
													variant={
														currentPrice === price.price
															? 'contained'
															: 'outlined'
													}
													sx={{
														padding: '3px'
													}}
													onClick={() =>
														handlePriceSelect(price.price)
													}>{`$ ${price.price} / ${price.unit}`}</Button>
											))}
									</div>
								</div>
							</div>
						</div>
						<Horizontal />
						<div>
							<SetQuantity
								cartProduct={cartProduct}
								handleQuantityIncrease={handleQuantityIncrease}
								handleQuantityDecrease={handleQuantityDecrease}
							/>
						</div>
						<Horizontal />
						<div className='max-w-[300px]'>
							<Button
								variant='contained'
								sx={{ backgroundColor: '#8B5CF6' }}
								onClick={() => handleAddProductToCart(cartProduct)}>
								Add To Cart
							</Button>
						</div>
					</>
				)}
			</div>
		</div>
	);
};
export default ProductDetail;

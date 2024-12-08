'use client';

import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/actions/getCurrentUser';
import { NextResponse } from 'next/server';
import { Review } from '@prisma/client';

export async function POST(request: Request) {
	const currentUser = await getCurrentUser();
	if (!currentUser) {
		return NextResponse.error();
	}

	const body = await request.json();
	const { product, rating, comment, userId } = body;
	const deliveredOrder = currentUser?.orders.some(
		(order) =>
			order.products.find((item) => item.id === product.id) &&
			order.deliveryStatus === 'delivered'
	);

	const userReview = product?.reviews.find((review: Review) => {
		return review.userId === currentUser.id;
	});

	if (userReview || !deliveredOrder) {
		return NextResponse.error();
	}

	const review = await prisma.review.create({
		data: {
			rating,
			comment,
			userId,
			productId: product.id
		}
	});
	return NextResponse.json(review);
}

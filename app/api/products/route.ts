'use client';
import prisma from '@/libs/prisma';
import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/actions/getCurrentUser';

export async function POST(request: Request) {
	const currentUser = await getCurrentUser();

	if (!currentUser || currentUser.role !== 'ADMIN') {
		return NextResponse.error();
	}

	const body = await request.json();
	const { name, description, category, brand, images, price, inStock } = body;

	const product = await prisma.product.create({
		data: {
			name,
			description,
			category,
			brand,
			images,
			price: parseFloat(price),
			inStock
		}
	});
	return NextResponse.json(product);
}

export async function PUT(request: Request) {
	const currentUser = await getCurrentUser();

	if (!currentUser || currentUser.role !== 'ADMIN') {
		return NextResponse.error();
	}

	const body = await request.json();
	const { id, inStock } = body;

	const product = await prisma.product.update({
		where: {
			id: id
		},
		data: {
			inStock
		}
	});
	return NextResponse.json(product);
}

import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/actions/getCurrentUser';

export async function POST(request: Request) {
	const currentUser = await getCurrentUser();
	if (!currentUser || currentUser.role !== 'ADMIN') {
		return NextResponse.error();
	}

	const body = await request.json();

	const {
		name,
		description,
		category,
		images,
		prices,
		inStock,
		size,
		shape,
		length
	} = body;

	const product = await prisma.product.create({
		data: {
			name,
			description,
			category,
			images,
			prices,
			inStock,
			size,
			shape,
			length,
			user: { connect: { id: currentUser.id } }
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
	const {
		id,
		name,
		description,
		category,
		images,
		prices,
		inStock,
		size,
		shape,
		length
	} = body;

	const product = await prisma.product.update({
		where: {
			id: id
		},
		data: {
			name,
			description,
			category,
			images,
			prices,
			inStock,
			size,
			shape,
			length
		}
	});
	return NextResponse.json(product);
}

export async function PATCH(request: Request) {
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

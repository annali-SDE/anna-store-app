import prisma from '@/lib/prisma';
import { Product } from '.prisma/client';

export interface IProductParams {
	productId?: string;
}

export default async function getProductById(params: IProductParams) {
	try {
		const { productId } = params;
		const product: Product | null = await prisma.product.findUnique({
			where: {
				id: productId
			},
			include: {
				reviews: {
					include: {
						user: true
					},
					orderBy: { createdAt: 'desc' }
				}
			}
		});
		if (!product) {
			return null;
		}
		return product;
	} catch (error: any) {
		throw new Error(error);
	}
}

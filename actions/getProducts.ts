import prisma from '@/lib/prisma';

export interface IProductsParams {
	category?: string | null;
	searchTerm?: string | null;
}

export default async function getProducts(params: IProductsParams) {
	try {
		const { category, searchTerm } = params;
		console.log('category', category, 'searchTerm', searchTerm);
		let searchString = searchTerm;
		if (!searchTerm) {
			searchString = '';
		}
		let query: any = {};
		if (category) {
			query.category = category;
		}

		const products = await prisma.product.findMany({
			where: {
				...query,
				OR: [
					{ name: { contains: searchString, mode: 'insensitive' } },
					{ description: { contains: searchString, mode: 'insensitive' } }
				]
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
		return products;
	} catch (error: any) {
		throw new Error(error);
	}
}

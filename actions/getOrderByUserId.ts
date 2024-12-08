import prisma from '@/lib/prisma';

interface IOrderParams {
	userId?: string;
}

export default async function getOrderByUserId(params: IOrderParams) {
	try {
		const { userId } = params;
		const orders = await prisma.order.findMany({
			where: {
				userId: userId
			},
			include: {
				user: true
			},
			orderBy: { createdAt: 'desc' }
		});
		if (!orders) {
			throw new Error('Orders are not found');
		}
		return orders;
	} catch (error: any) {
		throw new Error(error);
	}
}

import prisma from '@/lib/prisma';

interface IOrderParams {
	orderId?: string;
}

export default async function getOrderById(params: IOrderParams) {
	try {
		const { orderId } = params;
		const order = await prisma.order.findUnique({
			where: {
				id: orderId
			}
		});
		if (!order) {
			throw new Error('Order not found');
		}
		return order;
	} catch (error: any) {
		throw new Error(error);
	}
}

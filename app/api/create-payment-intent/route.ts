import Strip from 'stripe';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { CartProductType } from '@/app/product/[productId]/ProductDetail';
import { getCurrentUser } from '@/actions/getCurrentUser';

const strip = new Strip(process.env.STRIPE_SECRET_KEY as string, {
	apiVersion: '2024-10-28.acacia'
});

const calculateOrderAmount = (items: CartProductType[]) => {
	const totalPrice = items.reduce((acc, item) => {
		return acc + item.price * item.quantity;
	}, 0);
	return totalPrice;
};

export async function POST(req: Request) {
	const currentUser = await getCurrentUser();
	if (!currentUser) {
		return NextResponse.error();
	}
	const body = await req.json();
	const { items, payment_intent_id } = body;
	const total = Math.round(calculateOrderAmount(items) * 100);
	const orderData = {
		user: { connect: { id: currentUser.id } },
		amount: total,
		currency: 'usd',
		status: 'pending',
		deliveryStatus: 'pending',
		paymentIntentId: payment_intent_id,
		products: items
	};
	if (payment_intent_id) {
		const current_intent = await strip.paymentIntents.retrieve(
			payment_intent_id
		);
		if (current_intent) {
			const updated_intent = await strip.paymentIntents.update(
				payment_intent_id,
				{ amount: total }
			);
			// update the order status
			const [existingOrder, updateOrder] = await Promise.all([
				prisma.order.findFirst({
					where: { paymentIntentId: payment_intent_id }
				}),
				prisma.order.update({
					where: { paymentIntentId: payment_intent_id },
					data: { amount: total, products: items }
				})
			]);

			if (!existingOrder) {
				return NextResponse.error();
			}
			return NextResponse.json({ paymentIntent: updated_intent });
		}
	} else {
		// Create the PaymentIntent
		const paymentIntent = await strip.paymentIntents.create({
			amount: total,
			currency: 'usd',
			automatic_payment_methods: { enabled: true }
		});
		// Create the order
		orderData.paymentIntentId = paymentIntent.id;
		await prisma.order.create({
			data: orderData
		});
		return NextResponse.json({ paymentIntent });
	}
	return NextResponse.error();
}

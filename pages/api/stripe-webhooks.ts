import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';
import Stripe from 'stripe';
import { buffer } from 'micro';

export const config = {
	api: {
		bodyParser: false
	}
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
	apiVersion: '2024-10-28.acacia'
});
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method !== 'POST') {
		return res.status(405).send('Method Not Allowed');
	}

	const rawBody = await buffer(req);
	const sig = req.headers['stripe-signature']!;

	let stripeEvent;
	try {
		stripeEvent = stripe.webhooks.constructEvent(
			rawBody.toString(),
			sig,
			webhookSecret
		);
		res.status(200).send('OK');
	} catch (err) {
		if (err instanceof Error)
			return res.status(400).send(`Webhook Error: ${err.message}`);
		return res.status(400).send('Signature Webhook Error');
	}
	switch (stripeEvent.type) {
		case 'charge.succeeded':
			const charge: any = stripeEvent.data.object as Stripe.Charge;
			if (typeof charge.payment_intent === 'string') {
				const orderAddress = {
					line1: charge.shipping?.address?.line1,
					city: charge.shipping?.address?.city,
					state: charge.shipping?.address?.state ?? '',
					postalCode: charge.shipping?.address?.postal_code,
					country: charge.shipping?.address?.country
				};
				await prisma?.order.update({
					where: {
						paymentIntentId: charge.payment_intent
					},
					data: { status: 'complete', address: orderAddress }
				});
			}
			break;
		default:
	}
	res.json({ received: true });
}

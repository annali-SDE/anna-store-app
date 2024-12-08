import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';

export async function POST(req: Request) {
	const CLERK_WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

	if (!CLERK_WEBHOOK_SECRET) {
		throw new Error(
			'Error: Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local'
		);
	}

	// Create new Svix instance with secret
	const wh = new Webhook(CLERK_WEBHOOK_SECRET);

	// Get headers
	const headerPayload = await headers();
	const svix_id = headerPayload.get('svix-id');
	const svix_timestamp = headerPayload.get('svix-timestamp');
	const svix_signature = headerPayload.get('svix-signature');

	// If there are no headers, error out
	if (!svix_id || !svix_timestamp || !svix_signature) {
		return new Response('Error: Missing Svix headers', {
			status: 400
		});
	}

	// Get body
	const payload = await req.json();
	const body = JSON.stringify(payload);

	let evt: WebhookEvent;

	// Verify payload with headers
	try {
		evt = wh.verify(body, {
			'svix-id': svix_id,
			'svix-timestamp': svix_timestamp,
			'svix-signature': svix_signature
		}) as WebhookEvent;
	} catch (err) {
		console.error('Error: Could not verify webhook:', err);
		return new Response('Error: Verification error', {
			status: 400
		});
	}

	// Do something with payload
	// For this guide, log payload to console
	const { id } = evt.data;
	const eventType = evt.type;
	// if (eventType === 'user.created') {
	// 	const { email, id, first_name, last_name, image_url } = evt.data.payload;
	// 	console.log(`User created with ID ${id}, name ${name}, and email ${email}`);
	// }
	// console.log(`Received webhook with ID ${id} and event type of ${eventType}`);
	console.log('Webhook payload:', body);

	return new Response('Webhook received', { status: 200 });
}
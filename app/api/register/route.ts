import bcrypt from 'bcrypt';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
	const body = await request.json();
	const { first_name, last_name, email, password } = body;

	const hashedPassword = await bcrypt.hash(password, 10);
	const user = await prisma.user.create({
		data: {
			first_name,
			last_name,
			email,
			hashedPassword
		}
	});
	return NextResponse.json(user);
}

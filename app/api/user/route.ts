import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import bcrypt from 'bcrypt';
import prisma from '@/lib/prisma';

export async function GET() {
	const { userId } = auth();
	console.log(userId);

	if (!userId) {
		return new NextResponse('Unauthorized', { status: 401 });
	}
	return new NextResponse({ userId }, { status: 200 });
}

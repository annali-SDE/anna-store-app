import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import prisma from '@/lib/prisma';

import { auth } from '@clerk/nextjs/server';

export async function getSession() {
	return await getServerSession(authOptions);
}

export async function getCurrentUser2() {
	try {
		const session = await getSession();
		if (!session?.user?.email) {
			return null;
		}
		const currentUser = await prisma.user.findUnique({
			where: { email: session.user.email },
			include: {
				orders: true
			}
		});
		if (!currentUser) {
			return null;
		}
		return {
			...currentUser,
			createdAt: currentUser.createdAt.toISOString(),
			updatedAt: currentUser.updatedAt.toISOString()
		};
	} catch (e: any) {
		return null;
	}
}

export async function getCurrentUser() {
	const user = await auth();
	if (!user || !user.userId) {
		return null;
	}
	try {
		const currentUser = await prisma.user.findUnique({
			where: { clerkUserId: user.userId },
			include: {
				orders: true
			}
		});
		if (!currentUser) {
			return null;
		}
		return {
			...currentUser,
			createdAt: currentUser.createdAt.toISOString(),
			updatedAt: currentUser.updatedAt.toISOString()
		};
	} catch (e: any) {
		return null;
	}
}

import prisma from '@/lib/prisma';
import { User } from '@prisma/client';

export async function createUser(data: User) {
	try {
		const user = await prisma.user.create({
			data
		});
		return user;
	} catch (error: any) {
		throw new Error(error);
	}
}

export async function getUserById({
	id,
	clerkUserId
}: {
	id?: string;
	clerkUserId?: string;
}) {
	try {
		if (!id && !clerkUserId) {
			throw new Error('id or clerkId is required');
		}
		const query = id ? { id } : { clerkUserId };
		const user = await prisma.user.findUnique({ where: query });
		return { user };
	} catch (error: any) {
		throw new Error(error);
	}
}

export async function updateUser(id: string, data: Partial<User>) {
	try {
		const user = await prisma.user.update({ where: { id }, data });
		return { user };
	} catch (error: any) {
		throw new Error(error);
	}
}

export async function deleteUser(id: string) {
	try {
		const user = await prisma.user.delete({ where: { id } });
		return { user };
	} catch (error: any) {
		throw new Error(error);
	}
}

export async function getUserRole(id: string) {
	try {
		const user = await prisma.user.findUnique({
			where: { clerkUserId: id },
			select: { role: true }
		});

		return user?.role;
	} catch (error: any) {
		throw new Error(error);
	}
}

import { User } from '@prisma/client';

export type SafeUser = Omit<User, 'createdAt' | 'updatedAt'> & {
	createdAt: string;
	updatedAt: string;
};

export type selectOption = {
	group: string;
	value: string;
	label: string;
};

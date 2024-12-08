// import bcrypt from 'bcrypt';
// import prisma from '@/lib/prisma';
// import { NextResponse } from 'next/server';

// export async function POST(request: Request) {
// 	const body = await request.json();
// 	const { firstName, lastName, email, password } = body;

// 	const hashedPassword = await bcrypt.hash(password, 10);
// 	const user = await prisma.user.create({
// 		data: {
// 			firstName,
// 			lastName,
// 			email,
// 			hashedPassword
// 		}
// 	});
// 	return NextResponse.json(user);
// }

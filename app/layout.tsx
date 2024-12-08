import './globals.css';
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import NavBar from './components/nav/NavBar';

import CartProvider from '@/providers/CartProvider';
import { Toaster } from 'react-hot-toast';
import { ClerkProvider, ClerkLoaded, ClerkLoading } from '@clerk/nextjs';

import Footer from './components/footer/Footer';

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '700'] });

export const metadata: Metadata = {
	title: 'Fancy Fashion Shop',
	description: 'Ecommerce store for fancy fashion'
};

export default function RootLayout({
	children
}: {
	children: React.ReactNode;
}) {
	return (
		<ClerkProvider>
			<html lang='en' suppressHydrationWarning>
				<body className={`${poppins.className} text-slate-700`}>
					<ClerkLoaded>
						<Toaster
							toastOptions={{
								style: {
									background: 'rgb(51 65 85)',
									color: '#fff'
								}
							}}
						/>
						<CartProvider>
							<div className='flex flex-col min-h-screen'>
								<NavBar />
								<main className='flex-grow'>{children}</main>
								<Footer />
							</div>
						</CartProvider>
					</ClerkLoaded>
				</body>
			</html>
		</ClerkProvider>
	);
}

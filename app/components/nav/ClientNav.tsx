import Link from 'next/link';
import Image from 'next/image';
import Container from '../Container';
import CartCount from './CartCount';
import Categories from './Categories';
import SearchBar from './SearchBar';
import {
	SignedIn,
	SignedOut,
	SignInButton,
	UserButton
} from '@clerk/clerk-react';
import { CircleUserRound } from 'lucide-react';

const ClientNav = () => {
	return (
		<>
			<div className='py-4 border-b-[1px]'>
				<Container>
					<div className='flex items-center justify-between gap-3 md-gap-0'>
						<Link href='/'>
							<Image src='/logo4.png' alt='logo' width={65} height={65} />
						</Link>
						<div className='hidden md:block'>
							<SearchBar />
						</div>
						<div className='flex justify-end items-center gap-8 md:gap-12'>
							<div>
								<CartCount />
							</div>
							<div>
								<SignedIn>
									<div className='flex gap-4'>
										<UserButton />
									</div>
								</SignedIn>
								<SignedOut>
									<div className='flex gap-2'>
										<CircleUserRound />
										<SignInButton />
									</div>
								</SignedOut>
							</div>
						</div>
					</div>
				</Container>
			</div>
			<Categories />
		</>
	);
};
export default ClientNav;

import Link from 'next/link';
import Container from '../Container';
import FooterList from './FooterList';
import { MdFacebook } from 'react-icons/md';
import {
	AiFillTwitterCircle,
	AiFillInstagram,
	AiFillYoutube
} from 'react-icons/ai';

const Footer = () => {
	return (
		<footer className='bg-slate-700 text-slate-200 text-sm mt-16'>
			<Container>
				<div className='flex flex-col md:flex-row justify-between pt-16 pb-8'>
					<FooterList>
						<h3 className='text-base font-bold mb-2'>Shop Categories</h3>
						<Link href='#'>Phones</Link>
						<Link href='#'>Laptops</Link>
						<Link href='#'>Desktops</Link>
						<Link href='#'>Watches</Link>
						<Link href='#'>TVs</Link>
					</FooterList>
					<FooterList>
						<h3 className='text-base font-bold mb-2'>Customer Service</h3>
						<Link href='#'>Contact US</Link>
						<Link href='#'>Shipping Policy</Link>
						<Link href='#'>Return & Exchanges</Link>
						<Link href='#'>FAQs</Link>
					</FooterList>
					<FooterList>
						<h3 className='text-base font-bold mb-2'>About Us</h3>
						<p>
							Lorem ipsum dolor, sit amet consectetur adipisicing elit. Vel
							voluptatem, sint repellat, nostrum iste culpa rem cupiditate
							libero deserunt accusantium, atque beatae consectetur dolore quia
							earum laborum id velit omnis!
						</p>
						<p>&copy; {new Date().getFullYear()} E-Shop, All rights reserved</p>
					</FooterList>
					<FooterList>
						<h3 className='text-base font-bold mb-2'>Follow Us</h3>
						<div className='flex gap-2'>
							<Link href='#'>
								<MdFacebook size={24} />
							</Link>
							<Link href='#'>
								<AiFillTwitterCircle size={24} />
							</Link>
							<Link href='#'>
								<AiFillInstagram size={24} />
							</Link>
							<Link href='#'>
								<AiFillYoutube size={24} />
							</Link>
						</div>
					</FooterList>
				</div>
			</Container>
		</footer>
	);
};
export default Footer;

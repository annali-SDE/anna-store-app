'use client';

import Container from '../Container';
import { categories } from '@/app/utils/categorieLists';
import Category from './Category';
import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

const Categories = () => {
	const params = useSearchParams();
	const categryFromUrl = params?.get('category');

	const pathname = usePathname();
	const isMainPage = pathname === '/';

	if (!isMainPage) return null;

	return (
		<Suspense>
			<div className='bg-white'>
				<Container>
					<div className='pt-4 flex flex-row items-center justify-between overflow-x-auto'>
						{categories.map((item) => (
							<Category
								key={item.label}
								label={item.label}
								icon={item.icon}
								selected={
									categryFromUrl === item.label ||
									(!categryFromUrl && item.label === 'All')
								}
							/>
						))}
					</div>
				</Container>
			</div>
		</Suspense>
	);
};
export default Categories;

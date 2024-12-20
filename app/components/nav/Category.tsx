'use client';

import { useCallback } from 'react';
import { IconType } from 'react-icons';
import { twMerge } from 'tailwind-merge';
import { useRouter, useSearchParams } from 'next/navigation';
import queryString from 'query-string';
import { Suspense } from 'react';

interface CategoryProps {
	label: string;
	icon: IconType;
	selected?: boolean;
}

const Category: React.FC<CategoryProps> = ({
	label,
	icon: Icon,
	selected = false
}) => {
	const router = useRouter();
	const params = useSearchParams();
	const handleClick = useCallback(() => {
		if (label === 'All') {
			router.push('/');
		} else {
			let currentQuery = {};
			if (params) {
				currentQuery = queryString.parse(params.toString());
			}
			const updatedQuery = { ...currentQuery, category: label };
			const url = queryString.stringifyUrl(
				{
					url: '/',
					query: updatedQuery
				},
				{ skipNull: true }
			);
			router.push(url);
		}
	}, [label, params, router]);
	return (
		<Suspense>
			<div
				className={twMerge(
					'flex items-center justify-center text-center gap-2 p-2 border-b-2 hover:text-slate-800 transition cursor-point',
					selected
						? 'border-b-slate-800 text-slate-800'
						: 'border-transparent text-slate-500'
				)}
				onClick={handleClick}>
				<Icon size={20} />
				<div className='font-semibode text-sm'>{label}</div>
			</div>
		</Suspense>
	);
};
export default Category;

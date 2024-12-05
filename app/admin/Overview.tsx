'use client';

import { Order, Product, User } from '@prisma/client';
import { useEffect, useState } from 'react';
import Heading from '@/app/components/Heading';
import { formatPrice } from '../utils/formatPrice';
import { formatNumber } from '../utils/formatNumber';

interface OverviewProps {
	products: Product[];
	orders: Order[];
	users: User[];
}

type OverviewDataType = {
	[key: string]: {
		label: string;
		digit: number;
	};
};

const Overview: React.FC<OverviewProps> = ({ products, orders, users }) => {
	const [overviewData, setOverviewData] = useState<OverviewDataType>({
		sale: {
			label: 'Total Sale',
			digit: 0
		},
		products: {
			label: 'Total Products',
			digit: 0
		},
		orders: {
			label: 'Total Orders',
			digit: 0
		},
		paidOrders: {
			label: 'Total Paid Orders',
			digit: 0
		},
		unpaidOrders: {
			label: 'Total Unpaid Orders',
			digit: 0
		},
		users: {
			label: 'Total Users',
			digit: 0
		}
	});

	useEffect(() => {
		setOverviewData((prev) => {
			let tempData = { ...prev };
			const totalSale = orders.reduce((acc, order) => {
				if (order.status === 'complete') {
					return (acc += order.amount);
				} else {
					return acc;
				}
			}, 0);
			const paidOrders = orders.filter((order) => {
				return order.status === 'complete';
			});
			const unpaidOrders = orders.filter((order) => {
				return order.status === 'pending';
			});
			tempData.sale.digit = totalSale;
			tempData.orders.digit = orders.length;
			tempData.paidOrders.digit = paidOrders.length;
			tempData.unpaidOrders.digit = unpaidOrders.length;
			tempData.products.digit = products.length;
			tempData.users.digit = users.length;
			return tempData;
		});
	}, [products, orders, users]);

	const overviewKeys = Object.keys(overviewData);
	return (
		<div className='max-w-[1150px] m-auto'>
			<div className='mb-4 mt-8'>
				<Heading title='Status' center />
			</div>
			<div className='grid grid-cols-2 gap-3 max-h-50vh overflow-y-auto'>
				{overviewKeys &&
					overviewKeys.map((key) => {
						return (
							<div
								key={key}
								className='border-2 p-4 flex flex-col items-center gap-2 transition rounded-xl'>
								<div className='text-xl md:text-4xl font-bold'>
									{overviewData[key].label === 'Total Sale' ? (
										<>{formatPrice(overviewData[key].digit)}</>
									) : (
										<>{formatNumber(overviewData[key].digit)}</>
									)}
								</div>
								<div>{overviewData[key].label}</div>
							</div>
						);
					})}
				{/* {Object.keys(overviewData).map((key) => {
					return (
						<div key={key} className='bg-white p-4 shadow-md rounded-md'>
							<div className='text-lg font-semibold'>
								{overviewData[key].label}
							</div>
							<div className='text-4xl mt-2'>{overviewData[key].digit}</div>
						</div>
					);
				})} */}
			</div>
		</div>
	);
};
export default Overview;

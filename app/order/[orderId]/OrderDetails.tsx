'use client';

import Heading from '@/app/components/Heading';
import { formatPrice } from '@/app/utils/formatPrice';
import { Order } from '@prisma/client';
import Status from '@/app/components/Status';
import { MdAccessTimeFilled, MdDone, MdDeliveryDining } from 'react-icons/md';
import moment from 'moment';
import OrderItem from './OrderItem';

interface OrderDetailProps {
	order: Order;
}

const OrderDetails: React.FC<OrderDetailProps> = ({ order }) => {
	return (
		<div className='max-w-[1150px] m-auto flex flex-col gap-2'>
			<div>
				<Heading title='Order Details' center />
			</div>
			<div>Order ID: {order.id}</div>
			<div>
				Total Amount:{' '}
				<span className='font-bold'>{formatPrice(order.amount)}</span>
			</div>
			<div className='flex gap-2 items-center'>
				<div>Payment status:</div>
				<div>
					{order.status === 'pending' ? (
						<Status className='bg-slate-200 text-slate-700 w-full'>
							pending
							<MdAccessTimeFilled size={15} />
						</Status>
					) : order.status === 'complete' ? (
						<Status className='bg-green-200 text-green-700 w-full'>
							delivered
							<MdDone size={15} />
						</Status>
					) : (
						<></>
					)}
				</div>
			</div>
			<div className='flex gap-2 items-center'>
				<div>Delivery status:</div>
				<div>
					{order.deliveryStatus === 'pending' ? (
						<Status className='bg-slate-200 text-slate-700 w-full'>
							pending
							<MdAccessTimeFilled size={15} />
						</Status>
					) : order.deliveryStatus === 'dispatched' ? (
						<Status className='bg-purple-200 text-purple-700 w-full'>
							dispatched
							<MdDeliveryDining size={15} />
						</Status>
					) : order.deliveryStatus === 'delivered' ? (
						<Status className='bg-green-200 text-green-700 w-full'>
							delivered
							<MdDone size={15} />
						</Status>
					) : (
						<></>
					)}
				</div>
			</div>
			<div>Date: {moment(order.createdAt).fromNow()}</div>
			<div>
				<h2 className='font-semibold mt-4 mb-2'>Products Ordered</h2>
				<div className='grid grid-cols-5 text-xs gap-4 pb-2 items-center'>
					<div className='col-span-2 justify-self-start'>Product</div>
					<div className='justify-self-center'>Price</div>
					<div className='justify-self-center'>QTY</div>
					<div className='justify-self-end'>Total</div>
				</div>
				{order.products &&
					order.products.map((item) => {
						return (
							<>
								<OrderItem key={item.id} item={item} />
							</>
						);
					})}
			</div>
		</div>
	);
};
export default OrderDetails;

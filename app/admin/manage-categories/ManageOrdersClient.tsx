'use client';

import { Order, User } from '@prisma/client';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { formatPrice } from '@/app/utils/formatPrice';
import Heading from '@/app/components/Heading';
import Status from '@/app/components/Status';
import {
	MdAccessTimeFilled,
	MdDeliveryDining,
	MdDone,
	MdRemoveRedEye
} from 'react-icons/md';
import ActionBtn from '@/app/components/ActionBtn';
import { useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import moment from 'moment';

type ManageOrdersClientProps = {
	orders: ExtendedOrder[];
};

type ExtendedOrder = Order & {
	user: User;
};

const ManageOrdersClient = (props: ManageOrdersClientProps) => {
	const { orders } = props;
	const router = useRouter();

	let rows: any = [];
	if (orders) {
		rows = orders.map((order) => {
			return {
				id: order.id,
				userId: order.userId,
				amount: formatPrice(order.amount / 100),
				currency: order.currency,
				paymentStatus: order.status,
				deliveryStatus: order.deliveryStatus,
				paymentIntentId: order.paymentIntentId,
				date: moment(order.createdAt).fromNow()
			};
		});
	}

	const columns: GridColDef[] = [
		{
			field: 'id',
			headerName: 'ID',
			width: 220
		},
		{
			field: 'customer',
			headerName: 'Customer Name',
			width: 130
		},
		{
			field: 'amoumt',
			headerName: 'Amount(USD)',
			width: 130,
			renderCell: (params) => (
				<div className='font-bold text-slate-800'>{params.row.amount}</div>
			)
		},
		{
			field: 'paymentStatus',
			headerName: 'Payment Status',
			width: 130,
			renderCell: (params) => (
				<div className='h-full flex items-center justify-center'>
					{params.row.paymentStatus === 'pending' ? (
						<Status className='bg-slate-200 text-slate-700 w-full'>
							pending
							<MdAccessTimeFilled size={15} />
						</Status>
					) : params.row.paymentStatus === 'complete' ? (
						<Status className='bg-green-200 text-green-700 w-full'>
							delivered
							<MdDone size={15} />
						</Status>
					) : (
						<></>
					)}
				</div>
			)
		},
		{
			field: 'deliveryStatus',
			headerName: 'Delivery Status',
			width: 130,
			renderCell: (params) => (
				<div className='h-full flex items-center justify-center'>
					{params.row.deliveryStatus === 'pending' ? (
						<Status className='bg-slate-200 text-slate-700 w-full'>
							pending
							<MdAccessTimeFilled size={15} />
						</Status>
					) : params.row.deliveryStatus === 'dispatched' ? (
						<Status className='bg-purple-200 text-purple-700 w-full'>
							dispatched
							<MdDeliveryDining size={15} />
						</Status>
					) : params.row.deliveryStatus === 'delivered' ? (
						<Status className='bg-green-200 text-green-700 w-full'>
							delivered
							<MdDone size={15} />
						</Status>
					) : (
						<></>
					)}
				</div>
			)
		},
		{
			field: 'date',
			headerName: 'Date',
			width: 130
		},
		{
			field: 'actions',
			headerName: 'Actions',
			width: 220,
			renderCell: (params) => {
				return (
					<div className='flex h-full gap-x-2 items-center justify-center'>
						<ActionBtn
							icon={MdDeliveryDining}
							onClick={() => {
								handleDispatch(params.row.id);
							}}
							label='Refresh'
						/>
						<ActionBtn
							icon={MdDone}
							onClick={() => {
								handleDeliver(params.row.id);
							}}
							label='Delete'
						/>
						<ActionBtn
							icon={MdRemoveRedEye}
							onClick={() => {
								router.push(`/order/${params.row.id}`);
							}}
							label='Preview'
						/>
					</div>
				);
			}
		}
	];

	const handleDispatch = useCallback((id: string) => {
		axios
			.put('/api/orders', { id, deliveryStatus: 'dispatched' })
			.then((res) => {
				toast.success('Order dispatched');
				router.refresh();
			})
			.catch((err) => {
				toast.error('Failed to update order dispatch status');
				console.error(err);
			});
	}, []);

	const handleDeliver = useCallback(async (id: string) => {
		axios
			.put(`/api/orders`, { id, deliveryStatus: 'delivered' })
			.then((res) => {
				toast.success('Order delivered');
				router.refresh();
			})
			.catch((err) => {
				toast.error('Failed to update order delivery status');
				console.error(err);
			});
	}, []);

	return (
		<div className='max-w-[1150px] m-auto text-xl'>
			<div className='mb-4 mt-8'>
				<Heading title='Manage Orders' center />
			</div>
			<div style={{ height: 600, width: '100%' }}>
				<DataGrid
					rows={rows}
					columns={columns}
					initialState={{
						pagination: { paginationModel: { page: 0, pageSize: 9 } }
					}}
					pageSizeOptions={[9, 20]}
					checkboxSelection
					disableRowSelectionOnClick
				/>
			</div>
		</div>
	);
};
export default ManageOrdersClient;

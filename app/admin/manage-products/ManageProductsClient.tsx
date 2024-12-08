'use client';

import { Product } from '@prisma/client';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { formatPrice } from '@/app/utils/formatPrice';
import Heading from '@/app/components/Heading';
import Status from '@/app/components/Status';
import {
	MdCached,
	MdClose,
	MdDelete,
	MdDone,
	MdRemoveRedEye
} from 'react-icons/md';
import ActionBtn from '@/app/components/ActionBtn';
import { useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { ref, getStorage, deleteObject } from 'firebase/storage';
import firebaseApp from '@/lib/firebase';

interface ManageProductsClientProps {
	products: Product[];
}

const ManageProductsClient: React.FC<ManageProductsClientProps> = ({
	products
}) => {
	const router = useRouter();
	const storage = getStorage(firebaseApp);
	let rows: any = [];
	if (products) {
		rows = products.map((product) => {
			return {
				id: product.id,
				name: product.name,
				price: formatPrice(product.price),
				category: product.category,
				brand: product.brand,
				inStock: product.inStock,
				images: product.images
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
			field: 'name',
			headerName: 'Name',
			width: 220
		},
		{
			field: 'price',
			headerName: 'Price(USD)',
			width: 100,
			renderCell: (params) => (
				<div className='font-bold text-slate-800'>{params.row.price}</div>
			)
		},
		{
			field: 'category',
			headerName: 'Category',
			width: 100
		},
		{
			field: 'brand',
			headerName: 'Brand',
			width: 100
		},
		{
			field: 'inStock',
			headerName: 'In Stock',
			width: 120,
			renderCell: (params) => {
				return (
					<div className='h-full flex items-center justify-center'>
						{params.row.inStock === true ? (
							<Status className='bg-teal-200 text-teal-700 w-full'>
								in stock
								<MdDone size={15} />
							</Status>
						) : (
							<Status className='bg-rose-200 text-rose-700 w-full'>
								in stock
								<MdClose size={15} />
							</Status>
						)}
					</div>
				);
			}
		},
		{
			field: 'actions',
			headerName: 'Actions',
			width: 220,
			renderCell: (params) => {
				return (
					<div className='flex h-full gap-x-2 items-center justify-center'>
						<ActionBtn
							icon={MdCached}
							onClick={() => {
								handleToggleInStock(params.row.id, params.row.inStock);
							}}
							label='Refresh'
						/>
						<ActionBtn
							icon={MdDelete}
							onClick={() => {
								handleDeleteProduct(params.row.id, params.row.images);
							}}
							label='Delete'
						/>
						<ActionBtn
							icon={MdRemoveRedEye}
							onClick={() => {
								router.push(`products/${params.row.id}`);
							}}
							label='Preview'
						/>
					</div>
				);
			}
		}
	];

	const handleToggleInStock = useCallback((id: string, inStock: boolean) => {
		axios
			.put('/api/products', { id, inStock: !inStock })
			.then((res) => {
				toast.success('Product status updated successfully');
				router.refresh();
			})
			.catch((err) => {
				toast.error('Failed to update product status');
				console.error(err);
			});
	}, []);

	const handleDeleteProduct = useCallback(async (id: string, images: any[]) => {
		toast('Deleting product, please wait...');
		const handleImageDelete = async () => {
			try {
				for (const item of images) {
					if (item.image) {
						const imageRef = ref(storage, item.image);
						await deleteObject(imageRef);
						console.log('Image deleted');
					}
				}
			} catch (err) {
				console.error(err);
				toast.error('Failed to delete product images');
			}
		};
		await handleImageDelete();
		axios
			.delete(`/api/products/${id}`)
			.then((res) => {
				toast.success('Product deleted successfully');
				router.refresh();
			})
			.catch((err) => {
				toast.error('Failed to delete product');
				console.error(err);
			});
	}, []);
	return (
		<div className='max-w-[1150px] m-auto text-xl'>
			<div className='mb-4 mt-8'>
				<Heading title='Manage Products' center />
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
export default ManageProductsClient;

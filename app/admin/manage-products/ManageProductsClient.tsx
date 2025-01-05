'use client';

import { useCallback, useState, Fragment } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { ref, getStorage, deleteObject } from 'firebase/storage';
import firebaseApp from '@/lib/firebase';
import { Plus } from 'lucide-react';
import Button from '@mui/material/Button';
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Collapse,
	Box,
	Typography,
	IconButton,
	TablePagination,
	List,
	ListItem,
	ListItemText
} from '@mui/material';
import {
	MdCached,
	MdClose,
	MdDelete,
	MdDone,
	MdRemoveRedEye
} from 'react-icons/md';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';

import { Product } from '@prisma/client';
import ActionBtn from '@/app/components/ActionBtn';
import { formatPrice } from '@/app/utils/formatPrice';
import Heading from '@/app/components/Heading';
import Status from '@/app/components/Status';
import { PriceType } from '@/app/product/[productId]/ProductDetail';

interface ManageProductsClientProps {
	products: Product[];
}

const ManageProductsClient: React.FC<ManageProductsClientProps> = ({
	products
}) => {
	const [expandedRowId, setExpandedRowId] = useState<number | null>(null);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(5);

	const router = useRouter();
	const storage = getStorage(firebaseApp);

	let rows: any = [];
	if (products) {
		rows = products.map((product) => {
			let formattedPrice = `${formatPrice(product.prices[0].price)} / ${
				product.prices[0].unit
			}`;
			return {
				id: product.id,
				name: product.name,
				formattedPrice: formattedPrice,
				prices: product.prices,
				category: product.category,
				inStock: product.inStock,
				images: product.images
			};
		});
	}

	const handleRowClick = (rowId: number) => {
		setExpandedRowId(expandedRowId === rowId ? null : rowId);
	};

	const handleChangePage = (event: unknown, newPage: number) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const handleToggleInStock = useCallback((id: string, inStock: boolean) => {
		axios
			.patch('/api/products', { id, inStock: !inStock })
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
		<div className='max-w-[1280px] m-auto text-xl'>
			<div className='mb-4 mt-2 flex justify-between'>
				<Heading title='Manage Products' center />
				<Button
					type='button'
					variant='contained'
					sx={{ backgroundColor: '#8B5CF6' }}
					onClick={() => router.push('/admin/add-product')}>
					<Plus className='h-4 w-4 mr-2' />
					Create Product
				</Button>
			</div>
			<TableContainer component={Paper}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>ID</TableCell>
							<TableCell>Name</TableCell>
							<TableCell>Price</TableCell>
							<TableCell>Category</TableCell>
							<TableCell>In Stock</TableCell>
							<TableCell>Actions</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{rows
							.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
							.map((row: any) => (
								<Fragment key={row.id}>
									<TableRow>
										<TableCell>{row.id}</TableCell>
										<TableCell>{row.name}</TableCell>
										<TableCell>
											{row.formattedPrice}
											{row.prices && row.prices.length > 1 && (
												<IconButton
													aria-label='expand row'
													size='small'
													onClick={() => handleRowClick(row.id)}>
													{expandedRowId === row.id ? (
														<IoIosArrowUp />
													) : (
														<IoIosArrowDown />
													)}
												</IconButton>
											)}
										</TableCell>
										<TableCell>{row.category}</TableCell>
										<TableCell>
											{row.inStock === true ? (
												<Status className='bg-teal-200 text-teal-700 w-[90px]'>
													in stock
													<MdDone size={15} />
												</Status>
											) : (
												<Status className='bg-rose-200 text-rose-700 w-[90px]'>
													in stock
													<MdClose size={15} />
												</Status>
											)}
										</TableCell>
										<TableCell>
											<div className='flex h-full gap-x-2 items-center justify-start'>
												<ActionBtn
													icon={MdCached}
													onClick={() => {
														handleToggleInStock(row.id, row.inStock);
													}}
													label='Toggle In Stock'
												/>
												<ActionBtn
													icon={MdDelete}
													onClick={() => {
														handleDeleteProduct(row.id, row.images);
													}}
													label='Delete'
												/>
												<ActionBtn
													icon={MdRemoveRedEye}
													onClick={() => {
														router.push(`manage-product/${row.id}`);
													}}
													label='Preview'
												/>
											</div>
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell
											style={{ paddingBottom: 0, paddingTop: 0 }}
											colSpan={6}>
											<Collapse
												in={expandedRowId === row.id}
												timeout='auto'
												unmountOnExit>
												<Box margin={1}>
													<Typography
														variant='h6'
														gutterBottom
														component='div'
														className='underline underline-offset-8'>
														Price Options for this Product
														<List>
															{row.prices &&
																row.prices.map(
																	(item: PriceType, index: number) => (
																		<Fragment key={index}>
																			<ListItem>
																				<ListItemText
																					primary={`${formatPrice(
																						item.price
																					)} / ${item.unit}`}
																				/>
																			</ListItem>
																		</Fragment>
																	)
																)}
														</List>
														<Button
															variant='contained'
															color='error'
															size='small'
															onClick={() => handleRowClick(row.id)}>
															Close
														</Button>
													</Typography>
													<Typography>{row.description}</Typography>
												</Box>
											</Collapse>
										</TableCell>
									</TableRow>
								</Fragment>
							))}
					</TableBody>
				</Table>
				<TablePagination
					rowsPerPageOptions={[5, 10, 25]}
					component='div'
					count={rows.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onPageChange={handleChangePage}
					onRowsPerPageChange={handleChangeRowsPerPage}
				/>
			</TableContainer>
		</div>
	);
};

export default ManageProductsClient;

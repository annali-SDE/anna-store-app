'use client';

import {
	useEffect,
	useState,
	useCallback,
	use,
	ReactEventHandler
} from 'react';
import { useForm, FieldValues, SubmitHandler, set } from 'react-hook-form';
import toast from 'react-hot-toast';
import {
	getStorage,
	ref,
	uploadBytesResumable,
	getDownloadURL
} from 'firebase/storage';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { purple } from '@mui/material/colors';
import MuiTextField from '@mui/material/TextField';

import Heading from '@/app/components/Heading';
import Input from '@/app/components/inputs/Input';
import TextArea from '@/app/components/inputs/TextArea';
import CustomCheckBox from '@/app/components/inputs/CustomCheckBox';
import { categories } from '@/app/utils/categorieLists';
import CategoryInput from '@/app/components/inputs/CategoryInput';
import { Colors } from '@/app/utils/colors';
import SelectColor from '@/app/components/inputs/SelectColor';

import firebaseApp from '@/lib/firebase';
import CustomSelect from '@/app/components/inputs/CustomSelect';
import Button from '@mui/material/Button';
import {
	sizeList,
	shapeList,
	lengthList,
	unitList
} from '@/app/utils/selectOptions';
import { selectOption } from '@/types';

export type ImageType = {
	color: string;
	colorCode: string;
	image: File | null;
};

export type PriceType = {
	price: number;
	quantity: number;
	unit: string;
};

export type UploadedImageType = {
	color: string;
	colorCode: string;
	image: string;
};

const AddProductForm = () => {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [images, setImages] = useState<ImageType[] | null>();
	const [isProductCreated, setIsProductCreated] = useState(false);
	const [sizeOptions, setSizeOptions] = useState<selectOption[]>([]);
	const [shapeOptions, setShapeOptions] = useState<selectOption[]>([]);
	const [lengthOptions, setLengthOptions] = useState<selectOption[]>([]);

	const [addingPrice, setAddingPrice] = useState<boolean>(true);
	const [price, setPrice] = useState<number | null>(null);
	const [quantity, setQuantity] = useState<number | null>(null);
	const [unit, setUnit] = useState<string | null>(null);
	const [prices, setPrices] = useState<PriceType[]>([]);
	const [rows, setRows] = useState<PriceType[] | null>(null);
	const [priceError, setPriceError] = useState<boolean>(false);
	const [editPrice, setEditPrice] = useState<boolean>(false);
	const [editPriceIndex, setEditPriceIndex] = useState<number | null>(null);

	type TextFieldProps = {
		borderColor?: string;
	};

	const options = {
		shouldForwardProp: (prop: string) => prop !== 'borderColor'
	};
	const outlinedSelectors = [
		'& .MuiOutlinedInput-notchedOutline',
		'&:hover .MuiOutlinedInput-notchedOutline',
		'& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline'
	];
	const TextField = styled(
		MuiTextField,
		options
	)<TextFieldProps>(({ borderColor }) => ({
		'& label.Mui-focused': {
			color: borderColor
		},
		[outlinedSelectors.join(',')]: {
			borderWidth: 1,
			borderColor
		}
	}));

	const StyledTableCell = styled(TableCell)(({ theme }) => ({
		[`&.${tableCellClasses.head}`]: {
			backgroundColor: purple[50]
		},
		[`&.${tableCellClasses.body}`]: {
			fontSize: 14
		}
	}));
	const StyledTableRow = styled(TableRow)(({ theme }) => ({
		'&:nth-of-type(odd)': {
			backgroundColor: theme.palette.action.hover
		},
		// hide last border
		'&:last-child td, &:last-child th': {
			border: 0
		}
	}));

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		reset,
		formState: { errors }
	} = useForm<FieldValues>({
		defaultValues: {
			name: '',
			description: '',
			category: '',
			inStock: false,
			images: [],
			prices: [],
			size: 'One Size',
			shape: '',
			length: ''
		}
	});

	useEffect(() => {
		setCustomValue('images', images);
	}, [images]);

	useEffect(() => {
		if (isProductCreated) {
			reset();
			setImages(null);
			setIsProductCreated(false);
		}
	}, [isProductCreated]);

	const setCustomeValue = (id: string, value: any) => {
		setValue(id, value);
	};

	const onSubmit: SubmitHandler<FieldValues> = async (data) => {
		if (!prices || prices.length === 0) {
			setPriceError(true);
			return;
		}

		data.prices = prices;
		setIsLoading(true);

		let uploadedImages: UploadedImageType[] = [];
		if (!data.category) {
			setIsLoading(false);
			return toast.error('Please select a category');
		}
		if (!data.images || data.images.length === 0) {
			setIsLoading(false);
			return toast.error(
				'Please select at least one color and upload an image'
			);
		}

		const handleImageUploads = async () => {
			toast('Uploading image..., please wait...');
			try {
				for (const item of data.images) {
					if (item.image) {
						// YTo avoid duplicate file names, we can use the current time in milliseconds as part of  the file
						const fileName = new Date().getTime() + '-' + item.image.name;
						const storage = getStorage(firebaseApp);
						const storageRef = ref(storage, `products/${fileName}`);
						const uploadTask = uploadBytesResumable(storageRef, item.image);
						await new Promise<void>((resolve, reject) => {
							uploadTask.on(
								'state_changed',
								(snapshot) => {
									const progress =
										(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
									console.log('Upload is ' + progress + '% done');
									switch (snapshot.state) {
										case 'paused':
											console.log('Upload is paused');
											break;
										case 'running':
											console.log('Upload is running');
											break;
									}
								},
								(error) => {
									console.log('Error uploading image', error);
									reject(error);
								},
								() => {
									// Upload completed successfully, now we can get the download URL
									getDownloadURL(uploadTask.snapshot.ref)
										.then((downloadURL) => {
											uploadedImages.push({
												...item,
												image: downloadURL
											});
											console.log('File available at', downloadURL);
											resolve();
										})
										.catch((error) => {
											console.log('Error getting the download URL', error);
											reject(error);
										});
								}
							);
						});
					}
				}
			} catch (error) {
				setIsLoading(false);
				console.log('Error uploading image, please try again', error);
				return toast.error('Error uploading image, please try again');
			}
		};

		await handleImageUploads();
		const productData = { ...data, images: uploadedImages };
		axios
			.post('/api/products', productData)
			.then(() => {
				toast.success('Product added successfully');
				setIsProductCreated(true);
				router.refresh();
			})
			.catch((error) => {
				toast.error('Error adding product to db', error);
			})
			.finally(() => {
				setIsLoading(false);
			});
	};

	const category = watch('category');

	useEffect(() => {
		if (category === 'Press on Nails') {
			const sizeOptions = sizeList.filter((item) => item.group === 'Nail Size');
			setSizeOptions(sizeOptions);
			const shapeOptions = shapeList.filter(
				(item) => item.group === 'Nail Shape'
			);
			setShapeOptions(shapeOptions);
			const lengthOptions = lengthList.filter(
				(item) => item.group === 'Nail Length'
			);
			setLengthOptions(lengthOptions);
		} else if (category === 'DIY' || category === 'DIY Accesories') {
			const sizeOptions = sizeList.filter((item) => item.group === 'Diameter');
			setSizeOptions(sizeOptions);
			const shapeOptions = shapeList.filter((item) => item.group === 'Others');
			setShapeOptions(shapeOptions);
			const lengthOptions = lengthList.filter(
				(item) => item.group === 'Length'
			);
			setLengthOptions(lengthOptions);
		}
	}, [category]);

	const setCustomValue = (id: string, value: string) => {
		setValue(id, value, {
			shouldValidate: true,
			shouldDirty: true,
			shouldTouch: true
		});
	};

	const addImageToState = useCallback((value: ImageType) => {
		setImages((prev) => {
			if (!prev) return [value];
			return [...prev, value];
		});
	}, []);
	const removeImageFromState = useCallback((value: ImageType) => {
		setImages((prev) => {
			if (prev) {
				const filteredImages = prev.filter(
					(item) => item.color !== value.color
				);
				return filteredImages;
			}
			return prev;
		});
	}, []);

	const cleanPriceState = () => {
		setPrice(null);
		setQuantity(null);
		setUnit('');
	};

	const createData = (price: number, quantity: number, unit: string) => {
		return { price, quantity, unit };
	};

	const handleAddPrice = () => {
		if (!price || !quantity || !unit) {
			setPriceError(true);
			return;
		}
		let priceList;
		if (editPrice && editPriceIndex !== null) {
			const updatedPrice = {
				price: price,
				quantity: quantity,
				unit: unit
			} as PriceType;
			priceList = prices.map((item, index) => {
				if (index === editPriceIndex) {
					return updatedPrice;
				}
				return item;
			});
		} else {
			const newPrice = {
				price: price,
				quantity: quantity,
				unit: unit
			} as PriceType;
			priceList = [...prices, newPrice];
		}
		setPrices(priceList);
		const rows = priceList.map((item) => {
			return createData(item.price, item.quantity, item.unit);
		});
		setRows(rows);
		setEditPrice(false);
		setEditPriceIndex(null);
		setAddingPrice(false);
		cleanPriceState();
	};

	const handleEditPrice = (row: PriceType, index: number) => {
		setEditPriceIndex(index);
		setPrice(row.price);
		setQuantity(row.quantity);
		setUnit(row.unit);
		setEditPrice(true);
	};
	const handleDeletePrice = (index: number) => {
		const priceList = prices.filter((item, i) => i !== index);
		setPrices(priceList);
		const rows = priceList.map((item) => {
			return createData(item.price, item.quantity, item.unit);
		});
		setRows(rows);
	};

	useEffect(() => {
		if (!rows || rows.length === 0) {
			setAddingPrice(true);
		}
	}, [rows]);

	const handleCancelPriceForm = () => {
		cleanPriceState();
		setEditPrice(false);
		setEditPriceIndex(null);
		setAddingPrice(false);
	};

	return (
		<>
			<Heading title='Add a Product' center />
			<Input
				id='name'
				label='Name'
				disabled={isLoading}
				register={register}
				errors={errors}
				required
			/>
			<TextArea
				id='description'
				label='Description'
				disabled={isLoading}
				register={register}
				errors={errors}
			/>
			<CustomCheckBox
				id='inStock'
				label='In Stock'
				disabled={isLoading}
				register={register}
				checked={true}
			/>
			<div className='w-full font-medium'>
				<div className='mb-2 font-semibold'>Select a Category</div>
				<div className='grid grid-cols-2 md:grid-cols-4 gap-3 max-h[50vh] overflow-y-auto'>
					{categories.map((item) => {
						if (item.label === 'All') {
							return null;
						}
						return (
							<div key={item.label} className='col-span'>
								<CategoryInput
									label={item.label}
									icon={item.icon}
									selected={category === item.label}
									onClick={(category: string) =>
										setCustomValue('category', category)
									}
								/>
							</div>
						);
					})}
				</div>
			</div>
			<div className='w-full font-medium'>
				<div className='flex flex-col items-start justify-center gap-2 mb-5'>
					<div className='flex flex-row gap-4'>
						<div className='font-semibold'>Price</div>
						{!addingPrice && !editPrice && (
							<Button
								variant='contained'
								sx={{ backgroundColor: '#8B5CF6' }}
								size='small'
								onClick={() => setAddingPrice(true)}>
								Add Price
							</Button>
						)}
					</div>
					{rows && rows.length > 0 && (
						<div className='w-full'>
							<TableContainer component={Paper}>
								<Table sx={{ minWidth: 700 }} aria-label='customized table'>
									<TableHead>
										<TableRow>
											<StyledTableCell align='center'>Price</StyledTableCell>
											<StyledTableCell align='center'>Quantity</StyledTableCell>
											<StyledTableCell align='center'>Unit</StyledTableCell>
											<StyledTableCell align='center'>Actions</StyledTableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{rows.map((row, index) => (
											<StyledTableRow key={index}>
												<StyledTableCell
													component='th'
													scope='row'
													align='center'>
													{row.price}
												</StyledTableCell>
												<StyledTableCell align='center'>
													{row.quantity}
												</StyledTableCell>
												<StyledTableCell align='center'>
													{row.unit}
												</StyledTableCell>
												<StyledTableCell align='center' className='w-[20%]'>
													<div className='flex flex-row gap-2'>
														<Button
															variant='contained'
															size='small'
															color='warning'
															type='button'
															onClick={() => handleEditPrice(row, index)}>
															Edit
														</Button>
														<Button
															variant='contained'
															size='small'
															color='error'
															type='button'
															onClick={() => handleDeletePrice(index)}>
															Delete
														</Button>
													</div>
												</StyledTableCell>
											</StyledTableRow>
										))}
									</TableBody>
								</Table>
							</TableContainer>
						</div>
					)}
				</div>
				{(addingPrice || editPrice) && (
					<div className='flex flex-row gap-4 mb-3'>
						<TextField
							id='price'
							required
							label='Price'
							type='number'
							disabled={isLoading}
							value={price ?? ''}
							className='w-[30%] border border-red'
							borderColor={priceError ? 'red' : ''}
							slotProps={{
								input: {
									startAdornment: (
										<InputAdornment position='start'>$</InputAdornment>
									)
								}
							}}
							onChange={(e) => setPrice(Number(e.target.value))}
						/>
						<TextField
							id='quantity'
							required
							label='Quantity'
							type='number'
							disabled={isLoading}
							value={quantity ?? ''}
							borderColor={priceError ? 'red' : ''}
							className='w-[30%]'
							onChange={(e) => setQuantity(Number(e.target.value))}
						/>
						<TextField
							id='unit'
							select
							label='Unit'
							disabled={isLoading}
							value={unit ?? ''}
							borderColor={priceError ? 'red' : ''}
							className='w-[20%]'
							onChange={(e) => setUnit(e.target.value)}>
							{unitList ? (
								unitList.map((option) => (
									<MenuItem key={option.value} value={option.value}>
										{option.label}
									</MenuItem>
								))
							) : (
								<MenuItem value=''>{unit}</MenuItem>
							)}
						</TextField>
						<div className='flex flex-row gap-2'>
							<Button
								variant='contained'
								sx={{ backgroundColor: '#8B5CF6' }}
								size='small'
								onClick={handleAddPrice}>
								<Typography textTransform={'capitalize'}>Confirm</Typography>
							</Button>
							{rows && rows.length > 0 && (
								<Button
									variant='contained'
									color='error'
									size='small'
									onClick={handleCancelPriceForm}>
									<Typography textTransform={'capitalize'}>Cancel</Typography>
								</Button>
							)}
						</div>
					</div>
				)}
			</div>
			{category &&
				(category === 'Press on Nails' ||
					category === 'DIY' ||
					category === 'DIY Accesories') && (
					<div className='w-full'>
						<div className='w-full flex flex-col gap-2 items-start'>
							<div className='font-semibold'>Select a Size</div>
							<CustomSelect
								field={'size'}
								options={sizeOptions}
								setCustomeValue={setCustomeValue}
							/>
							<div className='font-semibold'>Select a Shape</div>
							<CustomSelect
								field={'shape'}
								options={shapeOptions}
								setCustomeValue={setCustomeValue}
							/>
							<div className='font-semibold'>Select a Length</div>
							<CustomSelect
								field={'length'}
								options={lengthOptions}
								setCustomeValue={setCustomeValue}
							/>
						</div>
					</div>
				)}
			<div className='w-full flex flex-col flex-wrap gap-1'>
				<div className='mb-2 font-semibold'>Select Colors</div>
				<div className='grid grid-cols-5 gap-1'>
					{Colors.map((item, index) => {
						return (
							<SelectColor
								key={index}
								item={item}
								addImageToState={addImageToState}
								removeImageFromState={removeImageFromState}
								isProductCreated={isProductCreated}
							/>
						);
					})}
				</div>
			</div>
			<Button
				type='button'
				variant='contained'
				onClick={handleSubmit(onSubmit)}
				sx={{ backgroundColor: '#8B5CF6' }}>
				{isLoading ? 'Loading...' : 'Add Product'}
			</Button>
		</>
	);
};
export default AddProductForm;

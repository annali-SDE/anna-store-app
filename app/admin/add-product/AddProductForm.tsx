'use client';

import { useEffect, useState, useCallback } from 'react';
import { useForm, FieldValues, SubmitHandler } from 'react-hook-form';
import toast from 'react-hot-toast';
import {
	getStorage,
	ref,
	uploadBytesResumable,
	getDownloadURL
} from 'firebase/storage';
import axios from 'axios';
import { useRouter } from 'next/navigation';

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
import { Button } from '../../components/ui/button';
import { sizeList, shapeList, lengthList } from '@/app/utils/selectOptions';

export type ImageType = {
	color: string;
	colorCode: string;
	image: File | null;
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
			describe: '',
			category: '',
			inStorck: false,
			images: [],
			price: '',
			size: '',
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

	const setCustomValue = (id: string, value: string) => {
		setValue(id, value, {
			shouldValidate: true,
			shouldDirty: true,
			shouldTouch: true
		});
	};

	const addImageToSate = useCallback((value: ImageType) => {
		setImages((prev) => {
			if (!prev) return [value];
			return [...prev, value];
		});
	}, []);
	const removeImageToSate = useCallback((value: ImageType) => {
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
			<Input
				id='price'
				label='Price'
				disabled={isLoading}
				register={register}
				errors={errors}
				type='number'
				required
			/>
			<TextArea
				id='description'
				label='Description'
				disabled={isLoading}
				register={register}
				errors={errors}
				required
			/>
			<div className='w-full flex flex-col gap-2 items-start'>
				<div className='font-semibold'>Select a Size</div>
				<CustomSelect
					field={'size'}
					options={sizeList}
					setCustomeValue={setCustomeValue}
				/>
			</div>
			<div className='w-full flex flex-col gap-2 items-start'>
				<div className='font-semibold'>Select a Shape</div>
				<CustomSelect
					field={'shape'}
					options={shapeList}
					setCustomeValue={setCustomeValue}
				/>
			</div>
			<div className='w-full flex flex-col gap-2 items-start'>
				<div className='font-semibold'>Select a Length</div>
				<CustomSelect
					field={'length'}
					options={lengthList}
					setCustomeValue={setCustomeValue}
				/>
			</div>

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
			<div className='w-full flex flex-col flex-wrap gap-1'>
				<div className='mb-2 font-semibold'>Select Colors</div>
				<div className='grid grid-cols-5 gap-1'>
					{Colors.map((item, index) => {
						return (
							<SelectColor
								key={index}
								item={item}
								addImageToSate={addImageToSate}
								removeImageFromState={removeImageToSate}
								isProductCreated={isProductCreated}
							/>
						);
					})}
				</div>
			</div>
			<Button
				type='button'
				variant='primary'
				onClick={handleSubmit(onSubmit)}
				className='w-full'>
				{isLoading ? 'Loading...' : 'Add Product'}
			</Button>
		</>
	);
};
export default AddProductForm;

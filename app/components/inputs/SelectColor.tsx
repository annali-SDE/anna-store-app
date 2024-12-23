'use client';

import { ImageType } from '@/app/admin/add-product/AddProductForm';
import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';

import SelectImage from './SelectImage';
import { Button } from '@mui/material';

interface SelectColorProps {
	item: ImageType;
	addImageToState: (value: ImageType) => void;
	removeImageFromState: (value: ImageType) => void;
	isProductCreated: boolean;
	disabled?: boolean;
	imagePath?: string | null;
	isNewProduct?: boolean;
}

const SelectColor: React.FC<SelectColorProps> = ({
	item,
	addImageToState,
	removeImageFromState,
	isProductCreated,
	disabled,
	imagePath,
	isNewProduct
}) => {
	const [isSelected, setIsSelected] = useState(false);
	const [file, setFile] = useState<File | null>(null);
	const [edittingImage, setEdittingImage] = useState(false);
	const [showSelectImage, setShowSelectImage] = useState(false);

	useEffect(() => {
		if (isProductCreated) {
			setIsSelected(false);
			setFile(null);
		}
	}, [isProductCreated]);

	useEffect(() => {
		if (imagePath && imagePath !== '') {
			setIsSelected(true);
		}
	}, [imagePath]);

	const handleFileChange = useCallback((value: File) => {
		setFile(value);
		addImageToState({
			...item,
			image: value
		});
		setShowSelectImage(false);
	}, []);

	const toggleEdittingImage = useCallback((value: boolean) => {
		setEdittingImage(value);
	}, []);

	const handleCheck = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		setIsSelected(e.target.checked);
		if (!e.target.checked) {
			setFile(null);
			removeImageFromState(item);
		}
	}, []);

	return (
		<div className='grid grid-cols-1 overflow-y-auto border-b-[1.2px] border-slate-200 items-center p-2'>
			<div className='flex flex-row gap-2 items-center h-[100px]'>
				<input
					id={item.color}
					type='checkbox'
					checked={isSelected}
					disabled={disabled}
					onChange={handleCheck}
					className={disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
				/>
				<span
					className={`rounded-full w-4 h-4 ${
						item.color === 'White' ? 'border border-black' : ''
					}`}
					style={{ background: item.colorCode }}></span>
				<label htmlFor={item.color} className='font-medium cursor-pointer'>
					{item.color}
				</label>
			</div>
			<>
				{isSelected && imagePath && imagePath !== '' && !edittingImage && (
					<div className='flex flex-col gap-1'>
						<div>
							{imagePath && imagePath !== '' && (
								<div>
									<Image
										src={imagePath}
										alt={item.color}
										width={80}
										height={80}
									/>
								</div>
							)}
						</div>
						{imagePath && imagePath != '' && (
							<div className='flex flex-col gap-2 text-sm col-span-2 items-start justify-between'>
								<div className='w-70px'>
									<Button
										type='button'
										variant='contained'
										size='small'
										color='warning'
										disabled={disabled}
										onClick={() => {
											setShowSelectImage(true);
											toggleEdittingImage(true);
										}}>
										Edit
									</Button>
								</div>
							</div>
						)}
					</div>
				)}
				{(showSelectImage || (isSelected && isNewProduct && !file)) && (
					<div className='col-span-2 text-center'>
						<SelectImage
							item={item}
							disabled={disabled}
							handleFileChange={handleFileChange}
						/>
					</div>
				)}
				{(file || edittingImage) && (
					<div className='flex flex-col gap-2 text-sm col-span-2 items-center justify-between'>
						<p>{file?.name}</p>
						<div className='w-70px'>
							<Button
								type='button'
								variant='contained'
								size='small'
								color='error'
								onClick={() => {
									setFile(null);
									toggleEdittingImage(false);
									setShowSelectImage(false);
									removeImageFromState(item);
								}}>
								Cancel
							</Button>
						</div>
					</div>
				)}
			</>
		</div>
	);
};
export default SelectColor;

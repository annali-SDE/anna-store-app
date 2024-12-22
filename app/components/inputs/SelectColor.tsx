'use client';

import { ImageType } from '@/app/admin/add-product/AddProductForm';
import { useCallback, useEffect, useState } from 'react';
import SelectImage from './SelectImage';
import { Button } from '@mui/material';

interface SelectColorProps {
	item: ImageType;
	addImageToState: (value: ImageType) => void;
	removeImageFromState: (value: ImageType) => void;
	isProductCreated: boolean;
	disabled?: boolean;
}

const SelectColor: React.FC<SelectColorProps> = ({
	item,
	addImageToState,
	removeImageFromState,
	isProductCreated,
	disabled
}) => {
	const [isSelected, setIsSelected] = useState(false);
	const [file, setFile] = useState<File | null>(null);

	useEffect(() => {
		if (isProductCreated) {
			setIsSelected(false);
			setFile(null);
		}
	}, [isProductCreated]);

	const handleFileChange = useCallback((value: File) => {
		setFile(value);
		addImageToState({
			...item,
			image: value
		});
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
				{isSelected && !file && (
					<div className='col-span-2 text-center'>
						<SelectImage item={item} handleFileChange={handleFileChange} />
					</div>
				)}
				{file && (
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

'use client';

import { ImageType } from '@/app/admin/add-product/AddProductForm';
import { useDropzone } from 'react-dropzone';
import { useCallback, useState } from 'react';

interface SelectImageProps {
	item?: ImageType;
	handleFileChange: (value: File) => void;
	imagePath?: string | null;
	disabled?: boolean;
}

const SelectImage: React.FC<SelectImageProps> = ({
	item,
	handleFileChange,
	disabled
}) => {
	const [selectedFile, setSelectedFile] = useState<File | null>(null);

	const onDrop = useCallback((acceptedFiles: File[]) => {
		if (acceptedFiles.length > 0) {
			handleFileChange(acceptedFiles[0]);
		}
	}, []);
	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		disabled,
		accept: { 'image/*': ['.jepg', '.png'] }
	});

	return (
		<div
			{...getRootProps()}
			className={`border-2 corder-slate-400 p-2 border-dashed text-sm font-normal text-slate-400 flex items-center justify-center ${
				disabled ? 'cursor-not-allowed' : 'cursor-pointer'
			}`}>
			<input {...getInputProps()} />
			{isDragActive ? (
				<p>Drop the image here ...</p>
			) : (
				<p>+ {item?.color} Image</p>
			)}
		</div>
	);
};
export default SelectImage;

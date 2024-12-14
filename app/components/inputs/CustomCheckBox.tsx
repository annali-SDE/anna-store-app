'use client';
import { UseFormRegister, FieldValues } from 'react-hook-form';

interface CustomCheckBoxProps {
	id: string;
	label: string;
	disabled?: boolean;
	register: UseFormRegister<FieldValues>;
	checked?: boolean;
}

const CustomCheckBox: React.FC<CustomCheckBoxProps> = ({
	id,
	label,
	disabled,
	register,
	checked
}) => {
	return (
		<div className='w-full flex flex-row gap-2 items-center'>
			<input
				type='checkbox'
				id={id}
				disabled={disabled}
				{...register(id)}
				placeholder=''
				className='cursor-pointer'
				defaultChecked={true}
			/>
			<label htmlFor={id} className='font-semibold cursor-pointer'>
				{label}
			</label>
		</div>
	);
};
export default CustomCheckBox;

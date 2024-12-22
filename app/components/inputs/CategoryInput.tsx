'use client';

import { IconType } from 'react-icons';

interface CategoryInputProps {
	selected?: boolean;
	label: string;
	icon: IconType;
	onClick: (value: string) => void;
	disabled?: boolean;
}

const CategoryInput: React.FC<CategoryInputProps> = ({
	selected,
	label,
	icon: Icon,
	onClick,
	disabled
}) => {
	return (
		<div className={disabled ? 'cursor-not-allowed' : 'cursor-pointer'}>
			<div
				onClick={() => onClick(label)}
				className={`rounded-xl border-2 p-4 flex flex-col items-center gap-2 hover:border-slate-500 transition ${
					selected ? 'border-slate-500' : 'border-slate-100'
				} ${disabled ? 'pointer-events-none' : ''} `}>
				<Icon size={30} />
				<div className='font-medium'>{label}</div>
			</div>
		</div>
	);
};
export default CategoryInput;

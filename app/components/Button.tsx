'use client';

import { IconType } from 'react-icons';

interface buttonProps {
	label: string;
	disabled?: boolean;
	outline?: boolean;
	small?: boolean;
	custom?: string;
	icon?: IconType;
	onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const Button: React.FC<buttonProps> = ({
	label,
	disabled,
	outline,
	small,
	custom,
	icon: Icon,
	onClick
}) => {
	return (
		<button
			onClick={onClick}
			disabled={disabled}
			className={`disabled: opacity-70 disabled:cursor-not-allowed rounded-md hover:opacity-90 transition w-full border-slate-600 flex items-center justify-center gap-2 
      ${outline ? 'bg-white' : 'bg-slate-600'} 
      ${outline ? 'text-slate-600' : 'text-white'} 
      ${small ? 'text-sm font-light' : 'text-md font-semibold'} 
      ${small ? 'py-1 px-2 border-[1px]' : 'py-3 px-4 border-2'} 
      ${custom ? custom : ''}`}>
			{Icon && <Icon size={24} />}
			{label}
			<span className='sr-only'>{label}</span>
		</button>
	);
};
export default Button;

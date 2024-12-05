'use client';

import { CartProductType } from '@prisma/client';

interface SetQuantityProps {
	cartCounter?: boolean;
	cartProduct: CartProductType;
	handleQuantityIncrease: () => void;
	handleQuantityDecrease: () => void;
}

const btnStyles =
	'border-[1.2px] border-slate-300 px-2 rounded disabled:cursor-not-allowed';

const SetQuantity: React.FC<SetQuantityProps> = ({
	cartProduct,
	cartCounter,
	handleQuantityIncrease,
	handleQuantityDecrease
}) => {
	return (
		<div className='flex gap-8 items-center'>
			{cartCounter ? null : <div className='font-semibold'>Quatity:</div>}
			<div className='flex gap-4 items-center text-base'>
				<button
					onClick={handleQuantityDecrease}
					className={btnStyles}
					disabled={cartProduct.quantity === 0}>
					-
				</button>
				<div>{cartProduct.quantity}</div>
				<button onClick={handleQuantityIncrease} className={btnStyles}>
					+
				</button>
			</div>
		</div>
	);
};
export default SetQuantity;

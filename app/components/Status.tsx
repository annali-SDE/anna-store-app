import { twMerge } from 'tailwind-merge';

const Status = ({
	className,
	children
}: React.PropsWithChildren & { className?: string }) => (
	<div
		className={twMerge(
			'leading-4 p-2 rounded flex items-center gap-1',
			className
		)}>
		{children}
	</div>
);
export default Status;

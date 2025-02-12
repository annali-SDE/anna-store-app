const FormWrap = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className='min-h-fit h-full flex items-center justify-center pb-12 pt-4'>
			<div className='max-w-[1280px] w-full flex flex-col gap-6 shadow-xl shadow-slate-200 items-center rounded-md p-4 md:p-8'>
				{children}
			</div>
		</div>
	);
};
export default FormWrap;

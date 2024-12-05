interface NullDataProps {
	title: string;
}

const NullData: React.FC<NullDataProps> = ({ title }) => {
	return (
		<div className='w-full h--[50vh] flex items-center justify-center text-xl md:text-2xl mt-4'>
			<p className='font-medium'>{title}</p>
		</div>
	);
};
export default NullData;

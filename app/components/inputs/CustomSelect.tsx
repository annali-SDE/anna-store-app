import { Label } from '@radix-ui/react-select';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue
} from '../../components/ui/select';

interface CustomSelectProps {
	options: {
		[key: string]: string[];
	};
	label: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ options, label }) => {
	return (
		<div>
			<Select>
				<SelectTrigger className='w-[280px] bg-white-1'>
					<SelectValue placeholder={label} />
				</SelectTrigger>
				<SelectContent className='bg-white'>
					{Object.keys(options).map((key) => (
						<SelectGroup key={key}>
							<SelectLabel className='underline underline-offset-8'>
								{key}
							</SelectLabel>
							{options[key].map((item) => (
								<SelectItem key={item} value={item}>
									{item}
								</SelectItem>
							))}
						</SelectGroup>
					))}
				</SelectContent>
			</Select>
		</div>
	);
};
export default CustomSelect;

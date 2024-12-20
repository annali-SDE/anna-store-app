import { Autocomplete } from '@mui/material';
import TextField from '@mui/material/TextField';
import { selectOption } from '@/types';

interface CustomSelectProps {
	options: selectOption[];
	field: string;
	setCustomeValue: (field: string, value: string) => void;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
	options,
	field,
	setCustomeValue
}) => {
	return (
		<div>
			<Autocomplete
				options={options}
				groupBy={(option) => option.group}
				getOptionLabel={(option) => option.label || ''}
				sx={{ width: 300 }}
				renderInput={(params) => (
					<TextField {...params} label={`Select a ${field}`} />
				)}
				onChange={(event, v) => {
					setCustomeValue(field, v?.value || '');
				}}
			/>
		</div>
	);
};
export default CustomSelect;

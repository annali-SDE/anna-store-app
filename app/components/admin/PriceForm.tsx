'use client';

import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { purple } from '@mui/material/colors';
import MuiTextField from '@mui/material/TextField';
import { Button } from '@mui/material';

import { unitList } from '@/app/utils/selectOptions';
import { PriceType } from '@/app/admin/add-product/AddProductForm';

type PriceFormProps = {
	disabled?: boolean;
	price: number | '';
	quantity: number | '';
	unit: string;
	setPrice: (price: number) => void;
	setQuantity: (quantity: number) => void;
	setUnit: (unit: string) => void;
	priceError?: boolean;
	handleEditPrice: (row: PriceType, index: number) => void;
	handleDeletePrice: (index: number) => void;
	prices: PriceType[];
	addingPrice: boolean;
	editPrice: boolean;
	handleAddPrice: () => void;
	handleCancelPriceForm: () => void;
};

const PriceForm: React.FC<PriceFormProps> = ({
	disabled,
	price,
	setPrice,
	priceError,
	handleEditPrice,
	handleDeletePrice,
	prices,
	addingPrice,
	editPrice,
	handleAddPrice,
	handleCancelPriceForm,
	quantity,
	setQuantity,
	unit,
	setUnit
}) => {
	type TextFieldProps = {
		borderColor?: string;
	};

	const options = {
		shouldForwardProp: (prop: string) => prop !== 'borderColor'
	};
	const outlinedSelectors = [
		'& .MuiOutlinedInput-notchedOutline',
		'&:hover .MuiOutlinedInput-notchedOutline',
		'& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline'
	];
	const TextField = styled(
		MuiTextField,
		options
	)<TextFieldProps>(({ borderColor }) => ({
		'& label.Mui-focused': {
			color: borderColor
		},
		[outlinedSelectors.join(',')]: {
			borderWidth: 1,
			borderColor
		}
	}));
	const StyledTableCell = styled(TableCell)(({ theme }) => ({
		[`&.${tableCellClasses.head}`]: {
			backgroundColor: purple[50]
		},
		[`&.${tableCellClasses.body}`]: {
			fontSize: 14
		}
	}));
	const StyledTableRow = styled(TableRow)(({ theme }) => ({
		'&:nth-of-type(odd)': {
			backgroundColor: theme.palette.action.hover
		},
		// hide last border
		'&:last-child td, &:last-child th': {
			border: 0
		}
	}));

	return (
		<div>
			{prices && prices.length > 0 && (
				<div className='w-full mb-4'>
					<TableContainer component={Paper}>
						<Table sx={{ minWidth: 700 }} aria-label='customized table'>
							<TableHead>
								<TableRow>
									<StyledTableCell align='center'>Price</StyledTableCell>
									<StyledTableCell align='center'>Quantity</StyledTableCell>
									<StyledTableCell align='center'>Unit</StyledTableCell>
									<StyledTableCell align='center'>Actions</StyledTableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{prices.map((row, index) => (
									<StyledTableRow key={index}>
										<StyledTableCell component='th' scope='row' align='center'>
											{row.price}
										</StyledTableCell>
										<StyledTableCell align='center'>
											{row.quantity}
										</StyledTableCell>
										<StyledTableCell align='center'>{row.unit}</StyledTableCell>
										<StyledTableCell align='center' className='w-[20%]'>
											<div className='flex flex-row gap-2'>
												<Button
													variant='contained'
													size='small'
													color='warning'
													type='button'
													disabled={disabled}
													onClick={() => handleEditPrice(row, index)}>
													Edit
												</Button>
												<Button
													variant='contained'
													size='small'
													color='error'
													type='button'
													disabled={disabled}
													onClick={() => handleDeletePrice(index)}>
													Delete
												</Button>
											</div>
										</StyledTableCell>
									</StyledTableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>
				</div>
			)}
			{!disabled && (addingPrice || editPrice) && (
				<div className='flex flex-row gap-4 mb-3'>
					<TextField
						id='price'
						required
						label='Price'
						type='number'
						disabled={disabled}
						value={price}
						inputMode='numeric'
						className={`w-[30%] border border-red ${
							disabled ? 'cursor-not-allowed' : ''
						}`}
						borderColor={priceError ? 'red' : ''}
						slotProps={{
							input: {
								startAdornment: (
									<InputAdornment position='start'>$</InputAdornment>
								)
							}
						}}
						onChange={(e) => setPrice(Number(e.target.value))}
					/>
					<TextField
						id='quantity'
						required
						label='Quantity'
						type='number'
						disabled={disabled}
						value={quantity ?? ''}
						borderColor={priceError ? 'red' : ''}
						className='w-[30%]'
						onChange={(e) => setQuantity(Number(e.target.value))}
					/>
					<TextField
						id='unit'
						select
						label='Unit'
						disabled={disabled}
						value={unit ?? ''}
						borderColor={priceError ? 'red' : ''}
						className='w-[20%]'
						onChange={(e) => setUnit(e.target.value)}>
						{unitList ? (
							unitList.map((option) => (
								<MenuItem key={option.value} value={option.value}>
									{option.label}
								</MenuItem>
							))
						) : (
							<MenuItem value=''>{unit}</MenuItem>
						)}
					</TextField>
					<div className='flex flex-row gap-2'>
						<Button
							variant='contained'
							sx={{ backgroundColor: '#8B5CF6' }}
							size='small'
							onClick={handleAddPrice}>
							<Typography textTransform={'capitalize'}>Confirm</Typography>
						</Button>
						{prices && prices.length > 0 && (
							<Button
								variant='contained'
								color='error'
								size='small'
								onClick={handleCancelPriceForm}>
								<Typography textTransform={'capitalize'}>Cancel</Typography>
							</Button>
						)}
					</div>
				</div>
			)}
		</div>
	);
};
export default PriceForm;

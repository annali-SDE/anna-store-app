'use client';

import { useState, Fragment } from 'react';
import moment from 'moment';
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	TablePagination
} from '@mui/material';

import { User } from '@prisma/client';
import Heading from '@/app/components/Heading';

interface ManageCustomersProps {
	users: User[];
}

const ManageCustomers: React.FC<ManageCustomersProps> = ({ users }) => {
	const [expandedRowId, setExpandedRowId] = useState<number | null>(null);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(5);

	let rows: any = [];
	if (users) {
		rows = users.map((user) => {
			return {
				id: user.id,
				firstName: user.firstName,
				lastName: user.lastName,
				clerkUserId: user.clerkUserId,
				email: user.email,
				role: user.role,
				createdAt: user.createdAt,
				updatedAt: user.updatedAt
			};
		});
	}

	const handleRowClick = (rowId: number) => {
		setExpandedRowId(expandedRowId === rowId ? null : rowId);
	};

	const handleChangePage = (event: unknown, newPage: number) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	return (
		<div className='max-w-[1280px] m-auto text-xl'>
			<div className='mb-4 mt-2 flex justify-between'>
				<Heading title='Manage Customers' center />
			</div>
			<TableContainer component={Paper}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>ID</TableCell>
							<TableCell>First Name</TableCell>
							<TableCell>Last Name</TableCell>
							<TableCell>Clerk Id</TableCell>
							<TableCell>Email</TableCell>
							<TableCell>Role</TableCell>
							<TableCell>Created At</TableCell>
							<TableCell>Updated At</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{rows
							.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
							.map((row: any) => (
								<Fragment key={row.id}>
									<TableRow>
										<TableCell>{row.id}</TableCell>
										<TableCell>{row.firstName}</TableCell>
										<TableCell>{row.lastName}</TableCell>
										<TableCell>{row.clerkUserId}</TableCell>
										<TableCell>{row.email}</TableCell>
										<TableCell>{row.role}</TableCell>
										<TableCell>
											{moment
												.utc(row.createdAt)
												.local()
												.format('YYYY-MM-DD HH:mm:ss')}
										</TableCell>
										<TableCell>
											{moment
												.utc(row.updatedAt)
												.local()
												.format('YYYY-MM-DD HH:mm:ss')}
										</TableCell>
									</TableRow>
								</Fragment>
							))}
					</TableBody>
				</Table>
				<TablePagination
					rowsPerPageOptions={[5, 10, 25]}
					component='div'
					count={rows.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onPageChange={handleChangePage}
					onRowsPerPageChange={handleChangeRowsPerPage}
				/>
			</TableContainer>
		</div>
	);
};

export default ManageCustomers;

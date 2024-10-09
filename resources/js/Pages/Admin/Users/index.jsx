import React, { useState } from 'react';
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, router } from "@inertiajs/react";
import TanstackTable from '@/Components/TanstackTable';

export default function Index({ users, total, currentPage, pageSize, lastPage }) {
	const [page, setPage] = useState(currentPage);
	const [itemsPerPage, setItemsPerPage] = useState(pageSize);

	const columns = [
		{
			header: 'Username',
			accessorKey: 'username',
		},
		{
			header: 'Email',
			accessorKey: 'email',
		},
		{
			header: 'Name',
			accessorFn: row => `${row.first_name} ${row.last_name}`,
		},
		// Add more columns as needed
	];

	const handlePageChange = (newPage) => {
		setPage(newPage);
		router.get(route('admin.users'), { page: newPage, pageSize: itemsPerPage }, {
			preserveState: true,
			preserveScroll: true,
		});
	};

	const handlePageSizeChange = (newPageSize) => {
		setItemsPerPage(newPageSize);
		router.get(route('admin.users'), { page: 1, pageSize: newPageSize }, {
			preserveState: true,
			preserveScroll: true,
		});
	};

	return (
		<AdminLayout header="Users">
			<Head title="Users" />
				<div className="py-12">
					<div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
						<div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
							<div className="p-6 text-gray-900">
								<h2 className="text-2xl font-semibold mb-4">Users List</h2>
				<TanstackTable
									data={users}
					columns={columns}
					pageCount={lastPage}
									pageIndex={page - 1}
									pageSize={itemsPerPage}
					onPageChange={handlePageChange}
					onPageSizeChange={handlePageSizeChange}
					total={total}
				/>
			</div>
						</div>
					</div>
				</div>
		</AdminLayout>
	);
}

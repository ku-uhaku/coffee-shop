import React, { useState, useCallback, useEffect } from 'react';
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, router } from "@inertiajs/react";
import TanstackTable from '@/Components/TanstackTable';
import debounce from 'lodash/debounce';

export default function Index({ users, total, currentPage, pageSize, lastPage, search }) {
	const [page, setPage] = useState(currentPage);
	const [itemsPerPage, setItemsPerPage] = useState(pageSize);
	const [searchTerm, setSearchTerm] = useState(search);
	const [selectedRows, setSelectedRows] = useState({});

	// Reset selected rows when page changes
	useEffect(() => {
		setSelectedRows({});
	}, [page, itemsPerPage, searchTerm]);

	const columns = [
		{
			header: 'Username',
			accessorKey: 'username',
			id: 'Username',
		},
		{
			header: 'Email',
			accessorKey: 'email',
			id: 'Email',
		},
		{
			header: 'First Name',
			accessorKey: 'first_name',
			id: 'First Name',
		},
		{
			header: 'Last Name',
			accessorKey: 'last_name',
			id: 'Last Name',
		},
		{
			header: 'Full Name',
			accessorFn: row => `${row.first_name} ${row.last_name}`,
			id: 'Full Name',
		},
		// Add more columns as needed	
	];

	const handlePageChange = (newPage) => {
		setPage(newPage);
		updateUsers(newPage, itemsPerPage, searchTerm);
	};

	const handlePageSizeChange = (newPageSize) => {
		setItemsPerPage(newPageSize);
		updateUsers(1, newPageSize, searchTerm);
	};

	const debouncedSearch = useCallback(
		debounce((value) => {
			updateUsers(1, itemsPerPage, value);
		}, 300),
		[itemsPerPage]
	);

	const handleSearchChange = (e) => {
		const value = e.target.value;
		setSearchTerm(value);
		debouncedSearch(value);
	};

	const updateUsers = (page, pageSize, search) => {
		router.get(
			route('admin.users'),
			{ page, pageSize, search },
			{
				preserveState: true,
				preserveScroll: true,
			}
		);
	};

	const handleBulkDelete = (selectedIds) => {
		if (confirm(`Are you sure you want to delete ${selectedIds.length} users?`)) {
			router.delete(route('admin.users.bulkDelete'), {
				data: { ids: selectedIds },
				preserveState: true,
				preserveScroll: true,
				onSuccess: () => {
					setSelectedRows({});
				},
			});
		}
	};

	return (
		<AdminLayout header="Users">
			<Head title="Users" />
			<div className="py-12">
				<div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
					<div className="bg-white  shadow-sm sm:rounded-lg">
						<div className="p-6 text-gray-900">
							<h2 className="text-2xl font-semibold mb-4">Users List</h2>
							<div className="mb-4">
								<input
									type="text"
									placeholder="Search users..."
									value={searchTerm}
									onChange={handleSearchChange}
									className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
								/>
							</div>
							<TanstackTable
								data={users}
								columns={columns}
								pageCount={lastPage}
								pageIndex={page - 1}
								pageSize={itemsPerPage}
								onPageChange={handlePageChange}
								onPageSizeChange={handlePageSizeChange}
								total={total}
								onBulkDelete={handleBulkDelete}
								selectedRows={selectedRows}
								setSelectedRows={setSelectedRows}
							/>
						</div>
					</div>
				</div>
			</div>
		</AdminLayout>
	);
}

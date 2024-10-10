import React, { useState, useCallback, useEffect } from 'react';
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, router, Link } from "@inertiajs/react";
import TanstackTable from '@/Components/TanstackTable';
import debounce from 'lodash/debounce';
import { toast } from 'sonner';
import Dropdown from '@/Components/Dropdown';
import { FaChevronDown, FaEdit, FaTrash, FaToggleOn, FaToggleOff, FaSearch } from 'react-icons/fa';

export default function Index({ users, total, currentPage, pageSize, lastPage, search, sort }) {
	const [page, setPage] = useState(currentPage);
	const [itemsPerPage, setItemsPerPage] = useState(pageSize);
	const [searchTerm, setSearchTerm] = useState(search);
	const [selectedRows, setSelectedRows] = useState({});
	const [sorting, setSorting] = useState(sort || []);

	// Reset selected rows when page changes
	useEffect(() => {
		setSelectedRows({});
	}, [page, itemsPerPage, searchTerm]);

	const handleStatusChange = (userId, currentStatus) => {

		const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
		router.put(route('admin.users.updateStatus', userId), {
			status: newStatus
		}, {
			preserveState: true,
			preserveScroll: true,
		});
		if(newStatus === 'active'){
			toast.success('User status updated to ' + newStatus)
		}else{
			toast.error('User status updated to ' + newStatus)
		}

	};

	const handleDelete = (userId) => {
		if (confirm('Are you sure you want to delete this user?')) {
			router.delete(route('admin.users.delete', userId), {
				preserveState: true,
				preserveScroll: true,
				onSuccess: () => toast.success('User deleted successfully'),
				onError: () => toast.error('Failed to delete user'),
			});
		}
	};

	const columns = [
		{
			header: 'Username',
			accessorKey: 'username',
			id: 'Username',
			enableSorting: true,
			isToggleable: true,
		},
		{
			header: 'Email',
			accessorKey: 'email',
			id: 'Email',
			enableSorting: true,
			isToggleable: true,
		},
		{
			header: 'First Name',
			accessorKey: 'first_name',
			id: 'First Name',
			enableSorting: true,
			isToggleable: true,
		},
		{
			header: 'Last Name',
			accessorKey: 'last_name',
			id: 'Last Name',
			enableSorting: true,
			isToggleable: true,
		},
		{
			header: 'Full Name',
			accessorFn: row => `${row.first_name} ${row.last_name}`,
			id: 'Full Name',
			enableSorting: false,
			isToggleable: true,
		},
		{
			header: 'Status',
			accessorKey: 'status',
			id: 'Status',
			enableSorting: true,
			isToggleable: true,
			cell: ({ row }) => (
				<span 
					className={`px-2 inline-flex items-center text-xs leading-5 font-semibold rounded-full cursor-pointer ${
						row.original.status === 'active' ? 'bg-green-100 text-green-900' : 'bg-red-100 text-red-900'
					}`}
					onClick={() => handleStatusChange(row.original.id, row.original.status)}
				>
					
					{row.original.status.charAt(0).toUpperCase() + row.original.status.slice(1)}
				</span>
			),
		},
		{
			header: 'Actions',
			id: 'actions',
			isToggleable: false, // Usually, we don't want to hide the actions column
			cell: ({ row }) => (
				<Dropdown>
					<Dropdown.Trigger>
						<button className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
							Actions
							<FaChevronDown className="w-4 h-4 ml-2 -mr-1 text-gray-400" aria-hidden="true" />
						</button>
					</Dropdown.Trigger>
					<Dropdown.Content>
						<div className="py-1">
							<Dropdown.Link 
								href={route('admin.users.edit', row.original.id)} 
								method="get" 
								as="button"
								className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-100 hover:text-indigo-900"
							>
								<FaEdit className="inline mr-2" /> Edit
							</Dropdown.Link>
							<Dropdown.Link 
								href="#" 
								onClick={() => handleDelete(row.original.id)} 
								as="button"
								className="block px-4 py-2 text-sm text-red-600 hover:bg-red-100 hover:text-red-900"
							>
								<FaTrash className="inline mr-2" /> Delete
							</Dropdown.Link>
						</div>
					</Dropdown.Content>
				</Dropdown>
			),
		},
		// Add more columns as needed	
	];

	const handlePageChange = (newPage) => {
		setPage(newPage);
		updateUsers(newPage, itemsPerPage, searchTerm, sorting);
	};

	const handlePageSizeChange = (newPageSize) => {
		setItemsPerPage(newPageSize);
		updateUsers(1, newPageSize, searchTerm, sorting);
	};

	const debouncedSearch = useCallback(
		debounce((value) => {
			updateUsers(1, itemsPerPage, value, sorting);
		}, 300),
		[itemsPerPage, sorting]
	);

	const handleSearchChange = (e) => {
		const value = e.target.value;
		setSearchTerm(value);
		debouncedSearch(value);
	};

	const handleSort = (newSorting) => {
		setSorting(newSorting);
		updateUsers(page, itemsPerPage, searchTerm, newSorting);
	};

	const updateUsers = (page, pageSize, search, sort) => {
		router.get(
			route('admin.users'),
			{ page, pageSize, search, sort: JSON.stringify(sort) },
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
					<div className="bg-white shadow-sm sm:rounded-lg">
						<div className="p-6 text-gray-900">
							<h2 className="text-2xl font-semibold mb-4">Users List</h2>
							<div className="mb-4 relative">
								<input
									type="text"
									placeholder="Search users..."
									value={searchTerm}
									onChange={handleSearchChange}
									className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
								/>
								<FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
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
								onSort={handleSort}
								initialSorting={sorting}
							/>
						</div>
					</div>
				</div>
			</div>
		</AdminLayout>
	);
}
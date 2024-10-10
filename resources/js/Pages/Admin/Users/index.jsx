import React, { useState, useEffect } from 'react';
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, router, usePage } from "@inertiajs/react";
import TanstackTable from '@/Components/TanstackTable';
import { toast } from 'sonner';
import Dropdown from '@/Components/Dropdown';
import { FaChevronDown, FaEdit, FaTrash } from 'react-icons/fa';
import change from '../../../../../public/sound/change.mp3';
import deleteSound from '../../../../../public/sound/delete.mp3';
import Modal from '@/Components/Modal';

export default function Index({ users, total, currentPage, pageSize, lastPage, search, sort, currentUserId }) {
	const [page, setPage] = useState(currentPage);
	const [itemsPerPage, setItemsPerPage] = useState(pageSize);
	const [selectedRows, setSelectedRows] = useState({});
	const [sorting, setSorting] = useState(sort || []);
	const [searchTerm, setSearchTerm] = useState(search || "");
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedUser, setSelectedUser] = useState(null);
	const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
	const [selectedIdsForBulkDelete, setSelectedIdsForBulkDelete] = useState([]);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [userToDelete, setUserToDelete] = useState(null);

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
		const audio = new Audio(change);
		audio.play();

	};

	const handleDelete = (user) => {
		if (user.id === currentUserId) {
			return;
		}
		setUserToDelete(user);
		setIsDeleteModalOpen(true);
	};

	const confirmDelete = () => {
		
	
		router.delete(route('admin.users.delete', userToDelete.id), {
			preserveState: true,
			preserveScroll: true,
			onSuccess: () => {
				setIsDeleteModalOpen(false);
				const audio = new Audio(deleteSound);
		audio.play();
			},
		});
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
			header: 'Full Name',
			accessorFn: row => `${row.first_name} ${row.last_name}`,
			id: 'Full Name',
			enableSorting: false,
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
			header: 'Phone',
			accessorKey: 'phone',
			id: 'phone',
			enableSorting: true,
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
			isToggleable: false,
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
							<button 
								onClick={() => handleDelete(row.original)} 
								className={`block w-full text-left px-4 py-2 text-sm ${
									row.original.id === currentUserId
										? 'text-gray-400 cursor-not-allowed'
										: 'text-red-600 hover:bg-red-100 hover:text-red-900'
								}`}
								disabled={row.original.id === currentUserId}
							>
								<FaTrash className="inline mr-2" /> Delete
							</button>
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

	const handleSearch = (value) => {
		setSearchTerm(value);
		updateUsers(1, itemsPerPage, value, sorting);
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
		if (selectedIds.includes(currentUserId)) {
			return;
		}
		setSelectedIdsForBulkDelete(selectedIds);
		setIsBulkDeleteModalOpen(true);
	};

	const confirmBulkDelete = () => {
		

		router.delete(route('admin.users.bulkDelete'), {
			data: { ids: selectedIdsForBulkDelete },
			preserveState: true,
			preserveScroll: true,
			onSuccess: () => {
				setSelectedRows({});
				setIsBulkDeleteModalOpen(false);
				const audio = new Audio(deleteSound);
				audio.play();	
			},
			onError: () => {
			},
		});
	};

	const handleClearFilters = () => {
		setSearchTerm('');
		setSorting([]);
		setPage(1);
		setItemsPerPage(10); // Reset to default page size

		// Use Inertia's visit method to replace the current URL without query parameters
		router.visit(route('admin.users'), {
			preserveState: false,
			replace: true,
		});
	};

	const handleModalOpen = (userId) => {
		setSelectedUser(users.find(user => user.id === userId));
		setIsModalOpen(true);
	};

	return (
		<AdminLayout header="Users">
			<Head title="Users" />
			<div className="py-12">
				<div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
					<div className="bg-white shadow-sm sm:rounded-lg">
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
								onBulkDelete={handleBulkDelete}
								selectedRows={selectedRows}
								setSelectedRows={setSelectedRows}
								onSort={handleSort}
								initialSorting={sorting}
								onSearch={handleSearch}
								initialSearchTerm={searchTerm}
								onClearFilters={handleClearFilters}
							/>
						</div>
					</div>
				</div>
			</div>

			<Modal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				title="User Details"
			>
				{selectedUser && (
					<div className="space-y-4">
						<p><span className="font-semibold">Name:</span> {selectedUser.first_name} {selectedUser.last_name}</p>
						<p><span className="font-semibold">Email:</span> {selectedUser.email}</p>
						<p><span className="font-semibold">Username:</span> {selectedUser.username}</p>
						<p><span className="font-semibold">Phone:</span> {selectedUser.phone}</p>
						<p><span className="font-semibold">Status:</span> 
							<span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
								selectedUser.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
							}`}>
								{selectedUser.status.charAt(0).toUpperCase() + selectedUser.status.slice(1)}
							</span>
						</p>
					</div>
				)}
			</Modal>
			<Modal
				isOpen={isBulkDeleteModalOpen}
				onClose={() => setIsBulkDeleteModalOpen(false)}
				title="Confirm Bulk Delete"
				footer={
					<div className="flex justify-end space-x-2">
						<button
							onClick={() => setIsBulkDeleteModalOpen(false)}
							className="px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-25 transition ease-in-out duration-150"
						>
							Cancel
						</button>
						<button
							onClick={confirmBulkDelete}
							className="px-4 py-2 bg-red-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-500 active:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition ease-in-out duration-150"
						>
							Delete
						</button>
					</div>
				}
			>
				<p className="text-sm text-gray-500">
					Are you sure you want to delete {selectedIdsForBulkDelete.length} users? This action cannot be undone.
				</p>
			</Modal>
			<Modal
				isOpen={isDeleteModalOpen}
				onClose={() => setIsDeleteModalOpen(false)}
				title="Confirm Delete"
				footer={
					<div className="flex justify-end space-x-2">
						<button
							onClick={() => {
								setIsDeleteModalOpen(false);
								setUserToDelete(null);
							}}
							className="px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-25 transition ease-in-out duration-150"
						>
							Cancel
						</button>
						<button
							onClick={confirmDelete}
							className="px-4 py-2 bg-red-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-500 active:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition ease-in-out duration-150"
						>
							Delete
						</button>
					</div>
				}
			>
				<p className="text-sm text-gray-500">
					Are you sure you want to delete the user "{userToDelete?.username}"? This action cannot be undone.
				</p>
			</Modal>
		</AdminLayout>
	);
}
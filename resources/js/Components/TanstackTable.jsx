import React, { useEffect, useState } from "react";
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    getSortedRowModel,
} from "@tanstack/react-table";
import Dropdown from '@/Components/Dropdown';
import { BsFunnel, BsSortDown, BsSortUp } from "react-icons/bs";
import { MdDeleteOutline, MdFilterAltOff } from "react-icons/md";
import { FaSearch } from "react-icons/fa";
import { HiChevronLeft, HiChevronRight, HiChevronUpDown, HiChevronUp, HiChevronDown } from "react-icons/hi2";
import debounce from 'lodash/debounce';

export default function TanstackTable({
    data,
    columns,
    pageCount,
    pageIndex,
    pageSize,
    onPageChange,
    onPageSizeChange,
    total,
    onBulkDelete,
    selectedRows,
    setSelectedRows,
    onSort,
    initialSorting = [],
    onSearch,
    initialSearchTerm = "",
    onClearFilters,
}) {
    const [columnVisibility, setColumnVisibility] = React.useState({});
    const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
    const [sorting, setSorting] = React.useState(initialSorting);
    const [searchTerm, setSearchTerm] = useState(initialSearchTerm);

    // Reset row selection when data changes
    useEffect(() => {
        setSelectedRows({});
    }, [data, setSelectedRows]);

    const table = useReactTable({
        data,
        columns: [
            {
                id: 'select',
                header: ({ table }) => (
                    <input
                        type="checkbox"
                        checked={table.getIsAllPageRowsSelected()}
                        onChange={table.getToggleAllPageRowsSelectedHandler()}
                    />
                ),
                cell: ({ row }) => (
                    <input
                        type="checkbox"
                        checked={row.getIsSelected()}
                        onChange={row.getToggleSelectedHandler()}
                    />
                ),
            },
            ...columns
        ],
        pageCount,
        state: {
            pagination: {
                pageIndex,
                pageSize,
            },
            columnVisibility,
            rowSelection: selectedRows,
            sorting,
        },
        onPaginationChange: (updater) => {
            if (typeof updater === "function") {
                const newState = updater({ pageIndex, pageSize });
                if (newState.pageIndex !== pageIndex) {
                    onPageChange(newState.pageIndex + 1);
                }
                if (newState.pageSize !== pageSize) {
                    onPageSizeChange(newState.pageSize);
                }
            }
        },
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setSelectedRows,
        onSortingChange: (updater) => {
            const newSorting = typeof updater === 'function' ? updater(sorting) : updater;
            setSorting(newSorting);
            onSort(newSorting);
        },
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        manualPagination: true,
        manualSorting: true,
    });

    const debouncedSearch = React.useCallback(
        debounce((value) => {
            onSearch(value);
        }, 300),
        [onSearch]
    );

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        debouncedSearch(value);
    };

    const handleBulkAction = (action) => {
        const selectedIds = Object.keys(selectedRows).map(index => data[parseInt(index)].id);
        switch (action) {
            case 'delete':
                onBulkDelete(selectedIds);
                break;
            // Add more cases for other bulk actions here
            default:
                console.log(`Bulk action ${action} not implemented`);
        }
    };

    const isAnyRowSelected = Object.keys(selectedRows).length > 0;

    const toggleableColumns = table.getAllLeafColumns().filter(column => column.columnDef.isToggleable);

    const handleClearFilters = () => {
        setSearchTerm("");
        onClearFilters();
    };

    return (
        <div className="overflow-x-auto">
            <div className="flex justify-between mb-4 relative space-x-2">
                <div className="relative flex-grow mr-2">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
                <div className="flex space-x-2">
                    <button
                        onClick={handleClearFilters}
                        className="bg-white border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center"
                    >
                        <MdFilterAltOff className="mr-2" />
                        Clear Filters
                    </button>
                    <Dropdown>
                        <Dropdown.Trigger>
                            <button
                                className="bg-white border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center"
                            >
                                Bulk Actions
                                <HiChevronDown className="w-4 h-4" />
                            </button>
                        </Dropdown.Trigger>
                        <Dropdown.Content align="left" width="48">
                            <button
                                onClick={() => isAnyRowSelected && handleBulkAction('delete')}
                                className={`w-full text-left px-4 py-2 text-sm ${
                                    isAnyRowSelected 
                                        ? 'text-gray-700 hover:bg-gray-100 hover:text-gray-900' 
                                        : 'text-gray-400 cursor-not-allowed'
                                } flex items-center`}
                            >
                                <MdDeleteOutline className="mr-2" /> Delete Selected
                            </button>
                            {/* Add more bulk action options here */}
                        </Dropdown.Content>
                    </Dropdown>
                    {toggleableColumns.length > 0 && (
                        <Dropdown>
                            <Dropdown.Trigger>
                                <button
                                    className="bg-white border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center"
                                >
                                    <BsFunnel className="mr-2" />
                                    Toggle Columns
                                    <HiChevronDown className="w-4 h-4" />
                                </button>
                            </Dropdown.Trigger>
                            <Dropdown.Content align="right" width="48">
                                {toggleableColumns.map(column => (
                                    <div key={column.id} className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900">
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={column.getIsVisible()}
                                                onChange={column.getToggleVisibilityHandler()}
                                                className="mr-2"
                                            />
                                            {column.columnDef.header}
                                        </label>
                                    </div>
                                ))}
                            </Dropdown.Content>
                        </Dropdown>
                    )}
                </div>
            </div>
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th
                                    key={header.id}
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={header.column.getToggleSortingHandler()}
                                >
                                    <div className="flex items-center">
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                        {header.column.getCanSort() && (
                                            <span className="ml-1">
                                                {{
                                                    asc: <HiChevronUp className="w-4 h-4" />,
                                                    desc: <HiChevronDown className="w-4 h-4" />,
                                                }[header.column.getIsSorted()] ?? <HiChevronUpDown className="w-4 h-4" />}
                                            </span>
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {table.getRowModel().rows.map((row) => (
                        <tr key={row.id}>
                            {row.getVisibleCells().map((cell) => (
                                <td
                                    key={cell.id}
                                    className="px-6 py-4 whitespace-nowrap"
                                >
                                    {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext()
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="mt-4 flex flex-col sm:flex-row items-center justify-between bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                <div className="flex items-center mb-4 sm:mb-0">
                    <span className="text-sm text-gray-700 mr-2">Show</span>
                    <select
                        value={pageSize}
                        onChange={(e) => {
                            const newPageSize = Number(e.target.value);
                            onPageChange(1);
                            onPageSizeChange(newPageSize);
                        }}
                        className="mt-1 block w-full sm:w-auto pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                        {[10, 20, 30, 40, 50, total].map((size) => (
                            <option key={size} value={size}>
                                {size === total ? `All` : size}
                            </option>
                        ))}
                    </select>
                    <span className="text-sm text-gray-700 ml-2">entries</span>
                </div>
                
                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto">
                    <div className="flex-shrink-0 mr-2 sm:mr-4">
                        <p className="text-sm text-gray-700">
                            Showing <span className="font-medium">{pageIndex * pageSize + 1}</span> to{" "}
                            <span className="font-medium">{Math.min((pageIndex + 1) * pageSize, total)}</span> of{" "}
                            <span className="font-medium">{total}</span> results
                        </p>
                    </div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span className="sr-only">Previous</span>
                            <HiChevronLeft className="h-5 w-5" aria-hidden="true" />
                        </button>
                        
                        {/* Pagination buttons */}
                        {(() => {
                            const currentPage = table.getState().pagination.pageIndex;
                            const pageCount = table.getPageCount();
                            const visiblePages = 5;
                            const halfVisible = Math.floor(visiblePages / 2);

                            let startPage = Math.max(currentPage - halfVisible, 0);
                            let endPage = Math.min(startPage + visiblePages - 1, pageCount - 1);

                            if (endPage - startPage + 1 < visiblePages) {
                                startPage = Math.max(endPage - visiblePages + 1, 0);
                            }

                            return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((index) => (
                                <button
                                    key={index}
                                    onClick={() => table.setPageIndex(index)}
                                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                        currentPage === index
                                            ? "z-10 bg-indigo-50 border-indigo-500 text-indigo-600"
                                            : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                                    }`}
                                >
                                    {index + 1}
                                </button>
                            ));
                        })()}
                        
                        <button
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span className="sr-only">Next</span>
                            <HiChevronRight className="h-5 w-5" aria-hidden="true" />
                        </button>
                    </nav>
                </div>
            </div>
        </div>
    );
}
import React, { useEffect } from "react";
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    getSortedRowModel,
} from "@tanstack/react-table";
import Dropdown from '@/Components/Dropdown';
import { BsFunnel, BsSortDown, BsSortUp } from "react-icons/bs";
import { MdDeleteOutline } from "react-icons/md";


// Add these SVG icon components
const SortIcon = () => (
    <svg className="w-4 h-4 inline-block ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
    </svg>
);

const SortAscIcon = () => (
    <svg className="w-4 h-4 inline-block ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
    </svg>
);

const SortDescIcon = () => (
    <svg className="w-4 h-4 inline-block ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
    </svg>
);

const ChevronDownIcon = () => (
    <svg className="w-4 h-4 inline-block ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
);

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
}) {
    const [columnVisibility, setColumnVisibility] = React.useState({});
    const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
    const [sorting, setSorting] = React.useState(initialSorting);

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

    return (
        <div className="overflow-x-auto">
            <div className="flex justify-end mb-4 relative space-x-2">
                <Dropdown>
                    <Dropdown.Trigger>
                        <button
                            className="bg-white border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center"
                        >
                            Bulk Actions
                            <ChevronDownIcon />
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
                                <ChevronDownIcon />
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
                                                    asc: <SortAscIcon />,
                                                    desc: <SortDescIcon />,
                                                }[header.column.getIsSorted()] ?? <SortIcon />}
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
            <div className="py-3 flex items-center justify-between">
                <div className="flex-1 flex justify-between sm:hidden">
                    <button
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                        Previous
                    </button>
                    <button
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                        Next
                    </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm text-gray-700">
                            Showing{" "}
                            <span className="font-medium">
                                {pageIndex * pageSize + 1}
                            </span>{" "}
                            to{" "}
                            <span className="font-medium">
                                {Math.min((pageIndex + 1) * pageSize, total)}
                            </span>{" "}
                            of <span className="font-medium">{total}</span>{" "}
                            results
                        </p>
                    </div>
                    <div>
                        <nav
                            className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                            aria-label="Pagination"
                        >
                            <button
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                            >
                                Previous
                            </button>

                            {(() => {
                                const currentPage =
                                    table.getState().pagination.pageIndex;
                                const pageCount = table.getPageCount();
                                const visiblePages = 5;
                                const halfVisible = Math.floor(
                                    visiblePages / 2
                                );

                                let startPage = Math.max(
                                    currentPage - halfVisible,
                                    0
                                );
                                let endPage = Math.min(
                                    startPage + visiblePages - 1,
                                    pageCount - 1
                                );

                                if (endPage - startPage + 1 < visiblePages) {
                                    startPage = Math.max(
                                        endPage - visiblePages + 1,
                                        0
                                    );
                                }

                                return Array.from(
                                    { length: endPage - startPage + 1 },
                                    (_, i) => startPage + i
                                ).map((index) => (
                                    <button
                                        key={index}
                                        onClick={() =>
                                            table.setPageIndex(index)
                                        }
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
                                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                            >
                                Next
                            </button>
                        </nav>
                    </div>
                </div>
            </div>
            <div className="mt-2">
                <select
                    value={pageSize}
                    onChange={(e) => {
                        const newPageSize = Number(e.target.value);
                        onPageChange(1);
                        onPageSizeChange(newPageSize);
                        // Reset to the first page when changing page size
                    }}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                    {[10, 20, 30, 40, 50, total].map((size) => (
                        <option key={size} value={size}>
                            {size === total ? `Show all` : `Show ${size}`}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}
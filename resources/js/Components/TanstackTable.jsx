import React, { useState } from "react";
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
} from "@tanstack/react-table";
import Dropdown from '@/Components/Dropdown';

export default function TanstackTable({
    data,
    columns,
    pageCount,
    pageIndex,
    pageSize,
    onPageChange,
    onPageSizeChange,
    total,
}) {
    const [columnVisibility, setColumnVisibility] = useState({});
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const table = useReactTable({
        data,
        columns,
        pageCount,
        state: {
            pagination: {
                pageIndex,
                pageSize,
            },
            columnVisibility,
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
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
    });

    return (
        <div className="overflow-x-auto">
            <div className=" flex justify-end mb-4 relative">
                <Dropdown>
                    <Dropdown.Trigger>
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="bg-white border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 "
                        >
                            Toggle Columns
                        </button>
                    </Dropdown.Trigger>
                    <Dropdown.Content align="right" width="48">
                        {table.getAllLeafColumns().map(column => (
                            <div key={column.id} className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={column.getIsVisible()}
                                        onChange={column.getToggleVisibilityHandler()}
                                        className="mr-2"
                                    />
                                    {column.id}
                                </label>
                            </div>
                        ))}
                    </Dropdown.Content>
                </Dropdown>
            </div>
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th
                                    key={header.id}
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    {flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                    )}
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

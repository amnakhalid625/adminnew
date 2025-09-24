// components/tables/ProductTable/ProductTable.jsx
import React, { useState, useMemo } from "react";
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    flexRender,
} from "@tanstack/react-table";
import {
    FiEdit,
    FiTrash2,
    FiEye,
    FiChevronDown,
    FiChevronUp,
} from "react-icons/fi";

const ProductTable = ({ products, onEdit, onDelete, onView }) => {
    const [sorting, setSorting] = useState([]);
    const [globalFilter, setGlobalFilter] = useState("");
    const [columnFilters, setColumnFilters] = useState([]);

    const columns = useMemo(
        () => [
            {
                id: "select",
                header: ({ table }) => (
                    <input
                        type="checkbox"
                        checked={table.getIsAllRowsSelected()}
                        onChange={table.getToggleAllRowsSelectedHandler()}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                ),
                cell: ({ row }) => (
                    <input
                        type="checkbox"
                        checked={row.getIsSelected()}
                        onChange={row.getToggleSelectedHandler()}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                ),
                enableSorting: false,
                enableHiding: false,
            },
            {
                accessorKey: "image",
                header: "Image",
                cell: ({ getValue, row }) => (
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                        <img
                            src={getValue() || "/api/placeholder/48/48"}
                            alt={row.original.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                ),
                enableSorting: false,
            },
            {
                accessorKey: "name",
                header: "Product",
                cell: ({ getValue, row }) => (
                    <div className="flex flex-col">
                        <span className="font-medium text-gray-900">
                            {getValue()}
                        </span>
                        <span className="text-sm text-gray-500">
                            {row.original.brand}
                        </span>
                    </div>
                ),
            },
            {
                accessorKey: "category",
                header: "Category",
                cell: ({ getValue }) => (
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        {getValue()}
                    </span>
                ),
            },
            {
                accessorKey: "subCategory",
                header: "Sub Category",
                cell: ({ getValue }) => (
                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                        {getValue()}
                    </span>
                ),
            },
            {
                accessorKey: "originalPrice",
                header: "Original Price",
                cell: ({ getValue }) => (
                    <span className="text-gray-500 line-through">
                        Rs {getValue()?.toLocaleString()}
                    </span>
                ),
            },
            {
                accessorKey: "price",
                header: "Price",
                cell: ({ getValue }) => (
                    <span className="font-semibold text-blue-600">
                        Rs {getValue()?.toLocaleString()}
                    </span>
                ),
            },
            {
                accessorKey: "sales",
                header: "Sales",
                cell: ({ getValue }) => (
                    <span className="font-medium">{getValue()} sale</span>
                ),
            },
            {
                accessorKey: "stock",
                header: "Stock",
                cell: ({ getValue }) => {
                    const stock = getValue();
                    return (
                        <span
                            className={`font-medium ${
                                stock > 1000
                                    ? "text-green-600"
                                    : stock > 100
                                    ? "text-yellow-600"
                                    : "text-red-600"
                            }`}
                        >
                            {stock?.toLocaleString()}
                        </span>
                    );
                },
            },
            {
                accessorKey: "rating",
                header: "Rating",
                cell: ({ getValue }) => (
                    <div className="flex items-center">
                        <span className="text-yellow-400">★</span>
                        <span className="ml-1 text-sm">{getValue()}</span>
                    </div>
                ),
            },
            {
                id: "actions",
                header: "Actions",
                cell: ({ row }) => (
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => onView(row.original)}
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View"
                        >
                            <FiEye className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => onEdit(row.original)}
                            className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Edit"
                        >
                            <FiEdit className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => onDelete(row.original)}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                        >
                            <FiTrash2 className="w-4 h-4" />
                        </button>
                    </div>
                ),
                enableSorting: false,
            },
        ],
        [onEdit, onDelete, onView]
    );

    const table = useReactTable({
        data: products,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        onColumnFiltersChange: setColumnFilters,
        state: {
            sorting,
            globalFilter,
            columnFilters,
        },
        initialState: {
            pagination: {
                pageSize: 10,
            },
        },
    });

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            {/* Table Header with Search */}
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Products
                    </h2>
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={globalFilter}
                                onChange={(e) =>
                                    setGlobalFilter(e.target.value)
                                }
                                className="pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <select
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            onChange={(e) => {
                                table
                                    .getColumn("category")
                                    ?.setFilterValue(
                                        e.target.value === "all"
                                            ? ""
                                            : e.target.value
                                    );
                            }}
                        >
                            <option value="all">All Categories</option>
                            <option value="Fashion">Fashion</option>
                            <option value="Beauty">Beauty</option>
                            <option value="Wellness">Wellness</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        {header.isPlaceholder ? null : (
                                            <div
                                                className={`flex items-center space-x-1 ${
                                                    header.column.getCanSort()
                                                        ? "cursor-pointer select-none hover:text-gray-700"
                                                        : ""
                                                }`}
                                                onClick={header.column.getToggleSortingHandler()}
                                            >
                                                <span>
                                                    {flexRender(
                                                        header.column.columnDef
                                                            .header,
                                                        header.getContext()
                                                    )}
                                                </span>
                                                {header.column.getCanSort() && (
                                                    <span className="ml-1">
                                                        {header.column.getIsSorted() ===
                                                        "desc" ? (
                                                            <FiChevronDown className="w-4 h-4" />
                                                        ) : header.column.getIsSorted() ===
                                                          "asc" ? (
                                                            <FiChevronUp className="w-4 h-4" />
                                                        ) : (
                                                            <div className="w-4 h-4 opacity-30">
                                                                <FiChevronUp className="w-4 h-4" />
                                                            </div>
                                                        )}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {table.getRowModel().rows.map((row) => (
                            <tr
                                key={row.id}
                                className="hover:bg-gray-50 transition-colors"
                            >
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
            </div>

            {/* Pagination */}
            <div className="px-6 py-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span>Show</span>
                    <select
                        value={table.getState().pagination.pageSize}
                        onChange={(e) =>
                            table.setPageSize(Number(e.target.value))
                        }
                        className="border border-gray-300 rounded px-2 py-1"
                    >
                        {[10, 20, 30, 40, 50].map((pageSize) => (
                            <option key={pageSize} value={pageSize}>
                                {pageSize}
                            </option>
                        ))}
                    </select>
                    <span>entries</span>
                </div>

                <div className="flex items-center space-x-2">
                    <button
                        className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </button>

                    <div className="flex items-center space-x-1">
                        {[...Array(table.getPageCount()).keys()]
                            .slice(
                                Math.max(
                                    0,
                                    table.getState().pagination.pageIndex - 2
                                ),
                                Math.min(
                                    table.getPageCount(),
                                    table.getState().pagination.pageIndex + 3
                                )
                            )
                            .map((page) => (
                                <button
                                    key={page}
                                    className={`px-3 py-1 text-sm rounded ${
                                        page ===
                                        table.getState().pagination.pageIndex
                                            ? "bg-blue-600 text-white"
                                            : "border border-gray-300 hover:bg-gray-100"
                                    }`}
                                    onClick={() => table.setPageIndex(page)}
                                >
                                    {page + 1}
                                </button>
                            ))}
                    </div>

                    <button
                        className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </button>
                </div>
            </div>

            {/* Selected Items Actions */}
            {table.getSelectedRowModel().rows.length > 0 && (
                <div className="px-6 py-3 bg-blue-50 border-t border-blue-200">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-blue-700">
                            {table.getSelectedRowModel().rows.length} items
                            selected
                        </span>
                        <div className="flex items-center space-x-2">
                            <button className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors">
                                Delete Selected
                            </button>
                            <button className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors">
                                Export Selected
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductTable;

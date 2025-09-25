import React, { useMemo } from "react";
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    flexRender,
    createColumnHelper,
} from "@tanstack/react-table";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import StarRating from "./StarRating.jsx";
import { Link } from "react-router-dom";
import { Eye } from "lucide-react";

const ProductsTable = ({
    data,
    globalFilter,
    setGlobalFilter,
    rowSelection,
    setRowSelection,
    onEditProduct,
    onDeleteProduct,
}) => {
    const columnHelper = createColumnHelper();

    const columns = useMemo(
        () => [
            columnHelper.display({
                id: "select",
                header: ({ table }) => (
                    <input
                        type="checkbox"
                        className="rounded border-gray-300"
                        checked={table.getIsAllRowsSelected()}
                        onChange={table.getToggleAllRowsSelectedHandler()}
                    />
                ),
                cell: ({ row }) => (
                    <input
                        type="checkbox"
                        className="rounded border-gray-300"
                        checked={row.getIsSelected()}
                        onChange={row.getToggleSelectedHandler()}
                    />
                ),
                size: 50,
            }),
            columnHelper.accessor("name", {
                header: "PRODUCT",
                cell: (info) => {
                    const product = info.row.original;
                    const image =
                        product.images && product.images.length > 0
                            ? `http://localhost:8080${product.images[0]}`
                            : "https://via.placeholder.com/50";
                    return (
                        <div className="flex items-center gap-3">
                            <img
                                src={image}
                                alt={product.name}
                                className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div>
                                <div
                                    className="text-sm font-medium text-gray-900 max-w-xs truncate"
                                    title={product.name}
                                >
                                    {product.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                    {product.brand}
                                </div>
                                <div className="text-xs text-gray-400">
                                    SKU: {product.sku}
                                </div>
                            </div>
                        </div>
                    );
                },
            }),
            columnHelper.accessor("category", {
                header: "CATEGORY",
                cell: (info) => (
                    <span className="text-sm text-gray-900">
                        {info.getValue()}
                    </span>
                ),
            }),
            columnHelper.accessor("subCategory", {
                header: "SUB CATEGORY",
                cell: (info) => (
                    <span className="text-sm text-gray-900">
                        {info.getValue() || "-"}
                    </span>
                ),
            }),
            columnHelper.accessor("thirdLevelCategory", {
                header: "3RD LEVEL",
                cell: (info) => (
                    <span className="text-sm text-gray-900">
                        {info.getValue() || "-"}
                    </span>
                ),
            }),
            columnHelper.accessor("price", {
                header: "PRICE",
                cell: (info) => {
                    const product = info.row.original;
                    return (
                        <div>
                            <div className="text-gray-500 line-through text-sm">
                                Rs {product.originalPrice.toFixed(2)}
                            </div>
                            <div className="font-semibold text-blue-600">
                                Rs {info.getValue().toFixed(2)}
                            </div>
                        </div>
                    );
                },
            }),
            columnHelper.accessor("stockQuantity", {
                header: "STOCK",
                cell: (info) => (
                    <span
                        className={`font-medium ${info.getValue() > 0
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                    >
                        {info.getValue().toLocaleString("en-IN")}
                    </span>
                ),
            }),
            columnHelper.accessor("averageRating", {
                header: "RATING",
                cell: (info) => <StarRating rating={info.getValue()} />,
            }),
            columnHelper.display({
                id: "actions",
                header: "ACTION",
                cell: ({ row }) => (
                    <div className="flex items-center gap-2 justify-center">
                        <Link
                            to={`/products/view/${row.original._id}`}
                            className="w-max h-max p-1 text-gray-600 hover:text-gray-900"
                        >
                            <Eye size={16} />
                        </Link>
                        <button
                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                            onClick={() => onEditProduct(row.original)}
                            title="Edit Product"
                        >
                            <FiEdit className="w-4 h-4" />
                        </button>
                        <button
                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                            onClick={() => onDeleteProduct(row.original._id)}
                            title="Delete Product"
                        >
                            <FiTrash2 className="w-4 h-4" />
                        </button>
                    </div>
                ),
                size: 100,
            }),
        ],
        [onEditProduct, onDeleteProduct, columnHelper]
    );

    const table = useReactTable({
        data: data || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state: {
            globalFilter,
            rowSelection,
        },
        onGlobalFilterChange: setGlobalFilter,
        onRowSelectionChange: setRowSelection,
        enableRowSelection: true,
        globalFilterFn: "includesString",
    });

    return (
        <div className="flex-1 overflow-auto bg-white">
            <table className="w-full">
                <thead className="bg-gray-50 sticky top-0">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th
                                    key={header.id}
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                    onClick={header.column.getToggleSortingHandler()}
                                >
                                    <div className="flex items-center space-x-1">
                                        <span>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef
                                                        .header,
                                                    header.getContext()
                                                )}
                                        </span>
                                        <span className="text-gray-400">
                                            {{
                                                asc: "↑",
                                                desc: "↓",
                                            }[header.column.getIsSorted()] ??
                                                null}
                                        </span>
                                    </div>
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
    );
};

export default ProductsTable;
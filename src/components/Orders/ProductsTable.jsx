import React, { useMemo } from "react";
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    createColumnHelper,
} from "@tanstack/react-table";

const ProductsTable = ({ products }) => {
    const columnHelper = createColumnHelper();

    const productColumns = useMemo(
        () => [
            columnHelper.accessor("image", {
                header: "IMAGE",
                cell: (info) => (
                    <img
                        src={info.getValue()}
                        alt="Product"
                        className="w-12 h-12 object-cover rounded-lg bg-gray-200 border"
                        onError={(e) => {
                            // Prevent infinite loop by checking if already using placeholder
                            if (
                                e.target.src !==
                                "https://via.placeholder.com/150?text=No+Image"
                            ) {
                                e.target.src =
                                    "https://via.placeholder.com/150?text=No+Image";
                            }
                        }}
                    />
                ),
            }),
            columnHelper.accessor("productId", {
                header: "PRODUCT ID",
                cell: (info) => (
                    <div className="text-sm text-gray-600 font-mono">
                        {info.getValue() || "N/A"}
                    </div>
                ),
            }),
            columnHelper.accessor("title", {
                header: "PRODUCT TITLE",
                cell: (info) => (
                    <div className="text-sm text-gray-800 font-medium max-w-xs">
                        <div className="truncate" title={info.getValue()}>
                            {info.getValue()}
                        </div>
                    </div>
                ),
            }),
            columnHelper.accessor("quantity", {
                header: "QUANTITY",
                cell: (info) => (
                    <div className="text-sm text-center font-medium bg-gray-100 px-2 py-1 rounded">
                        {info.getValue()}
                    </div>
                ),
            }),
            columnHelper.accessor("price", {
                header: "PRICE",
                cell: (info) => (
                    <div className="text-sm text-right font-medium">
                        Rs {(info.getValue() || 0).toLocaleString("en-PK")}
                    </div>
                ),
            }),
            columnHelper.accessor("subTotal", {
                header: "SUB TOTAL",
                cell: (info) => (
                    <div className="text-sm text-right font-semibold text-gray-900">
                        Rs {(info.getValue() || 0).toLocaleString("en-PK")}
                    </div>
                ),
            }),
        ],
        [columnHelper]
    );

    const productTable = useReactTable({
        data: products || [],
        columns: productColumns,
        getCoreRowModel: getCoreRowModel(),
    });

    // Handle empty products array
    if (!products || products.length === 0) {
        return (
            <div className="mt-4 bg-gray-50 rounded-lg border p-4 text-center">
                <p className="text-sm text-gray-500">
                    No products found in this order
                </p>
            </div>
        );
    }

    return (
        <div className="mt-4 bg-gray-50 rounded-lg border overflow-hidden">
            <div className="bg-gray-100 px-4 py-2 border-b">
                <h4 className="text-sm font-semibold text-gray-700">
                    Order Products ({products.length} items)
                </h4>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        {productTable.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id} className="bg-gray-100">
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef
                                                      .header,
                                                  header.getContext()
                                              )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {productTable.getRowModel().rows.map((row) => (
                            <tr
                                key={row.id}
                                className="bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors"
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <td key={cell.id} className="px-6 py-4">
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
        </div>
    );
};

export default ProductsTable;

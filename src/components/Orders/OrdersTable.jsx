import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
    useReactTable,
    getCoreRowModel,
    getExpandedRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    flexRender,
    createColumnHelper,
} from "@tanstack/react-table";
import {
    ChevronDown,
    ChevronUp,
    Eye,
    Download,
    Edit,
    Trash2,
} from "lucide-react";
import StatusBadge from "./StatusBadge.jsx";
import ProductsTable from "./ProductsTable";

const OrdersTable = ({
    data,
    globalFilter,
    onGlobalFilterChange,
    onDeleteOrder, // Receive delete handler
}) => {
    const [expanded, setExpanded] = useState({});
    const columnHelper = createColumnHelper();

    const columns = useMemo(
        () => [
            // ... (other columns are the same)
            columnHelper.display({
                id: "expander",
                header: "",
                size: 50,
                cell: ({ row }) => {
                    const hasItems =
                        row.original.orderItems &&
                        row.original.orderItems.length > 0;

                    if (!hasItems) {
                        return <div className="w-8 h-8"></div>;
                    }

                    return (
                        <button
                            onClick={() => row.toggleExpanded()}
                            className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                            type="button"
                            aria-label={
                                row.getIsExpanded()
                                    ? "Collapse row"
                                    : "Expand row"
                            }
                        >
                            {row.getIsExpanded() ? (
                                <ChevronDown className="w-4 h-4 text-gray-500" />
                            ) : (
                                <ChevronUp className="w-4 h-4 text-gray-500" />
                            )}
                        </button>
                    );
                },
            }),
            columnHelper.accessor("_id", {
                header: "ORDER ID",
                cell: (info) => (
                    <div className="text-sm text-blue-600 font-mono cursor-pointer">
                        {info.getValue()}
                    </div>
                ),
            }),
            columnHelper.accessor("paymentMethod", {
                header: "PAYMENT METHOD",
                cell: (info) => (
                    <div className="text-sm text-orange-600 font-medium">
                        {info.getValue() || "-"}
                    </div>
                ),
            }),
            columnHelper.accessor("shippingAddress.fullName", {
                header: "CUSTOMER NAME",
                cell: (info) => (
                    <div className="text-sm text-gray-900 font-medium">
                        {info.getValue()}
                    </div>
                ),
            }),
            columnHelper.accessor("shippingAddress.phone", {
                header: "PHONE",
                cell: (info) => (
                    <div className="text-sm text-gray-700 font-mono">
                        {info.getValue()}
                    </div>
                ),
            }),
            columnHelper.accessor("shippingAddress.address", {
                header: "ADDRESS",
                cell: ({ row }) => {
                    const { address, city, zipCode } =
                        row.original.shippingAddress;
                    return (
                        <div className="text-sm text-gray-700 max-w-xs truncate">
                            {`${address}, ${city} - ${zipCode}`}
                        </div>
                    );
                },
            }),
            columnHelper.accessor("totalPrice", {
                header: "TOTAL",
                cell: (info) => (
                    <div className="text-sm font-semibold text-gray-900">
                        Rs {info.getValue().toLocaleString("en-PK")}
                    </div>
                ),
            }),
            columnHelper.accessor("orderStatus", {
                header: "STATUS",
                cell: (info) => <StatusBadge status={info.getValue()} />,
            }),
            columnHelper.accessor("createdAt", {
                header: "DATE",
                cell: (info) => (
                    <div className="text-sm text-gray-700">
                        {new Date(info.getValue()).toLocaleDateString("en-PK")}
                    </div>
                ),
            }),
            // Actions
            columnHelper.display({
                id: "actions",
                header: "ACTIONS",
                cell: ({ row }) => (
                    <div className="flex space-x-1">
                        <Link
                            to={`/orders/view/${row.original._id}`}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                            title="View Order"
                        >
                            <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                            to={`/orders/edit/${row.original._id}`}
                            className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg"
                            title="Edit Order"
                        >
                            <Edit className="w-4 h-4" />
                        </Link>
                        <button
                            onClick={() => onDeleteOrder(row.original._id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                            title="Delete Order"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                ),
            }),
        ],
        [columnHelper]
    );
    // ... rest of the component is the same
    const table = useReactTable({
        data: data || [],
        columns,
        state: {
            globalFilter,
            expanded,
        },
        onGlobalFilterChange,
        onExpandedChange: setExpanded,
        getCoreRowModel: getCoreRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getRowCanExpand: (row) => {
            return (
                row.original.orderItems && row.original.orderItems.length > 0
            );
        },
    });

    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr
                                key={headerGroup.id}
                                className="bg-gray-50 border-b border-gray-200"
                            >
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        {header.isPlaceholder ? null : (
                                            <div
                                                className={
                                                    header.column.getCanSort()
                                                        ? "cursor-pointer select-none hover:text-gray-700 flex items-center space-x-1"
                                                        : ""
                                                }
                                                onClick={header.column.getToggleSortingHandler()}
                                            >
                                                <span>
                                                    {flexRender(
                                                        header.column.columnDef
                                                            .header,
                                                        header.getContext()
                                                    )}
                                                </span>
                                                <span className="text-gray-400">
                                                    {{
                                                        asc: "↑",
                                                        desc: "↓",
                                                    }[
                                                        header.column.getIsSorted()
                                                    ] ?? null}
                                                </span>
                                            </div>
                                        )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {table.getRowModel().rows.map((row) => (
                            <React.Fragment key={row.id}>
                                {/* Main Order Row */}
                                <tr className="hover:bg-gray-50 transition-colors">
                                    {row.getVisibleCells().map((cell) => (
                                        <td
                                            key={cell.id}
                                            className="px-4 py-4 whitespace-nowrap"
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </td>
                                    ))}
                                </tr>
                                {/* Expanded Products Row */}
                                {row.getIsExpanded() && (
                                    <tr>
                                        <td
                                            colSpan={columns.length}
                                            className="px-0 py-0 bg-gray-50"
                                        >
                                            <div className="p-6">
                                                <ProductsTable
                                                    products={
                                                        row.original.orderItems?.map(
                                                            (item) => ({
                                                                productId:
                                                                    item.product
                                                                        ?._id ||
                                                                    item.product ||
                                                                    "N/A",
                                                                title:
                                                                    item.product
                                                                        ?.name ||
                                                                    item.product
                                                                        ?.title ||
                                                                    "Product Name Not Available",
                                                                image:
                                                                    item.product
                                                                        ?.image ||
                                                                    item.product
                                                                        ?.images?.[0] ||
                                                                    "https://via.placeholder.com/150?text=No+Image",
                                                                quantity:
                                                                    item.quantity ||
                                                                    0,
                                                                price:
                                                                    item.product
                                                                        ?.price ||
                                                                    0,
                                                                subTotal:
                                                                    (item.quantity ||
                                                                        0) *
                                                                    (item
                                                                        .product
                                                                        ?.price ||
                                                                        0),
                                                            })
                                                        ) || []
                                                    }
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
export default OrdersTable;
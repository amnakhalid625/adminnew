import React, { useState, useMemo, useEffect } from "react";
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    flexRender,
    createColumnHelper,
} from "@tanstack/react-table";
import { Link, useNavigate } from "react-router-dom";
import { FiPlus, FiEdit, FiTrash2 } from "react-icons/fi";
import { useGetCategories, useDeleteCategory } from "../api/internal";
import toast from "react-hot-toast";

const CategoryList = () => {
    const navigate = useNavigate();
    const { getCategories, categories, setCategories } = useGetCategories();
    const { deleteCategory } = useDeleteCategory();

    useEffect(() => {
        (async () => {
            await getCategories();
        })();
    }, []);

    const handleDelete = async (categoryId) => {
        if (window.confirm("Are you sure you want to delete this category?")) {
            try {
                const res = await deleteCategory(categoryId);
                if (res.success) {
                    setCategories((prev) =>
                        prev.filter((cat) => cat._id !== categoryId)
                    );
                    toast.success("Category deleted successfully.");
                }
            } catch (err) {
                toast.error("Failed to delete category.");
            }
        }
    };

    const columnHelper = createColumnHelper();

    const columns = useMemo(
        () => [
            columnHelper.accessor("image", {
                header: "IMAGE",
                cell: (info) => (
                    <img
                        src={
                            info.getValue()
                                ? `http://localhost:8080${info.getValue()}`
                                : "https://via.placeholder.com/64"
                        }
                        alt="Category"
                        className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                    />
                ),
                size: 100,
            }),
            columnHelper.accessor("name", {
                header: "CATEGORY NAME",
                cell: (info) => (
                    <span className="text-sm font-medium text-gray-900">
                        {info.getValue()}
                    </span>
                ),
            }),
            columnHelper.display({
                id: "actions",
                header: "Action",
                cell: ({ row }) => (
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() =>
                                navigate(`/categories/edit/${row.original._id}`)
                            }
                            className="text-gray-600 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                        >
                            <FiEdit className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => handleDelete(row.original._id)}
                            className="text-gray-600 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors"
                        >
                            <FiTrash2 className="w-4 h-4" />
                        </button>
                    </div>
                ),
                size: 120,
            }),
        ],
        [navigate]
    );

    const table = useReactTable({
        data: categories || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-gray-900">
                            Category List
                        </h1>
                        <Link
                            to="/categories/add"
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
                        >
                            <FiPlus className="w-4 h-4" />
                            ADD CATEGORY
                        </Link>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <th
                                            key={header.id}
                                            className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider"
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
                        <tbody className="bg-white">
                            {table.getRowModel().rows.map((row, index) => (
                                <tr
                                    key={row.id}
                                    className={`border-b border-gray-100 hover:bg-gray-50 transition-colors`}
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
        </div>
    );
};

export default CategoryList;
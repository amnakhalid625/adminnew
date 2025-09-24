// components/TableFilters.jsx
import React from "react";
import { FiSearch, FiDownload } from "react-icons/fi";

const TableFilters = ({
    searchTerm,
    setSearchTerm,
    roleFilter,
    setRoleFilter,
    statusFilter,
    setStatusFilter,
}) => {
    return (
        <div className="bg-white p-4 rounded-lg border shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Search */}
            <div className="relative max-w-md flex-1">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    value={searchTerm}
                    placeholder="Search users..."
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4">
                <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="px-3 py-2 border rounded-lg"
                >
                    <option value="all">All Roles</option>
                    <option value="Admin">Admin</option>
                    <option value="Moderator">Moderator</option>
                    <option value="Customer">Customer</option>
                </select>

                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border rounded-lg"
                >
                    <option value="all">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Pending">Pending</option>
                </select>

                <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
                    <FiDownload className="w-4 h-4" />
                    Export
                </button>
            </div>
        </div>
    );
};

export default TableFilters;

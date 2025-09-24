/* eslint-disable no-unused-vars */
// pages/Users/Users.jsx
import React, { useState, useMemo, useEffect } from "react";
import {
    FiPlus,
    FiEye,
    FiEdit,
    FiTrash2,
    FiMail,
    FiPhone,
    FiMapPin,
} from "react-icons/fi";
import UsersTable from "../components/Users/UsersTable";
import TableFilters from "../components/Users/TableFilters";
import { useGetUsers } from "../api/internal";

const Users = () => {
    const [users, setUsers] = useState([]);

    const { getUsers, error, loading } = useGetUsers();

    useEffect(() => {
        (async () => {
            const data = await getUsers();
            if (data.success) {
                setUsers(data.users);
            }
        })();
    }, []);

    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");

    const filteredUsers = useMemo(() => {
        return users.filter((user) => {
            const matchesSearch =
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (user.phone && user.phone.includes(searchTerm));

            const matchesRole =
                roleFilter === "all" || user.role === roleFilter;
            const matchesStatus =
                statusFilter === "all" || user.status === statusFilter;

            return matchesSearch && matchesRole && matchesStatus;
        });
    }, [users, searchTerm, roleFilter, statusFilter]);

    const columns = useMemo(
        () => [
            {
                accessorKey: "avatar",
                header: "Avatar",
                cell: ({ row }) => (
                    <img
                        src={row.original.avatar || "/api/placeholder/40/40"}
                        alt={row.original.name}
                        className="h-10 w-10 rounded-full object-cover"
                    />
                ),
            },
            {
                accessorKey: "name",
                header: "Name",
                size: 200,
                minSize: 150,
                cell: ({ row }) => (
                    <div className="whitespace-nowrap">
                        <p className="font-medium">{row.original.name}</p>
                        <p className="text-xs text-gray-500">
                            {row.original.role === "admin"
                                ? "Administrator"
                                : "Customer"}
                        </p>
                    </div>
                ),
            },
            {
                accessorKey: "contact",
                header: "Contact",
                cell: ({ row }) => (
                    <div className="flex flex-col text-sm">
                        <span className="flex items-center text-gray-900">
                            <FiMail className="w-4 h-4 mr-2 text-gray-400" />
                            {row.original.email}
                        </span>
                        {row.original.phone && (
                            <span className="flex items-center text-gray-500">
                                <FiPhone className="w-4 h-4 mr-2 text-gray-400" />
                                {row.original.phone}
                            </span>
                        )}
                    </div>
                ),
            },
            {
                accessorKey: "address",
                header: "Address",
                cell: ({ row }) =>
                    row.original.address ? (
                        <div className="flex items-center text-sm text-gray-600">
                            <FiMapPin className="w-4 h-4 mr-1 text-gray-400" />
                            {`${row.original.address.city || ""}, ${
                                row.original.address.country || ""
                            }`}
                        </div>
                    ) : (
                        "-"
                    ),
            },
            { accessorKey: "role", header: "Role" },
            { accessorKey: "status", header: "Status" },
            {
                accessorKey: "orders",
                header: "Orders",
                cell: ({ row }) =>
                    row.original.orders ? row.original.orders.length : 0,
            },
            {
                id: "actions",
                header: "Actions",
                cell: ({ row }) => (
                    <div className="flex items-center space-x-2">
                        <button
                            className="p-2 hover:bg-blue-50 rounded"
                            title="View"
                        >
                            <FiEye className="w-4 h-4 text-gray-600 hover:text-blue-600" />
                        </button>
                        <button
                            className="p-2 hover:bg-green-50 rounded"
                            title="Edit"
                        >
                            <FiEdit className="w-4 h-4 text-gray-600 hover:text-green-600" />
                        </button>
                        <button
                            className="p-2 hover:bg-red-50 rounded"
                            title="Delete"
                        >
                            <FiTrash2 className="w-4 h-4 text-gray-600 hover:text-red-600" />
                        </button>
                    </div>
                ),
            },
        ],
        []
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Users</h1>
                    <p className="text-gray-600">
                        Manage your users and their permissions
                    </p>
                </div>
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg">
                    <FiPlus />
                    <span>Add User</span>
                </button>
            </div>

            {/* Filters */}
            <TableFilters
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                roleFilter={roleFilter}
                setRoleFilter={setRoleFilter}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
            />

            {/* Table */}
            <UsersTable data={filteredUsers} columns={columns} />
        </div>
    );
};

export default Users;
